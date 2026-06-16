import fs from 'fs';
const file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const POETS_DATA = \[\s*\{[\s\S]*?\}\s*\];\s*/, '');

content = content.replace(
  'const [books, setBooks] = useState([]);',
  'const [books, setBooks] = useState([]);\n  const [poets, setPoets] = useState([]);'
);

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

content = content.replace(
`  const favPoemsData = useMemo(() => {
    return POETS_DATA.flatMap((poet) => poet.poems).filter((poem) => favoritePoems.includes(poem.id));
  }, [favoritePoems]);`,
`  const favPoemsData = useMemo(() => {
    return poets.flatMap((poet) => poet.poems).filter((poem) => favoritePoems.includes(poem.id));
  }, [favoritePoems, poets]);`
);

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

// Update Hero text
content = content.replace(
`Poetry by Kalaam`,
`{settings?.hero?.poetryTitle || "Poetry by Kalaam"}`
);

content = content.replace(
`Immerse yourself in timeless poetry. Read verses from legendary poets and feel the essence of Kalaam.`,
`{settings?.hero?.poetrySubtitle || "Immerse yourself in timeless poetry. Read verses from legendary poets and feel the essence of Kalaam."}`
);

content = content.replace(
`Kalaam Library`,
`{settings?.hero?.libraryTitle || "Kalaam Library"}`
);

content = content.replace(
`Explore our vast collection of books. Discover literary masterpieces spanning English, Hindi, and Urdu.`,
`{settings?.hero?.librarySubtitle || "Explore our vast collection of books. Discover literary masterpieces spanning English, Hindi, and Urdu."}`
);

// Update Footer copyright
content = content.replace(
`© 2026 KALAAM - SAC NITR`,
`{settings?.footer?.text || "© 2026 KALAAM - SAC NITR"}`
);

fs.writeFileSync(file, content);
