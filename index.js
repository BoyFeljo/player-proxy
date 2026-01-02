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
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'no-referrer'
    });
    res.end(`Acesse com um ID: https://${req.headers.host}/12345`);
    return;
  }
  
  // Validação simples
  if (!/^[0-9]+$/.test(id)) {
    res.writeHead(404, {
      'Content-Type': 'text/html; charset=UTF-8',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'no-referrer'
    });
    res.end("ID inválido");
    return;
  }
  
  const playerUrl = BASE_PLAYER_URL + id;
  
  // ================= FETCH (equivalente ao CURL) =================
  try {
    const response = await fetch(playerUrl, {
      headers: {
        "Origin": FAKE_ORIGIN,
        "Referer": FAKE_REFERER,
        "User-Agent": "Mozilla/5.0 (Android 11)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      },
      // Equivalente a CURLOPT_FOLLOWLOCATION
      redirect: 'follow',
      // Equivalente a CURLOPT_SSL_VERIFYPEER false
      // (o node-fetch usa a verificação padrão do Node.js)
    });
    
    const httpCode = response.status;
    const html = await response.text();
    
    if (httpCode !== 200 || !html) {
      res.writeHead(502, {
        'Content-Type': 'text/html; charset=UTF-8',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'no-referrer'
      });
      res.end("Falha ao carregar o player");
      return;
    }
    
    // ================= HEADERS =================
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'no-referrer'
    });
    
    // ================= SAÍDA =================
    res.end(html);
    
  } catch (error) {
    console.error('Erro:', error);
    
    res.writeHead(502, {
      'Content-Type': 'text/html; charset=UTF-8',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'no-referrer'
    });
    res.end("Falha ao carregar o player");
  }
};