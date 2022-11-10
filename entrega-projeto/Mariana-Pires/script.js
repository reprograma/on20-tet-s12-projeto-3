const main = document.getElementById('main-content');
const input = document.querySelector('.search-input');
const button = document.querySelector('.search-button');

let i = 0;
let placeholder = "";
const txt = "Digite o @ do perfil desejado";
const speed = 120;
function type(){
    placeholder += txt.charAt(i);
   input.setAttribute("placeholder", placeholder);
    i++;
    setTimeout(type,speed);
}

function darklight() {
    var element = document.body;
    element.classList.toggle("dark-mode");
 }

button.addEventListener("click", (event) => {
  event.preventDefault()
  const username = input.value.trim()
  username ? getGitHubUser(username) : alert("OPS! Erro 404! Usuário não encontrado")
  input.value = ""
})

getGitHubUser = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)
    const userData = await response.json()
    if (response.status == 404) {
      renderUserNotFound();
    } else if (response.status == 200) {
      createCard(userData)
    }
  }
  catch(err) {
    console.error("Capturei um erro: ",err)
  }
}

createCard = (user) => {
  const { avatar_url, name, login, bio, followers, public_repos } = user
  main.innerHTML = `
    <div class='card'>
      <a href="https://www.github.com/${login}" target="_blank"><img class='profile-img' src=${avatar_url} alt="Foto do perfil do GitHub pesquisado, ao clicar, você é redirecionado ao link do perfil"></a>
      <h2 class='profile-title'>${name}</h2>
      <a href="https://www.github.com/${login}" target="_blank"><h4 class='profile-subtitle'>${login}</h4></a> 
      <p class='profile-description'>${bio ? bio : ""}</p>
      <div class='profile-infos'>
        <div class='info-box'>
          <img src='./img/people_outline.png' class='box-icon'>
          <p class='box-text'>${followers}</p>
        </div>
        <a class='link-repositories'>
          <div class='info-box'>
            <img src='./img/Vector.png' class='box-icon'>
            <p class='box-text'>${public_repos}</p>
          </div> 
        </a>
      </div>
    </div>
  `
  const linkRepositories = document.querySelector('.link-repositories')
  
  linkRepositories.addEventListener('click', clickLink = (event) => {
    event.preventDefault()
    getRepositories(login) 
    linkRepositories.removeEventListener('click', clickLink) 
  })
}

getRepositories = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`)
    const repositories = await response.json()
    if(repositories.length > 0) {
      createRepositoriesCards(repositories)
    } else {
      renderNotFoundRepositories(username)
    }
  }
  catch(err) {
    console.error("Capturei um erro: ",err)
  }
}

createRepositoriesCards = (repositories) => { 

  const repositoriesList = document.createElement('div')
  repositoriesList.setAttribute('id', 'repositories-list')
  main.appendChild(repositoriesList) 

  repositories.forEach((repository) => {
    const { name, description, language, stargazers_count } = repository
    return repositoriesList.innerHTML += `
      <div class='repository'>
        <h2 class='repository-title'>${name}</h2>
        <p class='repository-description'>${description ? description : ""}</p> 
        <div class='repository-details'>
          <p class='repository-text'>${language ? language : "Outra linguagem"}</p>
          <p class='repository-icon'>
            <img src="./img/star.png">
            ${stargazers_count}
          </p>
        </div>
      </div>
    `
  })
}

renderNotFoundRepositories = (username) => main.innerHTML += `<div class='not-found-repositories'><h2 class='not-found-subtitle'>${username} não possui nenhum repositório público ainda.</h2></div>`

renderUserNotFound = () => {
  return main.innerHTML = `
    <div class='not-found-box'>
      <h2 class='not-found-title'>OPS, NÃO ACHAMOS</h2>
      <h4 class='not-found-subtitle'>Que tal tentar de novo?</h4>
      <img class='not-found-img' src='./img/notfound.png'>
    </div>
  `
}

type()
