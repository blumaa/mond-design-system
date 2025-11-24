import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

/**
 * Post-build script to add explicit .js extensions to ES module imports.
 *
 * Fixes issues with strict ES module resolution in Vitest and other environments
 * that require explicit file extensions.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function fixImports(dir: string): void {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      fixImports(fullPath);
    } else if (entry.name.endsWith('.js')) {
      processJsFile(fullPath);
    }
  }
}

function processJsFile(filePath: string): void {
  let content = readFileSync(filePath, 'utf8');
  let modified = false;

  // Match: export/import ... from './path' or "../path"
  content = content.replace(
    /(from\s+['"])(\.\.?\/[\w/-]+)(['"])/g,
    (match, prefix, importPath, suffix) => {
      // Skip if already has an extension
      if (/\.(js|json)$/.test(importPath)) {
        return match;
      }

      // Resolve the import path relative to the current file
      const fileDir = dirname(filePath);
      const resolvedPath = resolve(fileDir, importPath);

      // Check if it's a directory (should import index.js)
      if (existsSync(resolvedPath) && statSync(resolvedPath).isDirectory()) {
        modified = true;
        return `${prefix}${importPath}/index.js${suffix}`;
      }

      // Check if it's a file (should add .js)
      if (existsSync(resolvedPath + '.js')) {
        modified = true;
        return `${prefix}${importPath}.js${suffix}`;
      }

      // If neither exists, assume it's a file and add .js
      // (handles edge cases where file might not exist yet)
      console.warn(`⚠️  Could not resolve: ${importPath} in ${filePath}`);
      modified = true;
      return `${prefix}${importPath}.js${suffix}`;
    }
  );

  if (modified) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed imports in ${filePath}`);
  }
}

// Run the script
const distDir = resolve(__dirname, '../dist');

if (!existsSync(distDir)) {
  console.error('❌ dist directory not found. Run build first.');
  process.exit(1);
}

console.log('🔧 Fixing ES module imports...');
fixImports(distDir);
console.log('✅ All imports fixed!');
