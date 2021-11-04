const loadBtn = document.getElementById('btnLoad'); 
const createBtn = document.getElementById('btnCreate'); 
const phoneList = document.getElementById('phonebook'); 
const personInput = document.querySelector('#person'); 
const phoneInput = document.querySelector('#phone'); 

function attachEvents() {
    loadBtn.addEventListener('click', getPhones);
    phoneList.addEventListener('click', removeContact);
    createBtn.addEventListener('click', (e) => createContact(personInput.value, phoneInput.value, e));
}

async function createContact(person, phone, e){
    e.preventDefault();

    personInput.value = '';
    phoneInput.value = '';

    const contact = {
        person: person,
        phone: phone,
    };
    const url = 'http://localhost:3030/jsonstore/phonebook';

    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact)
    });

    const data = await response.json();

    await getPhones()
}

async function getPhones(){
    let url = 'http://localhost:3030/jsonstore/phonebook'
    const response = await fetch(url);
    const data = await response.json(); 
    renderPhones(Object.values(data));
}

function renderPhones(phones){
    phoneList.innerHTML = '';
    phones.forEach(phone => {
       phoneList.appendChild(createContactElement(phone));
   });
}

function createContactElement(contentObj){
   let element = document.createElement('li');
   element.textContent = `${contentObj.person}: ${contentObj.phone}`;
   let deleteBtn = document.createElement('button');
   deleteBtn.textContent = 'Delete';
   deleteBtn.setAttribute('id', contentObj._id);
   element.appendChild(deleteBtn);

   return element;
}

async function removeContact(e){
    let contactId = undefined;

    if(e.target.tagName == 'BUTTON'){
        contactId = e.target.id;

        let url = 'http://localhost:3030/jsonstore/phonebook/' + contactId;

        const response = await fetch(url, {
            method: 'delete'
        });
    
       e.target.parentElement.remove();
    } 
}

attachEvents();