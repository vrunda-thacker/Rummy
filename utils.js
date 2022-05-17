const Consts = require("./consts");

/**
 * Find indexes for all players
 * @param {number} total_length - Total Number of players
 * @param {number} start_index - INdex of first player
 */
function findIndexes(total_length, start_index) {
    let indexes = [start_index]
    for (let i=1; i<total_length; i++){
        if ((start_index + 1) === total_length){
            start_index = 0
        } else{
            start_index = start_index + 1
        }
        indexes.push(start_index)
    }
    return indexes
}

/**
 * Register Player with name
 * @param {string} player_name - Player Name
 */
function registerPlayerName(player_name) {
    if(Consts.playerNames.indexOf(player_name) == -1){
        Consts.playerNames.push(player_name)
    }
}

/**
 * Verify Player with name
 * @param {string} player_name - Player Name
 */
 function verifyPlayerName(player_name) {
    if(Consts.playerNames.indexOf(player_name) == -1){
        return true;
    } else{
        return false;
    }
}

module.exports = {
    findIndexes: findIndexes,
    registerPlayerName: registerPlayerName,
    verifyPlayerName: verifyPlayerName
}