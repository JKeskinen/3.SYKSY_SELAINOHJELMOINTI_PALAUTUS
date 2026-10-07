const express = require('express')
const cors = require('cors')


// ============================================================
// EXPRESS-SOVELLUKSEN LUONTI
// ============================================================

// express() luo Express-palvelimen
const app = express()

// Backend kuuntelee porttia 3001
const PORT = 3001


// ============================================================
// MIDDLEWARE
// ============================================================

// CORS sallii esimerkiksi Reactin (localhost:5173)
// tehdä pyyntöjä tähän backend-palvelimeen.
app.use(cors())


// express.json() mahdollistaa JSON-datan lukemisen
// requestin bodysta.
//
// Esimerkiksi React lähettää:
//
// {
//   "title": "Idiootit ympärilläni",
//   "author": "Thomas Erikson"
// }
//
// Tämän jälkeen backendissä:
// req.body.title
// req.body.author
//
// toimivat.
app.use(express.json())


// ============================================================
// ETUSIVU /home
// ============================================================

// GET /home
//
// Kun selain pyytää:
// http://localhost:3001/home
//
// tämä suoritetaan.
app.get('/home', (req, res) => {

  // res.send() lähettää selaimelle HTML-tekstin
  res.send(`
    <h1>Kirjahyllyn pääty</h1>
    <h2>Etusivu</h2>
    <p>${new Date()}</p>
  `)
})


// ============================================================
// DATA
// ============================================================

// Tämä on backendin tämänhetkinen "tietokanta".
//
// Huom!
// Data säilyy vain niin kauan kuin Node-palvelin on käynnissä.
//
// Kun serveri käynnistetään uudelleen,
// nämä alkuperäiset kirjat tulevat takaisin.

let books = [

  {
    id: 1,
    title: 'Sinuhe egyptiläinen',
    author: 'Mika Waltari',
    review: 'Vaikuttava',
    rating: 5,
    status: 'SAATAVILLA',
    borrower: null
  },

  {
    id: 2,
    title: 'Sinuhe suomalainen',
    author: 'Mika Waltari',
    review: 'Aika ok',
    rating: 4,
    status: 'SAATAVILLA',
    borrower: null
  },

  {
    id: 3,
    title: 'Sinuhe ruotsalainen',
    author: 'Mika Waltari',
    review: 'No jotain',
    rating: 3,
    status: 'SAATAVILLA',
    borrower: null
  },

  {
    id: 4,
    title: 'Sinuhe norjalainen',
    author: 'Mika Waltari',
    review: 'emt',
    rating: 2,
    status: 'SAATAVILLA',
    borrower: null
  }
]


// ============================================================
// ID:N LUOMINEN
// ============================================================

// Luo satunnaisen numeron uudelle kirjalle.
//
// Esimerkiksi:
// 482391
//
// Tätä käytetään POST-pyynnössä uuden kirjan id:nä.
const generateId = () => {

  return Math.floor(
    Math.random() * 1000000
  )
}


// ============================================================
// ETUSIVU
// ============================================================

// GET /
//
// Selain:
// http://localhost:3001/
//
// Backend palauttaa HTML:ää.
app.get('/', (req, res) => {

  res.send(`
    <h1>Kirjahyllyn pääty</h1>
    <p>${new Date()}</p>
  `)
})


// ============================================================
// INFO
// ============================================================

// GET /info
//
// Näyttää tällä hetkellä muistissa olevien kirjojen määrän.
app.get('/info', (req, res) => {

  res.send(`
    <p>Kirjahyllyssä on ${books.length} kirjaa</p>
    <p>${new Date()}</p>
  `)
})


// ============================================================
// GET – KAIKKI KIRJAT
// ============================================================
//
// React tekee esimerkiksi:
//
// axios.get('http://localhost:3001/api/books')
//
//        ↓
//
// Tämä endpoint suoritetaan.
//
//        ↓
//
// res.json(books)
//
//        ↓
//
// React saa response.data
//
// ============================================================

app.get('/api/books', (req, res) => {

  // Lähetetään koko books-taulukko JSON-muodossa
  res.json(books)
})


// ============================================================
// GET – YKSI KIRJA
// ============================================================
//
// URL:
//
// /api/books/3
//
// :id on route-parametri.
//
// req.params.id sisältää tässä tapauksessa:
// "3"
//
// ============================================================

app.get('/api/books/:id', (req, res) => {


  // URL-parametri tulee tekstinä.
  //
  // "3" -> 3
  //
  // Number() muuttaa Stringin numeroksi.
  const id = Number(req.params.id)


  // Etsitään taulukosta oikea kirja.
  const book = books.find(
    book => book.id === id
  )


  // Jos kirjaa ei löytynyt,
  // palautetaan HTTP 404.
  if (!book) {

    return res.status(404).json({
      error: 'book not found'
    })
  }


  // Kirja löytyi -> lähetetään se Reactille.
  res.json(book)
})


// ============================================================
// POST – UUSI KIRJA
// ============================================================
//
// POST tarkoittaa uuden tiedon lisäämistä.
//
// React lähettää:
//
// axios.post(
//   '/api/books',
//   bookObject
// )
//
// bookObject tulee backendille:
// req.body
//
// ============================================================

