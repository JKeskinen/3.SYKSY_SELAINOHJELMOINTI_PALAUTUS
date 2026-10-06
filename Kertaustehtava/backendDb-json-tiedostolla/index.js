
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())




// ============================================================
// ID:N LUOMINEN
// ============================================================

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}


// ============================================================
// ETUSIVU
// ============================================================

app.get('/', (req, res) => {
  res.send(`
    <h1>Kirjahyllyn pääty</h1>
    <p>${new Date()}</p>
  `)
})


// ============================================================
// INFO
// ============================================================

app.get('/info', (req, res) => {
  res.send(`
    <p>Kirjahyllyssä on ${books.length} kirjaa</p>
    <p>${new Date()}</p>
  `)
})


// ============================================================
// GET – KAIKKI KIRJAT
// ============================================================

app.get('/api/books', (req, res) => {
  res.json(books)
})


// ============================================================
// GET – YKSI KIRJA
// ============================================================

app.get('/api/books/:id', (req, res) => {

  const id = Number(req.params.id)

  const book = books.find(book => book.id === id)

  if (!book) {
    return res.status(404).json({
      error: 'book not found'
    })
  }

  res.json(book)
})


// ============================================================
// POST – UUSI KIRJA
// ============================================================

app.post('/api/books', (req, res) => {

  const body = req.body

  // title ja author ovat pakollisia
  if (!body.title || !body.author) {
    return res.status(400).json({
      error: 'title or author missing'
    })
  }

  // Tarkistetaan, onko saman niminen kirja jo olemassa
  const existingBook = books.find(
    book => book.title === body.title
  )

  if (existingBook) {
    return res.status(400).json({
      error: 'title must be unique'
    })
  }

  const book = {
    id: generateId(),
    title: body.title,
    author: body.author,
    review: body.review,
    rating: body.rating
  }

  books = books.concat(book)

  res.json(book)
})


// ============================================================
// PUT – KIRJAN PÄIVITTÄMINEN
// ============================================================

app.put('/api/books/:id', (req, res) => {

  const id = Number(req.params.id)

  const book = books.find(book => book.id === id)

  // Kirjaa ei löytynyt
  if (!book) {
    return res.status(404).json({
      error: 'book not found'
    })
  }

  const body = req.body

  // title ja author ovat pakollisia
  if (!body.title || !body.author) {
    return res.status(400).json({
      error: 'title or author missing'
    })
  }

  // Päivitetään kirjan tiedot
  const updatedBook = {
    id: book.id,
    title: body.title,
    author: body.author,
    review: body.review,
    rating: body.rating
  }

  // Korvataan vanha kirja uudella
  books = books.map(book =>
    book.id === id
      ? updatedBook
      : book
  )

  res.json(updatedBook)
})


// ============================================================
// DELETE – KIRJAN POISTAMINEN
// ============================================================

app.delete('/api/books/:id', (req, res) => {

  const id = Number(req.params.id)

  const book = books.find(book => book.id === id)

  if (!book) {
    return res.status(404).json({
      error: 'book not found'
    })
  }

  books = books.filter(
    book => book.id !== id
  )

  res.status(204).end()
})


// ============================================================
// TUNTEMATON ENDPOINT
// ============================================================

app.use((req, res) => {
  res.status(404).json({
    error: 'unknown endpoint'
  })
})


// ============================================================
// SERVERIN KÄYNNISTYS
// ============================================================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
