const computer = {
  chooseCard: function(hand, total) {
    var values = this.getValueCards(hand);
    console.log('values: ', values);
    var specials = this.getSpecialCards(hand);
    console.log('specials: ', specials);

    if (total < 80) {
      if (values.length) {
        // Play highest card
        return values[values.length - 1];

      } else {
        return specials[0];

      }

    } else {
      if (values.length && specials.length) {
        if (values[0] + total > 99) {
          return specials[0];

        } else if (values[values.length - 1] + total < 99) {
          return values[values.length - 1];

        }
      } else if (specials.length) {
        return specials[0];

      } else {
        if (values[0] + total > 99) {
          return values[0];

        } else if (values[values.length - 1] + total < 99) {
          return values[values.length - 1];

        } else {
          return values[0];

        }
      }
    }
  },
  getValueCards: function(hand) {
    return hand.filter(card => {
      if (card[0][0] !== 'K' &&
          card[0][0] !== '4' &&
          card[0][0] !== '9' &&
          card[0][0] + card[0][1] !== '10') {
        return card;
      }
    }).sort((a, b) => {
      return a[1] - b[1];
    })
  },
  getSpecialCards: function(hand) {
    return hand.filter(card => {
      if (card[0][0] === 'K' ||
          card[0][0] === '4' ||
          card[0][0] === '9' ||
          card[0][0] + card[0][1] === '10') {
        return card;
      }
    }).sort((a, b) => {

      return a[1] - b[1];
    })
  }
}

export default computer;