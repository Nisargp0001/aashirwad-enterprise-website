const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldHeaderLogo = `<img src="/logo.jpeg" alt="Aashirwad Enterprise Logo" style="height: 48px; max-width: 100%; object-fit: contain;" />`;
const newHeaderLogo = `<img src="/logo.jpeg" alt="Aashirwad Enterprise Logo" style="height: 85px; max-width: 100%; object-fit: contain; mix-blend-mode: multiply;" />`;

const oldFooterLogo = `<img src="/logo.jpeg" alt="Logo" style="height: 40px; margin-bottom: 1rem;" />`;
const newFooterLogo = `<img src="/logo.jpeg" alt="Logo" style="height: 70px; margin-bottom: 1rem; mix-blend-mode: multiply;" />`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all instances of the old logos
  content = content.split(oldHeaderLogo).join(newHeaderLogo);
  content = content.split(oldFooterLogo).join(newFooterLogo);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
