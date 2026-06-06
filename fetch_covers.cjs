const fs = require('fs');
const https = require('https');

const tracks = [
    { id: 'cosmic_opera', term: 'COSMIC OPERA ACT II Labrinth', fallback: 'https://i.scdn.co/image/ab67616d0000b273d2f9ed70d24e6fffc87eef9f' },
    { id: 'i_am_what_i_am', term: 'I AM WHAT I AM YoungCaptain' },
    { id: 'carry_you', term: 'Carry You Novo Amor' },
    { id: 'west_lake', term: '西湖 痛仰' },
    { id: 'welcome_mood', term: 'Welcome to the Mood LEISURE' },
    { id: 'les_miserables', term: 'Les Miserables original cast' },
    { id: 'euphoria_3', term: 'Euphoria Hans Zimmer' },
    { id: 'river_wachi', term: '河流 蛙池' },
    { id: 'anhe_bridge', term: '安和桥 宋冬野' },
    { id: 'city_of_stars', term: 'City of Stars Ryan Gosling' },
    { id: 'athletics_iii', term: 'III Athletics' },
    { id: 'head_in_clouds', term: 'Head In The Clouds Hayd' },
    { id: 'dune_hans', term: 'Dune Hans Zimmer' },
    { id: 'kill_shijiazhuang_man', term: '杀死那个石家庄人 万能青年旅店' },
    { id: 'golden_hour', term: 'golden hour JVKE' },
    { id: 'teen_spirit', term: 'Smells Like Teen Spirit Nirvana' },
    { id: 'big_mama', term: 'Big Mama Latto' },
    { id: 'live_eden_project', term: 'The Who' },
    { id: 'iftyay', term: 'IFTYAY' }
];

async function search(term) {
    return new Promise((resolve, reject) => {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=20`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.results && parsed.results.length > 0) {
                        resolve(parsed.results[0].artworkUrl100.replace('100x100bb', '600x600bb'));
                    } else {
                        resolve(null);
                    }
                } catch (e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

async function main() {
    let file = fs.readFileSync('src/data/tracks.ts', 'utf8');
    for (const t of tracks) {
        let url = await search(t.term);
        if (!url && t.fallback) url = t.fallback;
        if (url) {
            console.log(`Found for ${t.id}: ${url}`);
            const regex = new RegExp(`(id:\\s*'${t.id}',[\\s\\S]*?coverUrl:\\s*')[^']+(')`);
            file = file.replace(regex, `$1${url}$2`);
        } else {
            console.log(`Not found for ${t.id}`);
        }
    }
    fs.writeFileSync('src/data/tracks.ts', file);
    console.log('Done!');
}
main();
