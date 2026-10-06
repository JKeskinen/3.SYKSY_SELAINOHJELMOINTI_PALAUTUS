# Frontend-muistio – React, JavaScript ja Axios

## Sisällysluettelo

1. [Reactin perusrakenne](#1-reactin-perusrakenne)
2. [Komponentit](#2-komponentit)
3. [Propsit](#3-propsit)
4. [State ja useState](#4-state-ja-usestate)
5. [Controlled input](#5-controlled-input)
6. [useEffect](#6-useeffect)
7. [Axios ja HTTP-pyynnöt](#7-axios-ja-http-pyynnöt)
8. [GET – tietojen hakeminen](#8-get--tietojen-hakeminen)
9. [POST – uuden tiedon lisääminen](#9-post--uuden-tiedon-lisääminen)
10. [PUT – tiedon päivittäminen](#10-put--tiedon-päivittäminen)
11. [DELETE – tiedon poistaminen](#11-delete--tiedon-poistaminen)
12. [Array-metodit](#12-array-metodit)
13. [filter() ja hakutoiminto](#13-filter-ja-hakutoiminto)
14. [map() ja listan renderöinti](#14-map-ja-listan-renderöinti)
15. [find()](#15-find)
16. [concat()](#16-concat)
17. [Arrow function](#17-arrow-function)
18. [Optional chaining `?.`](#18-optional-chaining-)
19. [Template literal](#19-template-literal)
20. [Tapahtumankäsittely](#20-tapahtumankäsittely)
21. [Form ja preventDefault()](#21-form-ja-preventdefault)
22. [Propsien välittäminen](#22-propsien-välittäminen)
23. [Reactin uudelleenrenderöinti](#23-reactin-uudelleenrenderöinti)
24. [Tiedon kulku sovelluksessa](#24-tiedon-kulku-sovelluksessa)
25. [Koodin kokonaislogiikka](#25-koodin-kokonaislogiikka)
26. [Tentissä osattavat asiat](#26-tentissä-osattavat-asiat)
27. [Tyypillisiä tenttikysymyksiä](#27-tyypillisiä-tenttikysymyksiä)

---

# 1. Reactin perusrakenne

React-sovellus koostuu komponenteista.

Tässä sovelluksessa komponentteja ovat:

```javascript
Filter
BookForm
Books
App
```

`App` on pääkomponentti, joka hallitsee sovelluksen statea ja API-logiikkaa.

Rakenne voidaan ajatella näin:

```text
App
│
├── Filter
│
├── BookForm
│
└── Books
```

`App` antaa lapsikomponenteille tietoa ja funktioita propsien avulla.

---

# 2. Komponentit

React-komponentti on yleensä JavaScript-funktio, joka palauttaa JSX:ää.

Esimerkiksi:

```javascript
const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    <input
      value={searchTerm}
      onChange={handleSearchChange}
    />
  </div>
)
```

Komponentti voidaan kirjoittaa myös näin:

```javascript
function App() {
  return (
    <div>
      Hello
    </div>
  )
}
```

Molemmat ovat React-komponentteja.

---

# 3. Propsit

Propsit ovat tapa välittää tietoa parent-komponentilta child-komponentille.

Esimerkiksi:

```javascript
<Filter
  searchTerm={searchTerm}
  handleSearchChange={handleSearchChange}
/>
```

`Filter` vastaanottaa nämä:

```javascript
const Filter = ({
  searchTerm,
  handleSearchChange
}) => (
```

Tässä:

```text
App
 │
 │ props
 ▼
Filter
```

Propsit ovat oletuksena read-only.

Child-komponentti ei siis yleensä muuta suoraan parentin statea.

Sen sijaan parent antaa childille funktion:

```javascript
handleSearchChange
```

ja child kutsuu sitä.

---

# 4. State ja useState

Reactin state sisältää komponentin muuttuvan tilan.

State luodaan:

```javascript
const [books, setBooks] = useState([])
```

Tässä:

```text
books
```

on nykyinen arvo.

```text
setBooks
```

on funktio, jolla arvo muutetaan.

```javascript
setBooks(newBooks)
```

Esimerkiksi:

```javascript
const [newTitle, setNewTitle] = useState('')
```

Alkuarvo on tyhjä merkkijono.

Kun käyttäjä kirjoittaa:

```javascript
setNewTitle(event.target.value)
```

React päivittää staten.

Tärkeä periaate:

```text
State muuttuu
     ↓
setState()
     ↓
React renderöi komponentin uudelleen
```

Statea ei pitäisi muuttaa suoraan:

```javascript
books.push(newBook)
```

vaan muodostetaan uusi taulukko:

```javascript
setBooks(books.concat(newBook))
```

---

# 5. Controlled input

Controlled input tarkoittaa, että inputin arvo tulee Reactin statesta.

Esimerkiksi:

```javascript
<input
  value={newTitle}
  onChange={handleTitleChange}
/>
```

State:

```javascript
const [newTitle, setNewTitle] = useState('')
```

Handler:

```javascript
const handleTitleChange = (event) =>
  setNewTitle(event.target.value)
```

Tiedon kulku:

```text
Käyttäjä kirjoittaa
        ↓
onChange
        ↓
handleTitleChange
        ↓
setNewTitle()
        ↓
React state muuttuu
        ↓
input päivittyy
```

Tämä on erittäin tyypillinen React-rakenne.

---

# 6. useEffect

`useEffect` suorittaa sivuvaikutuksia komponentissa.

Tyypillinen käyttökohde on API-kutsun tekeminen.

```javascript
useEffect(() => {

  axios
    .get(baseUrl)
    .then(response => {
      setBooks(response.data)
    })

}, [])
```

Tyhjä dependency array:

```javascript
[]
```

tarkoittaa, että effect suoritetaan komponentin ensimmäisen renderöinnin jälkeen eikä uudelleen state-muutosten takia.

Esimerkiksi:

```javascript
useEffect(() => {
  console.log('Suoritetaan')
}, [])
```

Jos riippuvuuksia olisi:

```javascript
useEffect(() => {
  ...
}, [searchTerm])
```

effect suoritettaisiin aina, kun `searchTerm` muuttuu.

---

# 7. Axios ja HTTP-pyynnöt

Axios on JavaScript-kirjasto HTTP-pyyntöjen tekemiseen.

Kirjaston import:

```javascript
import axios from 'axios'
```

Backendin osoite:

```javascript
const baseUrl = 'http://localhost:3001/api/books'
```

Axiosilla voidaan tehdä esimerkiksi:

```javascript
axios.get(...)
axios.post(...)
axios.put(...)
axios.delete(...)
```

HTTP-metodit:

| HTTP | Tarkoitus |
|---|---|
| GET | Hae tietoja |
| POST | Lisää uusi |
| PUT | Päivitä |
| DELETE | Poista |

---

# 8. GET – tietojen hakeminen

Kirjat haetaan backendistä:

```javascript
axios
  .get(baseUrl)
  .then(response => {
    setBooks(response.data)
  })
```

Backend palauttaa esimerkiksi:

```javascript
[
  {
    id: 1,
    title: "Book 1",
    author: "Author 1"
  },
  {
    id: 2,
    title: "Book 2",
    author: "Author 2"
  }
]
```

Axiosin response sisältää muun muassa:

```javascript
response.data
```

jossa varsinainen backendin palauttama data sijaitsee.

---

# 9. POST – uuden tiedon lisääminen

Uusi kirja muodostetaan objektiksi:

```javascript
const bookObject = {
  title: newTitle,
  author: newAuthor,
  review: newReview,
  rating: newRating
}
```

Sen jälkeen:

```javascript
axios
  .post(baseUrl, bookObject)
  .then(response => {
    setBooks(
      books.concat(response.data)
    )
  })
```

POST lähettää datan backendille.

```text
React
 │
 │ POST + bookObject
 ▼
Backend
 │
 │ uusi kirja
 ▼
response.data
 │
 ▼
setBooks()
```

---

# 10. PUT – tiedon päivittäminen

Jos samanniminen kirja löytyy:

```javascript
const existingBook =
  books.find(book => book.title === newTitle)
```

Jos kirja löytyy, tehdään PUT:

```javascript
axios
  .put(
    `${baseUrl}/${existingBook.id}`,
    bookObject
  )
```

URL voi olla esimerkiksi:

```text
http://localhost:3001/api/books/5
```

PUT lähettää:

```text
ID = 5
uudet kirjan tiedot
```

Backend palauttaa päivitetyn kirjan:

```javascript
response.data
```

Sitten Reactin state päivitetään:

```javascript
setBooks(
  books.map(book =>
    book.id === existingBook.id
      ? response.data
      : book
  )
)
```

---

# 11. DELETE – tiedon poistaminen

Poisto:

```javascript
axios
  .delete(`${baseUrl}/${id}`)
```

Esimerkiksi:

```text
DELETE /api/books/5
```

Kun backend on onnistuneesti poistanut kirjan:

```javascript
setBooks(
  books.filter(book => book.id !== id)
)
```

`filter()` jättää kaikki muut kirjat jäljelle.

---

# 12. Array-metodit

Tässä ohjelmassa käytetään erityisen paljon JavaScriptin array-metodeja.

Tärkeimmät:

```javascript
map()
filter()
find()
concat()
```

Näiden tarkoitus kannattaa osata tentissä.

| Metodi | Tarkoitus |
|---|---|
| `map()` | Muuttaa jokaisen alkion / muodostaa uuden listan |
| `filter()` | Suodattaa listasta alkioita |
| `find()` | Etsii ensimmäisen sopivan alkion |
| `concat()` | Yhdistää taulukoita / lisää alkioita |

---

# 13. filter() ja hakutoiminto

Hakutoiminto:

```javascript
const booksToShow =
  searchTerm === ''
    ? books
    : books.filter(book => {
```

Jos hakukenttä on tyhjä:

```javascript
books
```

Muuten käytetään:

```javascript
books.filter(...)
```

Esimerkiksi:

```javascript
books.filter(book =>
  book.title.toLowerCase().includes(s)
)
```

Tämä palauttaa vain kirjat, joiden nimi sisältää hakutekstin.

Hakua tehdään useasta kentästä:

```javascript
const titleMatch =
  book.title.toLowerCase().includes(s)

const authorMatch =
  book.author?.toLowerCase().includes(s)

const reviewMatch =
  book.review?.toLowerCase().includes(s)

const ratingMatch =
  book.rating?.toString().includes(s)
```

Lopuksi:

```javascript
return (
  titleMatch ||
  authorMatch ||
  reviewMatch ||
  ratingMatch
)
```

`||` tarkoittaa OR.

Eli kirja hyväksytään, jos haku löytyy:

```text
title
TAI
author
TAI
review
TAI
rating
```

---

# 14. map() ja listan renderöinti

Reactissa listoja renderöidään usein `map()`-metodilla.

Esimerkiksi:

```javascript
{books.map(book => (
  <li key={book.id}>
    {book.title}
  </li>
))}
```

Jos:

```javascript
books = [
  { id: 1, title: 'A' },
  { id: 2, title: 'B' }
]
```

React muodostaa:

```html
<li>A</li>
<li>B</li>
```

`key`:

```javascript
key={book.id}
```

antaa Reactille yksilöllisen tunnisteen listan elementille.

---

# 15. find()

`find()` etsii ensimmäisen ehdon täyttävän alkion.

Tässä:

```javascript
const existingBook =
  books.find(book => book.title === newTitle)
```

Jos löytyy:

```javascript
existingBook
```

sisältää kirjaobjektin.

Jos ei löydy:

```javascript
existingBook === undefined
```

Siksi voidaan tehdä:

```javascript
if (existingBook) {
  // kirja löytyi
} else {
  // kirjaa ei löytynyt
}
```

---

# 16. concat()

`concat()` muodostaa uuden taulukon.

Esimerkiksi:

```javascript
const numbers = [1, 2, 3]

const newNumbers =
  numbers.concat(4)
```

Tuloksena:

```javascript
[1, 2, 3, 4]
```

Kirjojen lisäämisessä:

```javascript
setBooks(
  books.concat(response.data)
)
```

Vanha lista säilyy muuttumattomana ja uusi kirja lisätään uuteen listaan.

---

# 17. Arrow function

Koodissa käytetään paljon arrow functioneita.

Esimerkiksi:

```javascript
book => book.title
```

Sama perinteisellä funktiolla:

```javascript
function(book) {
  return book.title
}
```

Useampi parametri:

```javascript
(event) => {
  setNewTitle(event.target.value)
}
```

Yksi parametri voidaan kirjoittaa ilman sulkuja:

```javascript
event => ...
```

Arrow function on erityisen yleinen:

```javascript
map()
filter()
find()
then()
```

yhteydessä.

---

# 18. Optional chaining `?.`

Koodissa:

```javascript
book.author?.toLowerCase()
```

`?.` on optional chaining.

Se estää virheen tilanteessa, jossa:

```javascript
book.author
```

on:

```javascript
undefined
```

Ilman optional chainingia:

```javascript
book.author.toLowerCase()
```

voisi aiheuttaa virheen.

Sama:

```javascript
book.review?.toLowerCase()
```

ja:

```javascript
book.rating?.toString()
```

---

# 19. Template literal

Template literal käyttää backtick-merkkejä:

```javascript
`${baseUrl}/${id}`
```

Jos:

```javascript
baseUrl = 'http://localhost:3001/api/books'
id = 5
```

tuloksena:

```text
http://localhost:3001/api/books/5
```

Template literalilla voidaan yhdistää tekstiä ja muuttujia helposti.

Esimerkiksi:

```javascript
`Delete book ${title} ?`
```

---

# 20. Tapahtumankäsittely

Reactissa tapahtumia käsitellään esimerkiksi:

```javascript
onChange
onClick
onSubmit
```

Esimerkiksi:

```javascript
<input
  onChange={handleTitleChange}
/>
```

Button:

```javascript
<button
  onClick={() => deleteBook(book.id, book.title)}
>
  Delete
</button>
```

Form:

```javascript
<form onSubmit={addBook}>
```

---

# 21. Form ja preventDefault()

Normaalisti HTML-formin submit voi aiheuttaa sivun latautumisen.

Reactissa tämä estetään:

```javascript
const addBook = (event) => {

  event.preventDefault()

  ...
}
```

`preventDefault()` estää selaimen oletustoiminnon.

Tässä tapauksessa:

```text
Submit
 ↓
onSubmit
 ↓
addBook()
 ↓
preventDefault()
 ↓
Axios POST/PUT
```

---

# 22. Propsien välittäminen

App antaa BookFormille paljon props-arvoja:

```javascript
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
```

BookForm vastaanottaa ne:

```javascript
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
```

Tätä kutsutaan propsien destructuringiksi.

Ilman destructuringia voisi kirjoittaa esimerkiksi:

```javascript
const BookForm = (props) => (
  <input value={props.newTitle} />
)
```

Destructuring tekee tästä lyhyemmän:

```javascript
const BookForm = ({ newTitle }) => (
  <input value={newTitle} />
)
```

---

# 23. Reactin uudelleenrenderöinti

Kun state muuttuu:

```javascript
setBooks(...)
```

React renderöi komponentin uudelleen.

Esimerkiksi:

```javascript
setSearchTerm(event.target.value)
```

muuttaa hakutekstiä.

Sen jälkeen:

```javascript
booksToShow
```

lasketaan uudelleen.

Tämän vuoksi taulukko päivittyy automaattisesti.

Reactin perusidea:

```text
STATE
  ↓
RENDER
  ↓
UI
```

Kun state muuttuu:

```text
setState()
   ↓
uusi renderöinti
   ↓
päivitetty UI
```

---

# 24. Tiedon kulku sovelluksessa

Sovelluksen tärkeä rakenne on:

```text
                App
                 │
        ┌────────┼────────┐
        │        │        │
        ▼        ▼        ▼
     Filter   BookForm   Books
```

App hallitsee statea:

```text
books
newTitle
newAuthor
newReview
newRating
searchTerm
```

Child-komponentit saavat tarvitsemansa tiedot propsina.

Esimerkiksi hakukenttä:

```text
Käyttäjä kirjoittaa
        ↓
Filter
        ↓
handleSearchChange()
        ↓
setSearchTerm()
        ↓
App state
        ↓
booksToShow
        ↓
Books
        ↓
päivitetty taulukko
```

---

# 25. Koodin kokonaislogiikka

## 25.1 Sovelluksen käynnistyminen

Kun App käynnistyy:

```javascript
useEffect(() => {
  axios.get(baseUrl)
    .then(response => {
      setBooks(response.data)
    })
}, [])
```

Kirjat haetaan backendistä.

```text
React
 ↓
GET /api/books
 ↓
Backend
 ↓
JSON
 ↓
response.data
 ↓
setBooks()
 ↓
kirjat näkyviin
```

---

## 25.2 Käyttäjä kirjoittaa hakukenttään

```text
input
 ↓
onChange
 ↓
handleSearchChange()
 ↓
setSearchTerm()
 ↓
booksToShow muuttuu
 ↓
Books renderöidään uudelleen
```

---

## 25.3 Käyttäjä lisää uuden kirjan

```text
BookForm
 ↓
Submit
 ↓
addBook()
 ↓
preventDefault()
 ↓
bookObject
 ↓
tarkistetaan find()
```

Jos kirjaa ei löydy:

```text
POST
 ↓
Backend
 ↓
response.data
 ↓
concat()
 ↓
setBooks()
 ↓
UI päivittyy
```

Jos kirja löytyy:

```text
PUT
 ↓
Backend
 ↓
response.data
 ↓
map()
 ↓
setBooks()
 ↓
UI päivittyy
```

---

## 25.4 Käyttäjä poistaa kirjan

```text
Delete-nappi
 ↓
handleDelete()
 ↓
confirm()
 ↓
DELETE
 ↓
Backend
 ↓
filter()
 ↓
setBooks()
 ↓
UI päivittyy
```

---

# 26. Tentissä osattavat asiat

Tästä koodista kannattaa osata ainakin seuraavat.

## React

Osaa selittää:

```javascript
useState()
useEffect()
props
components
JSX
controlled input
```

---

## JavaScript

Osaa:

```javascript
map()
filter()
find()
concat()
```

sekä:

```javascript
const
let
arrow function
template literal
optional chaining
```

---

## HTTP

Osaa erottaa:

```text
GET     = hae
POST    = lisää
PUT     = päivitä
DELETE  = poista
```

---

## Axios

Osaa esimerkiksi:

```javascript
axios.get(url)
axios.post(url, data)
axios.put(url, data)
axios.delete(url)
```

ja:

```javascript
.then(response => ...)
```

---

## React state

Osaa selittää:

```javascript
const [books, setBooks] = useState([])
```

Tarkoittaa:

```text
books     = nykyinen state
setBooks  = statea muuttava funktio
[]        = alkuarvo
```

---

# 27. Tyypillisiä tenttikysymyksiä

## Kysymys 1

Mitä tämä tekee?

```javascript
const [books, setBooks] = useState([])
```

### Vastaus

Luo Reactin staten nimeltä `books`.

Alkuarvo on tyhjä taulukko.

`setBooks`-funktiolla state voidaan päivittää.

---

## Kysymys 2

Mitä tämä tekee?

```javascript
useEffect(() => {
  axios.get(baseUrl)
}, [])
```

### Vastaus

Suorittaa effectin komponentin ensimmäisen renderöinnin jälkeen.

Tyhjä dependency array tarkoittaa, ettei effect riipu mistään muuttuvasta arvosta.

---

## Kysymys 3

Mitä `filter()` tekee?

```javascript
books.filter(book =>
  book.title.includes(searchTerm)
)
```

### Vastaus

Muodostaa uuden taulukon, joka sisältää vain ne kirjat, joiden nimi sisältää hakutekstin.

---

## Kysymys 4

Mitä `map()` tekee?

```javascript
books.map(book => (
  <li>{book.title}</li>
))
```

### Vastaus

Käy jokaisen taulukon alkion läpi ja muodostaa jokaisesta uuden arvon.

Reactissa sillä voidaan muodostaa esimerkiksi lista JSX-elementtejä.

---

## Kysymys 5

Miksi tarvitaan `key`?

```javascript
<li key={book.id}>
```

### Vastaus

React käyttää key-arvoa tunnistamaan listan yksittäiset elementit.

Sen pitäisi olla yksilöllinen ja vakaa tunniste.

---

## Kysymys 6

Mitä tämä tekee?

```javascript
event.preventDefault()
```

### Vastaus

Estää selaimen oletustoiminnon.

Formin tapauksessa se estää sivun normaalin latautumisen submitin yhteydessä.

---

## Kysymys 7

Mitä tämä tarkoittaa?

```javascript
book.author?.toLowerCase()
```

### Vastaus

Optional chaining.

Jos `author` on olemassa, `toLowerCase()` suoritetaan.

Jos `author` puuttuu, ohjelma ei aiheuta samanlaista `undefined`-virhettä.

---

## Kysymys 8

Mitä tämä tekee?

```javascript
books.find(book => book.title === newTitle)
```

### Vastaus

Etsii ensimmäisen kirjan, jonka `title` vastaa `newTitle`-arvoa.

Jos sopivaa kirjaa ei löydy, tulos on `undefined`.

---

## Kysymys 9

Mitä tämä tekee?

```javascript
setBooks(
  books.filter(book => book.id !== id)
)
```

### Vastaus

Muodostaa uuden taulukon, josta poistetaan kyseisen `id`:n kirja.

Sen jälkeen uusi taulukko asetetaan Reactin stateen.

---

## Kysymys 10

Miksi ei tehdä näin?

```javascript
books.push(newBook)
```

### Vastaus

Reactin statea ei pitäisi muuttaa suoraan.

Parempi tapa on muodostaa uusi taulukko:

```javascript
setBooks(
  books.concat(newBook)
)
```

Näin React saa uuden state-arvon ja renderöinti toimii odotetusti.

---

# Muistisääntö

React-sovelluksen peruslogiikan voi tiivistää näin:

```text
STATE
  ↓
PROPS
  ↓
COMPONENTS
  ↓
USER ACTION
  ↓
EVENT HANDLER
  ↓
STATE UPDATE
  ↓
RENDER
```

API-sovelluksessa mukaan tulee:

```text
React
  ↓
Axios
  ↓
HTTP
  ↓
Backend
  ↓
Database
```

Ja takaisin:

```text
Database
  ↓
Backend
  ↓
Axios response
  ↓
setState()
  ↓
React render
  ↓
UI
```

## Tärkeimmät muistettavat asiat

```text
useState  = state
useEffect = sivuvaikutus / API-kutsu
props     = parent → child
onChange  = input muuttui
onClick   = nappia painettiin
onSubmit  = form lähetettiin

GET       = hae
POST      = lisää
PUT       = päivitä
DELETE    = poista

map       = käy läpi / muodosta uusi lista
filter    = suodata
find      = etsi
concat    = yhdistä / lisää

?.        = optional chaining
=>        = arrow function
`${}`     = template literal
```

---

[⬆️ Palaa ylös](#frontend-muistio--react-javascript-ja-axios)