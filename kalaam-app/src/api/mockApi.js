const STORAGE_BOOKS = "kalaam_books_v1";
const STORAGE_SETTINGS = "kalaam_settings_v1";
const STORAGE_USERS = "kalaam_users_v1";
const STORAGE_SESSIONS = "kalaam_sessions_v1";
const STORAGE_LOGIN_FAILURES = "kalaam_login_failures_v1";

const DEFAULT_DB = {
  settings: {
    about: {
      mission:
        "Kalaam is the official poetry club of NIT Rourkela under the Student Activity Centre (SAC). Our mission is to promote creative expression, classic poetry appreciation, and critical discussion.",
      pillar1Title: "Creative Expression",
      pillar1Desc: "Empowering students to write, debate, and manifest poetry.",
      pillar2Title: "Historical Preservation",
      pillar2Desc:
        "Showcasing deep cultural Urdu, Hindi, and English masterpieces.",
    },
    quote: {
      title: "Thought of the Day",
      quote: "What you seek is seeking you.",
      author: "Rumi",
    },
    spotlight: {
      title: "Spotlight: Historical Poet of the Day",
      name: "Muztar Khairabadi",
      description:
        "An esteemed Urdu poet of the late 19th and early 20th centuries. Grandfather of the legend Javed Akhtar, he composed Bahr-e-Taweel, which hosts the longest single couplet in the history of Urdu Ghazal literature, weaving deep philosophical sadness with absolute linguistic beauty.",
    },
  },
  books: [
    {
      id: "1",
      title: "13 Reasons Why",
      author: "Jay Asher",
      genre: "Mystery",
      language: "english",
      availability: "Available",
      givenBy: "Student Activity Center",
      coverUrl:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80&auto=format&fit=crop",
      summary2:
        "After Hannah Baker dies, Clay Jensen receives cassettes detailing the 13 reasons why.",
      summary4:
        "13 Reasons Why follows Clay Jensen who receives cassette tapes from his classmate Hannah Baker detailing why she took her life.",
    },
    {
      id: "2",
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      language: "english",
      availability: "Checked Out",
      givenBy: "Alumni Donation",
      coverUrl:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80&auto=format&fit=crop",
      summary2:
        "Winston Smith attempts to navigate a world under constant surveillance by Big Brother.",
      summary4:
        "Set in a nightmare vision of futuristic London, Orwell's classic explores the terrifying mechanism of complete government surveillance.",
    },
    {
      id: "3",
      title: "Madhushala",
      author: "Harivansh Rai Bachchan",
      genre: "Poetry",
      language: "hindi",
      availability: "Available",
      givenBy: "Kalaam Library",
      coverUrl:
        "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&q=80&auto=format&fit=crop",
      summary2:
        "A masterpiece of Hindi literature using the metaphor of a wine tavern to explore life's profound truths.",
      summary4:
        "Madhushala uses the imagery of the tavern (Madhushala), the cupbearer, and the cup to reflect on the journey of life, mortality, and the universe, remaining one of the most celebrated works of Hindi poetry.",
    },
  ],
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

const readBooks = () => readJson(STORAGE_BOOKS, [...DEFAULT_DB.books]);
const writeBooks = (books) => writeJson(STORAGE_BOOKS, books);
const readSettings = () =>
  readJson(STORAGE_SETTINGS, { ...DEFAULT_DB.settings });
const writeSettings = (settings) => writeJson(STORAGE_SETTINGS, settings);
const readUsers = () => readJson(STORAGE_USERS, []);
const writeUsers = (users) => writeJson(STORAGE_USERS, users);
const readSessions = () => readJson(STORAGE_SESSIONS, {});
const writeSessions = (s) => writeJson(STORAGE_SESSIONS, s);
const readLoginFailures = () => readJson(STORAGE_LOGIN_FAILURES, {});
const writeLoginFailures = (f) => writeJson(STORAGE_LOGIN_FAILURES, f);

const SESSION_TTL_MS = 1000 * 60 * 60; // 1 hour
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_BLOCK_MS = 1000 * 60 * 5; // 5 minutes

const recordLoginFailure = (mobile) => {
  const failures = readLoginFailures();
  const entry = failures[mobile] || { count: 0, blockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    entry.blockedUntil = Date.now() + LOGIN_BLOCK_MS;
    entry.count = 0;
  }
  failures[mobile] = entry;
  writeLoginFailures(failures);
};

const clearLoginFailures = (mobile) => {
  const failures = readLoginFailures();
  delete failures[mobile];
  writeLoginFailures(failures);
};

const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);
const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const getSessionUser = (token) => {
  const sessions = readSessions();
  if (!token || !sessions[token]) throw new Error("Unauthorized");
  const session = sessions[token];
  if (!session || Date.now() > session.expiresAt) {
    delete sessions[token];
    writeSessions(sessions);
    throw new Error("Session expired");
  }
  const users = readUsers();
  const user = users.find((u) => u.id === session.userId);
  if (!user) throw new Error("Invalid session");
  return user;
};

const bufToB64 = (b) => btoa(String.fromCharCode(...new Uint8Array(b)));
const b64ToBuf = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function hashPassword(password, salt, iterations = 100000) {
  const enc = new TextEncoder();
  const passKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const key = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: b64ToBuf(salt), iterations, hash: "SHA-256" },
    passKey,
    256,
  );
  return bufToB64(key);
}

function genSalt() {
  const s = crypto.getRandomValues(new Uint8Array(16));
  return bufToB64(s);
}

