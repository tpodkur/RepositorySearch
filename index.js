
let REPOSITORIES;

function getRepositories(searchText) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.github.com/search/repositories?q=${searchText}`)
      .then(res => res.json())
      .then(repositories => {
        REPOSITORIES = repositories.items;
        resolve(repositories.items);
      })
      .catch(console.log);
  });
}

function createAutocompleteElement(id, name) {
  let elem = document.createElement('li');
  let button = document.createElement('button');
  button.classList.add('autocomplete__item');
  button.textContent = name;
  button.dataset.repoId = id;
  elem.appendChild(button);
  return elem;
}

function createRepoInfoElement(text) {
  let nameElem = document.createElement('p');
  nameElem.classList.add('repo__info');
  nameElem.textContent = text;
  return nameElem;
}

function createRepoElement(name, owner, stars) {
  let elem = document.createElement('li');
  elem.classList.add('repo-list__item');
  elem.classList.add('repo');

  let div = document.createElement('div');
  let nameElem = createRepoInfoElement(`Name: ${name}`);
  let ownerElem = createRepoInfoElement(`Owner: ${owner}`);
  let starsElem = createRepoInfoElement(`Stars: ${stars}`);
  div.appendChild(nameElem);
  div.appendChild(ownerElem);
  div.appendChild(starsElem);

  let button = document.createElement('button');
  button.classList.add('repo__close-button');

  elem.appendChild(div);
  elem.appendChild(button);

  return elem;
}









let autocompleteList = document.querySelector('.autocomplete');
let repoList = document.querySelector('.repo-list');

getRepositories('Q').then(repositories => {
  for (let i = 0; i < 5; i++) {
    let listItem = createAutocompleteElement(repositories[i].id, repositories[i].name);
    console.log(listItem)
    autocompleteList.appendChild(listItem);
  }
});

autocompleteList.addEventListener('click', (event) => {
  let repo = REPOSITORIES.find(elem => {
    return elem.id == event.target.dataset.repoId;
  });

  let elem = createRepoElement(repo.name, repo.owner.login, repo.watchers);
  repoList.appendChild(elem);
});
