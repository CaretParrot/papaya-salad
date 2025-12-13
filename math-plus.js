"use strict";

// @ts-check

const mathPlus = {
    /**
     * Creates settings for rounding and the dx value for discrete calculus.
     */
    settings: {
        rounding: 5,
        dx: 10 ** -3
    },
    /**
     * 
     * @param {number} value
     * @param {number} power 
     * @returns {number}
     *
     */
    xroot: function (value, power) {
        return Math.pow(value, 1 / power);
    },
    /**
     * 
     * @param {number[]} array 
     * @returns {number}
     */
    mean: function (array) {
        let total = 0;
        for (let i = 0; i < array.length; i++) {
            total += array[i];
        }

        return total / array.length;
    },
    /**
     * 
     * @param {number[]} array 
     * @returns {number}
     */
    median: function (array) {
        if (array.length % 2 === 0) {
            return mathPlus.mean([array[array.length / 2 - 1], array[array.length / 2]]);
        } else {
            return Math.floor(array[(array.length - 1) / 2]);
        }
    },
    /**
     * 
     * @param {number} number 
     * @returns {boolean}
     */
    isSquare: function (number) {
        for (let i = 0; i < number; i++) {
            if (number / i == i) {
                return true;
            }
        }

        return false;
    },
    /**
     * 
     * @param {number[]} array 
     * @returns {number}
     */
    geoMean: function (array) {
        let total = 1;
        for (let i = 0; i < array.length; i++) {
            total *= array[i];
        }

        return Math.pow(total, 1 / array.length);
    },
    /**
     * 
     * @param {number} number 
     * @returns {number[]}
     */
    factors: function (number) {
        let array = [];
        for (let i = 1; i < number; i++) {
            if (number % i === 0) {
                array.push(i);
            }
        }

        return array;
    },
    /**
     * 
     * @param {number} number 
     * @returns {string}
     */
    convertToFraction: function (number) {
        for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
            if (number * i % 1 === 0) {
                return number * i + "/" + i;
            }
        }

        console.warn("Fraction is too large to compute. The decimal was returned.");
        return number.toString();
    },
    /**
     * 
     * @param {number} radicalSquared 
     * @returns {string}
     */
    simpRadic: function (radicalSquared) {
        if (radicalSquared === 1) {
            console.warn("Given radical has only one square factor: 1. The radical is already simplified. The given number was returned");
            return radicalSquared.toString();
        }

        for (let i = 0; i < radicalSquared; i++) {
            if (radicalSquared / i == i) {
                return radicalSquared.toString();
            }
        }

        let squareFactors = [];
        for (let i = 0; i < this.factors(radicalSquared).length; i++) {
            if (this.isSquare(this.factors(radicalSquared)[i])) {
                squareFactors.push(this.factors(radicalSquared)[i]);
            }
        }

        if (squareFactors.length === 1) {
            console.warn(
                "Given radical has only one square factor: 1. The radical is already simplified. The given number was returned."
            );
            return "√" + radicalSquared;
        }

        return Math.max.apply(null, squareFactors) + "√" + radicalSquared / Math.max.apply(null, squareFactors);
    },
    /**
     * 
     * @param {number} number1 
     * @param {number} number2 
     * @returns {number}
     */
    hypotenuse: function (number1, number2) {
        return Math.sqrt(number1 ** 2 + number2 ** 2);
    },
    /**
     * 
     * @param {number} number 
     * @returns 
     */
    factorial: function (number) {
        let total = 1;
        for (let i = 1; i <= number; i++) {
            total *= i;
            if (total > Number.MAX_SAFE_INTEGER) {
                console.warn(`Factorial is too large to compute. Factorial of the given number returned "Infinity".`);
                return 0;
            }
        }
        return total;
    },
    /**
     * 
     * @param {number} number 
     * @returns {number}
     */
    roundToPlaces: function (number) {
        if (Math.abs(number) > 0) {
            return Math.round(number * (10 ** mathPlus.settings.rounding)) / (10 ** mathPlus.settings.rounding);
        } else {
            return number;
        }
    },
    /**
     * 
     * @param {number} number 
     * @returns {number}
     */
    toDegrees: function (number) {
        return number * 180 / Math.PI;
    },
    /**
     * 
     * @param {number} number 
     * @returns {number}
     */
    toRadians: function (number) {
        return number * Math.PI / 180;
    }
}

class MathFunction {
    /**
     * 
     * @param {string} expression 
     * @param {string} variable 
     */
    constructor(expression, variable) {
        this.expression = expression;
        this.variable = variable;
    }

    /**
     * 
     * @param {number} inputVal 
     * @returns {number}
     */
    evaluate(inputVal) {
        return mathPlus.roundToPlaces(Function(`return ${this.expression.replace(new RegExp(this.variable, "g"), inputVal.toString())};`)());
    }

