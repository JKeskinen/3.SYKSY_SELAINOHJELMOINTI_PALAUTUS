import {useState, useEffect} from 'react'
import axios from 'axios'


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



// Kirjaluettelo omalla returnilla
const Books = ({books, deleteBook}) => {
  //console.log('Type of deletebook:', typeof deletebook)
  return(
    <table>
      <tbody>
        <tr>
          <td><strong>Title</strong></td>
          <td><strong>Author</strong></td>
          <td><strong>Review</strong></td>
          <td><strong>Rating</strong></td>
        </tr>
        {books.map((book) =>(
          <tr key={book.title}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.review}</td>
            <td>{book.rating}/5</td>
            <td>
              <button onClick={() => deletebook(book.id, book.title)}>Delete</button>
            </td>              
          </tr> 
            ))}
      </tbody>
    </table>
  )
}



function App() {
  const [books,setBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(()=> {
    axios.get('http://localhost:3001/api/books')
    .then(response => {
      console.log(response.data)
      console.log(Array.isArray(response.data.books))
      setBooks(response.data)
    })

}, [])

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
      
      <Books
      books={booksToShow}
      />
    </div>
  )
}

export default App