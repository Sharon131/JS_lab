var http = require("http");
var url = require("url");
var fs = require("fs");
var file = 'form_2_2.html';

http.createServer(function (request, response) {
  console.log("--------------------------------------");
  var url_parts = url.parse(request.url, true);
  
  console.log(request.url);
  
  if (url_parts.pathname == '/') {
    fs.stat(file, function (err, stats) {
      if (err == null) { // If the file exists
        fs.readFile(file, function (err, data) { // Read it content
          response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          response.write(data);   // Send the content to the web browser
          response.end();
        });
      }
      else { // If the file does not exists
        response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        response.write('The ' + file + ' file does not exist');
        response.end();
      }
    });
  }
  else {
    var time_url = "http://worldtimeapi.org/api/timezone" + request.url;

    http.get(time_url, res => {
      
      res.setEncoding("utf8");
      let body = "";

      res.on("data", data => {
        body += data;
      });

      res.on("end", () => {
        body = JSON.parse(body);
        
        if (body['datetime']) {
          
          console.log((body['datetime']).toString());

          response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          response.write(JSON.stringify(body));
          response.end();
        
        }
        
      });

    });
  }


}).listen(8080);

console.log("The server was started on port 8080");
console.log("To end the server, press 'CTRL + C'");