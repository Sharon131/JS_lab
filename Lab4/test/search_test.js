var expect = require('chai').expect;
var search = require('../search')

describe("Search", function () {
    it("Works for a file", () => {
        const result = search.searchAndGet("random_file.txt")
        expect(result).to.equal("File:\n" + "random")
    })
    it("Works for a directory", () => {
        const result = search.searchAndGet("test")
        expect(result).to.equal("Catalog\n")
    })
})