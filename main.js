const titleInput = document.querySelector('#title-input');
const authorInput = document.querySelector('#author-input');
const isbnInput = document.querySelector('#isbn-input');
const submitBtn = document.querySelector('.submit-btn');
const records = document.querySelector('.records');
const crosses = Array.from(document.querySelectorAll('.cross'));

// Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// Add a record to list
const addRecord = function(e) {
    e.preventDefault();
    //validate
    if(titleInput.value === '' || authorInput.value === '' || isbnInput.value === '')
        showNotification('Please fill out all the fields');
    else {
        // instantiate a Book.
        const book = new Book(titleInput.value, authorInput.value, isbnInput.value);
        // Store the book record in local storage.
        Store.addBook(book);
        // Create new record's Elements.
        makeNewElements(titleInput.value, authorInput.value, isbnInput.value);
        // Add the new cross button to crosses array and bind removeRecord() function to all crosses.
        showNotification('Book Added!');
        clearInputs();
    }
}

// displays the stored records when the page is loaded.
const displayRecords = function() {
    const books = Store.getBooks();
    // Create new record's Elements.
    books.forEach((book)=>{
        makeNewElements(book.title, book.author, book.isbn)
    // Add the new cross button to crosses array and bind removeRecord() function to all crosses.
    });
}

const makeNewElements = function(bookTitle, authorName, isbnNumber) {
    const record = document.createElement('div');
    const title = document.createElement('p');
    const author = document.createElement('p');
    const isbn = document.createElement('p');
    const cross = document.createElement('a');

    title.appendChild(document.createTextNode(bookTitle));
    author.appendChild(document.createTextNode(authorName));
    isbn.appendChild(document.createTextNode(isbnNumber));
    cross.appendChild(document.createTextNode('x'));

    record.appendChild(title);
    record.appendChild(author);
    record.appendChild(isbn);
    record.appendChild(cross);
    records.appendChild(record);

    crosses.push(cross);
    crosses.forEach((cross)=> cross.addEventListener('click', removeRecord));

    addAttributes(record, title, author, isbn, cross);
    setRecordBG();
}

// Add attributes to newly created record elements.
const addAttributes = function(record, title, author, isbn, cross) {
    record.classList.add('record');
    title.classList.add('title');
    author.classList.add('author');
    isbn.classList.add('isbn');
    cross.classList.add('cross');
    cross.setAttribute('href', '#');
}

const removeRecord = function(e) {
    e.preventDefault();
    e.target.parentElement.remove();
    setRecordBG();
    Store.removeBook(e.target.previousElementSibling.textContent);
    showNotification('Book Removed!');
}

// Add a background color to added record.
const setRecordBG = function() {
    Array.from(records.children).forEach((record, index)=>
    record.style.backgroundColor = `${(index % 2) === 1? 'white' : 'rgba(92, 92, 92, 0.199)'}`
    );
}

// Give notification after adding/removing a record.
const showNotification = function(msg) {
    const notify = document.querySelector('.notify');
    notify.style.display = 'block';
    notify.textContent = msg;
    setTimeout(()=> notify.style.display='none', 2000);
}

//clear Input Fields after a book is added.
const clearInputs= function() {
    titleInput.value = '';
    authorInput.value = '';
    isbnInput.value = '';
}

// Storage class for storing/getting/removing records in local storage
class Store {

    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null)
            books = [];
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index)=> {
            if(book.isbn === isbn)
                books.splice(index, 1);
        }); 
        localStorage.setItem('books', JSON.stringify(books));
    }
}


// Event Listeners
submitBtn.addEventListener('click', addRecord);
crosses.forEach((cross)=> cross.addEventListener('click', removeRecord));
document.addEventListener('DOMContentLoaded', displayRecords());
