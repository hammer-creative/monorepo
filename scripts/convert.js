// scripts/convert-svgs.js
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../apps/web/public/icons');
const outputDir = path.join(
  __dirname,
  '../apps/web/src/components/common/logos',
);

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read all SVG files
const files = fs.readdirSync(iconsDir).filter((file) => file.endsWith('.svg'));

files.forEach((file) => {
  const svgContent = fs.readFileSync(path.join(iconsDir, file), 'utf-8');

  // Convert filename to component name (e.g., '2k.svg' -> 'TwoKLogo')
  const componentName =
    file
      .replace('.svg', '')
      .split('-')
      .map((word) => {
        if (word === '2k') return 'TwoK';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join('') + 'Logo';

  // Extract viewBox and paths
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 72 72';

  // Replace fill="#141515" or fill="..." with fill={fill}
  const modifiedSvg = svgContent
    .replace(/<svg[^>]*>/, '') // Remove opening svg tag
    .replace(/<\/svg>/, '') // Remove closing svg tag
    .replace(/fill="[^"]*"/g, 'fill={fill}')
    .replace(/fill='[^']*'/g, 'fill={fill}');

  const component = `interface LogoProps {
  fill?: string;
  className?: string;
}

export function ${componentName}({ fill = 'currentColor', className = '' }: LogoProps) {
  return (
    <svg
      viewBox="${viewBox}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      ${modifiedSvg.trim()}
    </svg>
  );
}
`;

  const outputFile = path.join(outputDir, `${componentName}.tsx`);
  fs.writeFileSync(outputFile, component);
  console.log(`Created ${componentName}.tsx`);
});

// Create index.ts barrel export
const indexContent = files
  .map((file) => {
    const componentName =
      file
        .replace('.svg', '')
        .split('-')
        .map((word) => {
          if (word === '2k') return 'TwoK';
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join('') + 'Logo';
    return `export { ${componentName} } from './${componentName}';`;
  })
  .join('\n');

fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent + '\n');
console.log('Created index.ts');
