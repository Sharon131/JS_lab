// Server

var http = require ("http");
var https = require("https");
var url = require ("url") ;

const site_url = "https://journals.agh.edu.pl/csci/oai?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:ojs.journals.agh.edu.pl:article"

var server = http.createServer ( (req, resp) => {
    var url_parts = url.parse(req.url, true);

    const identifier = url_parts.pathname;

    console.log(site_url+identifier);

    https.get(site_url+identifier, (res) => {
        console.log("Hello, there.");
        
        //res.setEncoding('utf8');
        
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            console.log(rawData);

            resp.writeHead(200, {
                'Content-Type' : 'text/plain',
                'origin': "http://localhost",
                'Access-Control-Allow-Origin': "*"
            });
            resp.write(rawData);
            resp.end();
        });
    });
    
});

server.listen (8080) ;