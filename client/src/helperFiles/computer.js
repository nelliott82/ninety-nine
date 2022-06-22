const computer = {
  chooseCard: function(hand, total) {
    console.log(total);
    var values = this.getValueCards(hand);
    console.log('value cards: ', values);
    var specials = this.getSpecialCards(hand);
    console.log('special cards: ', specials);

    if (total < 80) {
      if (values.length) {
        console.log('value played')
        // Play highest card
        return values[values.length - 1];
      } else {
        console.log('special played')
        return specials[0];
      }
    }
  },
  getValueCards: function(hand) {
    return hand.filter(card => {
      if (card[0] !== 'K' && card[0] !== '4' && card[0] !== '9' && card[0] !== '10') {
        return card;
      }
    }).sort((a, b) => {
      if (a[0] === 'A') {
        a[0] = 1;
      } else if (a[0] === 'Q' || a[0] === 'J') {
        a[0] = 10;
      } else {
        a[0] = parseInt(a[0])
      }

      if (b[0] === 'A') {
        b[0] = 1;
      } else if (b[0] === 'Q' || b[0] === 'J') {
        b[0] = 10;
      } else {
        b[0] = parseInt(b[0])
      }

      return a - b;
    })
  },
  getSpecialCards: function(hand) {
    return hand.filter(card => {
      if (card[0] === 'K' && card[0] === '4' && card[0] === '9' && card[0] === '10') {
        return card;
      }
    }).sort((a, b) => {
      a = a[0] === 'K' ? 1 : parseInt(a[0]);
      b = b[0] === 'K' ? 1 : parseInt(b[0]);
      return a - b;
    })
  }
}

export default computer;