/*
    so, when card is being created it gets a unique id
    then an html card is being created, which gets id of an associated card
    the html card also gets an on click event handler which will notify the associated card about clicks
    when a card is deleted, it gets html card by id to remove it
    since there are no more changes in the html card state, not required to store html reference in the card

    html card handling will be done in main, model card handling will be done in game.ts
*/

let chosen_card: (Card|null) = null;
let chosen_dir: Dir = Dir.Up; //only valid when a card is chosen

//choose a card to put down
//note: chosen connection can be None, as long
function choose_card(card: Card, by_dir: Dir) {
    chosen_card = card;
    chosen_dir = by_dir;
}

function cancel_choose_card() {
    chosen_card = null;
}