const https = require('https');
https.get('https://g.tenor.com/v1/search?q=slow+dance+silhouette+loop+smooth&key=LIVDSRZULELA&limit=5', (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(JSON.parse(body).results.map(i => i.media[0].gif.url)));
});
