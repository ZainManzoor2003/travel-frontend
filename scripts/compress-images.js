import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const compressedDir = path.join(__dirname, '../public/compressed');

// Create compressed directory if it doesn't exist
if (!fs.existsSync(compressedDir)) {
  fs.mkdirSync(compressedDir, { recursive: true });
}

// Image file extensions to process
const imageExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

// Recursively find all image files
function findImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file);
      if (imageExtensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// Compress a single image
async function compressImage(inputPath, outputPath) {
  try {
    const relativePath = path.relative(publicDir, inputPath);
    const outputRelativePath = path.relative(publicDir, outputPath);
    
    console.log(`Compressing: ${relativePath}`);
    
    await sharp(inputPath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality: 80,
        progressive: true,
        mozjpeg: true
      })
      .toFile(outputPath);
    
    // Get file sizes
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ Compressed: ${relativePath} (${(originalSize/1024/1024).toFixed(2)}MB → ${(compressedSize/1024/1024).toFixed(2)}MB, ${savings}% saved)`);
    
    return { originalSize, compressedSize, savings };
  } catch (error) {
    console.error(`✗ Error compressing ${inputPath}:`, error.message);
    return null;
  }
}

// Main compression function
async function compressAllImages() {
  console.log('🔍 Finding images in public folder...');
  const imageFiles = findImageFiles(publicDir);
  
  if (imageFiles.length === 0) {
    console.log('No images found to compress.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to compress.`);
  
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let successCount = 0;
  
  for (const imagePath of imageFiles) {
    const relativePath = path.relative(publicDir, imagePath);
    const outputPath = path.join(compressedDir, relativePath);
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const result = await compressImage(imagePath, outputPath);
    if (result) {
      totalOriginalSize += result.originalSize;
      totalCompressedSize += result.compressedSize;
      successCount++;
    }
  }
  
  const totalSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log('\n📊 Compression Summary:');
  console.log(`✓ Successfully compressed: ${successCount}/${imageFiles.length} images`);
  console.log(`📦 Total size: ${(totalOriginalSize/1024/1024).toFixed(2)}MB → ${(totalCompressedSize/1024/1024).toFixed(2)}MB`);
  console.log(`💾 Space saved: ${totalSavings}% (${((totalOriginalSize - totalCompressedSize)/1024/1024).toFixed(2)}MB)`);
  console.log(`\n📁 Compressed images saved to: ${path.relative(process.cwd(), compressedDir)}`);
  console.log('\n🔄 Next steps:');
  console.log('1. Review the compressed images');
  console.log('2. Replace original images with compressed versions');
  console.log('3. Update image references in your code if needed');
}

// Run the compression
compressAllImages().catch(console.error);
