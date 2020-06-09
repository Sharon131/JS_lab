var http = require("http");
var url = require("url");

http.createServer(function (request, response) {
  console.log("--------------------------------------");
  var url_parts = url.parse(request.url, true);
  console.log(request.url);
  
  
  /*http.get(time_url, res => {
    
    res.setEncoding("utf8");
    let body = "";

    res.on("data", data => {
      body += data;
    });

    res.on("end", () => {
      body = JSON.parse(body);
      
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.write(JSON.stringify(body));
      response.end();
    
    });
  });*/
  

}).listen(8080);

console.log("The server was started on port 8080");
console.log("To end the server, press 'CTRL + C'");