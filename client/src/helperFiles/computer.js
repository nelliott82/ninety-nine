const computer = {
  chooseCard: function(hand, total) {
    var values = this.getValueCards(hand);
    var specials = this.getSpecialCards(hand);
    console.log(total)
    console.log(specials);

    if (values.length) {
      for (let i = values.length - 1; i >= 0; i--) {
        if ((values[i][1] + total) <= 99) {
          console.log('played value')
          return values[i];
        }
      }
      if (specials.length) {
        console.log('played special')
        return specials[0];
      } else {
        return values[0];
      }

    } else if (specials.length) {
      return specials[0];

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

      return a[2] - b[2];
    })
  }
}

export default computer;