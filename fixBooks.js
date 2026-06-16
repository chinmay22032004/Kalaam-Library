import fs from 'fs';

let serverContent = fs.readFileSync('server/server.js', 'utf8');

const bookRoutes = `
// --- BOOKS ROUTES ---

// GET /api/books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (err) {
    console.error('API Books Error:', err);
    res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
});

// POST /api/books
app.post('/api/books', auth, admin, async (req, res) => {
  try {
    const { title, author, genre, language, givenBy, coverUrl, summary, copies } = req.body;
    
    if (!title || !author || !genre || !language) {
      return res.status(400).json({ message: 'Title, Author, Genre and Language are required' });
    }

    const copiesNum = parseInt(copies) || 1;
    
    const newBook = new Book({
      title,
      author,
      genre,
      language,
      availability: 'Available',
      givenBy,
      coverUrl,
      summary,
      copies: copiesNum,
      issuedUsers: []
    });
    
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: 'Error adding book' });
  }
});

// PUT /api/books/:id
app.put('/api/books/:id', auth, admin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    Object.assign(book, req.body);
    
    // Auto-calculate availability
    if (book.issuedUsers && book.copies) {
      book.availability = book.issuedUsers.length >= book.copies ? 'Checked Out' : 'Available';
    }
    
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Error updating book' });
  }
});

// DELETE /api/books/:id
app.delete('/api/books/:id', auth, admin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(444).json({ message: 'Book not found' });
    }
    // Remove from all users' favorites
    await User.updateMany({}, { $pull: { favorites: req.params.id } });
    
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting book' });
  }
});

`;

serverContent = serverContent.replace('// --- AUTHENTICATION ROUTES ---', bookRoutes + '// --- AUTHENTICATION ROUTES ---');

// Also remove `import Poet from './models/Poet.js';` since it's deleted
serverContent = serverContent.replace("import Poet from './models/Poet.js';\n", '');

fs.writeFileSync('server/server.js', serverContent);