export const api = {
  getSettings: async () => {
    await delay(500);
    return readSettings();
  },
  getBooks: async () => {
    await delay(800);
    return readBooks();
  },
  // User registration: { mobile, password, displayName, isAdmin }
  registerUser: async ({
    mobile,
    password,
    displayName = "",
    isAdmin = false,
  }) => {
    await delay(600);
    if (!mobile || !password)
      throw new Error("Mobile and password are required");
    if (!isValidMobile(mobile))
      throw new Error("Mobile number must be 10 digits");
    if (password.length < 8)
      throw new Error("Password must be at least 8 characters");
    const users = readUsers();
    if (users.find((u) => u.mobile === mobile))
      throw new Error("Mobile already registered");
    if (isAdmin && users.find((u) => u.isAdmin))
      throw new Error("Admin already exists");
    const salt = genSalt();
    const passwordHash = await hashPassword(password, salt);
    const newUser = {
      id: Date.now().toString(),
      mobile,
      displayName,
      isAdmin,
      passwordHash,
      salt,
      iterations: 100000,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);
    return {
      id: newUser.id,
      mobile: newUser.mobile,
      displayName: newUser.displayName,
      isAdmin: newUser.isAdmin,
    };
  },
  // Login with mobile & password -> returns token & user
  loginUser: async ({ mobile, password }) => {
    await delay(400);
    if (!mobile || !password) throw new Error("Invalid credentials");
    const failures = readLoginFailures();
    const entry = failures[mobile] || { count: 0, blockedUntil: 0 };
    if (entry.blockedUntil > Date.now())
      throw new Error("Too many failed attempts. Try again later.");
    const users = readUsers();
    const user = users.find((u) => u.mobile === mobile);
    if (!user) {
      recordLoginFailure(mobile);
      throw new Error("Invalid credentials");
    }
    const computed = await hashPassword(password, user.salt, user.iterations);
    if (computed !== user.passwordHash) {
      recordLoginFailure(mobile);
      throw new Error("Invalid credentials");
    }
    clearLoginFailures(mobile);
    // create session token
    const token = btoa(
      `${user.id}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
    );
    const sessions = readSessions();
    sessions[token] = {
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + SESSION_TTL_MS,
    };
    writeSessions(sessions);
    return {
      token,
      user: {
        id: user.id,
        mobile: user.mobile,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
      },
    };
  },
  logout: async (token) => {
    await delay(100);
    const sessions = readSessions();
    delete sessions[token];
    writeSessions(sessions);
    return true;
  },
  getCurrentUser: async (token) => {
    await delay(150);
    const sessions = readSessions();
    if (!sessions[token]) return null;
    const session = sessions[token];
    if (!session || Date.now() > session.expiresAt) {
      delete sessions[token];
      writeSessions(sessions);
      return null;
    }
    const users = readUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) return null;
    return {
      id: user.id,
      mobile: user.mobile,
      displayName: user.displayName,
      isAdmin: user.isAdmin,
    };
  },
  isAdminRegistered: async () => {
    await delay(100);
    const users = readUsers();
    return users.some((u) => u.isAdmin);
  },
  // return users without sensitive fields
  getUsers: async (token) => {
    await delay(200);
    const actingUser = getSessionUser(token);
    if (!actingUser.isAdmin) throw new Error("Only admin can view users");
    const users = readUsers();
    return users.map((u) => ({
      id: u.id,
      mobile: u.mobile,
      displayName: u.displayName,
      isAdmin: u.isAdmin,
      createdAt: u.createdAt,
    }));
  },

  // transfer admin rights to another user; only current admin can transfer
  transferAdmin: async (token, newAdminId) => {
    await delay(300);
    const actingUser = getSessionUser(token);
    if (!actingUser.isAdmin)
      throw new Error("Only current admin can transfer admin rights");
    const users = readUsers();
    const newAdmin = users.find((u) => u.id === newAdminId);
    if (!newAdmin) throw new Error("Target user not found");
    // demote existing admin(s)
    for (const u of users) {
      u.isAdmin = u.id === newAdminId;
    }
    writeUsers(users);
    return {
      id: newAdmin.id,
      mobile: newAdmin.mobile,
      displayName: newAdmin.displayName,
      isAdmin: true,
    };
  },

  deleteUser: async (token, userId) => {
    await delay(300);
    const actingUser = getSessionUser(token);
    if (!actingUser.isAdmin) throw new Error("Only admin can delete users");
    if (actingUser.id === userId)
      throw new Error("Admin cannot delete their own account");
    let users = readUsers();
    if (!users.some((u) => u.id === userId)) throw new Error("User not found");
    users = users.filter((u) => u.id !== userId);
    writeUsers(users);
    const sessions = readSessions();
    for (const tokenKey of Object.keys(sessions)) {
      if (sessions[tokenKey].userId === userId) {
        delete sessions[tokenKey];
      }
    }
    writeSessions(sessions);
    return true;
  },

  addBook: async (bookData, token) => {
    await delay(600);
    const actingUser = getSessionUser(token);
    if (!actingUser.isAdmin) throw new Error("Only admin can add books");
    if (bookData.coverUrl && !isValidHttpUrl(bookData.coverUrl))
      throw new Error("Cover image URL must be a valid http(s) address");
    const books = readBooks();
    const newBook = { id: Date.now().toString(), ...bookData };
    books.push(newBook);
    writeBooks(books);
    return newBook;
  },
  deleteBook: async (id, token) => {
    await delay(500);
    const actingUser = getSessionUser(token);
    if (!actingUser.isAdmin) throw new Error("Only admin can delete books");
    const books = readBooks().filter((b) => b.id !== id);
    writeBooks(books);
    return true;
  },
  updateSettings: async (type, data, token) => {
    await delay(600);
    const actingUser = getSessionUser(token);
    if (!actingUser.isAdmin) throw new Error("Only admin can update settings");
    const settings = { ...readSettings() };
    settings[type] = { ...settings[type], ...data };
    writeSettings(settings);
    return settings[type];
  },
};
