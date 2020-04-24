const fs = require('fs');

const searchAndGet = (dirOrFile) => {
    /* windows only */
    const input = "\\" + dirOrFile
    if(fs.existsSync(__dirname.concat(input)) && 
        fs.statSync(__dirname.concat(input)).isFile()){
            const fileContent = fs.readFileSync(__dirname.concat(input)).toString()
            return "File:\n" + fileContent;
    } else if(fs.existsSync(__dirname.concat(input)) && fs.statSync(__dirname.concat(input)).isDirectory()){
            return "Catalog\n";
    } else {
        return "Something else"
    }
}

exports.searchAndGet = searchAndGet

console.log("Search for: " + process.argv[2])
console.log(searchAndGet(process.argv[2]))
