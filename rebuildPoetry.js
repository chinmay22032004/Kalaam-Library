import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

const POETS_DATA_STR = `
const POETS_DATA = [
  {
    id: "mirza-ghalib",
    name: "Mirza Ghalib",
    description: "The most prominent Urdu and Persian poet of the Mughal Empire.",
    avatar: "https://via.placeholder.com/150/4E1A27/FFD59F?text=Ghalib",
    bio: "Mirza Asadullah Baig Khan, known by his pen name Ghalib, was a classical Urdu and Persian poet.",
    poems: [
      { id: "ghalib-dil-e-nadaan", title: "Dil-e-Nadaan", content: "Dil-e-nadaan tujhe hua kya hai,\\nAakhir is dard ki dawa kya hai?\\n\\nHum hain mushtaq aur woh bezaar,\\nYa Ilahi yeh majra kya hai?" },
      { id: "ghalib-hazaron", title: "Hazaron Khwahishen", content: "Hazaron khwahishen aisi ke har khwahish pe dum nikle,\\nBahut nikle mere armaan, lekin phir bhi kam nikle." },
      { id: "ghalib-ishq", title: "Ishq Ne Ghalib", content: "Ishq ne Ghalib nikamma kar diya,\\nVarna hum bhi aadmi the kaam ke." },
      { id: "ghalib-har", title: "Har Ek Baat Pe", content: "Har ek baat pe kehte ho tum ke tu kya hai,\\nTumhi kaho ke yeh andaz-e-guftagu kya hai?" }
    ]
  },
  {
    id: "faiz-ahmad",
    name: "Faiz Ahmad Faiz",
    description: "A celebrated revolutionary author and poet.",
    avatar: "https://via.placeholder.com/150/4E1A27/FFD59F?text=Faiz",
    bio: "Faiz Ahmad Faiz was an intellectual, revolutionary poet, and one of the most celebrated writers of the Urdu language.",
    poems: [
      { id: "faiz-mujh", title: "Mujh Se Pehli", content: "Mujh se pehli si muhabbat mere mehboob na maang,\\nMaine samjha tha ke tu hai toh darakhshaan hai hayaat." },
      { id: "faiz-hum", title: "Hum Dekhenge", content: "Hum dekhenge,\\nLazim hai ke hum bhi dekhenge.\\nWoh din ke jis ka waada hai,\\nJo lauh-e-azl mein likha hai." },
      { id: "faiz-gulon", title: "Gulon Mein Rang", content: "Gulon mein rang bhare baad-e-naubahaar chale,\\nChale bhi aao ke gulshan ka karobaar chale." },
      { id: "faiz-dasht", title: "Dasht-e-Tanhai", content: "Dasht-e-tanhai mein aye jaan-e-jahan larzaan hain,\\nTeri aawaz ke saaye, tere honton ke saraab." }
    ]
  },
  {
    id: "jaun-elia",
    name: "Jaun Elia",
    description: "A prominent Urdu poet, philosopher, and scholar.",
    avatar: "https://via.placeholder.com/150/4E1A27/FFD59F?text=Jaun",
    bio: "Syed Hussain Jaun Asghar Naqvi, known as Jaun Elia, was an Urdu poet and philosopher known for his unconventional style.",
    poems: [
      { id: "jaun-aakhri", title: "Aakhri Bar", content: "Kiya kaha ishq javidani hai!\\nAakhri bar mil rahay hain hum." },
      { id: "jaun-umar", title: "Umar Guzregi", content: "Umar guzregi imtihaan mein kya,\\nDaag hi denge mujhko daan mein kya?" },
      { id: "jaun-naya", title: "Naya Ek Rishta", content: "Naya ek rishta paida kyun karein hum,\\nBichhadna hai toh jhagda kyun karein hum?" },
      { id: "jaun-sharm", title: "Sharm Dehshat", content: "Sharm, dehshat, jhijhak, pareshani,\\nNaaz se kaam kyun nahi leti?\\nAap, ji, magar, yeh sab kya hai,\\nTum mera naam kyun nahi leti?" }
    ]
  },
  {
    id: "parveen-shakir",
    name: "Parveen Shakir",
    description: "An iconic female Urdu poet and civil servant.",
    avatar: "https://via.placeholder.com/150/4E1A27/FFD59F?text=Parveen",
    bio: "Parveen Shakir was a Pakistani poet, teacher and a civil servant of the Government of Pakistan.",
    poems: [
      { id: "parveen-ku", title: "Ku-ba-ku", content: "Ku-ba-ku phail gayi baat shanasai ki,\\nUs ne khushbu ki tarah meri pazeerai ki." },
      { id: "parveen-woh", title: "Woh Toh Khushbu Hai", content: "Woh toh khushbu hai havaon mein bikhar jayega,\\nMasla phool ka hai phool kidhar jayega?" },
      { id: "parveen-kaisa", title: "Kaisa Yeh Ishq", content: "Kaisa yeh ishq hai, kaisa yeh khumar hai,\\nTu mera nahi hai, phir bhi tera intezaar hai." },
      { id: "parveen-chal", title: "Chal Ne Ka Hausla", content: "Chal ne ka hausla nahi, rukna muhaal kar diya,\\nIshq ke is safar ne toh, mujhko nidhaal kar diya." }
    ]
  }
];

export default function App() {
`;