    /**
     * 
     * @param {number} inputVal 
     * @returns {number}
     */
    derivative(inputVal) {
        return mathPlus.roundToPlaces((this.evaluate(inputVal + mathPlus.settings.dx) - this.evaluate(inputVal)) / mathPlus.settings.dx);
    }

    /**
     * 
     * @param {number} lowerBound 
     * @param {number} upperBound 
     * @returns {Promise<number>}
     */
    async integral(lowerBound, upperBound) {
        let sum = 0;
        if (lowerBound < upperBound) {
            for (let i = lowerBound; i <= upperBound - mathPlus.settings.dx; i += mathPlus.settings.dx) {
                sum += (1 / 2) * (this.evaluate(i) + this.evaluate(i + mathPlus.settings.dx)) * (mathPlus.settings.dx);
            }

            return mathPlus.roundToPlaces(sum);
        } else if (lowerBound > upperBound) {
            for (let i = upperBound; i <= lowerBound - mathPlus.settings.dx; i += mathPlus.settings.dx) {
                sum += (1 / 2) * (this.evaluate(i) + this.evaluate(i + mathPlus.settings.dx)) * (mathPlus.settings.dx);
            }

            return -mathPlus.roundToPlaces(sum);
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
                sum += Function(`return ${this.expression.replace(new RegExp(this.variable, "g"), i.toString())};`)();
            }
            return mathPlus.roundToPlaces(sum);
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
                product *= Function(`return ${this.expression.replace(new RegExp(this.variable, "g"), i.toString())};`)();
            }
            return mathPlus.roundToPlaces(product);
        }
    }
}

class Vector {
    constructor(coords = [[0, 0, 0], [0, 0, 0]]) {
        this.coords = [coords[0], coords[1]];
        this.update();
    }

    update() {
        if (this.coords[0].length < 3) {
            for (let i = this.coords[0].length; i < 3; i++) {
                this.coords[0][i] = 0;
            }
        }

        if (this.coords[1].length < 3) {
            for (let i = this.coords[1].length; i < 3; i++) {
                this.coords[1][i] = 0;
            }
        }
    }

    setCoords(coords = [[0, 0, 0], [0, 0, 0]]) {
        this.coords = [coords[0], coords[1]];
        this.update();
    }

    getCoords() {
        return this.coords;
    }

    getMagnitude() {
        return Math.pow((this.coords[1][0] - this.coords[0][0]) ** 2 + (this.coords[1][1] - this.coords[0][1]) ** 2 + (this.coords[1][2] - this.coords[0][2]) ** 2, 1 / 2);
    }

    getPosVector() {
        return new Vector([[0, 0, 0], [this.coords[1][0] - this.coords[0][0], this.coords[1][1] - this.coords[0][1], this.coords[1][2] - this.coords[0][2]]]);
    }

    getUnitVector() {
        let tempVector = this.getPosVector();
        let magnitude = tempVector.getMagnitude();

        for (let i = 0; i < tempVector.getCoords()[1].length; i++) {
            tempVector.getCoords()[1][i] /= magnitude;
        }

        return tempVector;
    }

    slope() {
        return (this.coords[1][1] - this.coords[0][1]) / (this.coords[1][0] - this.coords[0][0]);
    }

    getTheta() {
        return Math.atan(this.slope());
    }
}
class Graph {
    /**
     * 
     * @param {Element} parentElement 
     * @returns 
     */
    constructor(parentElement) {
        this.element = document.createElement("canvas");
        this.element.style.transform = "scaleY(-1)";
        this.element.style.padding = "0";
        this.ctx = this.element.getContext("2d");

        if (this.ctx == null) {
            console.error("Failed creation of canvas.");
            return;
        }

        this.ctx.strokeStyle = "white";
        parentElement.appendChild(this.element);
    }

    get width() {
        return this.element.width;
    }

    set width(width) {
        this.element.width = width;
    }

    get height() {
        return this.element.height;
    }

    set height(height) {
        this.element.height = height;
    }

    /**
     * 
     * @param {Vector[]} vectorList 
     */
    graphVectors(vectorList) {
        if (this.ctx == null) {
            console.error("Failed creation of canvas.");
            return;
        }

        for (let i = 0; i < vectorList.length; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(vectorList[i].getCoords()[0][0], vectorList[i].getCoords()[0][1]);
            this.ctx.lineTo(vectorList[i].getCoords()[1][0], vectorList[i].getCoords()[1][1]);

            this.ctx.stroke();
        }
    }

    clear() {
        if (this.ctx == null) {
            console.error("Failed creation of canvas.");
            return;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}