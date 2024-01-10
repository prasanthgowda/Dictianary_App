"use strict";

const historybtn = document.querySelector(".history-btn");
const input = document.querySelector(".search-input");
const searchbtn = document.querySelector(".search-btn");
const outputContainer = document.querySelector(".search-output");
const historypage = document.querySelector(".historypage");
const historyheader = document.querySelector(".historyheader");
const goback = document.querySelector(".goback");
const home = document.querySelector(".home");
const historycontainer = document.querySelector(".historycontainer");
const clearhistory = document.querySelector(".clearhistory");

let storedHistory = localStorage.getItem("histo");
let history = storedHistory ? JSON.parse(storedHistory) : [];
historybtn.addEventListener("click", displayhistory);
goback.addEventListener("click", gobacktohome);

searchbtn.addEventListener("click", async () => {
  if (input.value === "") {
    alert("Enter a word");
    return;
  }

  const word = input.value.trim();
  input.value = "";

  // Display "Searching..." message
  displaySearchingMessage();

  try {
    const meaning = await fetchdata(word);
    createWordCard(word, meaning);
    addToSearchHistory(word, meaning);
  } catch (error) {
    // Handle errors, you might want to display an error message
    console.error(error);
  } finally {
    // Remove the "Searching..." message
    removeSearchingMessage();
  }
});

function displaySearchingMessage() {
  const searchingMessage = document.createElement("p");
  searchingMessage.textContent = "Searching...";
  searchingMessage.classList.add("searching-message");
  outputContainer.prepend(searchingMessage);
}

function removeSearchingMessage() {
  const searchingMessage = document.querySelector(".searching-message");
  if (searchingMessage) {
    searchingMessage.remove();
  }
}

async function fetchdata(word) {
  return await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => res.json())
    .then((data) => {
      if (
        data &&
        data.length > 0 &&
        data[0].meanings &&
        data[0].meanings.length > 0
      ) {
        return data[0].meanings[0].definitions[0].definition;
      } else {
        alert("word not found in dictionary");
        throw new Error("Word not found");
      }
    });
}

function createWordCard(word, meaning) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
  <h4>${word}</h4>
  <p>${meaning}</p>
  <button class="output-btn" data-custom="${word}">delete</button>
  `;
  outputContainer.prepend(card);

  const deletebtn = document.querySelector(".output-btn");

  //method--1
  // deletebtn.addEventListener("click",deletecard);
  deletebtn.addEventListener("click", deletecard);
}

function deletecard(event) {
  // method--1 of accessing elements like iving attribute to btn
  const word = event.target.getAttribute("data-custom");
  const wordcard = event.target.parentElement;
  wordcard.remove();
  input.focus();

  // method--2 by sending card itself as props like closers but should change props
  // card.remove();
  // removeFromSearchHistory(word);
}
function deletehistorycard(event) {
  // method--1 of accessing elements like iving attribute to btn
  const word = event.target.getAttribute("data-custom");
  const wordcard = event.target.parentElement;

  wordcard.remove();

  // method--2 by sending card itself as props like closers but should change props
  // card.remove();
  removeFromSearchHistory(word);
}

function addToSearchHistory(word, meaning) {
  const newcard = { word, meaning };
  history.push(newcard);
  localStorage.setItem("histo", JSON.stringify(history));
}

function removeFromSearchHistory(word) {
  history = history.filter((card) => card.word !== word);
  localStorage.setItem("histo", JSON.stringify(history));
  // if(history.length === 0){
  //   historypage.textContent="No History";
  //   return
  // }
  // displaySearch();
}

function displayhistory() {
  home.style.display = "none";
  historycontainer.style.display = "block";
  displaySearch();
}

function gobacktohome() {
  home.style.display = "block";
  historycontainer.style.display = "none";
}

clearhistory.addEventListener("click", () => {
  // Clear the localStorage
  localStorage.setItem("histo", JSON.stringify([]));
  history = [];

  // Clear the content of the history page
  historypage.innerHTML = "<h2>No History</h2>";
});

function displaySearch() {
  historypage.textContent = " ";
  if (history.length === 0) {
    historypage.innerHTML = "<h2>No History</h2>";
    return;
  }
  historypage.innetHTML = "";

  history.forEach((post) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
  <h4>${post.word}</h4>
  <p>${post.meaning}</p>
  <button class="output-btns"  data-custom="${post.word}">delete</button>
  `;
    historypage.prepend(card);

    const deletebtn = document.querySelector(".output-btns");

    //method--1
    // deletebtn.addEventListener("click",deletecard);
    deletebtn.addEventListener("click", deletehistorycard);
  });
}

 
