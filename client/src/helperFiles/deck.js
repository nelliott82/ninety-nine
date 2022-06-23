function shuffleDeck (deck) {
  var total = deck.length;

  while (total) {
    var randomIndex = Math.floor(Math.random() * total--);
    [deck[randomIndex], deck[total]] = [deck[total], deck[randomIndex]];
  }
  return deck;
};

function createDeck () {
  var suits = [ '♥', '♣', '♠', '♦' ];
  var values = [ 'A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K' ];
  var deck = [];

  suits.forEach(function(suit) {
    values.forEach(function(value) {
      var realValue = value;

      if (value === 'A') {
        realValue = 1;
      } else if (value === 'J' || value === 'Q') {
        realValue = 10;
      } else if (value === 'K') {
        // K realValue is 0 for sorting purposes
        realValue = 0;
      }

      deck.push([value + suit, realValue]);
    });
  });

  return deck;
}

module.exports = {
  shuffleDeck,
  createDeck
}