class Database {
    constructor() {
        this.data = new Array(new Array());
    }

    /**
     * @param {string} data
     * @returns {Promise<any[][]>}
     */
    async import(data, delimiter = ",", lineDelimiter = "\n") {
        let temp = data.split(lineDelimiter);

        for (let i = 0; i < temp.length; i++) {
            this.data[i] = temp[i].split(delimiter);
        }

        return this.data;
    }
}