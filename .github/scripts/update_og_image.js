const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../../combined_url_mapping.json');
const htmlPath = path.join(__dirname, '../../index.html');

try {
    // Read the JSON file
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const images = JSON.parse(jsonData);

    // Get all image entries
    const imageEntries = Object.values(images);

    if (imageEntries.length === 0) {
        console.error('No images found in combined_url_mapping.json');
        process.exit(1);
    }

    // Pick a random image
    const randomImage = imageEntries[Math.floor(Math.random() * imageEntries.length)];
    const imageUrl = randomImage.hq || randomImage.webp;

    if (!imageUrl) {
        console.error('Selected image has no URL');
        process.exit(1);
    }

    console.log(`Selected random image: ${imageUrl}`);

    // Read index.html
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Regex to replace og:image content
    const ogImageRegex = /<meta property="og:image" content="[^"]*" \/>/;
    const twitterImageRegex = /<meta name="twitter:image" content="[^"]*" \/>/;

    // Check if tags exist
    if (!ogImageRegex.test(htmlContent) || !twitterImageRegex.test(htmlContent)) {
        console.error('Could not find og:image or twitter:image meta tags in index.html');
        // If they don't exist, we might want to add them, but for now let's assume they are there (I just added them)
    }

    // Replace content
    htmlContent = htmlContent.replace(ogImageRegex, `<meta property="og:image" content="${imageUrl}" />`);
    htmlContent = htmlContent.replace(twitterImageRegex, `<meta name="twitter:image" content="${imageUrl}" />`);

    // Write back to index.html
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log('Successfully updated index.html with new random Open Graph image.');

} catch (error) {
    console.error('Error updating Open Graph image:', error);
    process.exit(1);
}
