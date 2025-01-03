import net from "net";
import { createFile } from "./index.js";
import http from "http";
import url from "url";

// This is the server driver file

// Sets up a server at port 9999
const port = 9999;
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.writeHead(200, { "Content-Type": "text/plain" });
  // The url is the link to the image
  const url = parseUrl(req); 
  // Creates ASCII text and returns it
  const str = createFile(url, 50).then((str) => {
    res.end(str);
  });
});

// Parse url formats the url to be usable with createFile in the index.js file
function parseUrl(req) {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname.slice(1);
  return pathName;
}

// Starts server
server.listen(port, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.log("listening on port", port);
  }
});