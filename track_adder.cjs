const fs = require('fs');
const https = require('https');

const newTracks = [
  { id: 'im_dada', term: 'DADA Holy Wave', title: "i'm DADA", artist: 'Holy Wave', genre: 'Rock', color: '#3B82F6' },
  { id: 'paradise_glass', term: 'The Other Side of Paradise Glass Animals', title: 'The Other Side of Paradise', artist: 'Glass Animals', genre: 'Indie', color: '#8B5CF6' },
  { id: 'free_loop', term: 'Free Loop Daniel Powter', title: 'Free Loop', artist: 'Daniel Powter', genre: 'Pop', color: '#F59E0B' },
  { id: 'worth_it', term: 'Worth It Fifth Harmony', title: 'Worth It', artist: 'Fifth Harmony', genre: 'Pop', color: '#EC4899' },
  { id: 'chun_ii', term: '椿乐队', title: '椿II/Chun', artist: '椿乐队', genre: 'Rock', color: '#EF4444' },
  { id: 'sign_of_the_times', term: 'Sign of the Times Harry Styles', title: 'Sign of the Times', artist: 'Harry Styles', genre: 'Pop', color: '#64748B' },
  { id: 'warp_me', term: 'Warp Me in Plastic CHROMANCE', title: 'Warp Me in Plastic', artist: 'CHROMANCE', genre: 'Pop', color: '#06B6D4' },
  { id: 'union_chapel', term: 'Union Chapel Manchester Orchestra', title: 'Union Chapel', artist: 'Manchester Orchestra', genre: 'Folk', color: '#10B981' },
  { id: 'down_on_earth', term: 'Down On Earth Turnover', title: 'Down On Earth', artist: 'Turnover', genre: 'Indie', color: '#FDE047' },
  { id: 'handwritten', term: 'Handwritten Shawn Mendes', title: 'Handwritten', artist: 'Shawn Mendes', genre: 'Pop', color: '#3B82F6' },
  { id: 'attention', term: 'Attention Charlie Puth', title: 'Attention', artist: 'Charlie Puth', genre: 'Pop', color: '#EF4444' },
  { id: 'in_utero', term: 'In Utero Nirvana', title: 'In Utero', artist: 'Nirvana', genre: 'Rock', color: '#D946EF' },
  { id: 'humdrum', term: 'Humdrum Chace', title: 'Humdrum', artist: 'Chace', genre: 'Electronic', color: '#C2410C' }
];

async function search(term) {
    return new Promise((resolve) => {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=1`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.results && parsed.results.length > 0) {
                        resolve(parsed.results[0].artworkUrl100.replace('100x100bb', '600x600bb'));
                    } else {
                        resolve('https://via.placeholder.com/600x600');
                    }
                } catch (e) { resolve('https://via.placeholder.com/600x600'); }
            });
        }).on('error', () => resolve('https://via.placeholder.com/600x600'));
    });
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '0,0,0';
}

async function run() {
    let fileStr = fs.readFileSync('src/data/tracks.ts', 'utf8');
    
    let tracksToAdd = [];
    let itemsToAdd = [];
    
    // We already have 19 tracks in the current file.
    let count = 19;
    
    let lastGridX = 3;
    let lastGridY = 5;

    for (const t of newTracks) {
        let coverUrl = await search(t.term);
        // Special case for missing ones, if necessary
        
        let rgb = hexToRgb(t.color);
        let trackObj = `  {
    id: '${t.id}',
    title: '${t.title}',
    artist: '${t.artist}',
    genre: '${t.genre}',
    bpm: 100,
    color: '${t.color}',
    glowGradient: 'radial-gradient(circle, rgba(${rgb},0.18) 0%, rgba(0,0,0,0) 70%)',
    twinId: 'TWIN-${t.id}',
    releaseYear: 2020,
    duration: '03:30',
    synthTheme: 'ambient',
    description: 'A great track by ${t.artist}.',
    coverUrl: '${coverUrl}',
  }`;
  
        tracksToAdd.push(trackObj);
        
        lastGridX++;
        if (lastGridX > 4) {
            lastGridX = 1;
            lastGridY++;
        }
        
        itemsToAdd.push(`  { id: '${count + 1}', track: TRACKS[${count}], gridX: ${lastGridX}, gridY: ${lastGridY}, offsetX: 0, offsetY: 0, scatterX: ${Math.floor(Math.random() * 1000 + 200)}, scatterY: ${Math.floor(Math.random() * 1000 + 200)} }`);
        count++;
    }
    
    let trackPart = tracksToAdd.join(',\n');
    let itemPart = itemsToAdd.join(',\n');
    
    fileStr = fileStr.replace(/}\n\];\n\nexport const CANVAS_ITEMS/, `},\n${trackPart}\n];\n\nexport const CANVAS_ITEMS`);
    fileStr = fileStr.replace(/}\n\];/g, `},\n${itemPart}\n];`);
    
    fs.writeFileSync('src/data/tracks.ts', fileStr);
    console.log("Success");
}

run();
