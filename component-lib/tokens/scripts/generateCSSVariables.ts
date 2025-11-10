import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCSSContent } from './generateCSSVariables.core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main execution
 */
function main() {
  console.log('🎨 Generating CSS variables from design tokens...\n');

  try {
    // Generate CSS content
    const cssContent = generateCSSContent();

    // Ensure dist directory exists
    const distDir = path.join(__dirname, '../../dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Write CSS file
    const outputPath = path.join(distDir, 'theme.css');
    fs.writeFileSync(outputPath, cssContent, 'utf-8');

    // Count variables
    const varCount = (cssContent.match(/--mond-/g) || []).length;

    console.log('✅ Successfully generated CSS variables!');
    console.log(`   📄 Output: ${path.relative(process.cwd(), outputPath)}`);
    console.log(`   🎯 Variables: ${varCount}`);
    console.log(`   📦 Size: ${(cssContent.length / 1024).toFixed(2)} KB\n`);
  } catch (error) {
    console.error('❌ Failed to generate CSS variables:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// Re-export core functions for backward compatibility
export { generateAllCSSVariables, generateCSSContent } from './generateCSSVariables.core.js';
