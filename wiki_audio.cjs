const https = require('https');
https.get('https://en.wikipedia.org/wiki/Wikipedia:Sound/list', (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    let m = body.match(/https:\/\/upload.wikimedia.org\/wikipedia\/commons\/[^"]+\.mp3/g);
    if(m) console.log(m.slice(0, 5));
  });
});
