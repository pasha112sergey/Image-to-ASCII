const btn = document.querySelector("button");
const input = document.querySelector("input");
const p = document.querySelector("p");

btn.addEventListener("click", async () => {
  let str = input.value;
  p.textContent = fetchAscii(str);
});

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
