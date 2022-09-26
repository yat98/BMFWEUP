let books = []
const STORAGE_KEY = 'BOOKSHELF_APPS'
const RENDER_EVENT = 'render-book'
const SAVED_EVENT = 'saved-book'

const inputBookIsComplete = document.getElementById('inputBookIsComplete')

const isStorageExists = () =>{
    if(typeof(Storage) === undefined){
        alert('Browser yang anda gunakan tidak mendukung')
        return false
    }
    return true
}

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY)
    let data = JSON.parse(serializedData)

    if(data !== null){
        for(const book of data){
            books.push(book)
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT))
}

const saveData = (option, book) => {
    if(isStorageExists()){
        const data = {add: option.add, undo: option.undo, complete: option.complete, remove: option.remove, book: book}
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new CustomEvent(SAVED_EVENT, { detail: data }))
    }
}

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

const findBookTitle = (title) => books.filter(
    (book) => book.title.toLowerCase().includes(title.toLowerCase())
)

const addBookToComplete = (id) => {
    const book = findBook(id)

    if(book === undefined) return

    book.isComplete = true
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData({complete: true}, book)
}

const undoBookCompleted = (id) => {
    const book = findBook(id)

    if(book === undefined) return

    book.isComplete = false
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData({undo: true}, book)
}

const removeBook = (id) => {
    const bookIndex = findBookIndex(id)

    if(bookIndex === -1) return

    const bookTemp = books[bookIndex]
    books.splice(bookIndex, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData({remove: true}, bookTemp)
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
    saveData({add: true}, bookObject)
}

const searchBookByTitle = (title) => {
    const bookTemp = books
    const booksSearch = findBookTitle(title)
    books = booksSearch
    document.dispatchEvent(new Event(RENDER_EVENT))
    books = bookTemp
}

const makeBook = (bookObject) => {
    const bookContainer = document.createElement('article')
    bookContainer.classList.add('book_item')

    const bookTitle = document.createElement('h3')
    bookTitle.innerText = bookObject.title

    const bookAuthor = document.createElement('p')
    bookAuthor.innerText = `Penulis: ${bookObject.author}`

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

document.addEventListener(SAVED_EVENT, function(e){
    let shelf = 'rak belum selesai dibaca'
    if(e.detail.book.isComplete){
        shelf = 'rak sudah selesai dibaca'
    }

    if(e.detail.add){
        alert(`Berhasil menambahkan buku ${e.detail.book.title} ke ${shelf}`)
    }else if(e.detail.undo){
        alert(`Berhasil memindahkan buku ${e.detail.book.title} ke ${shelf}`)
    }else if(e.detail.complete){
        alert(`Berhasil menyelesaikan buku ${e.detail.book.title}`)
    }else if(e.detail.remove){
        alert(`Berhasil menghapus buku ${e.detail.book.title}`)
    }
})

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
    if(isStorageExists()){
        loadDataFromStorage()
    }

    updatedBookSubmitTitle()
    inputBookIsComplete.addEventListener('change', (e) => updatedBookSubmitTitle())
    
    const bookSubmit = document.getElementById('bookSubmit')
    bookSubmit.addEventListener('click', function(e){
        e.preventDefault()
        addBook()
    })

    const searchSubmit = document.getElementById('searchSubmit')
    const searchBookTitle = document.getElementById('searchBookTitle')
    searchSubmit.addEventListener('click', function(e){
        e.preventDefault()
        searchBookByTitle(searchBookTitle.value)
    })
})