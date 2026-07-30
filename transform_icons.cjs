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
  // e.g. inventory_2 -> Inventory2, shopping_bag -> ShoppingBag
  return str.split('_').map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
}

const files = walk('./src');
let modifiedFilesCount = 0;
let skippedFiles = [];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Skip if it contains {benefit.icon} as we'll handle that manually
  if (content.includes('{benefit.icon}')) {
    skippedFiles.push(file);
    return;
  }

  // Regex to find the span. 
  // It handles single line and multi-line spans non-greedily
  const spanRegex = /<span\s+([^>]*?)className=["']([^"']*?)material-symbols-outlined([^"']*?)["']([^>]*?)>([\s\S]*?)<\/span>/g;
  
  let match;
  const iconsToImport = new Set();
  let modifiedContent = content;
  let hasModifications = false;

  modifiedContent = modifiedContent.replace(spanRegex, (fullMatch, beforeClass, classPrev, classNext, afterClass, iconNameStr) => {
    const rawIconName = iconNameStr.trim();
    
    // Ignore empty or weird matches
    if (!rawIconName || rawIconName.includes('<') || rawIconName.includes('{')) {
      return fullMatch; // Do not modify
    }
    
    const componentName = snakeToPascal(rawIconName);
    iconsToImport.add(componentName);
    hasModifications = true;
    
    // Construct new class string
    const newClassStr = `${classPrev.trim()} ${classNext.trim()}`.replace(/\s+/g, ' ').trim();
    
    let attrs = beforeClass.trim();
    if (newClassStr) {
       attrs += ` className="${newClassStr}"`;
    }
    if (afterClass.trim()) {
       attrs += ` ${afterClass.trim()}`;
    }
    
    attrs = attrs.trim();
    return attrs ? `<${componentName} ${attrs} />` : `<${componentName} />`;
  });

  if (hasModifications) {
    // Add imports
    const importStatement = `import { ${Array.from(iconsToImport).join(', ')} } from '@material-symbols-svg/react';\n`;
    
    // Insert after the last import, or at the top
    const lastImportIndex = modifiedContent.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = modifiedContent.indexOf('\n', lastImportIndex);
      modifiedContent = modifiedContent.slice(0, endOfLastImport + 1) + importStatement + modifiedContent.slice(endOfLastImport + 1);
    } else {
      modifiedContent = importStatement + modifiedContent;
    }
    
    fs.writeFileSync(file, modifiedContent, 'utf8');
    modifiedFilesCount++;
  }
});

console.log(`Modified ${modifiedFilesCount} files.`);
console.log(`Skipped files:`, skippedFiles);
