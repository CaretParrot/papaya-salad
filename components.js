"use strict";

class Database {
    #data;
    /**
     * @type {string[]}
     */
    #headerRow;

    constructor() {
        this.#data = new Array(new Array());
        this.#headerRow = [];
    }

    get data() {
        return this.#data;
    }

    get headerRow() {
        return this.#headerRow;
    }

    /**
     * @param {string} data
     * @returns {Promise<any[][]>}
     */
    async import(data, delimiter = ",", lineDelimiter = "\n") {
        this.#data = new Array(new Array());
        let temp = data.split(lineDelimiter);

        for (let i = 0; i < temp.length; i++) {
            this.#data[i] = temp[i].split(delimiter);
        }

        return this.data;
    }

    /**
     * @returns {number}
     */
    get rowCount() {
        return this.#data.length;
    }

    /**
     * @returns {number}
     */
    get columnCount() {
        let maxCount = 0;

        for (let i = 0; i < this.#data.length; i++) {
            if (this.#data[i].length > maxCount) {
                maxCount = this.#data[i].length;
            }
        }

        return maxCount;
    }

    /**
     * @returns {number[]}
     */
    get dimensions() {
        return [this.rowCount, this.columnCount];
    }

    /**
     * @param {File} file 
     * @returns {Promise<any[][]>}
     */
    async importFile(file, delimiter = ",", lineDelimiter = "\n") {
        this.#data = new Array(new Array());
        let fr = new FileReader();

        fr.onload = () => {
            this.import( /** @type {string} */(fr.result), delimiter, lineDelimiter);
        }

        fr.onerror = () => {
            throw "READ_ERROR: File could not be read.";
        }

        fr.readAsText(file);

        return this.data;
    }

    /**
     * @returns {string[]}
     */
    setHeaderRow() {
        this.#headerRow = this.#data[0];
        this.#data = this.#data.splice(1);
        return this.#headerRow;
    }
    

    /**
     * @param {number} col 
     * @returns 
     */
    getCol(col) {
        let array = [];

        for (let i = 0; i < this.data.length; i++) {
            array.push(this.data[i][col]);
        }

        return array;
    }

    /**
     * @param {number} col 
     * @param {any[]} array 
     */
    setCol(col, array) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i][col] = array[i];
        }
    }

    /**
     * @param {number} row 
     * @returns 
     */
    getRow(row) {
        return this.#data[row];
    }

    /**
     * @param {number} row 
     * @param {any[]} array 
     */
    setRow(row, array) {
        this.#data[row] = array;
    }
}

class View {
    #db;
    #container;

    /**
     * @param {Database} db 
     * @param {HTMLElement} container
     */
    constructor(db, container) {
        this.#db = db;
        this.#container = container;
    }

    get db() {
        return this.#db;
    }

    set db(db) {
        this.#db = db;
    }

    get container() {
        return this.#container;
    }
}

class TableView extends View {
    #db;
    #container;
    #element;
    /**
     * @type {string[]}
     */
    #formatting;

    /**
     * @param {Database} db 
     * @param {HTMLElement} container
     * @param {any[]} formatting
     */
    constructor(db, container, formatting) {
        super(db, container);
        this.#db = db;
        this.#container = container;
        if (formatting !== undefined) {
            this.#formatting = formatting;
        } else {
            this.#formatting = [];
            for (let i = 0; i < this.#db.getRow(0).length; i++) {
                this.#formatting[i] = "label";
            }
        }
        this.#element = document.createElement("div");
        this.#element.style.setProperty("display", "grid");
        this.#element.style.setProperty("grid", `auto / repeat(${this.#db.getRow(0).length.toString()}, 1fr)`);
        this.#container.appendChild(this.#element);
        this.update();
    }

    async update() {
        this.#element.innerHTML = "";
        for (let i = 0; i < this.#db.data.length; i++) {
            for (let j = 0; j < this.#db.data[i].length; j++) {
                let cell = document.createElement(this.#formatting[j]);
                cell.innerHTML = this.#db.data[i][j];
                this.#element.appendChild(cell);
            }
        }
    }

    get formatting() {
        return this.#formatting;
    }

    set formatting(formatting) {
        this.#formatting = formatting;
    }
} 