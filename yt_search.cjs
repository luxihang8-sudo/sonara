const https = require('https');
https.get('https://www.youtube.com/results?search_query=female+dance+silhouette+loop+abstract', (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    let re = /"videoId":"([a-zA-Z0-9_-]{11})".*?"title":\{"runs":\[\{"text":"([^"]+)"\}/g;
    let match;
    let count = 0;
    while((match = re.exec(body)) !== null && count < 10) {
      console.log(match[1], match[2]);
      count++;
    }
  });
});
