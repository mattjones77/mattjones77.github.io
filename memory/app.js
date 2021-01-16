document.addEventListener('DOMContentLoaded', () => {

    //cards
    const cardArray = [
        {
            name: 'flamebreast',
            img: 'images/flamebreast.png'
        },
        {
            name: 'flamebreast',
            img: 'images/flamebreast.png'
        },
        {
            name: 'bluetit',
            img: 'images/bluetit.png'
        },
        {
            name: 'bluetit',
            img: 'images/bluetit.png'
        },
        {
            name: 'robin',
            img: 'images/robin.png'
        },
        {
            name: 'robin',
            img: 'images/robin.png'
        },
        {
            name: 'owl',
            img: 'images/owl.png'
        },
        {
            name: 'owl',
            img: 'images/owl.png'
        },
        {
            name: 'featherbird',
            img: 'images/featherbird.png'
        },
        {
            name: 'featherbird',
            img: 'images/featherbird.png'
        },
        {
            name: 'hummingbird',
            img: 'images/hummingbird.png'
        },
        {
            name: 'hummingbird',
            img: 'images/hummingbird.png'
        },
    ]

    cardArray.sort(() => 0.5 - Math.random())

    const grid = document.querySelector('.grid')
    const resultDisplay = document.querySelector('#result')
    var cardsChosen = []
    var cardsChosenID = []
    var cardsWon = []

    // create the board

    function createBoard() {
        for (let i = 0; i < cardArray.length; i++) {
            var card = document.createElement('img')
            card.setAttribute('src', 'images/blank.png')
            card.setAttribute('data-id', i)
            card.addEventListener('click', flipCard)
            grid.appendChild(card)
        }
    }

    //check matches
    function checkForMatch() {
        var cards = document.querySelectorAll('img')
        const optionOneId = cardsChosenID[0]
        const optionTwoId = cardsChosenID[1]

        if (cardsChosen[0] === cardsChosen[1]) {
            cards[optionOneId].setAttribute('src', 'images/white.png')
            cards[optionTwoId].setAttribute('src', 'images/white.png')
            cardsWon.push(cardsChosen)
        } else {
            cards[optionOneId].setAttribute('src', 'images/blank.png')
            cards[optionTwoId].setAttribute('src', 'images/blank.png')
        }
        cardsChosen = []
        cardsChosenID = []
        resultDisplay.textContent = cardsWon.length
        if (cardsWon.length === cardArray.length/2) {
            resultDisplay.textContent = 'Congratulations! You found them all!'
        }
    }


    //flip card
    function flipCard() {
        var cardId = this.getAttribute('data-id')
        var cardName =  cardArray[cardId].name 
        if ((cardsChosen.length > 0 && cardsChosenID[0] === cardId)
                || this.getAttribute('src') === 'images/white.png' ){
                return
        }
        cardsChosen.push(cardName)
        cardsChosenID.push(cardId)
      
        this.setAttribute('src', cardArray[cardId].img)
        if (cardsChosen.length === 2) {
            setTimeout(checkForMatch, 500)
        }
    }

    createBoard()


})