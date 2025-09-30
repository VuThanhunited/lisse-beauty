const fs = require("fs").promises;
const path = require("path");

async function copyImages() {
  const sourceDir = path.join(
    __dirname,
    "../../../lisse-beauty-main(done)/lisse-beauty-main/src/data/KimlyIMG"
  );
  const targetBaseDir = path.join(__dirname, "../../uploads");

  // Create target directories
  const directories = [
    "before-after",
    "services",
    "banners",
    "staff",
    "lifestyle",
    "professional",
    "spa",
    "facility",
    "gallery",
  ];

  for (const dir of directories) {
    const dirPath = path.join(targetBaseDir, dir);
    try {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } catch (error) {
      console.log(`Directory ${dir} already exists or error:`, error.message);
    }
  }

  // File mapping (source -> destination)
  const fileMapping = {
    // Before/After images
    "fox-truoc.jpg": "before-after/fox-truoc.jpg",
    "fox-sau.jpg": "before-after/fox-sau.jpg",
    "glowing-truoc.jpg": "before-after/glowing-truoc.jpg",
    "glowing-sau-scaled.jpg": "before-after/glowing-sau-scaled.jpg",
    "Truoca.jpg": "before-after/Truoca.jpg",
    "Saua.jpg": "before-after/Saua.jpg",
    "Skechlips01-Truoc-scaled.png": "before-after/Skechlips01-Truoc-scaled.png",
    "Skechlips01-Sau-scaled.png": "before-after/Skechlips01-Sau-scaled.png",

    // Service images
    "hairstroke-cover.png": "services/hairstroke-cover.png",
    "closeup-soft-glossy-lips-highlighting-natural-beauty-skincare-techniques-2.jpg":
      "services/closeup-soft-glossy-lips-highlighting-natural-beauty-skincare-techniques-2.jpg",

    // Banners
    "Anh-bia-t7.jpg": "banners/Anh-bia-t7.jpg",
    "banner-mobiley.jpg": "banners/banner-mobiley.jpg",

    // Staff
    "Ban-sao-Lax56484Kim-Ly-scaled-e1751540571892.webp":
      "staff/Ban-sao-Lax56484Kim-Ly-scaled-e1751540571892.webp",

    // Lifestyle
    "beautiful-summer-girl-palm-leaves-young-sexy-woman-palm-tree-jungle-scaled.jpg":
      "lifestyle/beautiful-summer-girl-palm-leaves-young-sexy-woman-palm-tree-jungle-scaled.jpg",

    // Professional
    "business-woman-isolated-white-scaled.webp":
      "professional/business-woman-isolated-white-scaled.webp",

    // Spa
    "exquisite-display-beauty-treatment-spa-salon-accessories-quiescent-2048x1366.webp":
      "spa/exquisite-display-beauty-treatment-spa-salon-accessories-quiescent-2048x1366.webp",
    "pristine-elegant-spa-massage-room-with-neatly-arranged-towels-bed-soft-lighting-she.jpg":
      "spa/pristine-elegant-spa-massage-room-with-neatly-arranged-towels-bed-soft-lighting-she.jpg",

    // Facility
    "modern-luxury-beauty-salon-interior-with-marble-gold-accents-3d-rendering-3-scaled.webp":
      "facility/modern-luxury-beauty-salon-interior-with-marble-gold-accents-3d-rendering-3-scaled.webp",

    // Gallery
    "2151898108.jpg": "gallery/2151898108.jpg",
  };

  let copiedCount = 0;
  let errorCount = 0;

  for (const [sourceFile, targetFile] of Object.entries(fileMapping)) {
    try {
      const sourcePath = path.join(sourceDir, sourceFile);
      const targetPath = path.join(targetBaseDir, targetFile);

      // Check if source file exists
      try {
        await fs.access(sourcePath);
      } catch {
        console.log(`❌ Source file not found: ${sourceFile}`);
        errorCount++;
        continue;
      }

      // Copy file
      await fs.copyFile(sourcePath, targetPath);
      console.log(`✅ Copied: ${sourceFile} -> ${targetFile}`);
      copiedCount++;
    } catch (error) {
      console.log(`❌ Error copying ${sourceFile}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Successfully copied: ${copiedCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`\n🎯 Images are ready for MongoDB import!`);
  console.log(`\nNext steps:`);
  console.log(
    `1. Import services: mongoimport --db lisse_beauty --collection services --file data/services_import.json --jsonArray`
  );
  console.log(
    `2. Import images: mongoimport --db lisse_beauty --collection images --file data/images_import.json --jsonArray`
  );
  console.log(
    `3. Import feedbacks: mongoimport --db lisse_beauty --collection feedbacks --file data/feedbacks_import.json --jsonArray`
  );
}

// Run the copy function if this file is executed directly
if (require.main === module) {
  copyImages().catch(console.error);
}

module.exports = copyImages;
