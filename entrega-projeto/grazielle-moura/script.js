let main = document.getElementById('main-content');
let input = document.querySelector('.search-input');
let button = document.querySelector('.search-button');


button.addEventListener("click", (event) => {
  event.preventDefault()
  let username = input.value.trim()
  username ? getGitHubUser(username) : alert("Digite uma usuária válida!")
  input.value = ""
})

getGitHubUser = async (username) => {
  try {
    let response = await fetch(`https://api.github.com/users/${username}`)
    let userData = await response.json()
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
  let { avatar_url, name, login, bio, followers, public_repos } = user
  main.innerHTML = `
    <div class='card'>
      <img class='profile-img' src=${avatar_url} alt="foto da usuária no github">
      <h2 class='profile-title'>${name}</h2>
      <h4 class='profile-subtitle'>${login}</h4> 
      <p class='profile-description'>${bio ? bio : ""}</p>
      <div class='profile-infos'>
        <div class='info-box'>
          <img src='../../assets/people_outline.png' class='box-icon'>
          <p class='box-text'>${followers}</p>
        </div>
        <a class='link-repositories'>
          <div class='info-box'>
            <img src='../../assets/Vector.png' class='box-icon'>
            <p class='box-text'>${public_repos}</p>
          </div> 
        </a>
      </div>
    </div>
  `
  let linkRepositories = document.querySelector('.link-repositories')
  
  linkRepositories.addEventListener('click', clickLink = (event) => {
    event.preventDefault()
    getRepositories(login) 
    linkRepositories.removeEventListener('click', clickLink) 
  })
}

getRepositories = async (username) => {
  try {
    let response = await fetch(`https://api.github.com/users/${username}/repos`)
    let repositories = await response.json()
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

  let repositoriesList = document.createElement('div')
  repositoriesList.setAttribute('id', 'repositories-list')
  main.appendChild(repositoriesList) 


  repositories.forEach((repository) => {
    let { name, description, language, stargazers_count } = repository
    return repositoriesList.innerHTML += `
      <div class='repository'>
        <h2 class='repository-title'>${name}</h2>
        <p class='repository-description'>${description ? description : ""}</p> 
        <div class='repository-details'>
          <p class='repository-text'>${language ? language : "não-definida"}</p>
          <p class='repository-icon'>
            <img src="../../assets/star.png">
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
      <h2 class='not-found-title'>Usuária não encontrada 😖</h2>
      <h4 class='not-found-subtitle'>Pesquise novamente</h4>
      <img class='not-found-img' src='../../assets/notfound.png'>
    </div>
  `
}

let savedTheme = localStorage.getItem("theme");
let saveTheme = document.getElementById("save-theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  saveTheme.checked = true;
} else {
  let browserTheme = window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
  document.documentElement.setAttribute("data-theme", browserTheme);
}

saveTheme.addEventListener("change", (evt) => {
  if (evt.target.checked) {
    let currentTheme = document.documentElement.getAttribute("data-theme");
    localStorage.setItem("theme", currentTheme);
  } else {
    localStorage.removeItem("theme");
  }
});

let themeToggler = document.getElementById("theme-toggler");
themeToggler.addEventListener("click", () => {
  let targetTheme;
  let currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "light") {
    targetTheme = "dark";
  } else {
    targetTheme = "light";
  }
  if (saveTheme.checked) {
    localStorage.setItem("theme", targetTheme);
  }
  document.documentElement.setAttribute("data-theme", targetTheme);
});

