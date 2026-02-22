"use strict";

class PageGroup {
    #pageClass;
    #displayType;
    #currentPageId;
    #savePage;

    /**
     * @param {string} pageClass 
     * @param {string} displayType 
     * @param {string} initialPageId
     * @param {boolean} savePage
     */
    constructor(pageClass, displayType = "block", initialPageId = document.getElementsByClassName(pageClass)[0].id, savePage = true) {
        this.#pageClass = pageClass;
        this.#displayType = displayType;
        this.#currentPageId = initialPageId;
        this.#savePage = savePage;
        if (savePage) { 
            this.#currentPageId = localStorage.getItem(`${this.#pageClass}.savedPage`) || initialPageId;
            console.log(this.#currentPageId);
        }
        
        this.changePage(this.#currentPageId);
    }

    /**
     * @param {string} pageId 
     * @returns {boolean}
     */
    changePage(pageId) {
        let selectedElement = document.getElementById(pageId);
        if (selectedElement == null) {
            throw "Could not find page.";
        }

        let allPages = /** @type {HTMLCollectionOf<HTMLElement>} */ (document.getElementsByClassName(this.#pageClass));
        for (let i = 0; i < allPages.length; i++) {
            allPages[i].style.display = "none";
            /** @type {HTMLElement} */ (document.getElementById(pageId)).classList.remove("open");
        }

        selectedElement.style.display = this.#displayType;
        selectedElement.classList.add("open");
        this.#currentPageId = pageId;
        if (this.#savePage) { 
            localStorage.setItem(`${this.#pageClass}.savedPage`, this.#currentPageId);
        }
        return true;
    }
}

class SlideShow {
    #container;
    #slides;
    #slideNumber;
    #slideCount;
    #displayType;

    /**
     * @param {HTMLElement} container 
     * @param {string} displayType 
     */
    constructor(container, displayType = "block") {
        this.#container = container;
        this.#slides = this.#container.querySelectorAll("*");
        this.#slideNumber = 0;
        this.#slideCount = this.#slides.length;
        this.#displayType = displayType;
    }

    /**
     * 
     * @param {number} slideNumber 
     */
    moveToSlide(slideNumber) {
        for (let i = 0; i < this.#slideCount; i++) {
            /** @type {HTMLElement} */ (this.#container.children[i]).style.display = "none";
        }

        /** @type {HTMLElement} */ (this.#container.children[slideNumber]).style.display = this.#displayType;
    }

    clickable() {
        let slideCount = this.#slideCount;
        let slideNumber = this.#slideNumber;
        let slides = this.#slides;
        let displayType = this.#displayType;

        this.#container.style.cursor = "pointer";
        this.#container.style.userSelect = "none";

        this.moveToSlide(this.#slideNumber);

        this.#container.onclick = function (event) {
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
        let slideCount = this.#slideCount;
        let slideNumber = this.#slideNumber;
        let slides = this.#slides;
        let displayType = this.#displayType;

        this.moveToSlide(this.#slideNumber);

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

class Binder {
    #masterVal;
    #mapping;

    /**
     * @param {Map<HTMLElement, string>} mapping
     */
    constructor(mapping) {
        if (mapping === undefined || mapping.keys().next().value === undefined || mapping.values().next().value === undefined) {
            throw "Must list a mapping for a binder.";
        }

        // @ts-ignore
        this.#masterVal = mapping.keys().next().value[mapping.values().next().value];
        this.#mapping = mapping;

        mapping.forEach((property, element, map) => {
            element.oninput = () => {
                // @ts-ignore
                this.update(element[property]);
            }

            // @ts-ignore
            element[property] = this.#masterVal;
        });

    }

    /**
     * 
     * @param {string} value 
     */
    update(value) {
        this.#masterVal = value;

        this.#mapping.forEach((property, element, map) => {
            // @ts-ignore
            element[property] = this.masterVal;
        });
    }
}

class DeckOfCards {
    #cards;
    #values;
    #suits;
    /**
     * @type {object}
     */
    #stats;

    constructor(sorted = true) {
        this.#cards = [];
        this.#values = [
            "Ace", "Two", "Three", "Four",
            "Five", "Six", "Seven", "Eight",
            "Nine", "Ten", "Jack", "Queen", "King"
        ];
        this.#suits = ["Spades", "Diamonds", "Clubs", "Hearts"];
        this.#stats = {count: 52};

        for (let i = 0; i < this.#suits.length; i++) {
            for (let j = 0; j < this.#values.length; j++) {
                this.#cards.push(`${this.#values[j]} of ${this.#suits[i]}`);
            }
        }
        
        if (!sorted) {
            this.shuffle();
        }
    }

    shuffle() {
        for (let i = this.#cards.length - 1; i > 0; i--) {
            let randomIndex = RandomPlus.randomInteger(0, i + 1);
            let temp = this.#cards[i];
            this.#cards[i] = this.#cards[randomIndex];
            this.#cards[randomIndex] = temp;
        }

        return this.#cards;
    }

    get cards() {
        return this.#cards;
    }

    get top() {
        return this.#cards[0];
    }

    get bottom() {
        return this.#cards.at(-1);
    }

    get stats() {
        // @ts-ignore
        this.#stats.count = this.#cards.length;
        return this.#stats;
    }
}