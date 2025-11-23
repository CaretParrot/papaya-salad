/**
 * 
 * @param {string} pageClass 
 * @param {string} displayType 
 */
const PageGroup = function (pageClass, displayType = "block") {
    this.pageClass = pageClass;
    this.displayType = displayType;
    this.currentPageId = document.getElementsByClassName(pageClass)[0].id;

    /**
     * 
     * @param {string} pageId 
     * @returns {boolean}
     */
    this.changePage = function (pageId) {
        if (document.getElementById(pageId) == null) {
            return false;
        } 
        let allPages = document.getElementsByClassName(pageClass);
        for (let i = 0; i < allPages.length; i++) {
            allPages[i].style.display = "none";
            // @ts-ignore
            document.getElementById(pageId).classList.remove("open");
        }

        // @ts-ignore
        document.getElementById(pageId).style.display = displayType;
        // @ts-ignore
        document.getElementById(pageId).classList.add("open");
        this.currentPageId = allPages[0].id;
        return true;
    }

    this.changePage(this.currentPageId);
}

/**
 * 
 * @param {Element} htmlElement 
 * @param {string} displayType 
 */
const SlideShow = function (htmlElement, displayType = "block") {
    this.htmlElement = htmlElement;
    this.slideNumber = 0;
    this.numberOfSlides = this.htmlElement.children.length;
    this.displayType = displayType;

    /**
     * 
     * @param {number} numberOfSlides 
     * @param {object} htmlElement 
     * @param {number} slideNumber 
     * @param {string} displayType 
     */
    this.refreshSlide = function (numberOfSlides, htmlElement, slideNumber, displayType = "block") {
        for (let i = 0; i < numberOfSlides; i++) {
            htmlElement.children[i].style.display = "none";
        }

        htmlElement.children[slideNumber].style.display = displayType;
    }

    this.clickable = function () {
        let slides = this.slides;
        let slideNumber = this.slideNumber;
        let numberOfSlides = this.numberOfSlides;
        let htmlElement = this.htmlElement;
        let displayType = this.displayType;

        htmlElement.style.cursor = "pointer";
        htmlElement.style.userSelect = "none";

        this.refreshSlide(numberOfSlides, htmlElement, slideNumber, displayType);

        htmlElement.onclick = function (event) {
            slideNumber++;

            if (slideNumber === numberOfSlides) {
                slideNumber = 0;
            }

            for (let i = 0; i < numberOfSlides; i++) {
                htmlElement.children[i].style.display = "none";
            }

            htmlElement.children[slideNumber].style.display = "block";
        }
    }

    /**
     * 
     * @param {*} delay 
     */
    this.auto = function (delay = 1000) {
        let slideNumber = this.slideNumber;
        let numberOfSlides = this.numberOfSlides;
        let htmlElement = this.htmlElement;
        let displayType = this.displayType;

        this.refreshSlide(numberOfSlides, htmlElement, slideNumber, displayType);

        setInterval(function () {
            slideNumber++;

            if (slideNumber === numberOfSlides) {
                slideNumber = 0;
            }

            for (let i = 0; i < numberOfSlides; i++) {
                htmlElement.children[i].style.display = "none";
            }

            htmlElement.children[slideNumber].style.display = "block";
        }, delay);
    }
}

const randomPlus = {
    /**
     * 
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    randomInteger: function (min, max) {
        return Math.floor(Math.random() * max) + min;
    },
    /**
     * 
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    randomNumber: function (min, max) {
        return Math.random() * max + min;
    },
    /**
     * 
     * @returns {string}
     */
    randomCard: function () {
        let randomCardNumber = this.randomInteger(1, 13);
        let randomSuit = this.randomInteger(1, 4);
        let convertedNumber;
        let convertedSuit;

        switch (randomCardNumber) {
            case 1:
                convertedNumber = "Ace";
                break;
            case 11:
                convertedNumber = "Jack";
                break;
            case 12:
                convertedNumber = "Queen";
                break;
            case 13:
                convertedNumber = "King";
                break;
            default:
                break;
        }

        switch (randomSuit) {
            case 1:
                convertedSuit = "Spades";
                break;
            case 2:
                convertedSuit = "Diamonds";
                break;
            case 3:
                convertedSuit = "Clubs";
                break;
            case 4:
                convertedSuit = "Hearts";
                break;
            default:
                break;
        }

        return `${convertedNumber} of ${convertedSuit}`;
    }
}

const colorPalletes = {
    savedColor: 0,
    /**
     * 
     * @param {number} color 
     */
    paint: function (color = randomPlus.randomNumber(0, 360)) {
        document.documentElement.style.setProperty(`--dark-1`, `hsl(${color}, 5%, 10%)`);
        document.documentElement.style.setProperty(`--dark-2`, `hsl(${color}, 10%, 20%)`);
        document.documentElement.style.setProperty(`--dark-3`, `hsl(${color}, 15%, 30%)`);
        document.documentElement.style.setProperty(`--light-1`, `hsl(${color}, 70%, 85%)`);
        document.documentElement.style.setProperty(`--light-2`, `hsl(${color}, 80%, 90%)`);
        document.documentElement.style.setProperty(`--light-3`, `hsl(${color}, 90%, 95%)`);
        document.documentElement.style.setProperty(`--dark-placeholder`, `hsl(240, 10%, 20%, 0.5)`);
        document.documentElement.style.setProperty(`--light-placeholder`, `hsl(240, 80%, 90%, 0.5)`);
        colorPalletes.savedColor = color;
    }
}

const binder = {
    /**
     * 
     * @param {*} element1 
     * @param {*} property1 
     * @param {*} element2 
     * @param {*} property2 
     * @param {boolean} twoWay 
     */
    linkProperties: function (element1, property1, element2, property2, twoWay = true) {
        element2[property2] = element1[property1];
        element1[property1] = element2[property2];

        element1.oninput = function () {
            element2[property2] = element1[property1];
        }

        if (twoWay) {
            element2.oninput = function () {
                element1[property1] = element2[property2];
            }
        }
    }
}