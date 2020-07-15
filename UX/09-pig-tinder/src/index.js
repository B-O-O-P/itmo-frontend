'use strict';

const LAST = 6;
let currentCard = 1;

function handleSwipe(element, callback) {
  const touchElement = element;
  const threshold = 100;
  const restraint = 100;
  const allowedTime = 500;
  const handler = callback || function(swipeType) {};

  let swipeType;
  let startX;
  let startY;
  let distX;
  let distY;
  let elapsedTime;
  let startTime;

  touchElement.addEventListener(
    'touchstart',
    function(e) {
      const touchObject = e.changedTouches[0];
      swipeType = 'none';
      startX = touchObject.pageX;
      startY = touchObject.pageY;
      startTime = new Date().getTime();
      e.preventDefault();
    },
    false
  );

  touchElement.addEventListener(
    'touchmove',
    function(e) {
      e.preventDefault();
    },
    false
  );

  touchElement.addEventListener(
    'touchend',
    function(e) {
      const touchObject = e.changedTouches[0];
      distX = touchObject.pageX - startX;
      distY = touchObject.pageY - startY;
      elapsedTime = new Date().getTime() - startTime;
      if (elapsedTime <= allowedTime) {
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
          swipeType = distX < 0 ? 'left' : 'right';
        } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
          swipeType = distY < 0 ? 'up' : 'down';
        }
      }
      handler(swipeType);
      e.preventDefault();
    },
    false
  );
}

function addListener() {
  const currentCardElement = document.getElementById(`card${currentCard}`);
  handleSwipe(currentCardElement, swipeType => {
    switch (swipeType) {
      case 'left':
        swipeNope();
        break;
      case 'up':
        swipeSuper();
        break;
      case 'right':
        swipeLike();
        break;
    }
  });
}

addListener();

function swipeNope() {
  swipe('nope');
}

function swipeSuper() {
  swipe('super-like');
}

function swipeLike() {
  swipe('like');
}

function swipe(swipeId) {
  if (currentCard === LAST) {
    return;
  }

  const answerElement = document.getElementById(swipeId);
  const prevCardStyle = document.getElementById(`card${currentCard}`);

  answerElement.style.opacity = '1';

  switch (swipeId) {
    case 'nope':
      prevCardStyle.style.transform = `translate3d(-200%, -100%, 0) rotateZ(-60deg)`;
      break;
    case 'like':
      prevCardStyle.style.transform = `translate3d(200%, -100%, 0) rotateZ(60deg)`;
      break;
    case 'super-like':
      prevCardStyle.style.transform = `translate3d(0, -200%, 0)`;
      break;
  }

  setTimeout(() => {
    answerElement.style.opacity = '0';
    prevCardStyle.style.opacity = '0';
    prevCardStyle.style.display = 'none';
  }, 500);

  currentCard++;
  const currentCardElement = document.getElementById(`card${currentCard}`);
  currentCardElement.style.opacity = '1';
  addListener();
}
