import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add state variables
content = content.replace(
  'const [books, setBooks] = useState([]);',
  `const [books, setBooks] = useState([]);
  const [poets, setPoets] = useState([]);`
);
content = content.replace(
  'const [favorites, setFavorites] = useState([]);',
  `const [favorites, setFavorites] = useState([]);
  const [favoritePoems, setFavoritePoems] = useState([]);
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [poemSource, setPoemSource] = useState(null);`
);

// 2. Add API calls to useEffect
content = content.replace(
`        const [booksData, settingsData] = await Promise.all([
          api.getBooks(),
          api.getSettings(),
        ]);
        setBooks(booksData);
        setSettings(settingsData);`,
`        const [booksData, settingsData, poetsData] = await Promise.all([
          api.getBooks(),
          api.getSettings(),
          api.getPoets(),
        ]);
        setBooks(booksData);
        setSettings(settingsData);
        setPoets(poetsData);`
);

// 3. Add to handleLogout and handleAuthLogin
content = content.replace('setFavorites([]);', 'setFavorites([]);\n    setFavoritePoems([]);');
content = content.replace('setFavorites(user.favorites || []);', 'setFavorites(user.favorites || []);\n    setFavoritePoems(user.favoritePoems || []);');

content = content.replace(
`const refreshCurrentUser = async () => {
    if (!authToken) return null;
    const user = await api.getCurrentUser(authToken).catch(() => null);
    if (!user) {
      setAuthToken(null);
      setCurrentUser(null);
      setFavorites([]);
      localStorage.removeItem("kalaam_token");`,
`const refreshCurrentUser = async () => {
    if (!authToken) return null;
    const user = await api.getCurrentUser(authToken).catch(() => null);
    if (!user) {
      setAuthToken(null);
      setCurrentUser(null);
      setFavorites([]);
      setFavoritePoems([]);
      localStorage.removeItem("kalaam_token");`
);

content = content.replace(
`    setCurrentUser(user);
    setFavorites(user.favorites || []);
    if (!user.isAdmin) {`,
`    setCurrentUser(user);
    setFavorites(user.favorites || []);
    setFavoritePoems(user.favoritePoems || []);
    if (!user.isAdmin) {`
);

// 4. Add toggleFavoritePoem function
content = content.replace(
`  const englishBooks = useMemo(`,
`  const toggleFavoritePoem = async (poemId, e) => {
    if (e) e.stopPropagation();
    if (!currentUser) {
      showToast("Please login to manage favorites.", "info");
      return;
    }
    
    try {
      if (favoritePoems.includes(poemId)) {
        setFavoritePoems(favoritePoems.filter((favId) => favId !== poemId));
        showToast("Poem removed from favorites.", "info");
        await api.removeFavoritePoem(poemId, authToken);
      } else {
        setFavoritePoems([...favoritePoems, poemId]);
        showToast("Poem added to favorites.");
        await api.addFavoritePoem(poemId, authToken);
      }
    } catch (err) {
      showToast("Failed to sync favorite poem with server.", "error");
    }
  };

  const englishBooks = useMemo(`
);

// 5. Add favPoemsData
content = content.replace(
`  const favoriteBooks = useMemo(
    () => books.filter((b) => favorites.includes(b.id)),
    [books, favorites],
  );`,
`  const favoriteBooks = useMemo(
    () => books.filter((b) => favorites.includes(b.id)),
    [books, favorites],
  );
  const favPoemsData = useMemo(() => {
    return poets.flatMap((poet) => poet.poems).filter((poem) => favoritePoems.includes(poem.id));
  }, [favoritePoems, poets]);`
);

// 6. Navigation Tabs
content = content.replace(
`          <button
            onClick={() => navigateTo("library")}
            className={\`px-3 py-1.5 rounded font-semibold text-sm hover:bg-[#4E1A27] hover:text-[#FFD59F] transition \${activeTab === "library" ? "bg-[#4E1A27] text-[#FFD59F]" : ""}\`}
          >
            LIBRARY
          </button>`,
`          <button
            onClick={() => navigateTo("library")}
            className={\`px-3 py-1.5 rounded font-semibold text-sm hover:bg-[#4E1A27] hover:text-[#FFD59F] transition \${activeTab === "library" ? "bg-[#4E1A27] text-[#FFD59F]" : ""}\`}
          >
            LIBRARY
          </button>
          <button
            onClick={() => navigateTo("poetry")}
            className={\`px-3 py-1.5 rounded font-semibold text-sm hover:bg-[#4E1A27] hover:text-[#FFD59F] transition \${(activeTab === "poetry" || activeTab === "poet_profile" || activeTab === "poem_detail") ? "bg-[#4E1A27] text-[#FFD59F]" : ""}\`}
          >
            POETRY
          </button>`
);

content = content.replace(
`          <button
            onClick={() => navigateTo("library")}
            className="text-left font-bold py-3 px-4 hover:bg-[#4E1A27] hover:text-[#FFD59F] rounded transition"
          >
            LIBRARY
          </button>`,
`          <button
            onClick={() => navigateTo("library")}
            className="text-left font-bold py-3 px-4 hover:bg-[#4E1A27] hover:text-[#FFD59F] rounded transition"
          >
            LIBRARY
          </button>
          <button
            onClick={() => navigateTo("poetry")}
            className="text-left font-bold py-3 px-4 hover:bg-[#4E1A27] hover:text-[#FFD59F] rounded transition"
          >
            POETRY
          </button>`
);

content = content.replace(
`          <button
            onClick={() => navigateTo("library")}
            className="text-left font-bold py-3 px-4 hover:bg-[#4E1A27] hover:text-[#FFD59F] rounded transition"
          >
            LIBRARY
          </button>`,
`          <button
            onClick={() => navigateTo("library")}
            className="text-left font-bold py-3 px-4 hover:bg-[#4E1A27] hover:text-[#FFD59F] rounded transition"
          >
            LIBRARY
          </button>
          <button
            onClick={() => navigateTo("poetry")}
            className="text-left font-bold py-3 px-4 hover:bg-[#4E1A27] hover:text-[#FFD59F] rounded transition"
          >
            POETRY
          </button>`
);

// 7. Replace Hero text
content = content.replace(
`Poetry by Kalaam`,
`{settings?.hero?.title || "Poetry by Kalaam"}`
);
content = content.replace(
`Immerse yourself in timeless poetry. Read verses from legendary poets and feel the essence of Kalaam.`,
`{settings?.hero?.subtitle || "Immerse yourself in timeless poetry. Read verses from legendary poets and feel the essence of Kalaam."}`
);
content = content.replace(
`Kalaam Library`,
`{settings?.hero?.secondarySubtitle || "Kalaam Library"}`
); // note secondarySubtitle maps to library title. Wait, in server.js I used secondarySubtitle. Let's just use secondarySubtitle.

// 8. Fix AdminDashboard
content = content.replace(
`          <AdminDashboard
            books={books}
            setBooks={setBooks}`,
`          <AdminDashboard
            books={books}
            setBooks={setBooks}
            poets={poets}
            setPoets={setPoets}`
);

// 9. Fix Footer
content = content.replace(
`© 2026 KALAAM - SAC NITR`,
`{settings?.footer?.text || "© 2026 KALAAM - SAC NITR"}`
);

// Write changes
fs.writeFileSync('src/App.jsx', content);

