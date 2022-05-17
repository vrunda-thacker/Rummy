/*
 * Handlers for Incoming Socket Data
 */

handle.connected = (data) => { // Handle join
  sendData({
    cmd: 'join'
  });
}

handle.exit = (data) => { // Handle Exir
  window.location.href = "/";
}

handle.cards = (data) => { // Handle initial cards/layout

  totalPlayers = data.numberOfPlayers;

  for (let card of data.cards) {
    $(".my_cards").append(`<div class="card _${card.rank} ${card.suit} myhand"></div>`);
    hand.push(card);
  }

  for (let card of data.draw) {
    $(".show_deck").append(`<div class="card _${card.rank} ${card.suit}"></div>`);
    draw.push(card);
  }

  for (let meld of data.melds) {
    for (let card of meld) {
      $("#cards").append(`<div class="card _${card.rank} ${card.suit}"></div>`);
    }
    melds.push(meld);
  }

  // Create fake cards to prevent cheating (by people who inspect element to see opponents cards)
  for(i=1; i<totalPlayers;i++){
    let key = `op${i}hand`;
    let renderKey = `op${i}`;
    hands[key] = createFakeCards(key, data.opido[i-1]);
    renderHand(hands[key], flip=true, renderKey);
  }
  deck = createFakeCards('deck', data.deck);

  renderHand(hand);
  renderDeck(deck, left=true);
  renderDeck(draw);
  renderMelds(melds);
  renderHint();

  setGlowForAllPlayer();

  setClickHandle();

  if(data.myturn) {
    $('#hints').html('<h5>Left Click to select <br> a card from the middle</h5>');
  } else if(data.playerTurn){
    $('#hints').html(`<h5>${data.playerTurn} Turn...</h5>`);
  } else{
    $('#hints').html(`<h5>Waiting for other players to join...</h5>`);
  }

}

handle.draw = (data) => { // Handle draw

  console.log("data from handle draw");
  console.log(data)

  let nextCard = {};

  if (data.from == 'deck') { // Where From
    nextCard = deck.pop();
  } else {
    nextCard = draw.pop();
  }

  if (data.player == 'me') { // Who
    $(nextCard.html).attr('class', `card _${data.card.rank} ${data.card.suit} myhand`);
    hand.push(data.card);
    renderHand(hand);
    $('#hints').html('<h5>Right Click your hand <br> to create a meld or <br> Left Click to discard <br> a card and end your turn</h5>');
  } else{
    let classKey = `${data.player}hand`
    $(nextCard.html).attr('class', `card ${classKey} fake_${hands[classKey].length} unknown`);
    hands[classKey].push({
      html: `.card.fake_${hands[classKey].length}.${classKey}`,
      suit: 'none',
      rank: 'none'
    });
    renderHand(hands[classKey], flip=true, data.player);
  }
  setGlowForAllPlayer();

}

handle.discard = (data) => { // Handle discard

  if (data.player == 'me') { // Who
    hand.splice(hand.indexOf(getCard(hand, data.card)), 1);
    $(data.card.html).attr('class', `card _${data.card.rank} ${data.card.suit}`);
    draw.push(data.card);
    renderHand(hand);
    renderDeck(draw);
    $('#hints').html(`<h5>${data.playerTurn} Turn...</h5>`);
  } else{
    let classKey = `${data.player}hand`;
    let nextCard = hands[classKey].pop();
    $(nextCard.html).attr('class', `card _${data.card.rank} ${data.card.suit}`);
    draw.push(data.card);
    renderHand(hands[classKey], flip=true, data.player);
    renderDeck(draw);
    if (data.player == 'op1'){
      $('#hints').html('<h5>Left Click to select <br> a card from the middle</h5>');
    } else{
      $('#hints').html(`<h5>${data.playerTurn} Turn...</h5>`);
    }
  }
  setGlowForAllPlayer();

}

handle.newmeld = (data) => { // Handles creation of a new meld

  if (data.player == 'me') { // Who
    for(let card of data.meld) {
      hand.splice(hand.indexOf(getCard(hand, card)), 1);
    }
    melds.push(data.meld);
    renderHand(hand);
    renderMelds(melds);
  } else{
    let classKey = `${data.player}hand`;
    for(let card of data.meld) {   
      let nextCard = hands[classKey].pop();
      $(nextCard.html).attr('class', `card _${card.rank} ${card.suit}`);
    }
    melds.push(data.meld);
    renderHand(hands[classKey], flip=true, data.player);
    renderMelds(melds);
  }
}

handle.addmeld = (data) => { // Handles the edit of a previous meld

  if (data.player == 'me') { // Who
    hand.splice(hand.indexOf(getCard(hand, data.card)), 1);
    melds[data.index] = data.meld;
    renderHand(hand);
    renderMelds(melds);
  } else{
    let classKey = `${data.player}hand`;
    let nextCard = hands[classKey].pop();
    $(nextCard.html).attr('class', `card _${data.card.rank} ${data.card.suit}`);
    melds[data.index] = data.meld;
    renderHand(hands[classKey], flip=true, data.player);
    renderMelds(melds);
  }
}

handle.win = (data) => { // Handle win
  $('#alert').attr('class', 'alert alert-success');
  $('#alert').html(`<h4 class="alert-heading">You Won! Score: ${data.score}</h4><p id="exitmsg"></p>`);
  $('#alert').fadeToggle();
  $('.card').unbind('click');
  showConfetti();
  beginLeave();
}

handle.loss = (data) => { // Handle loss
  $('#alert').attr('class', 'alert alert-danger');
  $('#alert').html('<h4 class="alert-heading">You Lost!</h4><p id="exitmsg"></p>');
  $('#alert').fadeToggle();
  $('.card').unbind('click');
  beginLeave();
}
