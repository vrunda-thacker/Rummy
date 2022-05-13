// const consts = require("../../consts");
// import utils from "../../utils";
// const utils = require("../../utils");
// import { verifyPlayerName } from "../../utils";
/*
 * Functions for the Lobby/Index Page
 */

let joinGame = () => { // Joins/Creates regular game
  window.location.href = "/join/" + $('#code').val();
};

let joinCPU = () => { // Creates CPU game
  window.location.href = "/joincpu/" + $('#code').val();
};

handle.status = (data) => { // Handle getting the status of a lobby
  console.log("status dta")
  console.log(data)

  if (data.cmd == 'status') {
    if (data.status == 'waiting') {
      $('#lobbybtn').attr('class', 'btn btn-success');
      $('#lobbybtn').html('Join');
      $('#lobbybtn').on('click', () => joinGame());
    } else if (data.status == 'closed') {
      $('#lobbybtn').attr('class', 'btn btn-danger');
      $('#lobbybtn').html('Full');
    } else if (data.status == 'open') {
      $('#lobbybtn').attr('class', 'btn btn-info');
      $('#cpubtn').css({ display: 'inline' });
      $('#lobbybtn').html('Create');
      $('#lobbybtn').on('click', () => joinGame());
      $('#cpubtn').on('click', () => joinCPU());
    }
  }

};

$('#code').on('keyup', () => { // As the user types...

  $('#lobbybtn').unbind('click');
  $('#cpubtn').unbind('click');

  $('#cpubtn').css({ display: 'none' });

  let code = $('#code').val().replace(/\W/, ''); // Replace invalid chars
  let playerName = $('#player-name').val()
  // console.log("code kaik aavyu");
  // console.log(code);

  $('#code').val(code);

  // console.log("kuguyguigiu")

  // console.log(playerName);
  if (playerName){

    if (/^\w{5,12}$/.test(code)) {

      $('#lobbybtn').attr('class', 'btn btn-default');
      $('#lobbybtn').html('....');
      $('#lobbybtn').on('click', () => {});

      console.log("send data of currently typed lobby");
      console.log(code);

      send({
        'cmd': 'status',
        'lobby': code,
        'playerName': playerName
      }); // Request status of currently typed lobby

    } else {

      $('#lobbybtn').attr('class', 'btn btn-danger');
      $('#lobbybtn').html('Invalid');
      $('#lobbybtn').on('click', () => {});

    }
  } else{
    $('#lobbybtn').attr('class', 'btn btn-danger');
    $('#lobbybtn').html('Invalid Player name');
    $('#lobbybtn').on('click', () => {});
  }

});
