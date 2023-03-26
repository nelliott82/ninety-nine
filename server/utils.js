module.exports = {
  sortPlayers: (players, username = 'Waiting...') => {
    return players ?
      players.reduce((accum, player) => {
        accum.usernames.push(player.username);
        if (player.username === username) {
          accum.hand = player.hand;
        }
        return accum;
      }, { usernames: [], hand: [] }) :
      players;
  }
}