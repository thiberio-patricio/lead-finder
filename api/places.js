import { connectToDatabase } from './db.js';
import Lead from './leadModel.js';

// Google Places API integration for finding businesses
// Requires GOOGLE_PLACES_API_KEY environment variable

export default async function handler(req, res) {
  await connectToDatabase();
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { cidade, estado, nicho, raio = 5000 } = req.body;

  if (!cidade || !estado) {
    return res.status(400).json({ error: 'Cidade e estado são obrigatórios' });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GOOGLE_PLACES_API_KEY não configurada' });
  }

  try {
    // Step 1: Geocode the city to get coordinates
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(`${cidade}, ${estado}, Brasil`)}&key=${apiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== 'OK' || !geocodeData.results.length) {
      return res.status(400).json({ error: 'Não foi possível encontrar a localização' });
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;

    // Step 2: Search for businesses using Places API Nearby Search
    const searchQuery = nicho || 'estabelecimento comercial';
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${raio}&keyword=${encodeURIComponent(searchQuery)}&type=establishment&language=pt-BR&key=${apiKey}`;
    
    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();

    if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', placesData.status, placesData.error_message);
      return res.status(500).json({ error: `Erro na API: ${placesData.status}` });
    }

    const businesses = placesData.results || [];
    const processedLeads = [];

    for (const place of businesses) {
      try {
        // Step 3: Get place details including website
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,website,formatted_phone_number,types,url,business_status&language=pt-BR&key=${apiKey}`;
        
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        const details = detailsData.result || {};

        // Step 4: Try to find Instagram from website or search
        let instagramHandle = await findInstagram(place.name, details.website, cidade, apiKey);
        
        // Skip if we couldn't find an Instagram handle
        if (!instagramHandle) {
          instagramHandle = `@${normalizeUsername(place.name)}`;
        }

        // Check if lead already exists
        const existingLead = await Lead.findOne({ 
          $or: [
            { instagram: instagramHandle },
            { nome: place.name, cidade: cidade }
          ]
        });

        if (existingLead) {
          processedLeads.push({ ...existingLead.toObject(), status: 'existente' });
          continue;
        }

        // Create new lead
        const categoria = mapPlaceTypeToCategoria(place.types);
        const newLead = new Lead({
          nome: place.name,
          instagram: instagramHandle,
          estado: estado,
          cidade: cidade,
          bairro: extractBairro(details.formatted_address),
          categoria: nicho || categoria,
          seguidores: 0,
          engajamento: 0,
          posts: 0,
          ultimoPost: 0,
          leadScore: calculateInitialScore(place),
          status: 'novo',
          telefone: details.formatted_phone_number || '',
          bio: '',
          cta: false,
          reels: false,
          website: details.website || '',
          googlePlaceId: place.place_id,
          googleMapsUrl: details.url || '',
          rating: place.rating || 0,
          userRatingsTotal: place.user_ratings_total || 0,
        });

        await newLead.save();
        processedLeads.push({ ...newLead.toObject(), status: 'novo' });
      } catch (err) {
        console.error('Error processing place:', place.name, err.message);
      }
    }

    res.status(200).json({
      success: true,
      location: { cidade, estado, lat, lng },
      totalFound: businesses.length,
      processed: processedLeads.length,
      leads: processedLeads
    });
  } catch (err) {
    console.error('Places API error:', err);
    res.status(500).json({ error: err.message });
  }
}

