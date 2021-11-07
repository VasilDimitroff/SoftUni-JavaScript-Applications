 loadBooks();

let form = document.querySelector('#create');
let editForm = document.querySelector('#edit');
let loadBtn = document.querySelector('#loadBooks');
let tbody = document.querySelector('tbody');

form.addEventListener('submit', createBook);
loadBtn.addEventListener('click', loadBooks);
tbody.addEventListener('click', editOrRemoveBook);

async function createBook(e){
    e.preventDefault();
    let formData = new FormData(form);

    let title = formData.get('title');
    let author = formData.get('author');

    const url = 'http://localhost:3030/jsonstore/collections/books';

    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            author: author,
            title: title
        })
    });

   form.reset();
 loadBooks();
}

async function loadBooks(){
    const url = 'http://localhost:3030/jsonstore/collections/books';

    const response = await fetch(url);
    const data = await response.json();
    
    showBooks(data);
}

function showBooks(books){
    tbody.innerHTML = '';
    let booksArr = Object.entries(books);

   booksArr.forEach(book => {
        let trElement = document.createElement('tr');

        trElement.innerHTML = `<tr>
        <td>${book[1].title}</td>
        <td>${book[1].author}</td>
        <td>
            <button data-edit="${book[0]}">Edit</button>
            <button data-delete="${book[0]}">Delete</button>
        </td>
        </tr>`;

        tbody.appendChild(trElement);
    });
} 

async function getBook(id){
    const url  = 'http://localhost:3030/jsonstore/collections/books/' + id;

    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function editOrRemoveBook(e){
    if (e.target.tagName == 'BUTTON') {
        if (e.target.dataset.delete) {
           const deletedBook = await deleteBook(e.target.dataset.delete);
           loadBooks();
        }
        else if (e.target.dataset.edit) {
           await showEditForm(e.target.dataset.edit);
        }
        
    }
}

async function deleteBook(id){
    let url = 'http://localhost:3030/jsonstore/collections/books/' + id;

    const response = await fetch(url, {
        method: 'delete'
    });

    const data = await response.json();

    return data;
}

async function showEditForm(id){
    let url = 'http://localhost:3030/jsonstore/collections/books/' + id;

    const response = await fetch(url);

    const data = await response.json();
    form.style.display = 'none';
    editForm.style.display = 'block';

    let inputFields = editForm.querySelectorAll('input');
    inputFields[0].value = `${data.title}`;
    inputFields[1].value = `${data.author}`;

    let submitBtn = editForm.querySelector('button');
    
    submitBtn
    .addEventListener('click',(e) => onEdit(id, inputFields[0].value, inputFields[1].value, e));
}

async function onEdit(id, title, author, event){
    event.preventDefault();
    let url = 'http://localhost:3030/jsonstore/collections/books/' + id;

    let updatedBook = {
        author: author,
        title: title,
        _id: id 
    };

    const response = await fetch(url, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBook)
    });

    const data = await response.json();

    form.style.display = 'block';
    editForm.style.display = 'none';
    await loadBooks();
    return data;
}