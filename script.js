// initial dom stuff
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


// api request
var request = new XMLHttpRequest();

request.open('GET', "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false", true);

request.onload = () => {
    var data = JSON.parse(request.response);
    
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

// localStorage stuff
function addToken(event) {
    const tokenName = event.target.parentElement.firstElementChild.textContent;
    
    const tokenObject = JSON.parse(request.response).find(token => {
        return token.name === tokenName;
    });

    localStorage.setItem(tokenName, JSON.stringify(tokenObject));

    alert("Token added to your list!");
};

function removeToken(event) {
    container.innerHTML = "";
    const tokenName = event.target.parentElement.firstElementChild.textContent;

    localStorage.removeItem(tokenName);
    loadMyList();
};


function loadMyList() {
    container.innerHTML = "";
        
    let myArray = [];

    for (let i = 0; i < localStorage.length; i++) {
        myArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    };

    myArray.forEach((token) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const h1 = document.createElement('h1');
        h1.textContent = token.name;
        h1.style.backgroundImage = `url(${token.image})`;
        // console.log(token);

        const rank = document.createElement('p');
        rank.textContent = `#${token.market_cap_rank}`;

        const price = document.createElement('p');
        price.textContent = `\$${token.current_price}`;

        const btn = document.createElement('button');
        btn.id = 'add';
        btn.textContent = "X";

        container.appendChild(card);
        card.appendChild(h1);
        card.appendChild(rank);
        card.appendChild(price);
        card.appendChild(btn);       
    });
};

function switchList() {
    
    if (container.childNodes.length === 100) {
        loadMyList();        
    } else {
        container.innerHTML = "";
        request.onload();
    };   
};

function getAddressApi(addr, card) {
    var ethRequest = new XMLHttpRequest();

    ethRequest.open('GET', `https://api.etherscan.io/api?module=account&action=balance&address=${addr}&tag=latest&apikey=V771F82IC3UICCNZVJ4BMFNTVXZA4Q6K9Y`,true);

    // console.log(ethRequest);
    ethRequest.onload = () => {
        var ethData = JSON.parse(ethRequest.response);
        let ethValue = (ethData.result / 1000000000000000) / 1000;
        console.log(ethData.result, ethValue);

        const p = document.createElement('p');
        p.classList.add("ethValue");
        p.textContent = `Eth Balance: ${ethValue}`;

        card.appendChild(p);
    };

    ethRequest.send();
};

function showAddress(address) {
    container.innerHTML = "";

    const card = document.createElement('div');
    card.classList.add('card');

    const h1 = document.createElement('h1');
    h1.textContent = address;    

    container.appendChild(card);
    card.appendChild(h1);

    getAddressApi(address, card);
};


const clickFunction = (e) => {

    if (e.target.textContent === "+") {
        addToken(e);       
    };

    if (e.target.textContent === "My List") {
        switchList();
    };

    if (e.target.textContent === "X") {
        removeToken(e);
    };

    if (e.target === document.getElementsByTagName("img")[0]) {
        let address = prompt("enter ethereum address", "0xc1e42f862d202b4a0ed552c1145735ee088f6ccf");
        showAddress(address);
    };
};

document.addEventListener('click', clickFunction);