content = content.replace('export default function App() {', POETS_DATA_STR);

// Add States
content = content.replace(
  'const [favorites, setFavorites] = useState([]);',
  `const [favorites, setFavorites] = useState([]);
  const [favoritePoems, setFavoritePoems] = useState([]);
  const [selectedPoet, setSelectedPoet] = useState(null);
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [poemSource, setPoemSource] = useState(null);`
);

// Add to handleAuthLogin & refreshCurrentUser
content = content.replace(
  'setFavorites(user.favorites || []);',
  'setFavorites(user.favorites || []);\n    setFavoritePoems(user.favoritePoems || []);'
);
content = content.replace(
  'setFavorites(user.favorites || []);',
  'setFavorites(user.favorites || []);\n    setFavoritePoems(user.favoritePoems || []);'
);
content = content.replace(
  'setFavorites([]);',
  'setFavorites([]);\n      setFavoritePoems([]);'
);
content = content.replace(
  'setFavorites([]);',
  'setFavorites([]);\n      setFavoritePoems([]);'
);

// Add toggleFavoritePoem function and favPoemsData
const togglePoemFn = `
  const toggleFavoritePoem = async (poemId, e) => {
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

  const favPoemsData = useMemo(() => {
    return POETS_DATA.flatMap((poet) => poet.poems).filter((poem) => favoritePoems.includes(poem.id));
  }, [favoritePoems]);

`;
content = content.replace('const englishBooks = useMemo(', togglePoemFn + 'const englishBooks = useMemo(');

// Add POETRY to Desktop Nav
const desktopNavRegex = /<button[\s\S]*?onClick=\{\(\) => navigateTo\("about"\)\}[\s\S]*?>[\s\S]*?ABOUT[\s\S]*?<\/button>/;
const newDesktopNav = `<button
                onClick={() => navigateTo("poetry")}
                className={\`px-3 py-1.5 rounded font-semibold text-sm hover:bg-[#4E1A27] hover:text-[#FFD59F] transition \${(activeTab === "poetry" || activeTab === "poet_profile" || activeTab === "poem_view") ? "bg-[#4E1A27] text-[#FFD59F]" : ""}\`}
              >
                POETRY
              </button>
              <button
                onClick={() => navigateTo("about")}
                className={\`px-3 py-1.5 rounded font-semibold text-sm hover:bg-[#4E1A27] hover:text-[#FFD59F] transition \${activeTab === "about" ? "bg-[#4E1A27] text-[#FFD59F]" : ""}\`}
              >
                ABOUT
              </button>`;
content = content.replace(desktopNavRegex, newDesktopNav);

// Add POETRY to Mobile Nav
const mobileNavRegex = /<button[\s\S]*?onClick=\{\(\) => navigateTo\("about"\)\}[\s\S]*?>[\s\S]*?ABOUT KALAAM[\s\S]*?<\/button>/;
const newMobileNav = `<button
                  onClick={() => navigateTo("poetry")}
                  className={\`w-full text-left px-4 py-3 rounded font-bold tracking-wider text-sm hover:bg-[#FFD59F]/10 \${(activeTab === "poetry" || activeTab === "poet_profile" || activeTab === "poem_view") ? "bg-[#FFD59F]/10 text-[#FFD59F]" : "text-gray-300"}\`}
                >
                  POETRY
                </button>
                <button
                  onClick={() => navigateTo("about")}
                  className={\`w-full text-left px-4 py-3 rounded font-bold tracking-wider text-sm hover:bg-[#FFD59F]/10 \${activeTab === "about" ? "bg-[#FFD59F]/10 text-[#FFD59F]" : "text-gray-300"}\`}
                >
                  ABOUT KALAAM
                </button>`;
