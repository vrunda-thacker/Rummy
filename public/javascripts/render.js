/*
 * Several Methods for Drawing Things
 */

let setElementPos = (element, x, y, z = 2, degs = 0) => { // Sets an elements position via CSS
  // console.log("set elemennt pos log")
  // console.log(element)
  // console.log(x)
  // console.log(y)
  // console.log(z)
  // console.log(degs)
  $(element.html).css({
    'transform': `translateX(${x}px) translateY(${y}px) rotateZ(${degs}deg)`,
    'MozTransform': `translateX(${x}px) translateY(${y}px) rotateZ(${degs}deg)`,
    'WebkitTransform': `translateX(${x}px) translateY(${y}px) rotateZ(${degs}deg)`,
    'msTransform': `translateX(${x}px) translateY(${y}px) rotateZ(${degs}deg)`,
    'z-index': z
  });
}

let setGlow = (selector, amt, color) => { // Adds a colored glow
  selector.css({
    '-moz-box-shadow': `0 0 ${amt}px ${color}`,
    '-webkit-box-shadow': `0 0 ${amt}px ${color}`,
    'box-shadow': `0px 0px ${amt}px ${color}`
  });
}

let renderHand = (handCards, flip = false, type="me") => { // Renders hand (for both self and enemy)

  if(!flip) { sortDeck(handCards) }; // Sort my cards

  let height = flip ? 30 : $(window).height() - 250;
  let dangle = flip ? 4 : -4; // Rotation offset

  let i = 1,
      leftIndex = -1,
      rightIndex = -1,
      half = Math.floor(handCards.length / 2),
      offset = ($(window).width() / 2) - (20 * handCards.length / 2) - 70;
  let opOffset = ($(window).width() / 4) - (20 * handCards.length / 2) - 70;
  let anotherOffset = ($(window).width() / 2);

  if (handCards.length % 2 == 1) {
    leftIndex = half - 1;
    rightIndex = half + 1;
    setElementPos(handCards[half], $(window).width() / 2 - 75, height, half + 100, 0);
  } else {
    leftIndex = half - 1;
    rightIndex = half;
  }

  while (leftIndex >= 0) { // Start at middle card and setPos going outward
    if (type == "me"){
      setElementPos(handCards[leftIndex], offset + leftIndex * 20, height, leftIndex + 100, i * dangle);
      setElementPos(handCards[rightIndex], offset + rightIndex * 20, height, rightIndex + 100, i * -dangle);
    } else if (type == "op"){
      setElementPos(handCards[leftIndex], opOffset + leftIndex * 20, height, leftIndex + 100, i * dangle);
      setElementPos(handCards[rightIndex], opOffset + rightIndex * 20, height, rightIndex + 100, i * -dangle);
    } else if (type == "another"){
      setElementPos(handCards[leftIndex], anotherOffset + leftIndex * 20, height, leftIndex + 100, i * dangle);
      setElementPos(handCards[rightIndex], anotherOffset + rightIndex * 20, height, rightIndex + 100, i * -dangle);
    }
    leftIndex--;
    rightIndex++;
    i++;
  }

}

let renderDeck = (cards, left = false) => { // Renders deck (for both deck and face up draw pile)

  let offset = left ? $(window).width() / 2 - 200 : $(window).width() / 2 + 40;

  for (let i in cards) {
    setElementPos(cards[i], offset, $(window).height() / 2 - 99, i + 2, 0);
  }

}

let renderMelds = (melds) => { // Renders Melds

  let height = 10,
      offset = 10;

  for (let i in melds) {

    for (let j in melds[i]) {
      setElementPos(melds[i][j], offset + j * 20, height, i + j + 100, 0);
    }

    height += 220;
    if (height + 200 > $(window).height()) { // Start a new column if they go off screen
      height = 10;
      offset += 240;
    }

  }

}

let renderHint = () => { // Render hint msg in the top right

  setElementPos({html: '#hints'}, $(window).width() - 200, 10, 9999);

}
