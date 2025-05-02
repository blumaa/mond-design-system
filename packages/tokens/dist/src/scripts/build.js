import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Define the paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokensDir = path.join(__dirname, '../tokens');
const outputDir = path.join(__dirname, '../../dist');
// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
// Read all token files
const tokenFiles = fs.readdirSync(tokensDir).filter(file => file.endsWith('.json'));
// Combine all tokens into a single object
const allTokens = tokenFiles.reduce((acc, file) => {
    const filePath = path.join(tokensDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return { ...acc, ...content };
}, {});
// Write the combined tokens to a JSON file
fs.writeFileSync(path.join(outputDir, 'tokens.json'), JSON.stringify(allTokens, null, 2));
// Generate TypeScript types and content
const tokenContent = `// This file is auto-generated. Do not edit manually.
export const tokens = ${JSON.stringify(allTokens, null, 2)} as const;

// Export individual token groups
export const colors = tokens.colors;
export const spacing = tokens.spacing;
export const fontFamilies = tokens.fontFamilies;
export const fontSizes = tokens.fontSizes;
export const fontWeights = tokens.fontWeights;
export const lineHeights = tokens.lineHeights;
export const letterSpacings = tokens.letterSpacings;
export const radii = tokens.radii;
export const shadows = tokens.shadows;

// Type exports
export type Tokens = typeof tokens;
export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type FontFamilyToken = keyof typeof fontFamilies;
export type FontSizeToken = keyof typeof fontSizes;
export type FontWeightToken = keyof typeof fontWeights;
export type LineHeightToken = keyof typeof lineHeights;
export type LetterSpacingToken = keyof typeof letterSpacings;
export type RadiusToken = keyof typeof radii;
export type ShadowToken = keyof typeof shadows;`;
// Write the tokens file
const tokensPath = path.join(outputDir, 'tokens.ts');
fs.writeFileSync(tokensPath, tokenContent);
// Write the index file that re-exports everything
const indexPath = path.join(outputDir, 'index.ts');
fs.writeFileSync(indexPath, 'export * from "./tokens";');
console.log('✅ Design tokens built successfully!');
