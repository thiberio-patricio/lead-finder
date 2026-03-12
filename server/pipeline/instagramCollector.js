import axios from 'axios';
import Lead from '../models/Lead.js';
import dotenv from 'dotenv';

dotenv.config();

// placeholder routine for acquiring profile information from Instagram.
// in a real implementation you'd use the official Graph API and store an
// access token in the environment.  this function is intentionally simple so
// that the front end and database interactions can be tested without a live
// Instagram account.

async function fetchProfile(username) {
  // if an Instagram access token is configured we will attempt a real Graph
  // API request using the business_discovery edge.  this requires that you
  // have an Instagram Business/User ID connected to a Facebook page and that
  // the token has the "instagram_basic" and "pages_show_list" scopes.
  // set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_USER_ID in your env.
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessId = process.env.INSTAGRAM_BUSINESS_USER_ID;
  if (token && businessId) {
    try {
      const resp = await axios.get(`https://graph.facebook.com/v17.0/${businessId}`, {
        params: {
          access_token: token,
          fields: `business_discovery.username(${username}){username,followers_count,media_count,engagement,biography,ig_id}`
        }
      });
      const info = resp.data.business_discovery;
      // engagement is not returned by the API, compute a dummy value
      const eng = info.followers_count ? parseFloat(((Math.random() * 2)).toFixed(2)) : 0;
      return {
        seguidores: info.followers_count || 0,
        engajamento: eng,
        posts: info.media_count || 0,
        ultimoPost: 0,
        bio: info.biography || '',
        cta: false,
        reels: false,
      };
    } catch (err) {
      console.warn('instagram graph api call failed', err.message);
      // fall through to fake data
    }
  }

  // fallback to random data when token is missing or call fails
  return {
    seguidores: Math.floor(Math.random() * 8000) + 500,
    engajamento: parseFloat((Math.random() * 2).toFixed(2)),
    posts: Math.floor(Math.random() * 300),
    ultimoPost: Math.floor(Math.random() * 100),
    bio: 'descrição do perfil',
    cta: Math.random() > 0.5,
    reels: Math.random() > 0.5,
  };
}

export async function collectInstagramProfiles(filters = {}) {
  // you can look at filters.estado / cidade / nicho / raio to restrict which
  // leads to query.  at minimum we update every record that has an instagram
  // handle.
  const query = {};
  if (filters.estado) query.estado = filters.estado;
  if (filters.cidade) query.cidade = filters.cidade;
  if (filters.nicho) query.categoria = filters.nicho;
  // (raio would require geolocation lookup; omitted)

  // update existing leads first
  const existing = await Lead.find(query).exec();
  for (const lead of existing) {
    try {
      const data = await fetchProfile(lead.instagram.replace('@', ''));
      lead.seguidores = data.seguidores;
      lead.engajamento = data.engajamento;
      lead.posts = data.posts;
      lead.ultimoPost = data.ultimoPost;
      lead.bio = data.bio;
      lead.cta = data.cta;
      lead.reels = data.reels;
      lead.leadScore = computeLeadScore(data);
      await lead.save();
    } catch (err) {
      console.error('error fetching profile for', lead.instagram, err.message);
    }
  }

  // ### discover new accounts ###
  // in a real pipeline you would query the Instagram Graph API or a
  // scraper for business profiles that match the filters (location, niche,
  // etc.), then insert them into the database if they aren't already
  // present.  the code below simulates creating a couple of dummy records.
  if (filters.estado && filters.cidade) {
    const dummy = {
      nome: `${filters.cidade} Sample`,
      instagram: `@${filters.cidade.toLowerCase()}_business`,
      estado: filters.estado,
      cidade: filters.cidade,
      categoria: filters.nicho || 'Não especificado',
      seguidores: 0,
      engajamento: 0,
      posts: 0,
      ultimoPost: 0,
      leadScore: 0,
      status: 'novo',
    };
    // only insert if not exists
    const exists = await Lead.findOne({ instagram: dummy.instagram });
    if (!exists) {
      await new Lead(dummy).save();
      console.log('inserted placeholder lead', dummy.instagram);
    }
  }
}

function computeLeadScore(data) {
  // very naive formula for demonstration
  let score = (data.seguidores / 100) + (data.engajamento * 10);
  if (data.cta) score += 5;
  if (data.reels) score += 5;
  return Math.min(100, Math.round(score));
}

export default { collectInstagramProfiles, fetchProfile };
