const startButton = document.getElementsByClassName("startGame")[0];
const cardHolder = document.getElementsByClassName("card-holder");

(function () {
  let score = {
    min: 0,
    sec: 0,
  };
  localStorage.setItem("best_score", JSON.stringify(score));

  for (let i = 0; i < 4; i++) {
    let div = document.createElement("div");
    div.classList.add(`row${i + 1}`);
    cardHolder[0].appendChild(div);

    let row = document.getElementsByClassName(`row${i + 1}`)[0];

    for (let j = 0; j < 4; j++) {
      let div = document.createElement("div");
      div.classList.add(`div${j + 1}`);
      row.appendChild(div);
    }
  }
})();

startButton.addEventListener("click", function () {
  startGame();
});

Array.from(cardHolder).forEach((holder) => {
  holder.childNodes.forEach((row) => {
    row.childNodes.forEach((element) => {
      let current_row = parseInt(row.classList.value.slice(-1));
      element.addEventListener("click", () => {
        let id = parseInt(element.classList.value.slice(-1));
        checkCardBox(
          combination[(current_row - 1) * 4 + (id - 1)],
          id,
          current_row
        );
      });
    });
  });
});
