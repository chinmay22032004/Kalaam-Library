require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {
  // Ignore
}
const mongoose = require('mongoose');
const Book = require('./models/Book');
const Setting = require('./models/Setting');

const defaultSettings = [
  {
    type: 'about',
    data: {
      mission: "Kalaam is the official poetry club of NIT Rourkela under the Student Activity Centre (SAC). Our mission is to promote creative expression, classic poetry appreciation, and critical discussion.",
      pillar1Title: "Creative Expression",
      pillar1Desc: "Empowering students to write, debate, and manifest poetry.",
      pillar2Title: "Historical Preservation",
      pillar2Desc: "Showcasing deep cultural Urdu, Hindi, and English masterpieces."
    }
  },
  {
    type: 'quote',
    data: {
      title: "Thought of the Day",
      quote: "What you seek is seeking you.",
      author: "Rumi"
    }
  },
  {
    type: 'spotlight',
    data: {
      title: "Spotlight: Historical Poet of the Day",
      name: "Muztar Khairabadi",
      description: "An esteemed Urdu poet of the late 19th and early 20th centuries. Grandfather of the legend Javed Akhtar, he composed Bahr-e-Taweel, which hosts the longest single couplet in the history of Urdu Ghazal literature, weaving deep philosophical sadness with absolute linguistic beauty."
    }
  }
];

const defaultBooks = [
  {
    title: "13 Reasons Why",
    author: "Jay Asher",
    genre: "Mystery",
    language: "english",
    availability: "Available",
    givenBy: "Student Activity Center",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80&auto=format&fit=crop",
    summary: "After Hannah Baker dies, Clay Jensen receives cassettes detailing the 13 reasons why."
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    language: "english",
    availability: "Checked Out",
    givenBy: "Alumni Donation",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80&auto=format&fit=crop",
    summary: "Winston Smith attempts to navigate a world under constant surveillance by Big Brother."
  },
  {
    title: "Madhushala",
    author: "Harivansh Rai Bachchan",
    genre: "Poetry",
    language: "hindi",
    availability: "Available",
    givenBy: "Kalaam Library",
    coverUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&q=80&auto=format&fit=crop",
    summary: "A masterpiece of Hindi literature using the metaphor of a wine tavern to explore life's profound truths."
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kalaam');
    console.log('MongoDB connected successfully!');

    // Clear existing
    console.log('Clearing existing data...');
    await Book.deleteMany({});
    await Setting.deleteMany({});
    
    // We do NOT clear users, to prevent admin deletion unless desired.
    // If you want to clear users as well:
    // await User.deleteMany({});

    console.log('Seeding settings...');
    await Setting.insertMany(defaultSettings);
    
    console.log('Seeding books...');
    await Book.insertMany(defaultBooks);

    console.log('Seeding completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
