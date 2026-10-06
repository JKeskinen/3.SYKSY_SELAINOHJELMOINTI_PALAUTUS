import {useState, useEffect} from 'react'
import axios from 'axios'


const baseUrl = 'http://localhost:3001/api/books'

// LISÄTÄÄN SUODATIN KIRJOJEN ETSINTÄÄ VARTEN
// KOPIOIDAAN PUHELINLUETTELON MALLISTA
const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    Search by title or author:
    <input
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder='search'
    />
  </div>
)

const BookForm = ({
  newTitle,
  newAuthor,
  handleTitleChange,
  handleAuthorChange,
  addBook
}) => (
  <>
  <form onSubmit={addBook}>
    <div>
      title:
      <input
      value={newTitle}
      required
      onChange={handleTitleChange}
      placeholder="Title"
      />
    </div>
    <div>
      author:
      <input
      value={newAuthor}
      onChange={handleAuthorChange}
      placeholder="Author"
      />
    </div>

    <button type='submit'>Lisää</button>


  </form>
  </>

)

// Kirjaluettelo omalla returnilla
const Books = ({books, deleteBook}) => {
  //console.log('Type of deletebook:', typeof deletebook)
  return(
    <table>
      <tbody>
        <tr>
          <td><strong>Id</strong></td>
          <td><strong>Title</strong></td>
          <td><strong>Author</strong></td>
          <td><strong>Review</strong></td>
          <td><strong>Rating</strong></td>
        </tr>
        {books.map((book) =>(
          <tr key={book.id}>
            <td>{book.id}</td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.review}</td>
            <td>{book.rating}/5</td>
            <td>
              <button onClick={() => deleteBook(book.id, book.title)}>Delete</button>
            </td>              
          </tr> 
            ))}
      </tbody>
    </table>
  )
}



function App() {
  const [books,setBooks] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  

  useEffect(()=> {
    axios.get('http://localhost:3001/api/books')
    .then(response => {
      console.log(response.data)
      console.log(Array.isArray(response.data.books))
      setBooks(response.data)
    })

}, [])

  // Lisätään handlerit App-funktioon
  const handleAuthorChange = (event) => setNewAuthor(event.target.value)
  const handleTitleChange = (event) => setNewTitle(event.target.value)


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }
    const booksToShow = searchTerm === ''
    ? books 
    : books.filter(book=> {
      const titleMatch  = book.title.toLowerCase().includes(searchTerm.toLowerCase())
      const authorMatch = book.author.includes(searchTerm)
      
      return(
         titleMatch || authorMatch)
    })
  console.log(books)
  console.log(Array.isArray(books))





    // lisätään deleteBook
    const handleDelete = (id, title) => {
      console.log('DELETE:',id,title)
      if (window.confirm(`Delete book ${title} ?`)){
        axios
        .delete(`http://localhost:3001/api/books/${id}`)
        .then(() => {
          setBooks(books.filter(b => b.id !== id))
        })
      }
    }

    const addBook = (event) => {
      event.preventDefault()
      const bookObject = {title : newTitle,author : newAuthor}
      const existingBook = books.find(book => book.title === newTitle)

      if (existingBook) {
        if (window.confirm(
          `${newTitle} on jo lisätty kirjastoon`
        )) {
          axios
          .put(`http://localhost:3001/api/books/${existingBook.id}`,bookObject

          )
          .then(response => {
            setBooks(
              books.map(book => book.id === existingBook.id
                ? response.data : book
              )
            )
            setNewTitle('')
            setNewAuthor('')
          })
        }
      }else {
          axios.post(`http://localhost:3001/api/books`, bookObject)
          .then(response => {
            setBooks(books.concat(response.data))
            setNewTitle('')
            setNewAuthor('')
          })
        
      }
    }







  return (
    <div>
      <h1>Kirja-arvostelu</h1>
      <Filter
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <ul>
        {books.map(book =>(
          <li key={book.id}>
            <strong>{book.title}</strong>{book.review} ({book.rating}/5)
          </li>
        ))}
      </ul>

      <h3>const Books-listaus</h3>

      <BookForm
      newTitle={newTitle}
      newAuthor={newAuthor}
      handleTitleChange={handleTitleChange}
      handleAuthorChange={handleAuthorChange}
      addBook={addBook}
      />
      
      <Books
      books={booksToShow}
      deleteBook={handleDelete}
      />
    </div>
  )
}

export default App