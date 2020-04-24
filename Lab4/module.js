/**
 * Some documentation
 */
module.exports = class Operation {
   /**
    * @constructor
    * @param {*} x 
    * @param {*} y 
    */
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Function returnnin sum of x and y
     */
    sum() {
        return this.x+this.y;
    }
};

//exports.module = Operation;
//export.Operation;