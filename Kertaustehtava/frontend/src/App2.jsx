import { useState, useEffect } from 'react'
import axios from 'axios'

// Backendin osoite
// Kaikki kirjadatan GET/POST/PUT/DELETE-pyynnöt menevät tänne.
const baseUrl = 'http://localhost:3001/api/books'


// ============================================================
// FILTER
// ============================================================
// App välittää tälle komponentille:
// - searchTerm = mitä käyttäjä kirjoitti hakukenttään
// - handleSearchChange = funktio, joka päivittää searchTerm-tilan
//
// Props kulkevat siis:
// App -> Filter
// ============================================================

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


// ============================================================
// BOOK FORM
// ============================================================
// Lomakkeen tiedot tulevat App-komponentin statesta.
// Kun käyttäjä kirjoittaa kenttään:
// input -> onChange -> handler -> state
//
// Kun lomake lähetetään:
// form -> onSubmit -> addBook -> POST/PUT backendille
// ============================================================

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
          placeholder="Review"
        />
      </div>

      <div>
        rating:

        <input
          type="number"
          min="1"
          max="5"
          value={newRating}
          onChange={handleRatingChange}
          placeholder="1-5"
        />
      </div>

      <button type="submit">
        Lisää
      </button>

    </form>
  </>
)


// ============================================================
// BOOKS
// ============================================================
// Saa Appilta:
// - books = näytettävät kirjat
// - deleteBook = poistofunktio
// - changeBookStatus = varaus/lainaus/palautus
//
// books.map() käy kaikki kirjat läpi ja tekee jokaisesta <tr>-rivin.
// ============================================================

const Books = ({ books, deleteBook, changeBookStatus }) => {

  return (
    <table>
      <tbody>

        <tr>
          <td><strong>Id</strong></td>
          <td><strong>Title</strong></td>
          <td><strong>Author</strong></td>
          <td><strong>Review</strong></td>
          <td><strong>Rating</strong></td>
          <td><strong>Status</strong></td>
        </tr>


        {/* map = jokaisesta book-oliosta tehdään yksi HTML-rivi */}
        {books.map((book) => (

          <tr key={book.id}>

            {/* Nämä tiedot näkyvät selaimessa,
                koska ne tulostetaan JSX:n sisällä {} */}
            <td>{book.id}</td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.review}</td>
            <td>{book.rating}/5</td>
            <td>{book.status}</td>

            <td>

              {/* Näytetään nappi vain jos kirja on saatavilla */}
              {book.status === 'SAATAVILLA' && (
                <button
                  onClick={() =>
                    changeBookStatus(book.id, 'VARATTU')
                  }
                >
                  Varaa
                </button>
              )}


              {/* VARATTU -> LAINATTU */}
              {book.status === 'VARATTU' && (
                <button
                  onClick={() =>
                    changeBookStatus(book.id, 'LAINATTU')
                  }
                >
                  Lainaa
                </button>
              )}


              {/* LAINATTU -> SAATAVILLA */}
              {book.status === 'LAINATTU' && (
                <button
                  onClick={() =>
                    changeBookStatus(book.id, 'SAATAVILLA')
                  }
                >
                  Palauta
                </button>
              )}


              {/* Poisto */}
              <button
                onClick={() =>
                  deleteBook(book.id, book.title)
                }
              >
                Delete
              </button>

            </td>

          </tr>
        ))}

      </tbody>
    </table>
  )
}


// ============================================================
// APP
// ============================================================
// App on sovelluksen pääkomponentti.
//
// Täällä:
// - säilytetään state
// - haetaan data backendistä
// - lähetetään data backendille
// - käsitellään käyttäjän tapahtumat
// - välitetään data lapsikomponenteille
// ============================================================

