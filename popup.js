'use strict';

const input$ = document.getElementById('word-input');
const searchButton$ = document.getElementById('search-button');
const loader$ = document.getElementById('loader');
const notFound$ = document.getElementById('not-found');
const notFoundMessage$ = document.getElementById('not-found-message');
const serverError$ = document.getElementById('server-error');
const result$ = document.getElementById('result');
const title$ = document.getElementById('title');
const article$ = document.getElementById('article');
const description$ = document.getElementById('description');
const credits$ = document.getElementById('credits');
const url = 'https://safe-fjord-57072.herokuapp.com/search/';

const startSearch = () => {
  loader$.style.display = "block";
  result$.style.display = "none";
  notFound$.style.display = "none";
  serverError$.style.display = "none";
}

const endSearch = () => {
  loader$.style.display = "none";
}

const searchDefinition = () => {
  startSearch();
  try {
    fetch(url + input$.value).then((response) => {
      response.json().then((data) => {
        endSearch();
        if (!response.ok) {
          switch (data.id) {
            case 1:
              notFound$.style.display = "block";
              break;
            case 2:
              notFoundMessage$.innerHTML += ". Make sure it is a noun 😉";
              notFound$.style.display = "block";
              break;
            default:
              serverError$.style.display = "block";
              break;
          }
        } else {
          result$.style.display = "block";
          title$.innerHTML = data.title;
          switch (data.gender.toLowerCase()) {
            case 'maskulin':
              article$.innerHTML = 'der';
              break;
            case 'feminin':
              article$.innerHTML = 'die';
              break;
            case 'neutrum':
              article$.innerHTML = 'das';
              break;
          }
          description$.innerHTML = data.description;
          credits$.style.display = "block";
        }
      })
    });
  } catch (error) {
    endSearch();
    serverError$.style.display = "block";
  }
}

searchButton$.onclick = searchDefinition;
input$.onkeyup = ({ which }) => {
  if (which === 13) {
    searchDefinition();
  }
}

