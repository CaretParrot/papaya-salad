class Database {
    constructor() {
        this.data = new Array(new Array());
    }

    /**
     * @param {string} data
     * @returns {Promise<any[][]>}
     */
    async import(data, delimiter = ",", lineDelimiter = "\n") {
        this.data = new Array(new Array());
        let temp = data.split(lineDelimiter);

        if (temp.length === 1) {
            console.warn("Line delimiter yielded only one row.");
        }

        for (let i = 0; i < temp.length; i++) {
            this.data[i] = temp[i].split(delimiter);

            if (this.data[i].length === 1) {
                console.warn("Delimiter yielded only one column.");
            }
        }

        return this.data;
    }

    /**
     * @param {File} file 
     * @returns {Promise<any[][]>}
     */
    async importFile(file, delimiter = ",", lineDelimiter = "\n") {
        this.data = new Array(new Array());
        let fr = new FileReader();

        fr.onload = () => {
            this.import( /** @type {string} */ (fr.result), delimiter, lineDelimiter);
        }

        fr.onerror = () => {
            throw "READ_ERROR: File could not be read.";
        }

        fr.readAsText(file);

        return this.data;
    }
}