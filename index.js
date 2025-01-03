import fs from "fs";
import inquirer from "inquirer";
import sharp from "sharp";
import fetch from "node-fetch";
import path from "path";
const ascii = " .:-=+*#%@";
// const ascii =  `.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@`



async function downloadImage(filePath) {
  // Await an image download from the link
  const img = await fetch(filePath);
  // Throw error if failed to fetch an image
  if (!img.ok) {
    throw new Error(`Failed to fetch image: ${img.statusText}`);
  }
  // Convert to Buffer
  const buffer = await img.arrayBuffer();

  // Debugging image processing
  sharp(buffer)
  .modulate({ // Increase saturation and contrast
    saturation: 10,
    contrast : 10
  })
  .greyscale()
  .linear(3.3, -20.) // Increase saturation and contrast
  // .negate() // Negate the image
  // .normalize({
  //   lower : 1,
  //   upper: 50
  // })
  .resize(500) // Resize to be smaller
  // Open the edited image with the default image viewer
  .toFile('test.png');
  return Buffer.from(buffer);
}

// Converts the image to ASCII by scanning pixels, getting the brightness value and mapping it onto the ASCII Brightness array.
async function convertImageToAscii(fileName, dimensions) {
  try {
    // 
    fileName = await downloadImage(fileName);
    let image = sharp(fileName)
    .modulate({ // Increase saturation and contrast
      saturation: 10,
      contrast : 10
    })
    .greyscale()
    .linear(1.7, -20)
    // .negate() // Negate the image
    // .normalize({
    //   lower : 1,
    //   upper: 99
    // }) // Increase saturation and contrast
    .resize(dimensions)
    let metadata = await image.metadata();
    let { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const width = info.width;
    const height = info.height;
    console.log("width: ", width, "height ", height);
    const channels = info.channels;
    if (data.length !== width * height * channels) {
      console.error("Mismatch in expected and actual data length.");
      return;
    }

    let str = "";
    let countX = 0;
    for (let y = 0; y < height; y++) {
      let row = "";
      for (let x = 0; x < width -2; x++) {
        const index = (y * width + x) * channels;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        row += brightnessToAscii(brightness) + " ";
      }
      str += row + "\n";
    }
    return str;
  } catch (error) {
    console.log(error);
  }
}

//brightness calculation
function brightnessToAscii(brightness) {
  brightness = Math.max(0, Math.min(255, brightness));
  const index = Math.floor((brightness / 255) * (ascii.length - 1));
  return ascii[index];
}

export async function createFile(fileName, dimensions) {
  let str = await convertImageToAscii(fileName, dimensions);
  return str;
}

