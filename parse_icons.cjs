const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

function snakeToPascal(str) {
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

const files = walk('./src');
let filesWithIcons = 0;
let totalIcons = 0;
const allUsedIcons = new Set();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match <span className="material-symbols-outlined...">icon_name</span>
  // This is a naive regex but works for the format shown in the grep output
  const matches = [...content.matchAll(/<span\s+className=["'](.*?)material-symbols-outlined(.*?)["'](.*?)>(.*?)<\/span>/g)];
  if (matches.length > 0) {
    filesWithIcons++;
    totalIcons += matches.length;
    matches.forEach(m => allUsedIcons.add(m[4].trim()));
  }
});

console.log(`Found ${totalIcons} icons across ${filesWithIcons} files.`);
console.log(`Unique icons:`, Array.from(allUsedIcons));
