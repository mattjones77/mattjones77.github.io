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
    ]


const grid = document.querySelector('.grid')

// create the board

function  createBoard() {
    for (let i = 0; i < cardArray.length; i++){
        var card = document.createElement('img')
        card.setAttribute('src', 'images/blank.png')
        card.setAttribute('data-id', i)
       // TODO card.addEventListener('click', flipCard)
        grid.appendChild(card)
    }
}

createBoard()


})