module.exports = {
  sortPlayers: (players, username) => {
    return players.reduce((accum, player) => {
      accum.usernames.push(player.username);
      if (player.username === username) {
        accum.hand = player.hand;
      }
      return accum;
    }, { usernames: [], hand: [] });
  }
}