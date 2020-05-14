var http = require("http");
var url = require("url");
var fs = require("fs");

http.createServer(function(request, response) {
    /*
      ,,request'' - input stream - contains data received from the browser, e.g. encoded contents of HTML form fields

      ,,response'' - output stream - put in it data that you want to send back to the browser.
         The answer sent by this stream must consist of two parts: the header and the body.
         The header contains, among others, information about the type (MIME) of data contained in the body.
         The body contains the correct data, e.g. a form definition.

    */
    console.log("--------------------------------------")
    console.log("The relative URL of the current request: "+request.url+"\n")
    var url_parts = url.parse(request.url,true); //parsing (relative) URL

    if(url_parts.pathname == '/submit') { //Processing the form content, if the relative URL is '/ submit'
        var name=url_parts.query['name']; //Read the contents of the field (form) named 'name'
        var dirs = name.split(' ');
        
        console.log("Creating a response header")
	    response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});  //Creating an answer header - we inform the browser that the body of the answer will be plain text
	    console.log("Creating the body of the response")

        for (i in dirs) {
            var command = dirs[i].split(':');
            
            console.log('Command0: ' + command[0]);
            console.log('Command1: ' + command[1]);
            console.log('Command2: ' + command[2]);
            console.log(parseInt(command[2],8));
            
            if (command[1].localeCompare('chmod') == 0) {
                fs.chmod(command[0], command[2], (err, stats) => {
                    console.log('XD')
                    console.log(err)
                    console.log(stats)
                    if (err) throw err;
                    
                    fs.stat(command[0], (err, stats) => {
                        console.log('The permissions for '+ command[0] + ' have been changed to: ' + command[2]);

                        console.log('    size: ' + stats["size"]);
                        console.log('    mode: ' + stats["mode"]);
                        console.log('    others eXecute: ' + (stats["mode"] & 1 ? 'x' : '-'));
                        console.log('    others Write:   ' + (stats["mode"] & 2 ? 'w' : '-'));
                        console.log('    others Read:    ' + (stats["mode"] & 4 ? 'r' : '-'));
                    
                        console.log('    group eXecute:  ' + (stats["mode"] & 10 ? 'x' : '-'));
                        console.log('    group Write:    ' + (stats["mode"] & 20 ? 'w' : '-'));
                        console.log('    group Read:     ' + (stats["mode"] & 40 ? 'r' : '-'));
                    
                        console.log('    owner eXecute:  ' + (stats["mode"] & 100 ? 'x' : '-'));
                        console.log('    owner Write:    ' + (stats["mode"] & 200 ? 'w' : '-'));
                        console.log('    owner Read:     ' + (stats["mode"] & 400 ? 'r' : '-'));
                    
                    
                        console.log('    file:           ' + (stats["mode"] & 0100000 ? 'f' : '-'));
                        console.log('    directory:      ' + (stats["mode"] & 0040000 ? 'd' : '-'));
                    });
                });
            } else if (command[1].localeCompare('copy') == 0) {
                
                fs.readdir(command[0], (err, files) => {
                    if(err){
                        response.write("Error: " + err)
                        response.end();
                        return
                    }

                    
                    for (j in files) {
                        const file = files[j];
                                
                        fs.stat(command[0]+'/'+file, (err, stat) => {
                            if(err){
                                response.write("Error: " + err)
                                response.end();
                                return
                            }

                            const date2 = new Date(stat.mtime);
                            date2.setDate(date2.getDate() + parseInt(command[3], 10));
                            
                            if (date2.toDateString().localeCompare((new Date()).toDateString()) == 0) {
                                if (!fs.existsSync(command[2])) {
                                    fs.mkdirSync(command[2]);
                                }
                                
                                fs.copyFile(command[0]+'/'+file, command[2]+'/'+file, (err) => {                                    
                                    if (err) {
                                        response.write("Error: " + err)
                                        response.end();
                                        return
                                    }
                                    console.log(file + ' was copied to folder ' + command[2]);
                                })
                            }
                        });
        
                    }
                });
            } else {
                console.log('Not known command.\n');
            }
        }
       
        //response.write('Hello '+name); //Place given data (here: 'Hello' text) in the body of the answer
	    response.end(); //The end of the response - send it to the browser
	    console.log("Sending a response")
    }
    else { //Generating the form
	    console.log("Creating a response header")
	    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});  //Creating a repsonse header - we inform the browser that the body of the response will be HTML text
	    //and now we put an HTML form in the body of the answer
        console.log("Creating a response body")
	    response.write('<form method="GET" action="/submit">');
	    response.write('<label for="name">Give file name</label>');
	    response.write('<input name="name">');
	    response.write('<br>');
	    response.write('<input type="submit">');
	    response.write('</form>');
	    response.end();  //The end of the response - send it to the browser
	    console.log("Sending a response")
    }
}).listen(8080);
console.log("The server was started on port 8080");
console.log("To end the server, press 'CTRL + C'");