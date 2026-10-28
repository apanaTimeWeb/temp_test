import fs from 'fs';
import path from 'path';

const projectRoot = 'C:\\Users\\satyam\\Desktop\\Projects_working\\temp_test\\frontend';
const authDir = path.join(projectRoot, 'app', 'frontend_public', 'public_auth');

function getAllFiles(dir, exts = ['.ts', '.tsx']) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(fullPath))) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getAllFiles(authDir);
console.log(`Found ${files.length} ts/tsx files in public_auth.`);

let modifiedCount = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Regex to match imports: from './...' or from '../...'
  // e.g. import ... from '../api/PublicAuthSignInApi';
  content = content.replace(/(from\s+['"])(\.\.?\/[^'"]+)(['"])/g, (match, prefix, importPath, suffix) => {
    // Resolve absolute path
    const fileDir = path.dirname(filePath);
    const resolvedPath = path.resolve(fileDir, importPath);

    // Compute path relative to projectRoot
    const relToRoot = path.relative(projectRoot, resolvedPath).replace(/\\/g, '/');

    // Make sure it starts with @/
    const newPath = `@/${relToRoot}`;
    return `${prefix}${newPath}${suffix}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
    console.log(`Updated: ${path.relative(projectRoot, filePath).replace(/\\/g, '/')}`);
  }
}

console.log(`\nSuccessfully converted ${modifiedCount} files to direct absolute imports (@/...).`);

