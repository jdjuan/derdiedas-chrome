'use strict';

const input$ = document.getElementById('word-input');
const searchButton$ = document.getElementById('search-button');
const loader$ = document.getElementById('loader');
const similarWord$ = document.getElementById('similar-word');
const notFound$ = document.getElementById('not-found');
const notFoundMessage$ = document.getElementById('not-found-message');
const serverError$ = document.getElementById('server-error');
const result$ = document.getElementById('result');
const title$ = document.getElementById('title');
const article$ = document.getElementById('article');
const description$ = document.getElementById('description');
const link$ = document.getElementById('link');
const url = 'https://safe-fjord-57072.herokuapp.com/search/';
let searchTerm = '';

const startSearch = () => {
  loader$.style.display = "block";
  result$.style.display = "none";
  notFound$.style.display = "none";
  serverError$.style.display = "none";
  similarWord$.style.display = "none";
}

const endSearch = () => {
  loader$.style.display = "none";
}

const showDefinition = (data) => {
  result$.style.display = "block";
  title$.innerHTML = data.title;
  if (searchTerm !== data.title.toLowerCase().trim()) {
    similarWord$.style.display = "block";
  }

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
  link$.setAttribute('href', data.link);
}

const showError = (data) => {
  switch (data.id) {
    case 1:
      notFound$.style.display = "block";
      break;
    case 2:
      notFound$.style.display = "block";
      break;
    default:
      serverError$.style.display = "block";
      break;
  }
}

const showResult = (response) => {
  response.json().then((data) => {
    if (!response.ok) {
      showError(data);
    } else {
      showDefinition(data);
    }
  });
}

const searchDefinition = () => {
  try {
    startSearch();
    searchTerm = input$.value.toLowerCase().trim();
    fetch(url + searchTerm).then((response) => {
      console.log(response);
      endSearch();
      if (response.status === 404) {
        throw {};
      } else {
        showResult(response);
      }
    }).catch(() => {
      endSearch();
      serverError$.style.display = "block";
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