app.post('/api/books', (req, res) => {


  // Reactin lähettämä JSON löytyy req.body:stä.
  const body = req.body


  // Tarkistetaan pakolliset tiedot.
  //
  // Jos title TAI author puuttuu,
  // palautetaan HTTP 400.
  if (!body.title || !body.author) {

    return res.status(400).json({
      error: 'title or author missing'
    })
  }


  // Tarkistetaan löytyykö saman niminen kirja.
  const existingBook = books.find(
    book => book.title === body.title
  )


  // Jos löytyy -> ei lisätä uutta kirjaa.
  if (existingBook) {

    return res.status(400).json({
      error: 'title must be unique'
    })
  }


  // Rakennetaan uusi kirja.
  //
  // Osa tiedoista tulee Reactilta.
  // id ja oletusarvot luodaan backendissä.
  const book = {

    id: generateId(),

    title: body.title,

    author: body.author,

    review: body.review,

    rating: body.rating,

    // Uusi kirja on aina aluksi saatavilla.
    status: 'SAATAVILLA',

    // Aluksi kukaan ei lainaa kirjaa.
    borrower: null
  }


  // Lisätään uusi kirja books-taulukkoon.
  //
  // concat() tekee uuden taulukon,
  // jossa vanhat kirjat + uusi kirja.
  books = books.concat(book)


  // Lähetetään luotu kirja takaisin Reactille.
  //
  // React saa tämän:
  //
  // response.data
  //
  res.json(book)
})


// ============================================================
// PUT – KIRJAN PÄIVITTÄMINEN
// ============================================================
//
// PUT tarkoittaa olemassa olevan tiedon muuttamista.
//
// Esimerkiksi React:
//
// axios.put(
//   '/api/books/3',
//   updatedBook
// )
//
//        ↓
//
// req.params.id = "3"
// req.body = päivitetty kirja
//
// ============================================================

app.put('/api/books/:id', (req, res) => {


  // Haetaan id URL:sta.
  const id = Number(req.params.id)


  // Etsitään olemassa oleva kirja.
  const book = books.find(
    book => book.id === id
  )


  // Jos kirjaa ei löydy -> 404.
  if (!book) {

    return res.status(404).json({
      error: 'book not found'
    })
  }


  // Reactin lähettämä uusi data.
  const body = req.body


  // title ja author ovat pakollisia.
  if (!body.title || !body.author) {

    return res.status(400).json({
      error: 'title or author missing'
    })
  }


  // ==========================================================
  // PÄIVITETYN KIRJAN LUOMINEN
  // ==========================================================

  const updatedBook = {

    // Kopioidaan alkuperäinen kirja.
    ...book,

    // Korvataan sen tiedot body:n tiedoilla.
    ...body,

    // ID:tä ei saa vaihtaa.
    //
    // Vaikka body sisältäisi toisen id:n,
    // käytetään alkuperäistä.
    id: book.id
  }


  // ==========================================================
  // VANHAN KIRJAN KORVAAMINEN
  // ==========================================================

  // map() käy kaikki kirjat läpi.
  //
  // Jos id täsmää:
  //     käytetään updatedBookia
  //
  // Muuten:
  //     käytetään alkuperäistä bookia.
  books = books.map(book =>
    book.id === id
      ? updatedBook
      : book
  )


  // Lähetetään päivitetty kirja takaisin Reactille.
  res.json(updatedBook)
})


// ============================================================
// ALKUPERÄINEN PUT-VERSIO
// ============================================================
//
// Tässä versiossa kaikki kentät olisi määritelty käsin.
//
// Nykyinen versio:
//
// {
//   ...book,
//   ...body,
//   id: book.id
// }
//
// on joustavampi, koska body:n kentät voidaan päivittää
// ilman että kaikkia niitä tarvitsee kirjoittaa erikseen.
//
// ============================================================

/*
const updatedBook = {
  id: book.id,
  title: body.title,
  author: body.author,
  review: body.review,
  rating: body.rating,
  status: body.status,
  borrower: body.borrower
}
*/


// ============================================================
// DELETE – KIRJAN POISTAMINEN
// ============================================================
//
// DELETE /api/books/:id
//
// Esimerkiksi:
//
// axios.delete('/api/books/3')
//
// ============================================================

app.delete('/api/books/:id', (req, res) => {


  // URL:n id muutetaan numeroksi.
  const id = Number(req.params.id)


  // Etsitään poistettava kirja.
  const book = books.find(
    book => book.id === id
  )


  // Jos kirjaa ei löydy -> 404.
  if (!book) {

    return res.status(404).json({
      error: 'book not found'
    })
  }


  // filter() luo uuden taulukon.
  //
  // Kaikki muut kirjat säilyvät.
  // Poistettavan kirjan id jätetään pois.
  books = books.filter(
    book => book.id !== id
  )


  // 204 = onnistui, mutta palautettavaa dataa ei ole.
  res.status(204).end()
})


// ============================================================
// TUNTEMATON ENDPOINT
// ============================================================
//
// Jos mikään yllä olevista routeista ei vastannut pyyntöön,
// päädytään tänne.
//
// Esimerkiksi:
//
// GET /api/foobar
//
// ============================================================

app.use((req, res) => {

  res.status(404).json({
    error: 'unknown endpoint'
  })
})


// ============================================================
// SERVERIN KÄYNNISTYS
// ============================================================
//
// Käynnistää Express-palvelimen.
//
// Tämän jälkeen backend kuuntelee:
//
// http://localhost:3001
//
// ============================================================

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  )
})