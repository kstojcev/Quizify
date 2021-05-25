window.addEventListener("load", function () {
  location.hash = "";
});
localStorage.clear();

let loadingContainer = document.getElementById("loading");
let goodLuckQuote = document.getElementById("goodLuckQuote");
let startQuizBtn = document.getElementById("startQuiz");
let questionContainer = document.getElementById("questionContainer");
let completedQuestions = document.getElementById("completedQuestions");
let goodLuckSection = document.getElementById("goodLuckSection");
let resultSection = document.getElementById("resultSection");
let tryAgain = document.getElementById("tryAgain");
let counter = 0;
let counterCorrect = document.getElementById("counterCorrect");
let totalCorrectAnswers = document.getElementById("totalCorrectAnswers");

loadingContainer.innerHTML = `
<div class="spinner-border" role="status">
<span class="visually-hidden">Loading...</span>
</div> <h1>Loading Quiz... </h1>`;
let welcomeQuote = document.getElementById("welcomeQuote");

function hideLoading() {
  setTimeout(function () {
    loadingContainer.style.display = "none";
  }, 500);
  // The API loads too fast on my PC so i put a slight delay just in case
  welcomeQuote.style.display = "flex";
}

startQuizBtn.addEventListener("click", function (e) {
  welcomeQuote.classList.remove("d-flex");
  welcomeQuote.classList.add("d-none");
  goodLuckSection.classList.remove("d-none");
  goodLuckSection.classList.add("d-flex");

  completedQuestions.innerHTML = "<h3>Completed:" + counter + "/20 </h3>  ";

  location.hash = "#question-" + counter;
});

let startOverBtn = document.getElementById("startOver");
startOverBtn.addEventListener("click", function () {
  location.replace("index.html");
  localStorage.clear();
});

function test() {
  async function getQuestions() {
    let response = await fetch("https://opentdb.com/api.php?amount=1");
    let data = await response;
    return data;
  }
  getQuestions()
    .then((response) => response.json())
    .then((data) => {
      let quiz = data.results;

      let questionContainer = document.getElementById("questionContainer");

      console.log(data);

      for (let i = 0; i < quiz.length; i++) {
        function shuffle(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        }

        function answers() {
          let answers = [];
          quiz[i].incorrect_answers.forEach(function (incorrect_answer) {
            answers.push(
              `<button type="button" onclick='loadQuestion()' class="btn btn-outline-dark" >${incorrect_answer}</button>`
            );
          });
          answers.push(
            `<button type="button" onclick='loadQuestion()' class="btn btn-outline-dark" id="correctanswer">${quiz[i].correct_answer}</button>`
          );

          return answers;
        }

        let answerShuffle = shuffle(answers());
        let random = answerShuffle.join(" ");

        let html = `
              <div class="card">
              <div class="card-header h3 p-3">${quiz[i].question}</div>
              <div class="card-body d-flex justify-content-evenly" id="answers">
              ${random}
              </div>
              <div class="card-footer text-muted p-3">${quiz[i].category}</div>
              </div>
              `;
        questionContainer.innerHTML = html;
        let correctAnswer = document.getElementById("correctanswer");
        let correctOption = localStorage.getItem("correct");
        correctAnswer.addEventListener("click", function () {
          correctOption++;
          localStorage.setItem("correct", correctOption);
        });
        if (counter == 20) {
          goodLuckSection.classList.remove("d-flex");
          goodLuckSection.classList.add("d-none");
          resultSection.classList.remove("d-none");
          resultSection.classList.add("d-flex");
          totalCorrectAnswers.innerHTML =
            "<br><h3>Total Correct Answers:" +
            localStorage.getItem("correct") +
            "/20 </h3>  ";
        }
        tryAgain.addEventListener("click", function () {
          location.replace("index.html");
          localStorage.clear();
        });
      }

      return data;
    })
    .then(() => {
      hideLoading();
    });
}

test();

function loadQuestion() {
  welcomeQuote.style.display = "none";
  test();
  counter++;
  completedQuestions.innerHTML = "<h3>Completed:" + counter + "/20 </h3>  ";

  location.hash = "#question-" + counter;
}
