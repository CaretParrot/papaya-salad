"use strict";

class MathPlus {
    constructor() { }

    /**
     * @param {number} value
     * @param {number} power 
     * @returns {number}
     */
    static root(value, power) {
        return Math.pow(value, 1 / power);
    }

    /**
     * 
     * @param {number[]} array 
     * @returns {number}
     */
    static mean(...array) {
        let total = 0;
        for (let i = 0; i < array.length; i++) {
            total += array[i];
        }

        return total / array.length;
    }

    /**
     * 
     * @param {number[]} array 
     * @returns {number}
     */
    static #meanArray(array) {
        let total = 0;
        for (let i = 0; i < array.length; i++) {
            total += array[i];
        }

        return total / array.length;
    }

    /**
     * 
     * @param {number[]} array 
     * @returns {number}
     */
    static median(...array) {
        if (array.length % 2 === 0) {
            return MathPlus.#meanArray([array[array.length / 2 - 1], array[array.length / 2]]);
        } else {
            return Math.floor(array[(array.length - 1) / 2]);
        }
    }

    /**
     * 
     * @param {number} number 
     * @returns {boolean}
     */
    static isSquare(number) {
        for (let i = 0; i < number; i++) {
            if (number / i === i) {
                return true;
            }
        }

        return false;
    }

    /**
     * 
     * @param {number[]} array 
     * @returns {number}
     */
    static geoMean(...array) {
        let total = 1;
        for (let i = 0; i < array.length; i++) {
            total *= array[i];
        }

        return Math.pow(total, 1 / array.length);
    }

    /**
     * 
     * @param {number} number 
     * @returns {number[]}
     */
    static factors(number) {
        let array = [];
        for (let i = 1; i < number; i++) {
            if (number % i === 0) {
                array.push(i);
            }
        }

        return array;
    }

    /**
     * 
     * @param {number} number 
     */
    static primeFactorization(number) {
        let array = [];

        for (let i = 2; i < number; i++) {
            if (number % i === 0) {
                array.push(i);
                number /= i;
                i = 2;
            }
        }

        array.push(number);
        array.sort();

        return array;
    }

    /**
     * 
     * @param {number} number 
     * @returns {string}
     */
    static convertToFraction(number) {
        for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
            if (number * i % 1 === 0) {
                return number * i + "/" + i;
            }
        }

        console.warn("Fraction is too large to compute. The decimal was returned.");
        return number.toString();
    }

    /**
     * 
     * @param {number} radical 
     * @returns {string}
     */
    static simpRadic(radical) {
        let radicalSquared = radical ** 2;

        for (let i = 1; i <= radicalSquared; i++) {
            if (radicalSquared / i === i) {
                return Math.sqrt(radicalSquared).toString();
            }
        }

        let squareFactors = [];
        let factors = MathPlus.factors(radicalSquared);
        for (let i = 0; i < factors.length; i++) {
            if (MathPlus.isSquare(factors[i])) {
                squareFactors.push(factors[i]);
            }
        }

        if (squareFactors.length === 1) {
            return Math.sqrt(radicalSquared).toString();
        }

        return Math.max.apply(null, squareFactors) + "√" + radicalSquared / Math.max.apply(null, squareFactors);
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {number}
     */
    static hypotenuse(x, y) {
        return Math.sqrt(x ** 2 + y ** 2);
    }

    /**
     * 
     * @param {number} number 
     * @returns {Promise<number>}
     */
    static async factorial(number) {
        let total = 1;
        for (let i = 1; i <= number; i++) {
            total *= i;
            if (total > Number.MAX_SAFE_INTEGER) {
                console.warn(`Factorial is too large to compute. Factorial of the given number returned "Infinity".`);
                return Infinity;
            }
        }
        return total;
    }

    /**
     * 
     * @param {number} number 
     * @returns {number}
     */
    static toDegrees(number) {
        return number * 180 / Math.PI;
    }

    /**
     * 
     * @param {number} number 
     * @returns {number}
     */
    static toRadians(number) {
        return number * Math.PI / 180;
    }

    /**
     * @param {number} number 
     * @param {number} numberOfPlaces
     * @returns {number}
     */
    static roundToPlaces(number, numberOfPlaces) {
        return Math.round(number * (10 ** numberOfPlaces)) / (10 ** numberOfPlaces);
    }
}

