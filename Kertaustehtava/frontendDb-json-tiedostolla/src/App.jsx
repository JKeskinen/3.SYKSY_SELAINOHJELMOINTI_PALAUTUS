import {useState, useEffect} from 'react'
import axios from 'axios'


const baseUrl = 'http://localhost:3001/books'

// LISÄTÄÄN SUODATIN KIRJOJEN ETSINTÄÄ VARTEN
// KOPIOIDAAN PUHELINLUETTELON MALLISTA
const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    Search by title or author, review or rating:
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
  newReview,
  newRating,
  handleTitleChange,
  handleAuthorChange,
  handleReviewChange,
  handleRatingChange,
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
    <div>
      review:
      <input
      value={newReview}
      onChange={handleReviewChange}
      placeholder='Review'
      />
    </div>
    <div>
      rating:
      <input
      type="number" min="1" max="5"
      value={newRating}
      onChange={handleRatingChange}
      placeholder='1-5'
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
  const [newReview, setNewReview] = useState('')
  const [newRating, setNewRating] = useState('')
  const [showBestBooks, setShowBestBooks] = useState(false)  // NAPILLE TILA (false) 

  const bestBooks = books.filter(book => book.rating === 5) // NAPPI PARHAILLE KIRJOILLE
  
  

  useEffect(()=> {
    axios.get('http://localhost:3001/books')
    .then(response => {
      console.log(response.data)
      console.log(Array.isArray(response.data.books))
      setBooks(response.data)
    })

}, []) // [] -> effect suoritetaan komponentin ensimmäisen renderöinnin yhteydessä eikä uudelleen jokaisella renderöinnillä

  // Lisätään handlerit App-funktioon
  const handleAuthorChange = (event) => setNewAuthor(event.target.value)
  const handleTitleChange = (event) => setNewTitle(event.target.value)
  const handleReviewChange = (event) => setNewReview(event.target.value)
  const handleRatingChange = (event) => setNewRating(event.target.value)
  


  


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }
    const booksToShow = searchTerm === ''
    ? books 
    : books.filter(book => {
      const s = searchTerm.toLowerCase()
      const titleMatch  = book.title.toLowerCase().includes(s)
      const authorMatch = book.author?.toLowerCase().includes(s)
      // LISÄTÄÄN NUMEROHAUN MAHDOLLISUUS
      const reviewMatch = book.review?.toLowerCase().includes(s)
      const ratingMatch = book.rating?.toString().includes(s) // Käännetaan numero Stringiksi, niin pystyy hakemaan. 
      
      
      return titleMatch || authorMatch || reviewMatch || ratingMatch
    })
  console.log(books)
  console.log(Array.isArray(books))





    // lisätään deleteBook
    const handleDelete = (id, title) => {
      console.log('DELETE:',id,title)
      if (window.confirm(`Delete book ${title} ?`)){
        axios
        .delete(`http://localhost:3001/books/${id}`)
        .then(() => {
          setBooks(books.filter(b => b.id !== id))
        })
      }
    }

    const addBook = (event) => {
      event.preventDefault()
      const bookObject = {title : newTitle,author : newAuthor, review : newReview, rating : Number(newRating)}
      const existingBook = books.find(book => book.title === newTitle)

      if (existingBook) {
        if (window.confirm(
          `${newTitle} on jo lisätty kirjastoon`
        )) {
          axios
          .put(`http://localhost:3001/books/${existingBook.id}`,bookObject

          )
          .then(response => {
            setBooks(
              books.map(book => book.id === existingBook.id
                ? response.data : book
              )
            )
            setNewTitle('')
            setNewAuthor('')
            setNewReview('')
            setNewRating('')
          })
        }
      }else {
          axios.post(`http://localhost:3001/books`, bookObject)
          .then(response => {
            setBooks(books.concat(response.data))
            setNewTitle('')
            setNewAuthor('')
            setNewReview('')
            setNewRating('')
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
      newReview={newReview}
      newRating={newRating}

      handleTitleChange={handleTitleChange}
      handleAuthorChange={handleAuthorChange}
      handleReviewChange={handleReviewChange}
      handleRatingChange={handleRatingChange}
      
      addBook={addBook}
      />
      <div>
        <button onClick={() => setShowBestBooks(!showBestBooks)}>
          Näytä parhaat kirjat
        </button>
        
      </div>
      <Books
      books={showBestBooks ? bestBooks : booksToShow}
      deleteBook={handleDelete}
      />
    </div>
  )
}

export default App