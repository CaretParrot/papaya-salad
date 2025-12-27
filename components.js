class Database {
    constructor() {
        this.data = new Array(new Array());
        this.headerRow = null;
    }

    /**
     * @param {string} data
     * @returns {Promise<any[][]>}
     */
    async import(data, delimiter = ",", lineDelimiter = "\n") {
        this.data = new Array(new Array());
        let temp = data.split(lineDelimiter);

        for (let i = 0; i < temp.length; i++) {
            this.data[i] = temp[i].split(delimiter);
        }

        return this.data;
    }

    /**
     * @returns {number}
     */
    get rowCount() {
        return this.data.length;
    }

    /**
     * @returns {number}
     */
    get columnCount() {
        let maxCount = 0;

        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].length > maxCount) {
                maxCount = this.data[i].length;
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
        this.data = new Array(new Array());
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
        this.headerRow = this.data[0];
        this.data = this.data.splice(1);
        return this.headerRow;
    }
}