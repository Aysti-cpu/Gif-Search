

let searchBar;
let gifContainer;

(() => {
    console.log("JS loaded");

    // Init UI Elements
    searchBar = document.getElementById('search-bar');
    gifContainer = document.getElementById('gif-container');
})()

// Copies text to clipboard
const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

const copyUrlToClipboard = (clickedElement) => {
    const iFrame = clickedElement.target.parentElement.getElementsByTagName('iframe')[0];
    const copySpan = clickedElement.target.parentElement.getElementsByTagName('span')[2];
    copySpan.style.opacity = 1;

    copyToClipboard(iFrame.src);
};

const addFav = async (clickedElement) => {
    const iFrame = clickedElement.target.parentElement.getElementsByTagName('iframe')[0];
    const url = iFrame.src;

    const body = JSON.stringify({ url });
    const response = await fetch(`http://localhost:8080/fav`, {
        method: "POST",
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(await response.json())
};



const createGifElement = (url) => {
    const divElement = document.createElement('div');
    divElement.style.flex = 1;
    divElement.style.display = "flex";
    divElement.style.flexDirection = "column";
    divElement.style.padding = "16px";
    const gifElement = document.createElement('iframe');
    gifElement.style.flex = 1;
    gifElement.src = url;
    gifElement.frameBorder = 0;
    

    const span = document.createElement('span');
    span.style.flex = 1;
    span.style.textAlign = "center";
    span.style.cursor = "pointer";
    span.textContent = "⭐️";
    span.onclick = addFav;
    

    const span2 = document.createElement('span');
    span2.style.flex = 1;
    span2.style.textAlign = "center";
    span2.textContent = "📩";
    span2.style.cursor = "pointer";
    span2.onclick = copyUrlToClipboard;

    const span3 = document.createElement('span');
    span3.style.flex = 1;
    span3.style.textAlign = "center";
    span3.textContent = url;
    span3.style.opacity = 0;


    divElement.appendChild(gifElement);
    divElement.appendChild(span);
    divElement.appendChild(span2);
    divElement.appendChild(span3);

    return divElement;
};

searchBar.addEventListener("keyup", async e => {
    if (e.keyCode === 13) {
        await searchGifs(searchBar.value);
    }
  });


const searchGifs = async (searchTerm) => {
    const gifs = await retrieveGifs(searchTerm);
    
    
    while (gifContainer.firstChild) {
        gifContainer.removeChild(gifContainer.lastChild);
      }


    for(let gif of gifs) {
        gifContainer.appendChild(createGifElement(gif.embed_url));
    }
};

const retrieveGifs = async (searchTerm) => {
    const body = JSON.stringify({ searchTerm });
    const response = await fetch(`http://localhost:8080/search`, {
        method: "POST",
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
};