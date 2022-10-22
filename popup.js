'use strict';

const input$ = document.getElementById('word-input');
const searchButton$ = document.getElementById('search-button');
const loader$ = document.getElementById('loader');
const similarWord$ = document.getElementById('similar-word');
const notFound$ = document.getElementById('not-found');
const notFoundMessage$ = document.getElementById('not-found-message');
const severalMeanings$ = document.getElementById('several-meanings');
const serverError$ = document.getElementById('server-error');
const result$ = document.getElementById('result');
const title$ = document.getElementById('title');
const article$ = document.getElementById('article');
const description$ = document.getElementById('description');
const link$ = document.getElementById('link');
const credits$ = document.getElementById('credits');
// const url = 'http://localhost:5000/search/';
const url = 'https://german-genders.vercel.app/api/search/';
// const url = 'https://safe-fjord-57072.herokuapp.com/search/';
let searchTerm = '';

const startSearch = () => {
  loader$.style.display = 'block';
  result$.style.display = 'none';
  notFound$.style.display = 'none';
  serverError$.style.display = 'none';
  similarWord$.style.display = 'none';
  description$.style.display = 'none';
  credits$.style.display = 'none';
  severalMeanings$.style.display = 'none';
};

const endSearch = () => {
  loader$.style.display = 'none';
};

const showDefinition = (data) => {
  result$.style.display = 'block';
  title$.innerHTML = data.title;
  if (searchTerm !== data.title.toLowerCase().trim()) {
    similarWord$.style.display = 'block';
  }

  let article = '';
  if (data.gender.der) {
    article += ' der /';
  }
  if (data.gender.die) {
    article += ' die /';
  }
  if (data.gender.das) {
    article += ' das /';
  }
  article$.innerHTML = article.slice(1, -2);
  if (data.responseType === 900) {
    description$.style.display = 'block';
    description$.innerHTML = data.description;
  } else if (data.responseType === 901) {
    severalMeanings$.style.display = 'block';
  }
  link$.setAttribute('href', data.link);
  credits$.style.display = 'block';
};

const showError = (data) => {
  switch (data.id) {
    case 1:
      notFound$.style.display = 'block';
      break;
    case 2:
      notFound$.style.display = 'block';
      break;
    default:
      serverError$.style.display = 'block';
      break;
  }
};

const showResult = (response) => {
  response.json().then((data) => {
    if (!response.ok) {
      showError(data);
    } else {
      showDefinition(data);
    }
  });
};

const searchDefinition = () => {
  try {
    startSearch();
    searchTerm = input$.value.toLowerCase().trim();
    fetch(url + searchTerm)
      .then((response) => {
        console.log(response);
        endSearch();
        if (response.status === 404) {
          throw {};
        } else {
          showResult(response);
        }
      })
      .catch(() => {
        endSearch();
        serverError$.style.display = 'block';
      });
  } catch (error) {
    endSearch();
    serverError$.style.display = 'block';
  }
};

searchButton$.onclick = searchDefinition;
input$.onkeyup = ({ which }) => {
  if (which === 13) {
    searchDefinition();
  }
};
