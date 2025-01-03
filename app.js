import net from "net";
import { createFile } from "./index.js";
import http from "http";
import url from "url";
const port = 9999;
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.writeHead(200, { "Content-Type": "text/plain" });
  const url = parseUrl(req);
  //need to create a function that gets the width, and then binds the width
  const str = createFile(url, 50).then((str) => {
    console.log(str);
    res.end(str);
  });
});

server.listen(port, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.log("listening on port", port);
  }
});

function parseUrl(req) {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname.slice(1);
  return pathName;
}
