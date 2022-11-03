const main = document.getElementById('main-content');
const input = document.querySelector('.search-input');
const button = document.querySelector('.search-button');

button.addEventListener("click", (event) => {
    event.preventDefault()
    const username = input.value.trim()
    username ? getGitHubUser(username) : alert('Digite uma usuária válida!')
    input.value= ""
})

getGitHubUser = async (user) => {
    try {
        const response = await fetch(`https://api.github.com/users/${user}`)
        const data = await response.json()
        createCard(data)

    }
    catch(err) {
        console.error("Capturei um erro:", err)
    }
} 

createCard = (user) => {
    const { avatar_url, name, login, bio, public_repos, followers } = user
    main.innerHTML = `
    <div class='card'>
        <img class='profile-img' src=${avatar_url} alt='foto da usuária no github'>
        <h3 class='profile-title'>${name}</h3>
        <h4 class='profile-subtitle'>${login}</h4>
        <p class='profile-description'> ${bio ? bio : ""}</p>
        <div class='profile-infos'> 
            
            <div class='info-box'>
                <img src='../../assets/people_outline.png' class='box-icon'>
                <p class='box-text'>${followers}</p>
            </div>

            <div class='info-box'> 
                <img src='../../assets/Vector.png' class='box-icon'>
                <p class='box-text'>${public_repos}</p>          
            </div>

        </div>
        
    </div>
    
    `
}