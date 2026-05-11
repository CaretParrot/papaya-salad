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

class TableView extends HTMLElement {
    /**
     * @type {Database}
     */
    #db;
    /**
     * @type {string[]}
     */
    #types;
    static observedAttributes = ["db"];

    constructor() {
        super();
        this.#db = new Database();
        this.#types = [];
    }

    /**
     * @param {Database} db 
     * @param {string[]} types 
     */
    load(db, types) {
        this.#db = db;
        this.#types = types;
        if (types !== undefined) {
            this.#types = types;
        } else {
            this.#types = [];
            for (let i = 0; i < this.#db.getRow(0).length; i++) {
                this.#types.push("label");
            }
        }
        this.update();
    }

    async update() {
        this.innerHTML = "";
        for (let i = 0; i < this.#db.data.length; i++) {
            for (let j = 0; j < this.#db.data[i].length; j++) {
                let cell = document.createElement(this.#types[j]);
                cell.innerHTML = this.#db.data[i][j];
                this.appendChild(cell);
            }
        }
    }

    get formatting() {
        return this.#types;
    }

    set formatting(formatting) {
        this.#types = formatting;
    }

    /**
     * 
     * @param {string} name 
     * @param {Database} oldValue 
     * @param {Database} newValue 
     */
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(newValue);

        switch (name) {
            case "db":
                this.load(newValue, []);
                break;
            default:
                break;
        }
    }
}

class NavBar extends HTMLElement {
    static observedAttributes = ["links"];
    constructor() {
        super();
    }

    /**
     * @param {string} name 
     * @param {string} oldValue 
     * @param {string} newValue 
     */
    attributeChangedCallback(name, oldValue, newValue) {
        let linkList = [];
        if (name === "links") {
            linkList = JSON.parse(newValue);
            for (let i = 0; i < linkList.length; i++) {
                let newLink = document.createElement("a");
                newLink.href = `./${linkList[i]}.html`;
                newLink.innerHTML = (linkList[i][0].toUpperCase() + linkList[i].slice(1)).replace("-", " ");
                this.appendChild(newLink);
            }
        }
    }
}

class ToggleButton extends HTMLButtonElement {
    static observedAttributes = ["on", "on-text", "off-text", "onclick"];
    #on;
    #onText;
    #offText; 

    constructor() {
        super();
        this.#on = "false";
        this.#onText = "Off";
        this.#offText = "On";
    }

    connectedCallback() {
        this.#on = "false";
        this.#onText = "Off";
        this.#offText = "On";
    }

    /**
     * 
     * @param {string} name 
     * @param {string} oldValue 
     * @param {string} newValue 
     */
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name);
        switch (name) {
            case "on":
                this.#on = newValue;
                this.#on === "false" ? this.innerHTML = this.#onText : this.innerHTML = this.#offText;
                break;
            case "on-text":
                this.#onText = newValue;
                this.#on === "false" ? this.innerHTML = this.#onText : this.innerHTML = this.#offText;
                break;
            case "off-text":
                this.#offText = newValue;
                this.#on === "false" ? this.innerHTML = this.#onText : this.innerHTML = this.#offText;
                break;
            default:
                break;
        }
    }
}

customElements.define("table-view", TableView);
customElements.define("nav-bar", NavBar);
customElements.define("toggle-button", ToggleButton, {extends: "button"});