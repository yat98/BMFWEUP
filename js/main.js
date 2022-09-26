const books = []
const RENDER_EVENT = 'render-book'

const inputBookIsComplete = document.getElementById('inputBookIsComplete')
const bookSubmit = document.getElementById('bookSubmit')

const generateId = () => +new Date()

const generateBookObject = (id, title, author, year, isComplete) => {
    return { id, title, author, year, isComplete }
}

const updatedBookSubmitTitle = () => {
    const spanEl = bookSubmit.childNodes[1]
    if(inputBookIsComplete.checked) spanEl.innerText = 'Selesai dibaca'
    else spanEl.innerText = 'Belum selesai dibaca'
}

const findBook = (id) => books.find((book) => book.id == id)

const findBookIndex = (id) => books.findIndex((book) => book.id == id)

const addBookToComplete = (id) => {
    const book = findBook(id)

    if(book === undefined) return

    book.isComplete = true
    document.dispatchEvent(new Event(RENDER_EVENT))
}

const undoBookCompleted = (id) => {
    const book = findBook(id)

    if(book === undefined) return

    book.isComplete = false
    document.dispatchEvent(new Event(RENDER_EVENT))
}

const removeBook = (id) => {
    const book = findBookIndex(id)

    if(book === -1) return

    books.splice(book, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
}

const addBook = () => {
    const id = generateId()
    const title = document.getElementById('inputBookTitle').value
    const author = document.getElementById('inputBookAuthor').value
    const year = document.getElementById('inputBookYear').value
    const isComplete = inputBookIsComplete.checked

    const bookObject = generateBookObject(id, title, author, year, isComplete)
    books.push(bookObject)
    
    document.dispatchEvent(new Event(RENDER_EVENT))
}

const makeBook = (bookObject) => {
    const bookContainer = document.createElement('article')
    bookContainer.classList.add('book_item')

    const bookTitle = document.createElement('h3')
    bookTitle.innerText = bookObject.title

    const bookAuthor = document.createElement('p')
    bookAuthor.innerText = `Penulis: ${bookObject.title}`

    const bookYear = document.createElement('p')
    bookYear.innerText = `Tahun: ${bookObject.year}`

    const bookAction = document.createElement('div')
    bookAction.classList.add('action')

    const actionButtonUpdate = document.createElement('button')
    actionButtonUpdate.classList.add('green')
    if(bookObject.isComplete){
        actionButtonUpdate.innerHTML = 'Belum selesai dibaca'
        actionButtonUpdate.addEventListener('click', function(e){
            undoBookCompleted(bookObject.id)
        })
    }else{
        actionButtonUpdate.innerHTML = 'Selesai dibaca'
        actionButtonUpdate.addEventListener('click', function(e){
            addBookToComplete(bookObject.id)
        })
    }
    const actionButtonRemove = document.createElement('button')
    actionButtonRemove.classList.add('red')
    actionButtonRemove.innerText = 'Hapus buku'
    actionButtonRemove.addEventListener('click', function(e){
        removeBook(bookObject.id)
    })
    bookAction.append(actionButtonUpdate,actionButtonRemove)

    bookContainer.append(bookTitle, bookAuthor, bookYear, bookAction)

    return bookContainer
}

document.addEventListener(RENDER_EVENT, function(e){
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList')
    incompleteBookshelfList.innerHTML = ''

    const completeBookshelfList = document.getElementById('completeBookshelfList')
    completeBookshelfList.innerHTML = ''

    for(const book of books){
        const bookEl = makeBook(book)

        if(book.isComplete) completeBookshelfList.append(bookEl)
        else incompleteBookshelfList.append(bookEl)
    }
})

document.addEventListener('DOMContentLoaded', () => {
    updatedBookSubmitTitle()
    
    inputBookIsComplete.addEventListener('change', (e) => updatedBookSubmitTitle())
    
    bookSubmit.addEventListener('click', function(e){
        e.preventDefault()
        addBook()
    })
})