class MathFunction {
    #expression;
    #variable;
    #rounding;
    #d;

    /**
     * @param {string} expression 
     * @param {string} variable 
     * @param {number} rounding
     * @param {number} d
     */
    constructor(expression, variable, rounding = 5, d = 10 ** -3) {
        this.#expression = expression;
        this.#variable = variable;
        this.#rounding = rounding;
        this.#d = d;
    }

    /**
     * @param {number} number 
     * @returns {number}
     */
    roundToPlaces(number) {
        return Math.round(number * (10 ** this.#rounding)) / (10 ** this.#rounding);
    }

    /**
     * @param {number} number 
     * @param {number} numberOfPlaces
     * @returns {number}
     */
    static roundToPlaces(number, numberOfPlaces) {
        return Math.round(number * (10 ** numberOfPlaces)) / (10 ** numberOfPlaces);
    }

    /**
     * 
     * @param {number} inputVal 
     * @returns {number}
     */
    evaluate(inputVal) {
        return this.roundToPlaces(Function(`return ${this.#expression.replace(new RegExp(this.#variable, "g"), inputVal.toString())};`)());
    }

    /**
     * 
     * @param {number} inputVal 
     * @returns {number}
     */
    derivative(inputVal) {
        return this.roundToPlaces((this.evaluate(inputVal + this.#d) - this.evaluate(inputVal)) / this.#d);
    }

    /**
     * @param {number} lowerBound 
     * @param {number} upperBound 
     * @returns {Promise<number>}
     */
    async integral(lowerBound, upperBound) {
        let sum = 0;
        if (lowerBound < upperBound) {
            for (let i = lowerBound; i <= upperBound - this.#d; i += this.#d) {
                sum += (1 / 2) * (this.evaluate(i) + this.evaluate(i + this.#d)) * (this.#d);
            }

            return this.roundToPlaces(sum);
        } else if (lowerBound > upperBound) {
            for (let i = upperBound; i <= lowerBound - this.#d; i += this.#d) {
                sum += (1 / 2) * (this.evaluate(i) + this.evaluate(i + this.#d)) * (this.#d);
            }

            return -this.roundToPlaces(sum);
        } else {
            return 0;
        }
    }

    /**
     * 
     * @param {number} lowerBound 
     * @param {number} upperBound 
     * @returns {Promise<number>}
     */
    async summation(lowerBound, upperBound) {
        let sum = 0;
        if (lowerBound >= upperBound) {
            console.error("Upper bound must be greater than lower bound.");
            return 0;
        } else if (lowerBound % 1 !== 0 || upperBound % 1 !== 0) {
            console.error("Summation bounds must be integers.");
            return 0;
        } else {
            for (let i = lowerBound; i <= upperBound; i++) {
                sum += Function(`return ${this.#expression.replace(new RegExp(this.#variable, "g"), i.toString())};`)();
            }
            return this.roundToPlaces(sum);
        }
    }

    /**
     * 
     * @param {number} lowerBound 
     * @param {number} upperBound 
     * @returns {Promise<number>}
     */
    async product(lowerBound, upperBound) {
        let product = 1;
        if (lowerBound >= upperBound) {
            console.error("Upper bound must be greater than lower bound.");
            return 0;
        } else if (lowerBound % 1 !== 0 || upperBound % 1 !== 0) {
            console.error("Summation bounds must be integers.");
            return 0;
        } else {
            for (let i = lowerBound; i <= upperBound; i++) {
                product *= Function(`return ${this.#expression.replace(new RegExp(this.#variable, "g"), i.toString())};`)();
            }
            return this.roundToPlaces(product);
        }
    }
}

class Vector {
    #coords;

    /**
     * @param {number[]} tail 
     * @param {number[]} tip
     */
    constructor(tail, tip) {
        if (tail === undefined && tip === undefined) {
            throw "INIT_ERROR: Tip coordinates must be specified.";
        }

        for (let i = 0; i < tail.length; i++) {
            if (typeof tail[i] !== "number") {
                throw "INIT_ERROR: Coordinates are not numeric types.";
            }
        }

        if (tip === undefined) {
            tip = tail;
            tail = [0, 0, 0];
        } else {
            for (let i = 0; i < tip.length; i++) {
                if (typeof tip[i] !== "number") {
                    throw "INIT_ERROR: Coordinates are not numeric types.";
                }
            }
        }

        this.#coords = [tail, tip];
        this.update();
    }

    get coords() {
        return this.#coords;
    }

    set coords([tail, tip]) {
        this.#coords = [tail, tip];
    }

    /**
     * @return {void}
     */
    update() {
        if (this.#coords[0].length < 3) {
            for (let i = this.#coords[0].length; i < 3; i++) {
                this.#coords[0][i] = 0;
            }
        }

        if (this.#coords[1].length < 3) {
            for (let i = this.#coords[1].length; i < 3; i++) {
                this.#coords[1][i] = 0;
            }
        }
    }

    /**
     * @returns {number}
     */
    get magnitude() {
        return Math.pow((this.#coords[1][0] - this.#coords[0][0]) ** 2 + (this.#coords[1][1] - this.#coords[0][1]) ** 2 + (this.#coords[1][2] - this.#coords[0][2]) ** 2, 1 / 2);
    }

    /**
     * @returns {number}
     */
    get slope() {
        return (this.#coords[1][2] - this.#coords[0][2]) / (Math.pow((this.#coords[1][0] - this.#coords[0][0]) ** 2 + (this.#coords[1][1] - this.#coords[0][1]) ** 2, 1 / 2));
    }

    /**
     * @returns {number}
     */
    get theta() {
        return Math.atan((this.#coords[1][1] - this.#coords[0][1]) / (this.#coords[1][0] - this.#coords[0][0]));
    }

    /**
     * @returns {number}
     */
    get phi() {
        return (Math.PI / 2) - Math.atan(this.slope);
    }

    get isPositionVector() {
        for (let i = 0; i < this.#coords[0].length; i++) {
            if (this.#coords[0][i] !== 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * @returns {Vector}
     */
    getUnitVector() {
        let tempVector = this.getPositionVector();
        let magnitude = tempVector.magnitude;

        for (let i = 0; i < tempVector.coords.length; i++) {
            tempVector.coords[1][i] /= magnitude;
        }

        return new Vector(this.#coords[0], [this.#coords[0][0] + tempVector.#coords[1][0], this.#coords[0][1] + tempVector.#coords[1][1], this.#coords[0][2] + tempVector.#coords[1][2]]);
    }

    /**
     * @returns {Vector}
     */
    getPositionVector() {
        return new Vector([0, 0, 0], [this.#coords[1][0] - this.#coords[0][0], this.#coords[1][1] - this.#coords[0][1], this.#coords[1][2] - this.#coords[0][2]]);
    }

    /**
     * @param {Vector} vector1 
     * @param {Vector} vector2
     */
    static dot(vector1, vector2) {
        let posVector1;
        let posVector2;

        if (!vector1.isPositionVector || !vector2.isPositionVector) {
            console.warn("Vectors were converted into position vectors before calculation.");
        }

        posVector1 = vector1.getPositionVector();
        posVector2 = vector2.getPositionVector();

        return posVector1.coords[1][0] * posVector2.coords[1][0] + posVector1.coords[1][1] * posVector2.coords[1][1] + posVector1.coords[1][2] * posVector2.coords[1][2];
    }

    /**
     * @param {Vector} vector1 
     * @param {Vector} vector2 
     */
    static cross(vector1, vector2) {
        let posVector1;
        let posVector2;

        if (!vector1.isPositionVector || !vector2.isPositionVector) {
            console.warn("Vectors were converted into position vectors before calculation.");
        }

        posVector1 = vector1.getPositionVector();
        posVector2 = vector2.getPositionVector();

        return new Vector([0, 0, 0], [(posVector1.coords[1][1] * posVector2.coords[1][2]) - (posVector1.coords[1][2] * posVector2.coords[1][1]), (posVector1.coords[1][2] * posVector2.coords[1][0]) - (posVector1.coords[1][0] * posVector2.coords[1][2]), (posVector1.coords[1][0] * posVector2.coords[1][1]) - (posVector1.coords[1][1] * posVector2.coords[1][0])]);
    }
}

class Graph {
    #element;
    /**
     * @type {Vector[]}
     */
    #vectors;
    #width;
    #height;
    #color;
    #lineWidth;
    #ctx;
    /**
     * @param {Element} parentElement 
     */
    constructor(parentElement, width = 300, height = 300, color = "white", lineWidth = 5) {
        this.#element = document.createElement("canvas");

        this.#vectors = [];
        this.#width = width;
        this.#height = height;
        this.#color = color;
        this.#lineWidth = lineWidth;

        this.#element.style.transform = "scaleY(-1)";
        this.#element.style.padding = "0";
        this.#ctx = /** @type {CanvasRenderingContext2D} */ (this.#element.getContext("2d"));

        if (this.#ctx === null) {
            throw "INIT_ERROR: Could not create paint context."
        }

        this.#ctx.lineWidth = this.#lineWidth;
        parentElement.appendChild(this.#element);
    }

    /**
     * @returns {number}
     */
    get width() {
        return this.#element.width;
    }

    /**
     * @param {number} width
     * @returns {void}
     */
    set width(width) {
        this.#element.width = width;
    }

    /**
     * @returns {number}
     */
    get height() {
        return this.#element.height;
    }

    /**
     * @param {number} height
     * @returns {void}
     */
    set height(height) {
        this.#element.height = height;
    }

    /**
     * @returns {Vector[]}
     */
    get vectors() {
        return this.#vectors;
    }

    /**
     * @param {Vector[]} vectors
     * @return {void}
     */
    set vectors(vectors) {
        this.#vectors = vectors;
        for (let i = 0; i < this.#vectors.length; i++) {
            this.#ctx.strokeStyle = this.#color;
            this.#ctx.lineWidth = this.#lineWidth;
            this.#ctx.beginPath();
            this.#ctx.moveTo(this.#vectors[i].coords[0][0], this.#vectors[i].coords[0][1]);
            this.#ctx.lineTo(this.#vectors[i].coords[1][0], this.#vectors[i].coords[1][1]);
            this.#ctx.stroke();
        }
    }

    clear() {
        this.#ctx.clearRect(0, 0, this.width, this.height);
    }
}

class Matrix {
    /**
     * @type {number[][]}
     */
    #values;

    constructor(m = 2, n = 2) {
        this.#values = new Array(new Array());

        for (let i = 0; i < m; i++) {
            this.#values[i] = [];
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    this.#values[i].push(1);
                } else {
                    this.#values[i].push(0);
                }
            }
        }
    }

    get m() {
        return this.#values.length;
    }

    get n() {
        return this.#values[0].length;
    }

    get matrix() {
        return this.#values;
    }

    set matrix(values) {
        if (values.length !== this.m || values[0].length !== this.n) {
            throw `INVALID_INPUT: Matrix input must be ${this.m}×${this.n}.`;
        }

        this.#values = values;
    }

    /**
     * 
     * @param {number} row 
     * @param {number} column 
     * @returns {number}
     */
    getValue(row, column) {
        return this.#values[row - 1][column - 1];
    }

    /**
     * @param {number} index 
     * @returns {number[]}
     */
    getRow(index) {
        if (index > this.m || index < 1) {
            throw "INVALID_INDEX: Index is too large or small. Please note that matrices do not use zero-indexing.";
        }

        return this.#values[index - 1];
    }

    /**
     * @param {number} index 
     * @returns {number[]}
     */
    getColumn(index) {
        if (index > this.n || index < 1) {
            throw "INVALID_INDEX: Index is too large or small. Please note that matrices do not use zero-indexing.";
        }

        let columnOutput = [];
        for (let i = 0; i < this.m; i++) {
            columnOutput.push(this.#values[i][index - 1]);
        }

        return columnOutput;
    }

    /**
     * @param {number} row 
     * @param {number} scale 
     * @returns {number[]}
     */
    scaleRow(row, scale) {
        if (row > this.m || row < 1) {
            throw "INVALID_INDEX: Index is too large or small. Please note that matrices do not use zero-indexing.";
        }

        for (let i = 1; i <= this.n; i++) {
            this.setValue(row, i, this.getValue(row, i) * scale);
        }

        return this.getRow(row);
    }

    /**
     * @param {number} index1 
     * @param {number} index2
     */
    swapRows(index1, index2) {
        if (index1 > this.m || index1 < 1 || index2 > this.m || index2 < 1) {
            throw "INVALID_INDEX: Index is too large or small. Please note that matrices do not use zero-indexing.";
        }

        let temp = JSON.parse(JSON.stringify(this.#values[index1 - 1]));
        this.#values[index1 - 1] = this.#values[index2 - 1];
        this.#values[index2 - 1] = temp;
    }

    /**
     * @param {number} index1 
     * @param {number} scale 
     * @param {number} index2 
     * @return {number[]}
     */
    addMultipleOfRow(index1, scale, index2) {
        if (index1 > this.m || index1 < 1 || index2 > this.m || index2 < 1) {
            throw "INVALID_INDEX: Index is too large or small. Please note that matrices do not use zero-indexing.";
        }

        let temp = JSON.parse(JSON.stringify(this.getRow(index1)));

        for (let i = 0; i < this.n; i++) {
            temp[i] *= scale;
            this.setValue(index2, i + 1, this.getValue(index2, i + 1) + temp[i]);

        }

        return this.getRow(index2);
    }

    /**
     * @param {number} row 
     * @param {number} column 
     * @param {number} value 
     */
    setValue(row, column, value) {
        if (row > this.m || row < 1 || column > this.n || column < 1) {
            throw "INVALID_INDEX: Index is too large or small. Please note that matrices do not use zero-indexing.";
        }

        this.#values[row - 1][column - 1] = value;
    }

    /**
     * @returns {Promise<Matrix>}
     */
    async echelonForm() {
        this.optimizeRowOrder();

        let i = 1;
        let minDim = Math.min(this.m, this.n);

        for (i = 1; i <= minDim; i++) { 
            if (this.getValue(i, i) !== 0) {
                this.scaleRow(i, 1 / this.getValue(i, i));
            }

            for (let j = i + 1; j <= this.m; j++) { 
                this.addMultipleOfRow(i, -this.getValue(j, i), j);
            }
        }

        for (i -= 1; i > 1; i--) {
            for (let j = i - 1; j >= 1; j--) {
                this.addMultipleOfRow(i, -this.getValue(j, i), j);
            }
        }

        this.moveZeroVectors();

        return this;
    }

    optimizeRowOrder() {
        let maximum = this.getValue(1, 1);
        let maxIndex = 0;

        for (let i = 1; i <= this.m; i++) {
            if (this.getValue(i, 1) > maximum) {
                maximum = this.getValue(i, 1);
                maxIndex = i;
            }
        }

        this.swapRows(1, maxIndex);
    }

    /**
     * @param {number} row 
     */
    isZeroVector(row) {
        for (let i = 1; i <= this.n; i++) {
            if (this.getValue(row, i) !== 0) {
                return false;
            }
        }

        return true;
    }

    moveZeroVectors() { 
        for (let i = 1; i <= this.m; i++) {
            if (this.isZeroVector(i)) {
                this.matrix.splice(i - 1, 1);
                let newVector = [];

                for (let i = 0; i < this.n; i++) {
                    newVector.push(0);
                }

                this.matrix.push(newVector);
            }
        }
    }
}