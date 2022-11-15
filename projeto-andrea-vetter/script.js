const main = document.getElementById('main-content');
const mainCard = document.getElementById('main-card');
const carousel = document.getElementById('carousel');
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
  catch (err) {
    console.error("Capturei um erro: ", err)
  }
}

createCard = (user) => {
  const { avatar_url, name, login, bio, followers, public_repos } = user
  mainCard.innerHTML = `
    <div class='card'>
      <img class='profile-img' src=${avatar_url} alt="foto da usuária no github">
      <h2 class='profile-title'>${name}</h2>
      <h4 class='profile-subtitle'>${login}</h4> 
      <p class='profile-description'>${bio ? bio : ""}</p>
      <div class='profile-infos'>
        <div class='info-box'>
          <img src='../assets/people_outline.png' class='box-icon'>
          <p class='box-text'>${followers}</p>
        </div>
        <a class='link-repositories'>
          <div class='info-box'>
            <img src='../assets/Vector.png' class='box-icon'>
            <p class='box-text'>${public_repos}</p>
          </div> 
        </a>
      </div>
    </div>
  `
  carousel.innerHTML = ""

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
    if (repositories.length > 0) {
      console.log(repositories)
      createRepositoriesCards(repositories)
    } else {
      renderNotFoundRepositories(username)
    }
  }
  catch (err) {
    console.error("Capturei um erro: ", err)
  }
}

createRepositoriesCards = (repositories) => {
  const repositoriesList = document.createElement('div')
  repositoriesList.setAttribute('id', 'repositories-list')
  repositoriesList.setAttribute('class', "c-carousel__slides js-carousel--simple")
  carousel.appendChild(repositoriesList)

  repositories.forEach((repository) => {
    const { name, description, language, stargazers_count } = repository
    repositoriesList.innerHTML += `
      <div class='repository c-carousel__slide'>
        <h2 class='repository-title'>${name}</h2>
        <p class='repository-description'>${description}</p> 
        <div class='repository-details'>
          <p class='repository-text'>${language}</p>
          <p class='repository-icon'>
            <img src="../assets/star.png">
            ${stargazers_count}
          </p>
        </div>
      </div>
    `
  })
  
  carousel.innerHTML += `
      <div class="js-carousel--simple-dots"></div>
      `
      // Retirei os botões arrow porque não consegui fazer com que ficassem no lugar que queria.
      // <button class="js-carousel--simple-prev">«</button>
      // <button class="js-carousel--simple-next">»</button>

  const simpleCarousel = document.querySelector(".js-carousel--simple");

  new Glider(simpleCarousel, {
    slidesToShow: '4',
    slidesToScroll: '4',
    itemWidth: undefined,
    exactWidth: false,
    draggable: true,
    dots: ".js-carousel--simple-dots",
    // arrows: {
    //   prev: ".js-carousel--simple-prev",
    //   next: ".js-carousel--simple-next",
    // },
    scrollLock: true,
  })

}

renderNotFoundRepositories = (username) => main.innerHTML += `<div class='not-found-repositories'><h2 class='not-found-subtitle'>${username} não possui nenhum repositório público ainda.</h2></div>`

renderUserNotFound = () => {
  return main.innerHTML = `
    <div class='not-found-box'>
      <h2 class='not-found-title'>Usuária não encontrada 😖</h2>
      <h4 class='not-found-subtitle'>Pesquise novamente</h4>
      <img class='not-found-img' src='../assets/notfound.png'>
    </div>
  `
}

const toggle = document.getElementById("toggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
}
)