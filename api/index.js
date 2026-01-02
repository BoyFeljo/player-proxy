// api/index.js
const fetch = require('node-fetch');

// ================= CONFIGURAÇÕES =================
const BASE_PLAYER_URL = "https://player.fimoo.site/embed/";
const FAKE_ORIGIN     = "https://hyper.hyperappz.site/";
const FAKE_REFERER   = "https://hyper.hyperappz.site/";

module.exports = async (req, res) => {
  // ================= PEGAR ID DA URL =================
  const requestUri = req.url || '/';
  const pathParts = requestUri.split('/').filter(p => p);
  const id = pathParts[0] || '';
  
  // Se acessar a raiz sem ID
  if (!id) {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.end(`Acesse com um ID: https://${req.headers.host}/12345`);
    return;
  }
  
  // Validação simples
  if (!/^[0-9]+$/.test(id)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.end("ID inválido");
    return;
  }
  
  const playerUrl = BASE_PLAYER_URL + id;
  
  // ================= FETCH =================
  try {
    const response = await fetch(playerUrl, {
      headers: {
        "Origin": FAKE_ORIGIN,
        "Referer": FAKE_REFERER,
        "User-Agent": "Mozilla/5.0 (Android 11)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      },
      redirect: 'follow'
    });
    
    const httpCode = response.status;
    const html = await response.text();
    
    if (httpCode !== 200 || !html) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('Referrer-Policy', 'no-referrer');
      res.end("Falha ao carregar o player");
      return;
    }
    
    // ================= HEADERS =================
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'no-referrer');
    
    // ================= SAÍDA =================
    res.end(html);
    
  } catch (error) {
    console.error('Erro:', error);
    
    res.statusCode = 502;
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.end("Falha ao carregar o player");
  }
};
