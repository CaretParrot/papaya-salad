"use strict";

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
        this.slides = this.container.querySelectorAll("*");
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

class RandomPlus {
    constructor() { }

    /**
     * 
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    static randomInteger(min, max) {
        return Math.floor(Math.random() * (max + 1)) + min;
    }

    /**
     * 
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    static randomNumber(min, max) {
        return Math.random() * max + min;
    }

    /**
     * 
     * @returns {string}
     */
    static randomCard() {
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
                convertedNumber = randomCardNumber
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

    /**
     * @returns {string}
     */
    static coinFlip() {
        return RandomPlus.randomInteger(0, 1) === 0 ? "Heads" : "Tails";
    }

    /**
     * @returns {boolean}
     */
    static booleanFlip() {
        return RandomPlus.randomInteger(0, 1) === 0 ? true : false;
    }
}

class ColorPalletes {
    constructor() { }

    /**
     * 
     * @param {number} hue
     * @param {number} accentHue 
     * @returns {number[]}
     */
    static paint(hue = RandomPlus.randomInteger(0, 360), accentHue = hue + 20) {
        document.documentElement.style.setProperty("--hue", hue.toString());
        document.documentElement.style.setProperty("--accent-hue", accentHue.toString());
        return [hue, accentHue];
    }
}

class Binder {
    /**
     * @param {Map<HTMLElement, string>} mapping
     */
    constructor(mapping) {
        if (mapping === undefined || mapping.keys().next().value === undefined || mapping.values().next().value === undefined) {
            throw "Must list a mapping for a binder.";
        }

        // @ts-ignore
        this.masterVal = mapping.keys().next().value[mapping.values().next().value];
        this.mapping = mapping;

        mapping.forEach((property, element, map) => {
            element.oninput = () => {
                // @ts-ignore
                this.update(element[property]);
            }

            // @ts-ignore
            element[property] = this.masterVal;
        });

    }

    /**
     * 
     * @param {string} value 
     */
    update(value) {
        this.masterVal = value;

        this.mapping.forEach((property, element, map) => {
            // @ts-ignore
            element[property] = this.masterVal;
        });
    }
}