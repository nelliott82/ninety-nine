module.exports = {
  formatPlayers: (players, currentUsername = 'Waiting...') => {
    return players ?
      players.reduce((accum, player) => {
        let { username, strikes, turn } = player;
        accum.playerObjects.push({ username, strikes, turn });

        if (username === currentUsername && !accum.hand.length) {
          accum.hand = player.hand;
        }
        return accum;
      }, { playerObjects: [], hand: [] }) :
      players;
  }
}