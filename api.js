const router = require("express").Router(); // using express router
const books = require("./books");

let booksDirectory = books; // creating a book directory

router.get("/books", function (req, res) {
  res.send(booksDirectory);
});

router.get("/books/:id", function (req, res) {
  // get CRUD function to retrieve a list of books available
  const { id } = req.params;

  const book = booksDirectory.find((b) => b.isbn === id); // checking to see if the book exists
  if (!book) return res.status(404).send("Book does not exist in the database"); // if it doesn't returning an error

  res.send(book);
});

router.post("/books", function (req, res) {
  // post CRUD function to post a certain book
  const { title, author, description, price, isbn } = req.body; // how the post would look

  const bookExists = booksDirectory.find((b) => b.isbn === isbn);
  if (bookExists) return res.send("Book already exists in the database");

  const book = {
    title,
    author,
    description,
    price,
    isbn,
  };
  booksDirectory.push(book); // pushing a book at the end

  res.send(book);
});

router.put("/books/:id", function (req, res) {
  // update CRUD function where it will update the desired detail
  const { id } = req.params;
  const { title, author, description, price } = req.body;

  let book = booksDirectory.find((b) => b.isbn === id);
  if (!book) return res.status(404).send("Book does not exist in the database");

  const updateField = (val, prev) => (!val ? prev : val);

  const updatedBook = {
    // a const function to update the field
    ...book,
    title: updateField(title, book.title),
    author: updateField(author, book.author),
    description: updateField(description, book.description),
    price: updateField(price, book.price),
  };

  const bookIndex = booksDirectory.findIndex((b) => b.isbn === book.isbn);
  booksDirectory.splice(bookIndex, 1, updatedBook);

  res.status(200).send(updatedBook);
});

router.delete("/books/:id", function (req, res) {
  // a delete CRUD function responsible for deleting the desired book by isbn
  const { id } = req.params;
  let book = booksDirectory.find((b) => b.isbn === id);
  if (!book) return res.status(404).send("Book does not exist in the database");
  booksDirectory = booksDirectory.filter((b) => b.isbn !== id);

  res.send("Book deleted");
});

module.exports = router;