content = content.replace(mobileNavRegex, newMobileNav);

// Replace Hero Buttons
const heroRegex = /<div className="pt-6 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center relative z-20 w-full sm:w-auto">[\s\S]*?<\/div>/;
const newHeroButton = `<div className="pt-6 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center relative z-20 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        showToast("Please login to view the poetry section.", "info");
                        return;
                      }
                      navigateTo("poetry");
                    }}
                    className="w-full sm:w-auto bg-[#FFD59F] text-[#4E1A27] hover:bg-[#e6b87e] font-bold py-3 sm:py-2.5 px-8 rounded-lg transition transform active:scale-95 shadow-[0_4px_14px_rgba(255,213,159,0.3)] text-xs sm:text-sm uppercase tracking-wider"
                  >
                    Poetry by Kalaam
                  </button>
                </div>`;
content = content.replace(heroRegex, newHeroButton);


// Add the Poetry JSX views
const poetryJSX = `
        {activeTab === "poetry" && (
          <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out]">
            <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
              <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-[#FFD59F]/70">
                LITERARY MASTERS
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif text-[#FFD59F]">
                Poetry by Kalaam
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                Discover the immortal words of legendary poets. Select a profile to read their masterpieces.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {POETS_DATA.map((poet) => (
                <div 
                  key={poet.id}
                  onClick={() => {
                    setSelectedPoet(poet);
                    setSelectedPoem(null);
                    navigateTo("poet_profile");
                  }}
                  className="cursor-pointer bg-[#6a2536]/40 border border-[#FFD59F]/30 p-6 rounded-xl flex flex-col items-center text-center hover:border-[#FFD59F] hover:-translate-y-1 transition-all duration-300 group"
                >
                  <img src={poet.avatar} alt={poet.name} className="w-24 h-24 rounded-full object-cover border-2 border-[#FFD59F] mb-4 group-hover:scale-105 transition" />
                  <h3 className="text-lg font-bold font-serif text-[#FFD59F]">{poet.name}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-300 font-light mt-2 line-clamp-3">
                    {poet.description}
                  </p>
                  <button className="mt-4 text-[#FFD59F] text-xs font-bold uppercase tracking-widest group-hover:text-[#e6b87e] flex items-center gap-1">
                    Read <Feather className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "poet_profile" && selectedPoet && (
          <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out]">
            <button 
              onClick={() => navigateTo("poetry")}
              className="text-[#FFD59F] text-sm font-bold flex items-center gap-2 hover:opacity-80 transition"
            >
              &larr; Back to Poets
            </button>
            
            <div className="bg-[#6a2536]/40 border border-[#FFD59F]/20 p-6 sm:p-10 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-10">
              <img src={selectedPoet.avatar} alt={selectedPoet.name} className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-[#FFD59F] shadow-lg shrink-0" />
              <div className="space-y-4 text-center md:text-left">
                <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#FFD59F]">
                  {selectedPoet.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed max-w-2xl">
                  {selectedPoet.bio}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-serif text-[#FFD59F] border-b border-[#FFD59F]/20 pb-2">
                Selected Works
              </h2>
              <div className="flex flex-col gap-3">
                {selectedPoet.poems.map((poem) => (
                  <div key={poem.id} className="bg-[#6a2536]/30 border border-[#FFD59F]/10 p-4 rounded-lg flex justify-between items-center hover:bg-[#6a2536]/50 transition cursor-pointer"
                    onClick={() => {
                      setSelectedPoem(poem);
                      setPoemSource("poet_profile");
                      navigateTo("poem_view");
                    }}
                  >
                    <h3 className="text-lg font-bold font-serif text-[#FFD59F]">{poem.title}</h3>
                    <div className="flex gap-4">
                       <button
                          onClick={(e) => toggleFavoritePoem(poem.id, e)}
                          className="text-[#FFD59F]/50 hover:text-[#FFD59F] transition z-10"
                        >
                          <Heart className={\`w-5 h-5 \${favoritePoems.includes(poem.id) ? "fill-[#FFD59F] text-[#FFD59F]" : ""}\`} />
                        </button>
                        <span className="text-[#FFD59F] font-bold text-sm">Read &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "poem_view" && selectedPoem && (
          <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out]">
            <button 
              onClick={() => {
                if (poemSource === "favorites") navigateTo("favorites");
                else navigateTo("poet_profile");
              }}
              className="text-[#FFD59F] text-sm font-bold flex items-center gap-2 hover:opacity-80 transition"
            >
              &larr; Back
            </button>
            <div className="bg-[#6a2536]/40 border border-[#FFD59F]/20 p-8 sm:p-12 rounded-2xl flex flex-col items-center">
              <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#FFD59F] mb-6">{selectedPoem.title}</h1>
              <div className="whitespace-pre-wrap text-center text-lg sm:text-2xl font-serif text-gray-300 leading-relaxed max-w-2xl">
                {selectedPoem.content}
              </div>
              <button
                onClick={(e) => toggleFavoritePoem(selectedPoem.id, e)}
                className="mt-8 flex items-center gap-2 text-[#FFD59F] border border-[#FFD59F]/30 px-6 py-2 rounded-full hover:bg-[#FFD59F]/10 transition"
              >
                <Heart className={\`w-5 h-5 \${favoritePoems.includes(selectedPoem.id) ? "fill-[#FFD59F]" : ""}\`} />
                {favoritePoems.includes(selectedPoem.id) ? "Favorited" : "Add to Favorites"}
              </button>
            </div>
          </section>
        )}
`;

