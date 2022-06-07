const app = document.getElementById('root');
const logo = document.createElement('img');
logo.src = "logo.png";

const container = document.createElement('div');
container.classList.add("container");

const myListDiv = document.createElement('button');
myListDiv.id = 'myList';
myListDiv.textContent = "My List";

app.appendChild(logo);
app.appendChild(myListDiv);
app.appendChild(container);



var request = new XMLHttpRequest();

request.open('GET', "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false", true);

request.onload = () => {
    var data = JSON.parse(request.response);
    console.log(data);
    
    if (!data) {
        const errorMessage = document.createElement('marquee');
        errorMessage.textContent = 'Gah its not working!!!';
        return app.appendChild(errorMessage);
    }

    data.forEach((token, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const h1 = document.createElement('h1');
        h1.textContent = token.name;
        h1.style.backgroundImage = `url(${token.image})`;
        // console.log(token);

        const rank = document.createElement('p');
        rank.textContent = `#${index+1}`;

        const price = document.createElement('p');
        price.textContent = `\$${token.current_price}`;

        const btn = document.createElement('button');
        btn.id = 'add';
        btn.textContent = "+";

        container.appendChild(card);
        card.appendChild(h1);
        card.appendChild(rank);
        card.appendChild(price);
        card.appendChild(btn);        
    })
};

request.send();


function addToken(event) {
    const tokenName = event.target.parentElement.firstElementChild.textContent;
        
    const tokenObject = JSON.parse(request.response).find(token => {
        return token.name === tokenName;
    });
    
    localStorage.setItem(tokenName, JSON.stringify(tokenObject));
};

function switchList() {
    container.innerHTML = "";

    //USE LOCALSTORAGE.KEY
    // localStorage.forEach((token, index) => {
    //     const card = document.createElement('div');
    //     card.classList.add('card');

    //     const h1 = document.createElement('h1');
    //     h1.textContent = token.name;
    //     h1.style.backgroundImage = `url(${token.image})`;
    //     // console.log(token);

    //     const rank = document.createElement('p');
    //     rank.textContent = `#${index+1}`;

    //     const price = document.createElement('p');
    //     price.textContent = `\$${token.current_price}`;

    //     const btn = document.createElement('button');
    //     btn.id = 'add';
    //     btn.textContent = "+";

    //     container.appendChild(card);
    //     card.appendChild(h1);
    //     card.appendChild(rank);
    //     card.appendChild(price);
    //     card.appendChild(btn);       
// });
};



const clickFunction = (e) => {
    if (e.target.textContent === "+") {
        addToken(e);       
    };

    if (e.target.textContent === "My List") {
        switchList();
    }

    console.log(localStorage);
};

document.addEventListener('click', clickFunction);