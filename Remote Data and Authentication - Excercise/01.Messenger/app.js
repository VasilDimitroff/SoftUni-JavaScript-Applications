let messageElement = document.querySelector('[name="content"]');
let nameElement = document.querySelector('[name="author"]');
const sendButton = document.querySelector('#submit');
const refreshButton = document.querySelector('#refresh');
const messages = document.querySelector('#messages');

function attachEvents() {
   sendButton.addEventListener('click', (e) => sendData(nameElement.value, messageElement.value, e));
   refreshButton.addEventListener('click', loadMessages);
}

async function sendData(nameText, messageText, e){
    messageElement.value = '';

    const url = 'http://localhost:3030/jsonstore/messenger';

    const obj = {
        author: nameText,
        content: messageText
    };

    const response = await fetch(url, {
        method: 'post',
        headers: {    
                'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    });

    const data = await response.json();
    loadMessages();
}

async function loadMessages(){
    const url = 'http://localhost:3030/jsonstore/messenger';

    const response = await fetch(url);
    const data = await response.json();

    let infoArray = Object.values(data).map( a => `${a.author}: ${a.content}`);

    let result = infoArray.join('\n');
     messages.value = result;
}

attachEvents();