content = content.replace('{activeTab === "about" && (', poetryJSX + '\n        {activeTab === "about" && (');

// Update Favorites view
const favoritesRegex = /\{activeTab === "favorites" && \([\s\S]*?<\/section>\s*\)}/;
const newFavoritesJSX = `{activeTab === "favorites" && (
          <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out]">
            <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
              <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-[#FFD59F]/70">
                YOUR COLLECTION
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif text-[#FFD59F]">
                My Favorites
              </h1>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#FFD59F] border-b border-[#FFD59F]/20 pb-2 mb-4">Books</h2>
                {favoriteBooks.length === 0 ? (
                  <div className="text-center py-10 bg-[#6a2536]/20 rounded-xl border border-[#FFD59F]/10">
                    <Heart className="w-10 h-10 mx-auto text-[#FFD59F]/20 mb-3" />
                    <p className="text-sm text-gray-400">No favorite books yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {favoriteBooks.map((book) => (
                      <BookRow key={book._id} book={book} onOpen={() => { setBookModal({ isOpen: true, bookId: book._id }); }} currentUser={currentUser} toggleFavorite={toggleFavorite} favorites={favorites} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold font-serif text-[#FFD59F] border-b border-[#FFD59F]/20 pb-2 mb-4">Poems</h2>
                {favPoemsData.length === 0 ? (
                  <div className="text-center py-10 bg-[#6a2536]/20 rounded-xl border border-[#FFD59F]/10">
                    <Feather className="w-10 h-10 mx-auto text-[#FFD59F]/20 mb-3" />
                    <p className="text-sm text-gray-400">No favorite poems yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {favPoemsData.map((poem) => (
                      <div key={poem.id} className="bg-[#6a2536]/30 border border-[#FFD59F]/10 p-4 rounded-lg flex justify-between items-center hover:bg-[#6a2536]/50 transition cursor-pointer"
                        onClick={() => {
                          setSelectedPoem(poem);
                          setPoemSource("favorites");
                          navigateTo("poem_view");
                        }}
                      >
                        <h3 className="text-lg font-bold font-serif text-[#FFD59F]">{poem.title}</h3>
                        <div className="flex gap-4">
                           <button onClick={(e) => toggleFavoritePoem(poem.id, e)} className="text-[#FFD59F] transition z-10">
                              <Heart className="w-5 h-5 fill-[#FFD59F] text-[#FFD59F]" />
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}`;
content = content.replace(favoritesRegex, newFavoritesJSX);

fs.writeFileSync('src/App.jsx', content);
