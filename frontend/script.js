// This file handles the direct HTML document and pastes the script obtained from the server NodeJS script

// Select document elements
const btn = document.querySelector("button");
const input = document.querySelector("input");
const p = document.querySelector("p");

// Add an event listener to the button that listens for the image link
btn.addEventListener("click", async () => {
  let str = input.value;
  // returns and sets the content of the HTML paragraph elmeent to the ASCII representation of the image
  p.textContent = fetchAscii(str); 
});

// Fetches the ASCII from the server (app.js)
function fetchAscii(str) {
  let asciiString = fetch(`http://localhost:9999/${str}`)
    .then((string) => string.text())
    .then((data) => {
      console.log(data);
      p.textContent = data;
    })
    .catch((err) => {
      console.error(err);
    });
}