import { connectToDatabase } from './db.js';
import { collectInstagramProfiles } from '../server/pipeline/instagramCollector.js';
import Lead from './leadModel.js';

export default async function handler(req, res) {
  await connectToDatabase();
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { estado, cidade, nicho, raio } = req.body;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  try {
    // If Google Places API is configured, use it to find businesses first
    if (apiKey) {
      const placesResult = await searchGooglePlaces({ estado, cidade, nicho, raio, apiKey });
      if (placesResult.success) {
        // Then collect Instagram profiles for the found businesses
        collectInstagramProfiles({ estado, cidade, nicho, raio }).catch(e => console.error(e));
        return res.status(202).json({ 
          message: 'scan started with Google Places', 
          businessesFound: placesResult.totalFound,
          leadsCreated: placesResult.processed
        });
      }
    }
    
    // Fallback to original behavior
    collectInstagramProfiles({ estado, cidade, nicho, raio }).catch(e => console.error(e));
    res.status(202).json({ message: 'scan started' });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ error: err.message });
  }
}

// Google Places search function
async function searchGooglePlaces({ estado, cidade, nicho, raio = 5000, apiKey }) {
  try {
    // Geocode the city
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(`${cidade}, ${estado}, Brasil`)}&key=${apiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== 'OK' || !geocodeData.results.length) {
      return { success: false, error: 'Location not found' };
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;
    
    // Search for businesses
    const searchQuery = nicho || 'estabelecimento comercial';
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${raio}&keyword=${encodeURIComponent(searchQuery)}&type=establishment&language=pt-BR&key=${apiKey}`;
    
    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();

    if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
      return { success: false, error: placesData.status };
    }

    const businesses = placesData.results || [];
    let processed = 0;

    for (const place of businesses) {
      try {
        // Get place details
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,website,formatted_phone_number,types,url,business_status&language=pt-BR&key=${apiKey}`;
        
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        const details = detailsData.result || {};

        // Find Instagram handle
        let instagramHandle = await findInstagramHandle(place.name, details.website, cidade, apiKey);
        if (!instagramHandle) {
          instagramHandle = `@${normalizeUsername(place.name)}`;
        }

        // Check if exists
        const exists = await Lead.findOne({ 
          $or: [
            { instagram: instagramHandle },
            { googlePlaceId: place.place_id }
          ]
        });

        if (!exists) {
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
            endereco: details.formatted_address || '',
            latitude: place.geometry?.location?.lat || 0,
            longitude: place.geometry?.location?.lng || 0,
          });
          await newLead.save();
          processed++;
        }
      } catch (err) {
        console.error('Error processing place:', place.name, err.message);
      }
    }

    return { success: true, totalFound: businesses.length, processed };
  } catch (err) {
    console.error('Google Places search error:', err);
    return { success: false, error: err.message };
  }
}

// Find Instagram handle
async function findInstagramHandle(businessName, website, cidade, apiKey) {
  // Try to extract from website
  if (website) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(website, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LeadFinder/1.0)' }
      });
      clearTimeout(timeoutId);
      
      const html = await response.text();
      const match = html.match(/instagram\.com\/([a-zA-Z0-9_\.]+)/i);
      if (match && match[1] && !['p', 'explore', 'stories', 'reels'].includes(match[1].toLowerCase())) {
        return `@${match[1]}`;
      }
    } catch (e) {
      // Ignore
    }
  }

  // Try Google Custom Search if configured
  if (process.env.GOOGLE_SEARCH_CX) {
    try {
      const searchQuery = `${businessName} ${cidade} instagram site:instagram.com`;
      const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&key=${apiKey}&cx=${process.env.GOOGLE_SEARCH_CX}&num=3`;
      
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
    } catch (e) {
      // Ignore
    }
  }

  return null;
}

// Normalize username
function normalizeUsername(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_]/g, '')
    .substring(0, 30);
}

// Extract bairro
function extractBairro(address) {
  if (!address) return '';
  const parts = address.split(',').map(p => p.trim());
  return parts.length >= 2 ? parts[1] : '';
}

// Map place types
function mapPlaceTypeToCategoria(types) {
  const typeMap = {
    restaurant: 'Restaurante', food: 'Alimentação', cafe: 'Cafeteria', bar: 'Bar',
    bakery: 'Padaria', beauty_salon: 'Salão de Beleza', hair_care: 'Cabeleireiro',
    spa: 'Spa', gym: 'Academia', clothing_store: 'Loja de Roupas',
    shoe_store: 'Loja de Calçados', jewelry_store: 'Joalheria',
    electronics_store: 'Eletrônicos', furniture_store: 'Móveis',
    pet_store: 'Pet Shop', veterinary_care: 'Veterinário', dentist: 'Dentista',
    doctor: 'Médico', pharmacy: 'Farmácia', real_estate_agency: 'Imobiliária',
    car_dealer: 'Concessionária', car_repair: 'Mecânica', florist: 'Floricultura',
    supermarket: 'Supermercado', lodging: 'Hospedagem', school: 'Escola',
  };
  for (const type of types || []) {
    if (typeMap[type]) return typeMap[type];
  }
  return 'Comércio Local';
}

// Calculate score
function calculateInitialScore(place) {
  let score = 30;
  if (place.rating) score += (place.rating / 5) * 20;
  if (place.user_ratings_total > 100) score += 15;
  else if (place.user_ratings_total > 50) score += 10;
  else if (place.user_ratings_total > 10) score += 5;
  if (place.business_status === 'OPERATIONAL') score += 10;
  return Math.min(100, Math.round(score));
}
