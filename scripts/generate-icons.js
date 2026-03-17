/**
 * Simple SVG-based icon generator
 * Run: node scripts/generate-icons.js
 * Requires: npm install @resvg/resvg-js (optional — or use online tool)
 *
 * Alternatively, use https://realfavicongenerator.net/ with the favicon.svg
 */

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#1a56db"/>
  <path d="M256 60 L420 140 L420 280 C420 360 344 430 256 460 C168 430 92 360 92 280 L92 140 Z" fill="white" opacity="0.95"/>
  <path d="M196 256 L236 296 L324 208" stroke="#1a56db" stroke-width="28" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

console.log('WorkGuard icon SVG:')
console.log(svgIcon)
console.log('\nTo generate PNG icons:')
console.log('1. Save the SVG above as icon.svg')
console.log('2. Use https://realfavicongenerator.net/ or')
console.log('3. Use ImageMagick: convert -size 512x512 icon.svg public/icons/icon-512.png')
