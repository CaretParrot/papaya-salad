const id = {
    setupTree: function () {
        let allElements = document.querySelectorAll("*");

        for (let i = 0; i < allElements.length; i++) {
            if (allElements[i].id === "setupTree") {
                console.error("setupTree is already used by easyTree. Please use a different id.")
            } else {
                id[allElements[i].id] = allElements[i];
            }
        }
    }
}
const PageGroup = function (pageClass, displayType = "block") {
    this.pageClass = pageClass;
    this.displayType = displayType;
    this.currentPageId = document.getElementsByClassName(pageClass)[0].id;

    this.changePage = function (pageId) {
        allPages = document.getElementsByClassName(this.pageClass);
        for (let i = 0; i < allPages.length; i++) {
            allPages[i].style.display = "none";
            document.getElementById(pageId).classList.remove("open");
        }

        document.getElementById(pageId).style.display = displayType;
        document.getElementById(pageId).classList.add("open");
        this.currentPageId = document.getElementsByClassName(pageClass)[0].id;
    }

    this.changePage(this.currentPageId);
}

const SlideShow = function (htmlElement, displayType = "block") {
    this.htmlElement = htmlElement;
    this.slideNumber = 0;
    this.numberOfSlides = this.htmlElement.children.length;
    this.displayType = displayType;

    this.refreshSlide = function (numberOfSlides, htmlElement, slideNumber, displayType = this.displayType) {
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

    this.auto = function (delay = 1000) {
        let slides = this.slides;
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
    randomInteger: function (min, max) {
        return Math.floor(Math.random() * max) + min;
    },
    randomNumber: function (min, max) {
        return Math.random() * max + min;
    },
    randomCard: function () {
        let randomCardNumber = randomInteger(1, 13);
        let randomSuit = randomInteger(1, 4);

        switch (randomCardNumber) {
            case 1:
                randomCardNumber = "Ace";
                break;
            case 11:
                randomCardNumber = "Jack";
                break;
            case 12:
                randomCardNumber = "Queen";
                break;
            case 13:
                randomCardNumber = "King";
                break;
            default:
                break;
        }

        switch (randomSuit) {
            case 1:
                randomSuit = "Spades";
                break;
            case 2:
                randomSuit = "Diamonds";
                break;
            case 3:
                randomSuit = "Clubs";
                break;
            case 4:
                randomSuit = "Hearts";
                break;
            default:
                break;
        }

        return `${randomCardNumber} of ${randomSuit}`;
    }
}

const colorPalletes = {
    savedColor: 0,
    paint: function (color = randomPlus.randomNumber(0, 360)) {
        document.documentElement.style.setProperty(`--dark-1`, `hsl(${color}, 5%, 10%)`);
        document.documentElement.style.setProperty(`--dark-2`, `hsl(${color}, 10%, 20%)`);
        document.documentElement.style.setProperty(`--dark-3`, `hsl(${color}, 15%, 30%)`);
        document.documentElement.style.setProperty(`--light-1`, `hsl(${color}, 45%, 90%)`);
        document.documentElement.style.setProperty(`--light-2`, `hsl(${color}, 40%, 80%)`);
        document.documentElement.style.setProperty(`--light-3`, `hsl(${color}, 35%, 70%)`);
        colorPalletes.savedColor = color;
    }
}

const binder = {
    linkProperties: function (element1, property1, element2, property2, twoWay = false) {
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