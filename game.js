let configuration = {
  gameStarted: false,
  checkingCards: false,
  min: 0,
  sec: 0,
  remaining: 16,
  completed: 0,
  pictures: [
    "bm-logo",
    "pumpkin",
    "bats",
    "witch",
    "bm-text",
    "dresscode",
    "cat",
    "castle",
  ],
};

let best_score = JSON.parse(localStorage.getItem("best_score"));

let guessedIndex = [];
let cards = [];
let deleteNodes = [];
let combination = [];

const resultElement = document.getElementsByClassName("result");
const timerElement = document.getElementsByClassName("timer");
const scoreElement = document.getElementsByClassName("score");

let stopwatch;

startTimer = () => {
  stopwatch = setInterval(function () {
    if (++configuration.sec > 59) {
      configuration.sec -= 60;
      ++configuration.min;
    }
    if (configuration.sec < 10) {
      timerElement[0].innerHTML =
        "0" + configuration.min + ":0" + configuration.sec;
    } else {
      timerElement[0].innerHTML =
        "0" + configuration.min + ":" + configuration.sec;
    }

    if (configuration.min === 5) {
      clearInterval(stopwatch);
    }
  }, 1000);
};

startGame = () => {
  configuration.gameStarted = true;

  resultElement[0].innerHTML = "";
  clearInterval(stopwatch);
  startTimer();

  document.getElementById("button").innerHTML = "RESTART GAME";

  guessedIndex = [];

  configuration.min = 0;
  configuration.sec = 0;
  configuration.remaining = 16;
  configuration.completed = 0;

  timerElement[0].style.visibility = "visible";
  scoreElement[0].innerHTML =
    configuration.completed + "/" + configuration.remaining;
  scoreElement[0].style.visibility = "visible";

  deleteNodes.forEach((element) => {
    removeElementStyle(element.style);
  });

  combination = generateCombination.publicGen();
};

addPoints = () => {
  // CLICKED ON THE GUESSED CARD
  for (let i = 0; i < guessedIndex.length; i++) {
    if (guessedIndex[i] === cards[0].elem) {
      cards = [];
      configuration.checkingCards = false;
      return;
    }
  }

  // CLICKED ON THE SAME CARD
  if (cards[0].row === cards[1].row && cards[0].ind === cards[1].ind) {
    cards.shift();
    configuration.checkingCards = false;
    return;
  }

  // AFTER 1000 ms REMOVE STYLE FROM WRONG CARDS
  if (cards[0].elem !== cards[1].elem) {
    let timer = setTimeout(() => {
      let fElem = document.getElementsByClassName(`row${cards[0].row}`)[0];
      let sElem = document.getElementsByClassName(`row${cards[1].row}`)[0];

      let firstElem = fElem.getElementsByClassName(`div${cards[0].ind}`)[0]
        .style;
      let secondElem = sElem.getElementsByClassName(`div${cards[1].ind}`)[0]
        .style;

      removeElementStyle(firstElem);
      removeElementStyle(secondElem);

      cards = [];
      configuration.checkingCards = false;
    }, 1000);
  } else if (cards[0].elem === cards[1].elem) {
    guessedIndex.push(cards[0].elem);

    configuration.remaining -= 2;
    configuration.completed += 2;
    scoreElement[0].innerHTML = configuration.completed + "/16";

    cards = [];
    configuration.checkingCards = false;
  }
};

addElementToCard = (elem, ind, row) => {
  let card = {
    elem,
    ind,
    row,
  };

  const r = document.getElementsByClassName(`row${row}`);

  cards.push(card);

  deleteNodes.push(r[0].getElementsByClassName(`div${card.ind}`)[0]);

  let picture = configuration.pictures[elem - 1];

  let row_pic = document.getElementsByClassName(`row${row}`)[0];

  setElementStyle(
    row_pic.getElementsByClassName(`div${ind}`)[0].style,
    picture
  );
};

removeElementStyle = (element) => {
  element.backgroundImage = "none";
  element.backgroundColor = "#f98a00";
  element.borderTopRightRadius = "0px";
  element.borderBottomLeftRadius = "0px";
  element.borderTopLeftRadius = "40px";
  element.borderBottomRightRadius = "40px";
  element.boxShadow = "10px 15px #272324";
};

setElementStyle = (element, picture) => {
  element.backgroundColor = "#272324";
  element.backgroundImage = `url(assets/${picture}.jpg)`;
  element.borderTopRightRadius = "40px";
  element.borderBottomLeftRadius = "40px";
  element.borderTopLeftRadius = "0px";
  element.borderBottomRightRadius = "0px";
  element.boxShadow = "10px 15px #f98a00";
};

checkCardBox = (elem, ind, row) => {
  if (configuration.gameStarted && !configuration.checkingCards) {
    addElementToCard(elem, ind, row);

    for (let i = 0; i < guessedIndex.length; i++) {
      if (guessedIndex[i] === cards[cards.length - 1].elem) {
        cards.pop();
        return;
      }
    }

    if (cards.length === 2) {
      configuration.checkingCards = true;
      addPoints();
    }

    if (configuration.remaining === 0) {
      best_score.min = best_score.min > 0 ? best_score.min : configuration.min;
      best_score.sec = best_score.sec > 0 ? best_score.sec : configuration.sec;

      if (best_score.min > configuration.min) {
        best_score.min = configuration.min;
        best_score.sec = configuration.sec;
      } else if (best_score.min === configuration.min) {
        if (best_score.sec > configuration.sec) {
          best_score.sec = configuration.sec;
        }
      }

      resultElement[0].innerHTML =
        "Your time is " +
        configuration.min +
        " min " +
        configuration.sec +
        " sec! Your best time is " +
        best_score.min +
        " min " +
        best_score.sec +
        " sec!";

      resultElement[0].style.visibility = "visible";

      localStorage.setItem("best_score", JSON.stringify(best_score));
      clearInterval(stopwatch);
    }
  }
};

generateCombination = (function () {
  let privateGen = function () {
    let combination = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = combination.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combination[i], combination[j]] = [combination[j], combination[i]];
    }
    return combination;
  };

  return {
    publicGen: function () {
      return privateGen();
    },
  };
})();
