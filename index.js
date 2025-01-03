import fs from "fs";
import inquirer from "inquirer";
import sharp from "sharp";
import fetch from "node-fetch";
import path from "path";
const ascii = " .:-=+*#%@";

// Main file for the logic of the Image to ASCII Conversion


// This interprets the image from teh link
async function downloadImage(filePath) {
  // Await an image from the given link

  const img = await fetch(filePath);
  // Throw error if failed to fetch an image

  if (!img.ok) {
    throw new Error(`Failed to fetch image: ${img.statusText}`);
  }
  // Convert to Buffer for later usage

  const buffer = await img.arrayBuffer();
  return Buffer.from(buffer);
}

// Converts the image to ASCII by scanning pixels, getting the brightness value and mapping it onto the ASCII Brightness array.
// Filename is the URL to an image and the dimensions are specified to nicely fit into a HTML
async function convertImageToAscii(fileName, dimensions) {
  try {
    fileName = await downloadImage(fileName);
    let image = sharp(fileName)

    // Increase saturation and contrast
    .modulate({ 
      saturation: 10,
      contrast : 10
    })
    // Convert to grayscale for easier processing
    .greyscale()

    // Adjusts image levels to bring out the contrast more
    .linear(1.7, -20)

    // Resize to make the image smaller
    .resize(dimensions)

    // Get metadata for later scanning of pixels
    let metadata = await image.metadata();
    let { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Get dimensions of the image
    const width = info.width;
    const height = info.height;

    // Get channels of the images
    const channels = info.channels;
    if (data.length !== width * height * channels) {
      console.error("Mismatch in expected and actual data length.");
      return;
    }

    // Main logic of the conversion
    // Begin with an empty string for the ASCII conversion

    let str = "";
    for (let y = 0; y < height; y++) {

      // Each row string is an empty string and gets populated with the ASCII character representing the brightness of the given pixel
      let row = "";
      for (let x = 0; x < width - 2; x++) { // -2 correction

        // Go over each pixel
        const index = (y * width + x) * channels;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        // Calculate its brightness
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Add the "ASCII pixel" to the row
        row += brightnessToAscii(brightness) + " ";
      }
      // Add the created row and a new line to the string
      str += row + "\n";
    }

    // Return the converted image
    return str;
  } catch (error) {
    console.log(error);
  }
}

// Brightness calculation of a given pixel given its brightness
function brightnessToAscii(brightness) {
  
  // Normalizes the brightness
  brightness = Math.max(0, Math.min(255, brightness));

  // Creates an index variable to map the brightness to ASCII 
  const index = Math.floor((brightness / 255) * (ascii.length - 1));

  // Return the proper character representing the brightness of a pixel
  return ascii[index];
}

// Creates the ASCII string from an image URL in specified dimensions
export async function createFile(fileName, dimensions) {
  let str = await convertImageToAscii(fileName, dimensions);
  return str;
}