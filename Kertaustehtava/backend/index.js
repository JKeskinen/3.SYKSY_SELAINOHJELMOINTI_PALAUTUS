const express = require('express')
const cors = require('cors')

const app = express()

//Ota cors käyttöön
app.use(cors())

//middleware json-datan käsittelyyn 
app.use(express.json())


//esimerkkidata
let books =[
    {
        id: 1,
        title: 'Sinuhe egyptiläinen',
        author: 'Mika Waltari',
        review: 'Vaikuttava',
        rating: 5
    }
]


const generateId = () => {
  return Number(Math.floor(Math.random() * 1000000))
}

app.get('/',(req,res) => {
    res.send(`
        <p>Kirjahyllyn pääty</p>
        <p>${new Date()}</p>
        `)
})


app.get('/info', (req, res) => {
  res.send(`
    <p>Kirjahyllyssä on ${books.length} kirjaa</p>
    <p>${new Date()}</p>
    <button>/api/books/</button>
  `)
})

//kaikki kirjat 
app.get('/api/books', (req,res)=>{
    res.json(books)
})


// Uuden kirjan lisääminen tarkistuksilla
app.post('/api/books', (req, res) => {
  const body = req.body

  if (!body.title || !body.author) {
    return res.status(400).json({
      error: 'title or author missing'
    })
  }

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
  new Date
})





//--NÄYTÄ KIRJA ID-NUMERON PERUSTEELLA
app.get('/api/books/:id', (req, res) => {
  const id = Number(req.params.id)

  const book = books.find(
    book => book.id === id
  )
  if (!book) {
    return res.status(404).json({
      error: 'book not found'
    })
  }
  res.json(book)
})





//--DELETE
app.delete('/api/books/:id', (req, res) => {
  const id = Number(req.params.id)
  books = books.filter(
    books => books.id !== id
  )
  res.status(204).end()
})






//------------------------------
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`)
})