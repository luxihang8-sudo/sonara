const fs = require('fs');

const requiredOrder = [
    'cosmic_opera',
    'i_am_what_i_am',
    'carry_you',
    'west_lake',
    'welcome_mood',
    'anhe_bridge',
    'dune_hans',
    'big_mama',
    'les_miserables',
    'city_of_stars',
    'kill_shijiazhuang_man',
    'live_eden_project',
    'euphoria_3',
    'athletics_iii',
    'golden_hour',
    'iftyay',
    'river_wachi',
    'head_in_clouds',
    'teen_spirit'
];

let content = fs.readFileSync('src/data/tracks.ts', 'utf8');

// Extract the TRACKS array content
const tracksMatch = content.match(/export const TRACKS: Track\[\] = \[([\s\S]*?)\];\n\nexport const CANVAS_ITEMS/);

if (!tracksMatch) {
    console.error("Could not find TRACKS array");
    process.exit(1);
}

const tracksBlock = tracksMatch[1];
// Split by track blocks.
const trackRegex = /\{\r?\n\s+id: '([^']+)'[\s\S]*?\r?\n\s+\}/g;
let match;
const tracksMap = {};

while ((match = trackRegex.exec(tracksBlock)) !== null) {
    const id = match[1];
    tracksMap[id] = match[0];
}

const newTracksContent = requiredOrder.map(id => tracksMap[id]).join(',\n  ');

content = content.replace(tracksMatch[1], '\n  ' + newTracksContent + '\n');

// Also update CANVAS_ITEMS tracks order based on the new array
const newCanvasItems = requiredOrder.map((trackId, i) => {
    return `{ id: '${i + 1}', track: TRACKS[${i}], gridX: ${(i % 4) + 1}, gridY: ${Math.floor(i / 4) + 1}, offsetX: 0, offsetY: 0, scatterX: ${Math.floor(Math.random() * 1500 + 100)}, scatterY: ${Math.floor(Math.random() * 1500 + 100)} }`;
});

const canvasMatch = content.match(/export const CANVAS_ITEMS: CanvasItem\[\] = \[([\s\S]*?)\];/);
if (canvasMatch) {
    content = content.replace(canvasMatch[1], '\n  ' + newCanvasItems.join(',\n  ') + '\n');
}

fs.writeFileSync('src/data/tracks.ts', content);
console.log("Successfully reordered tracks.");
