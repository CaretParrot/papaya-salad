class PageGroup {
    /**
     * @param {string} pageClass 
     * @param {string} displayType 
     */
    constructor(pageClass, displayType = "block", initialPageId = document.getElementsByClassName(pageClass)[0].id) {
        this.pageClass = pageClass;
        this.displayType = displayType;
        this.currentPageId = initialPageId;
        this.changePage(this.currentPageId);
    }

    /**
     * @param {string} pageId 
     * @returns {boolean}
     */
    changePage(pageId) {
        let selectedElement = document.getElementById(pageId);
        if (selectedElement == null) {
            return false;
        } 
        
        let allPages = /** @type {HTMLCollectionOf<HTMLElement>} */ (document.getElementsByClassName(this.pageClass));
        for (let i = 0; i < allPages.length; i++) {
            allPages[i].style.display = "none";
            /** @type {HTMLElement} */ (document.getElementById(pageId)).classList.remove("open");
        }

        selectedElement.style.display = this.displayType;
        selectedElement.classList.add("open");
        this.currentPageId = pageId;
        return true;
    }
}

class SlideShow {
    /**
     * @param {HTMLElement} container 
     * @param {string} displayType 
     */
    constructor(container, displayType = "block") {
        this.container = container;
        this.slides = /** @type {HTMLCollectionOf<HTMLElement>} */ this.container.querySelectorAll("*");
        this.slideNumber = 0;
        this.slideCount = this.slides.length;
        this.displayType = displayType;
    }

    /**
     * 
     * @param {number} slideNumber 
     */
    moveToSlide(slideNumber) {
        for (let i = 0; i < this.slideCount; i++) {
            /** @type {HTMLElement} */ (this.container.children[i]).style.display = "none";
        }

        /** @type {HTMLElement} */ (this.container.children[slideNumber]).style.display = this.displayType;
    }

    clickable() {
        let slideCount = this.slideCount;
        let slideNumber = this.slideNumber;
        let slides = this.slides;
        let displayType = this.displayType;

        this.container.style.cursor = "pointer";
        this.container.style.userSelect = "none";

        this.moveToSlide(this.slideNumber);

        this.container.onclick = function (event) {
            slideNumber++;

            if (slideNumber === slideCount) {
                slideNumber = 0;
            }

            for (let i = 0; i < slideCount; i++) {
                /** @type {HTMLElement} */ (slides[i]).style.display = "none";
            }

            /** @type {HTMLElement} */ (slides[slideNumber]).style.display = displayType;
        }
    }

    /**
     * 
     * @param {number} delay 
     */
    auto(delay = 1000) {
        let container = this.container;
        let slideCount = this.slideCount;
        let slideNumber = this.slideNumber;
        let slides = this.slides;
        let displayType = this.displayType;

        this.moveToSlide(this.slideNumber);

        setInterval(function () {
            slideNumber++;

            if (slideNumber === slideCount) {
                slideNumber = 0;
            }

            for (let i = 0; i < slideCount; i++) {
                /** @type {HTMLElement} */ (slides[i]).style.display = "none";
            }

            /** @type {HTMLElement} */ (slides[slideNumber]).style.display = displayType;
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