// Try to find Instagram handle from various sources
async function findInstagram(businessName, website, cidade, apiKey) {
  // Method 1: Check website for Instagram link
  if (website) {
    try {
      const instagramFromSite = await extractInstagramFromWebsite(website);
      if (instagramFromSite) return instagramFromSite;
    } catch (e) {
      console.log('Could not fetch website:', website);
    }
  }

  // Method 2: Search Google for Instagram profile
  try {
    const searchQuery = `${businessName} ${cidade} instagram site:instagram.com`;
    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&key=${apiKey}&cx=${process.env.GOOGLE_SEARCH_CX || ''}&num=3`;
    
    if (process.env.GOOGLE_SEARCH_CX) {
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      if (searchData.items && searchData.items.length > 0) {
        for (const item of searchData.items) {
          const match = item.link.match(/instagram\.com\/([^\/\?]+)/);
          if (match && match[1] && !['p', 'explore', 'stories', 'reels'].includes(match[1])) {
            return `@${match[1]}`;
          }
        }
      }
    }
  } catch (e) {
    console.log('Google search failed:', e.message);
  }

  return null;
}

// Extract Instagram handle from website HTML
async function extractInstagramFromWebsite(websiteUrl) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(websiteUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LeadFinder/1.0)'
      }
    });
    clearTimeout(timeoutId);
    
    const html = await response.text();
    
    // Look for Instagram links
    const patterns = [
      /instagram\.com\/([a-zA-Z0-9_\.]+)/gi,
      /href=["'][^"']*instagram\.com\/([a-zA-Z0-9_\.]+)["']/gi,
      /@([a-zA-Z0-9_\.]+)\s*(?:no\s*)?instagram/gi,
    ];
    
    for (const pattern of patterns) {
      const matches = html.matchAll(pattern);
      for (const match of matches) {
        const username = match[1];
        if (username && !['p', 'explore', 'stories', 'reels', 'accounts'].includes(username.toLowerCase())) {
          return `@${username}`;
        }
      }
    }
  } catch (e) {
    // Ignore fetch errors
  }
  return null;
}

// Normalize business name to potential Instagram username
function normalizeUsername(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9_]/g, '') // Keep only valid chars
    .substring(0, 30);
}

// Extract bairro from address
function extractBairro(address) {
  if (!address) return '';
  const parts = address.split(',').map(p => p.trim());
  // Usually bairro is the 2nd part in Brazilian addresses
  return parts.length >= 2 ? parts[1] : '';
}

// Map Google Place types to business categories
function mapPlaceTypeToCategoria(types) {
  const typeMap = {
    restaurant: 'Restaurante',
    food: 'Alimentação',
    cafe: 'Cafeteria',
    bar: 'Bar',
    bakery: 'Padaria',
    beauty_salon: 'Salão de Beleza',
    hair_care: 'Cabeleireiro',
    spa: 'Spa',
    gym: 'Academia',
    clothing_store: 'Loja de Roupas',
    shoe_store: 'Loja de Calçados',
    jewelry_store: 'Joalheria',
    electronics_store: 'Eletrônicos',
    furniture_store: 'Móveis',
    home_goods_store: 'Casa e Decoração',
    pet_store: 'Pet Shop',
    veterinary_care: 'Veterinário',
    dentist: 'Dentista',
    doctor: 'Médico',
    hospital: 'Hospital',
    pharmacy: 'Farmácia',
    lawyer: 'Advocacia',
    accounting: 'Contabilidade',
    real_estate_agency: 'Imobiliária',
    car_dealer: 'Concessionária',
    car_repair: 'Mecânica',
    car_wash: 'Lava-Rápido',
    florist: 'Floricultura',
    supermarket: 'Supermercado',
    convenience_store: 'Conveniência',
    lodging: 'Hospedagem',
    travel_agency: 'Agência de Viagens',
    school: 'Escola',
    university: 'Universidade',
  };

  for (const type of types || []) {
    if (typeMap[type]) return typeMap[type];
  }
  return 'Comércio Local';
}

// Calculate initial lead score based on Google data
function calculateInitialScore(place) {
  let score = 30; // Base score
  
  if (place.rating) {
    score += (place.rating / 5) * 20; // Up to 20 points for rating
  }
  
  if (place.user_ratings_total) {
    if (place.user_ratings_total > 100) score += 15;
    else if (place.user_ratings_total > 50) score += 10;
    else if (place.user_ratings_total > 10) score += 5;
  }
  
  if (place.business_status === 'OPERATIONAL') {
    score += 10;
  }
  
  return Math.min(100, Math.round(score));
}
