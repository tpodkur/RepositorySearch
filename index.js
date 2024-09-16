let REPOSITORIES;

function getRepositories(searchText) {
  return new Promise(resolve => {
    if (!searchText) return resolve();

    fetch(`https://api.github.com/search/repositories?q=${searchText}`)
      .then(res => res.json())
      .then(repositories => {
        REPOSITORIES = repositories.items;
        resolve(repositories.items);
      })
      .catch(console.log);
  });
}

function debounce(fn, ms, callback) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args).then(callback), ms);
  };
}

function createAutocompleteElement(id, name) {
  let elem = document.createElement('li');
  let button = document.createElement('button');
  button.classList.add('autocomplete__item');
  button.textContent = name;
  elem.dataset.repoId = id;
  elem.appendChild(button);
  return elem;
}

function createRepoInfoElement(text) {
  let nameElem = document.createElement('p');
  nameElem.classList.add('repo__info');
  nameElem.textContent = text;
  return nameElem;
}

function createRepoElement(repo) {
  let elem = document.createElement('li');
  elem.classList.add('repo');
  elem.dataset.repoId = repo.id;

  let div = document.createElement('div');
  let nameElem = createRepoInfoElement(`Name: ${repo.name}`);
  let ownerElem = createRepoInfoElement(`Owner: ${repo.owner.login}`);
  let starsElem = createRepoInfoElement(`Stars: ${repo.watchers}`);
  div.appendChild(nameElem);
  div.appendChild(ownerElem);
  div.appendChild(starsElem);

  let button = document.createElement('button');
  button.classList.add('repo__close-button');

  elem.appendChild(div);
  elem.appendChild(button);

  return elem;
}

function isRepositoryInList(listElement, repoElement) {
  for (let item of listElement.children) {
    if (item.dataset.repoId === repoElement.dataset.repoId) return true;
  }
  return false;
}









let autocompleteList = document.querySelector('.autocomplete');
let repoList = document.querySelector('.repo-list');
let input = document.querySelector('.search__input');

autocompleteList.addEventListener('click', (event) => {
  let repo = REPOSITORIES.find(elem => {
    return elem.id == event.target.parentElement.dataset.repoId;
  });

  let repoElement = createRepoElement(repo);
  if (!isRepositoryInList(repoList, event.target.parentElement)) {
    repoList.appendChild(repoElement);
    input.value = '';
    autocompleteList.innerHTML = '';
  }
});

const getRepositoriesDebounced = debounce(getRepositories, 100, (repositories) => {
  autocompleteList.innerHTML = '';
  if (!repositories || repositories.length === 0) return;
  const autocompleteLength = (repositories.length < 5) ? repositories.length : 5;
  for (let i = 0; i < autocompleteLength; i++) {
    let listItem = createAutocompleteElement(repositories[i].id, repositories[i].name);
    autocompleteList.appendChild(listItem);
  }
});

input.addEventListener('keyup', (event) => {
  getRepositoriesDebounced(event.target.value);
});

repoList.addEventListener('click', (event) => {
  if (event.target.classList.contains('repo__close-button')) {
    const listItem = event.target.parentElement;
    repoList.removeChild(listItem);
  }
});
