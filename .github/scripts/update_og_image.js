const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../../combined_url_mapping.json');
const dataPath = path.join(__dirname, '../../_data/og_metadata.yml');

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

    // Create YAML content
    const yamlContent = `image: ${imageUrl}
image_alt: Art Image from Public Domain Collection
`;

    // Write to _data/og_metadata.yml
    fs.writeFileSync(dataPath, yamlContent, 'utf8');
    console.log('Successfully updated _data/og_metadata.yml with new random Open Graph image.');

} catch (error) {
    console.error('Error updating Open Graph image:', error);
    process.exit(1);
}