function App() {


  // ==========================================================
  // STATE
  // ==========================================================

  // Kaikki kirjat
  const [books, setBooks] = useState([])

  // Lomakkeen kentät
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newReview, setNewReview] = useState('')
  const [newRating, setNewRating] = useState('')

  // Hakukenttä
  const [searchTerm, setSearchTerm] = useState('')

  // Näytetäänkö parhaat kirjat
  const [showBestBooks, setShowBestBooks] = useState(false)

  // Näytetäänkö vapaat kirjat
  const [showAvailableBooks, setShowAvailableBooks] = useState(false)

  // Tämä state on tällä hetkellä olemassa,
  // mutta sitä ei käytetä näkymän muuttamiseen.
  const [libraryView, setLibraryView] = useState(false)


  // ==========================================================
  // FILTERÖIDYT KIRJAT
  // ==========================================================

  // rating === 5 -> vain viiden tähden kirjat
  const bestBooks = books.filter(
    book => book.rating === 5
  )

  // status === SAATAVILLA -> vain vapaat kirjat
  const availableBooks = books.filter(
    book => book.status === 'SAATAVILLA'
  )


  // ==========================================================
  // GET DATA BACKENDISTÄ
  // ==========================================================
  //
  // useEffect(..., [])
  // suoritetaan ensimmäisen renderöinnin jälkeen.
  //
  // axios.get()
  //       ↓
  // Backend
  //       ↓
  // response.data
  //       ↓
  // setBooks()
  //       ↓
  // React renderöi näkymän uudelleen
  //
  // ==========================================================

  useEffect(() => {

    axios
      .get('http://localhost:3001/api/books')

      .then(response => {

        // Backendiltä tullut data
        console.log(response.data)

        // Tallennetaan kirjat Reactin stateen
        setBooks(response.data)
      })

  }, [])


  // ==========================================================
  // INPUT HANDLERIT
  // ==========================================================
  //
  // event.target.value = käyttäjän kirjoittama arvo
  //
  // Esimerkiksi:
  //
  // käyttäjä kirjoittaa "Thomas"
  //       ↓
  // event.target.value
  //       ↓
  // setNewAuthor("Thomas")
  //       ↓
  // newAuthor sisältää "Thomas"
  //
  // ==========================================================

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleReviewChange = (event) => {
    setNewReview(event.target.value)
  }

  const handleRatingChange = (event) => {
    setNewRating(event.target.value)
  }


  // Hakukentän handler
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }


  // ==========================================================
  // HAKU
  // ==========================================================

  // Jos hakukenttä on tyhjä:
  // näytetään kaikki kirjat.
  //
  // Muuten filter() etsii kirjoja.
  const booksToShow =
    searchTerm === ''
      ? books
      : books.filter(book => {

          const s = searchTerm.toLowerCase()

          const titleMatch =
            book.title.toLowerCase().includes(s)

          const authorMatch =
            book.author?.toLowerCase().includes(s)

          const reviewMatch =
            book.review?.toLowerCase().includes(s)

          // Rating on numero -> muutetaan Stringiksi
          const ratingMatch =
            book.rating?.toString().includes(s)

          return (
            titleMatch ||
            authorMatch ||
            reviewMatch ||
            ratingMatch
          )
        })


  // ==========================================================
  // STATUS: VARAA / LAINAA / PALAUTA
  // ==========================================================

  const changeBookStatus = (id, newStatus) => {

    // Etsitään oikea kirja id:n perusteella
    const book = books.find(
      book => book.id === id
    )

    if (!book) return


    // Kopioidaan vanha kirja
    // ja muutetaan vain status.
    const updatedBook = {
      ...book,
      status: newStatus
    }


    // PUT = päivitetään backendissä oleva kirja
    axios
      .put(`${baseUrl}/${id}`, updatedBook)

      .then(response => {

        // Päivitetään myös Reactin state.
        //
        // Jos id täsmää:
        // käytetään backendiltä saatua päivitettyä kirjaa.
        //
        // Muut kirjat pysyvät ennallaan.
        setBooks(
          books.map(book =>
            book.id === id
              ? response.data
              : book
          )
        )
      })
  }


  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = (id, title) => {

    console.log('DELETE:', id, title)

    if (
      window.confirm(`Delete book ${title} ?`)
    ) {

      // DELETE backendille
      axios
        .delete(
          `http://localhost:3001/api/books/${id}`
        )

        .then(() => {

          // Poistetaan kirja myös Reactin statesta
          setBooks(
            books.filter(book => book.id !== id)
          )
        })
    }
  }


  // ==========================================================
  // POST / PUT - UUDEN KIRJAN LISÄYS
  // ==========================================================

  const addBook = (event) => {

    // Estää selainta lataamasta sivua uudelleen
    event.preventDefault()


    // Rakennetaan objekti lomakkeen tiedoista
    const bookObject = {

      title: newTitle,
      author: newAuthor,
      review: newReview,

      // Input antaa arvon String-muodossa.
      // Muutetaan rating numeroksi.
      rating: Number(newRating),

      status: 'SAATAVILLA',
      borrower: null
    }


    // Tarkistetaan löytyykö samalla nimellä jo kirja
    const existingBook = books.find(
      book => book.title === newTitle
    )


    // ========================================================
    // KIRJA ON JO OLEMASSA
    // ========================================================

    if (existingBook) {

      if (
        window.confirm(
          `${newTitle} on jo lisätty kirjastoon`
        )
      ) {

        // PUT = päivitetään olemassa oleva kirja
        axios
          .put(
            `http://localhost:3001/api/books/${existingBook.id}`,
            bookObject
          )

          .then(response => {

            // Päivitetään muuttunut kirja stateen
            setBooks(
              books.map(book =>
                book.id === existingBook.id
                  ? response.data
                  : book
              )
            )

            // Tyhjennetään lomake
            setNewTitle('')
            setNewAuthor('')
            setNewReview('')
            setNewRating('')
          })
      }


    // ========================================================
    // KIRJAA EI OLE -> UUSI KIRJA
    // ========================================================

    } else {

      // POST = uusi kirja backendille
      axios
        .post(
          `http://localhost:3001/api/books`,
          bookObject
        )

        .then(response => {

          // Lisätään backendin palauttama uusi kirja stateen
          setBooks(
            books.concat(response.data)
          )

          // Tyhjennetään lomake
          setNewTitle('')
          setNewAuthor('')
          setNewReview('')
          setNewRating('')
        })
    }
  }


  // ==========================================================
  // JSX
  // ==========================================================
  //
  // TÄÄLLÄ DATA MUUTTUU NÄKYVÄKSI SELAIMESSA.
  //
  // Esimerkiksi:
  //
  // {book.title}
  //
  // tarkoittaa:
  // ota book-oliosta title ja näytä se selaimessa.
  //
  // ==========================================================

  return (
    <div>

      <h1>Kirja-arvostelu</h1>


      {/* Muuttaa libraryView-statea */}
      <button
        onClick={() =>
          setLibraryView(!libraryView)
        }
      >
        Kirjasto
      </button>


      {/* Hakukomponentti */}
      <Filter
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />


      {/* filter + length kertoo kirjojen määrän */}
      <p>
        Saatavilla:
        {
          books.filter(
            book => book.status === 'SAATAVILLA'
          ).length
        }
      </p>

      <p>
        Varattuna:
        {
          books.filter(
            book => book.status === 'VARATTU'
          ).length
        }
      </p>

      <p>
        Lainattuna:
        {
          books.filter(
            book => book.status === 'LAINATTU'
          ).length
        }
      </p>


      {/* Toinen tapa näyttää kirjat */}
      <ul>
        {books.map(book => (

          <li key={book.id}>

            <strong>
              {book.title}
            </strong>

            {book.review}

            ({book.rating}/5 {book.status})

          </li>
        ))}
      </ul>


      <h3>const Books-listaus</h3>


      {/* Lomake */}
      <BookForm

        // Lomakkeen nykyiset arvot
        newTitle={newTitle}
        newAuthor={newAuthor}
        newReview={newReview}
        newRating={newRating}

        // Inputien handlerit
        handleTitleChange={handleTitleChange}
        handleAuthorChange={handleAuthorChange}
        handleReviewChange={handleReviewChange}
        handleRatingChange={handleRatingChange}

        // Lomakkeen submit
        addBook={addBook}
      />


      {/* Näkymän vaihtamiseen liittyvät napit */}
      <div>

        <button
          onClick={() =>
            setShowBestBooks(!showBestBooks)
          }
        >
          Näytä parhaat kirjat
        </button>


        <button
          onClick={() =>
            setShowAvailableBooks(
              !showAvailableBooks
            )
          }
        >
          {
            showAvailableBooks
              ? 'Näytä kaikki kirjat'
              : 'Näytä vapaat kirjat'
          }
        </button>

      </div>


      {/* =====================================================
          BOOKS-KOMPONENTTI
          
          Tälle annetaan books-propiksi se lista,
          joka halutaan näyttää.
          
          Järjestys:
          
          1. Vapaat kirjat
          2. Parhaat kirjat
          3. Hakutulokset / kaikki kirjat
          ===================================================== */}

      <Books

        books={
          showAvailableBooks
            ? availableBooks
            : showBestBooks
              ? bestBooks
              : booksToShow
        }

        deleteBook={handleDelete}

        changeBookStatus={changeBookStatus}
      />


      {/* =====================================================
          SAATAVILLA
          ===================================================== */}

      <h2>SAATAVILLA OLEVAT KIRJAT</h2>

      <ul>

        {books
          .filter(
            book => book.status === 'SAATAVILLA'
          )
          .map(book => (

            <li key={book.id}>
              {book.title}
            </li>

          ))
        }

      </ul>


      {/* =====================================================
          VARATUT
          ===================================================== */}

      <h2>VARATUT KIRJAT</h2>

      <ul>

        {books
          .filter(
            book => book.status === 'VARATTU'
          )
          .map(book => (

            <li key={book.id}>
              {book.title}
            </li>

          ))
        }

      </ul>


      {/* =====================================================
          LAINATUT
          ===================================================== */}

      <h2>LAINATUT KIRJAT</h2>

      <ul>

        {books
          .filter(
            book => book.status === 'LAINATTU'
          )
          .map(book => (

            <li key={book.id}>
              {book.title}
            </li>

          ))
        }

      </ul>

    </div>
  )
}


export default App