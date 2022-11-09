const main = document.getElementById('main-content');
const input = document.querySelector('.search-input');
const button = document.querySelector('.search-button');

button.addEventListener("click", (event) => {
  event.preventDefault()
  const username = input.value.trim()
  username ? getGitHubUser(username) : alert("Digite uma usuária válida!")
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
      <img class='profile-img' src=${avatar_url} alt="foto da usuária no github">
      <h2 class='profile-title'>${name}</h2>
      <h4 class='profile-subtitle'>${login}</h4> 
      <p class='profile-description'>${bio ? bio : ""}</p>
      <div class='profile-infos'>
        <a class='link-followers'>
          <div class='info-box'>
            <img src='./assets/people_outline.png' class='box-icon'>
            <p class='box-text'>${followers}</p>
          </div>
        </a>
        <a class='link-repositories'>
          <div class='info-box'>
            <img src='./assets/Vector.png' class='box-icon'>
            <p class='box-text'>${public_repos}</p>
          </div> 
        </a>
      </div>
    </div>
  `
  const linkFollowers = document.querySelector('.link-followers')
  const linkRepositories = document.querySelector('.link-repositories')
  
  linkFollowers.addEventListener('click', clickLinkFollowers = (event) => {
    event.preventDefault()
    getFollowers(login) 
    const content = document.getElementById('repositories-list')
    content.remove()
  })

  linkRepositories.addEventListener('click', clickLinkRepositories = (event) => {
    event.preventDefault()
    getRepositories(login) 
    const content = document.getElementById('repositories-list')
    content.remove()
  
  })
}

getFollowers = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/followers`)
    const followers = await response.json()
    if(followers.length > 0) {
      createFollowersCards(followers)
    } else {
      renderNotFoundFollowers(username)
    }
  }
  catch(err) {
    console.error("Capturei um erro: ",err)
  }
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

createFollowersCards =  (followers) => { 

  const followersList = document.createElement('div')
  followersList.setAttribute('id', 'repositories-list')
  main.appendChild(followersList) 

  followers.forEach(async (follower) => {
    const response = await fetch(`https://api.github.com/users/${follower.login}`)
    const user = await response.json()

    const { name, avatar_url } = user
    return followersList.innerHTML += `
      <div class='followers'>
      <img src="${avatar_url}" >
        <h2 class='followers-title'>${name}</h2>
      </div>
    `
  })
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
          <p class='repository-text'>${language ? language : "não-definida"}</p>
          <p class='repository-icon'>
            <img src="./assets/star.png">
            ${stargazers_count}
          </p>
        </div>
      </div>
    `
  })
}

renderNotFoundFollowers = (username) => main.innerHTML += `<div class='not-found-repositories'><h2 class='not-found-subtitle'>${username} não possui nenhum(a) seguidor(a).</h2></div>`
renderNotFoundRepositories = (username) => main.innerHTML += `<div class='not-found-repositories'><h2 class='not-found-subtitle'>${username} não possui nenhum repositório público ainda.</h2></div>`

renderUserNotFound = () => {
  return main.innerHTML = `
    <div class='not-found-box'>
      <h2 class='not-found-title'>Usuária não encontrada 😖</h2>
      <h4 class='not-found-subtitle'>Pesquise novamente</h4>
      <img class='not-found-img' src='./assets/notfound.png'>
    </div>
  `
}

