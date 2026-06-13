const MOCK_DB = {
  settings: {
    about: {
      mission: "Kalaam is the official poetry club of NIT Rourkela under the Student Activity Centre (SAC). Our mission is to promote creative expression, classic poetry appreciation, and critical discussion.",
      pillar1Title: "Creative Expression",
      pillar1Desc: "Empowering students to write, debate, and manifest poetry.",
      pillar2Title: "Historical Preservation",
      pillar2Desc: "Showcasing deep cultural Urdu, Hindi, and English masterpieces."
    },
    quote: { quote: "What you seek is seeking you.", author: "Rumi" },
    spotlight: {
      name: "Muztar Khairabadi",
      description: "An esteemed Urdu poet of the late 19th and early 20th centuries. Grandfather of the legend Javed Akhtar, he composed Bahr-e-Taweel, which hosts the longest single couplet in the history of Urdu Ghazal literature, weaving deep philosophical sadness with absolute linguistic beauty."
    }
  },
  books: [
    { id: '1', title: "13 Reasons Why", author: "Jay Asher", genre: "Mystery", language: "english", availability: "Available", givenBy: "Student Activity Center", coverUrl: "[https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&auto=format&fit=crop](https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&auto=format&fit=crop)", summary2: "After Hannah Baker dies, Clay Jensen receives cassettes detailing the 13 reasons why.", summary4: "13 Reasons Why follows Clay Jensen who receives cassette tapes from his classmate Hannah Baker detailing why she took her life." },
    { id: '2', title: "1984", author: "George Orwell", genre: "Dystopian", language: "english", availability: "Checked Out", givenBy: "Alumni Donation", coverUrl: "[https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200&auto=format&fit=crop](https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200&auto=format&fit=crop)", summary2: "Winston Smith attempts to navigate a world under constant surveillance by Big Brother.", summary4: "Set in a nightmare vision of futuristic London, Orwell's classic explores the terrifying mechanism of complete government surveillance." },
    { id: '3', title: "Madhushala", author: "Harivansh Rai Bachchan", genre: "Poetry", language: "hindi", availability: "Available", givenBy: "Kalaam Library", coverUrl: "[https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=200&auto=format&fit=crop](https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=200&auto=format&fit=crop)", summary2: "A masterpiece of Hindi literature using the metaphor of a wine tavern to explore life's profound truths.", summary4: "Madhushala uses the imagery of the tavern (Madhushala), the cupbearer, and the cup to reflect on the journey of life, mortality, and the universe, remaining one of the most celebrated works of Hindi poetry." }
  ]
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getSettings: async () => { await delay(500); return { ...MOCK_DB.settings }; },
  getBooks: async () => { await delay(800); return [...MOCK_DB.books]; },
  login: async (password) => {
    await delay(600);
    if (password === 'admin') return { token: 'mock-jwt-token-123' };
    throw new Error('Invalid credentials');
  },
  addBook: async (bookData, token) => {
    await delay(600);
    if (!token) throw new Error('Unauthorized');
    const newBook = { id: Date.now().toString(), ...bookData };
    MOCK_DB.books.push(newBook);
    return newBook;
  },
  deleteBook: async (id, token) => {
    await delay(500);
    if (!token) throw new Error('Unauthorized');
    MOCK_DB.books = MOCK_DB.books.filter(b => b.id !== id);
    return true;
  },
  updateSettings: async (type, data, token) => {
    await delay(600);
    if (!token) throw new Error('Unauthorized');
    MOCK_DB.settings[type] = { ...MOCK_DB.settings[type], ...data };
    return MOCK_DB.settings[type];
  }
};
