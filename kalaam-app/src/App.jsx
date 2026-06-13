import { useState, useEffect, useMemo } from "react";
import {
  Heart,
  Search,
  Menu,
  X,
  Lock,
  Unlock,
  Feather,
  Quote,
  Lightbulb,
  CheckCircle,
  Instagram,
  Youtube,
  Loader,
  CheckCircle2,
  XCircle,
  UserCog,
} from "lucide-react";
import { api } from "./api/mockApi";
import BookRow from "./components/BookRow";
import BookDetailsModal from "./components/BookDetailsModal";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [books, setBooks] = useState([]);
  const [settings, setSettings] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [jwtToken, setJwtToken] = useState(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState({ english: "", hindi: "" });
  const [bookModal, setBookModal] = useState({
    isOpen: false,
    bookId: null,
    summarySize: 2,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, settingsData] = await Promise.all([
          api.getBooks(),
          api.getSettings(),
        ]);
        setBooks(booksData);
        setSettings(settingsData);
      } catch {
        showToast("Error connecting to server.", "error");
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchData();
  }, []);

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminLogin = async () => {
    setAuthLoading(true);
    try {
      const response = await api.login(adminPassword);
      setJwtToken(response.token);
      setAdminModalOpen(false);
      setAdminPassword("");
      showToast("Admin portal unlocked.");
      navigateTo("admin");
    } catch {
      showToast("Incorrect password.", "error");
    } finally {
      setAuthLoading(false);
    }
  };

  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
      showToast("Removed from favorites.", "info");
    } else {
      setFavorites([...favorites, id]);
      showToast("Added to favorites.");
    }
  };

  const englishBooks = useMemo(
    () =>
      books.filter(
        (b) =>
          b.language === "english" &&
          (b.title.toLowerCase().includes(searchQuery.english.toLowerCase()) ||
            b.author.toLowerCase().includes(searchQuery.english.toLowerCase())),
      ),
    [books, searchQuery.english],
  );
  const hindiBooks = useMemo(
    () =>
      books.filter(
        (b) =>
          b.language === "hindi" &&
          (b.title.toLowerCase().includes(searchQuery.hindi.toLowerCase()) ||
            b.author.toLowerCase().includes(searchQuery.hindi.toLowerCase())),
      ),
    [books, searchQuery.hindi],
  );
  const favoriteBooks = useMemo(
    () => books.filter((b) => favorites.includes(b.id)),
    [books, favorites],
  );

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#4E1A27] flex items-center justify-center text-[#FFD59F]">
        <Loader className="w-12 h-12 animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#4E1A27] text-[#FFD59F] font-sans selection:bg-[#FFD59F] selection:text-[#4E1A27] overflow-x-hidden">
      {/* Header Navigation */}
      <header
        style={{ height: "55px" }}
        className="fixed top-0 left-0 w-full bg-[#FFD59F] text-[#4E1A27] flex items-center justify-between px-3 sm:px-8 z-50 shadow-md"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo("home")}
            className={`px-2 sm:px-3 py-1.5 rounded font-bold tracking-widest text-xs sm:text-sm hover:bg-[#4E1A27] hover:text-[#FFD59F] transition ${activeTab === "home" ? "bg-[#4E1A27] text-[#FFD59F]" : ""}`}
          >
            HOME
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
          <button
            onClick={() => navigateTo("about")}
            className={`px-3 py-1.5 rounded font-semibold text-sm hover:bg-[#4E1A27] hover:text-[#FFD59F] transition ${activeTab === "about" ? "bg-[#4E1A27] text-[#FFD59F]" : ""}`}
          >
            ABOUT
          </button>
          <button
            onClick={() => navigateTo("favorites")}
            className={`px-3 py-1.5 rounded font-semibold text-sm hover:bg-[#4E1A27] hover:text-[#FFD59F] transition flex items-center gap-1 ${activeTab === "favorites" ? "bg-[#4E1A27] text-[#FFD59F]" : ""}`}
          >
            <Heart className="w-4 h-4 text-red-700 fill-current" /> MY
            FAVOURITES
            <span className="bg-[#4E1A27] text-[#FFD59F] text-xs px-2 py-0.5 rounded-full font-bold ml-1">
              {favorites.length}
            </span>
          </button>
          {jwtToken && (
            <button
              onClick={() => navigateTo("admin")}
              className="px-3 py-1.5 rounded font-bold text-sm bg-red-800 text-[#FFD59F] hover:bg-red-700 transition flex items-center gap-1"
            >
              <Unlock className="w-4 h-4" /> ADMIN
            </button>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => navigateTo("favorites")}
            className="relative text-[#4E1A27] p-2"
          >
            <Heart className="w-5 h-5" />
            <span className="absolute top-0 right-0 bg-[#4E1A27] text-[#FFD59F] text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {favorites.length}
            </span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#4E1A27] p-2 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{ top: "55px" }}
          className="fixed left-0 w-full bg-[#FFD59F] text-[#4E1A27] z-40 border-t border-[#4E1A27]/20 shadow-lg flex flex-col p-4 space-y-3 md:hidden"
        >
          <button
            onClick={() => navigateTo("home")}
            className="text-left font-bold py-3 px-4 hover:bg-[#4E1A27] hover:text-[#FFD59F] rounded transition"
          >
            HOME
          </button>
          <button
            onClick={() => navigateTo("about")}
            className="text-left font-bold py-3 px-4 hover:bg-[#4E1A27] hover:text-[#FFD59F] rounded transition"
          >
            ABOUT KALAAM
          </button>
          {jwtToken && (
            <button
              onClick={() => navigateTo("admin")}
              className="text-left font-bold py-3 px-4 bg-red-800 text-[#FFD59F] rounded transition"
            >
              ADMIN DASHBOARD
            </button>
          )}
        </div>
      )}

      {/* Responsive Left Strip (8px on mobile, 15px on desktop) */}
      <div
        className="fixed left-0 sm:w-4 w-2 bg-[#FFD59F] z-30 shadow-[2px_0_10px_rgba(0,0,0,0.3)]"
        style={{ top: "55px", bottom: "55px" }}
      ></div>

      {/* Main Container - Added carefully calculated padding-left to clear the left strip on mobile */}
      <main className="grow pt-20 pb-20 pl-6 pr-4 sm:pr-8 sm:pl-10 md:pl-14 lg:pl-16 w-full max-w-full overflow-hidden box-border">
        {activeTab === "home" && (
          <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out]">
            <div
              className="relative overflow-hidden rounded-2xl border border-[#FFD59F]/30 p-4 sm:p-10 shadow-2xl flex flex-col items-center justify-center min-h-[45vh] md:min-h-[55vh]"
              style={{
                background: "linear-gradient(135deg, #6a2536 0%, #4E1A27 100%)",
              }}
            >
              <div className="absolute -right-16 -bottom-16 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-[#FFD59F]/5 pointer-events-none"></div>
              <div className="absolute -left-16 -top-16 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-[#FFD59F]/5 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
                <div className="flex flex-col items-center">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif text-[#FFD59F] text-center tracking-widest sm:tracking-widest drop-shadow-2xl">
                    Kalaam Library
                  </h1>
                  <div className="flex items-center gap-2 sm:gap-4 mt-3 opacity-80">
                    <div
                      className="h-px w-8 sm:w-24"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, #FFD59F)",
                      }}
                    ></div>
                    <Feather className="text-[#FFD59F] w-4 h-4 sm:w-5 sm:h-5 drop-shadow-md" />
                    <div
                      className="h-px w-8 sm:w-24"
                      style={{
                        background:
                          "linear-gradient(270deg, transparent, #FFD59F)",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-8 text-center space-y-4 px-2 sm:px-4 relative max-w-3xl w-full">
                  <Quote className="absolute -top-2 left-0 md:-left-6 w-6 h-6 md:w-12 md:h-12 text-[#FFD59F]/10 transform -scale-x-100 hidden sm:block" />
                  <Quote className="absolute -bottom-2 right-0 md:-right-6 w-6 h-6 md:w-12 md:h-12 text-[#FFD59F]/10 hidden sm:block" />

                  <p className="font-serif text-xl sm:text-3xl lg:text-4xl leading-relaxed md:leading-[1.7] font-bold text-[#FFD59F] drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] pt-2 relative z-10 w-full">
                    मैं अकेला ही चला था जानिब-ए-मंज़िल मगर
                    <br />
                    लोग साथ आते गए और कारवाँ बनता गया
                  </p>
                  <p className="font-serif text-sm sm:text-xl text-[#e6b87e] font-semibold tracking-wider opacity-90 drop-shadow-md pt-1 relative z-10">
                    — मजरूह सुल्तानपुरी —
                  </p>
                </div>

                <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center relative z-20 w-full sm:w-auto">
                  <button
                    onClick={() => navigateTo("english")}
                    className="w-full sm:w-auto bg-[#FFD59F] text-[#4E1A27] hover:bg-[#e6b87e] font-bold py-3 sm:py-2.5 px-8 rounded-lg transition transform active:scale-95 shadow-[0_4px_14px_rgba(255,213,159,0.3)] text-xs sm:text-sm uppercase tracking-wider"
                  >
                    English
                  </button>
                  <button
                    onClick={() => navigateTo("hindi")}
                    className="w-full sm:w-auto border-2 border-[#FFD59F] text-[#FFD59F] hover:bg-[#FFD59F]/10 font-bold py-3 sm:py-2.5 px-8 rounded-lg transition active:scale-95 text-xs sm:text-sm uppercase tracking-wider shadow-md"
                  >
                    Hindi & Urdu
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-[#6a2536]/40 border border-[#FFD59F]/20 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-wider text-[#FFD59F]/70">
                    <Feather className="w-3 h-3 sm:w-4 sm:h-4" /> Spotlight:
                    Historical Poet of the Day
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#FFD59F]">
                    {settings?.spotlight?.name}
                  </h2>
                  <p
                    className="text-xs sm:text-sm font-light leading-relaxed text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: settings?.spotlight?.description,
                    }}
                  ></p>
                </div>
              </div>

              <div className="bg-[#FFD59F] text-[#4E1A27] rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2">
                    <Lightbulb className="w-3 h-3" /> Thought of the Day
                  </div>
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 opacity-30 transform -scale-x-100" />
                  <p className="font-serif italic font-semibold text-base sm:text-lg leading-snug">
                    "{settings?.quote?.quote}"
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold tracking-wider uppercase opacity-80 text-right">
                    - {settings?.quote?.author}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "about" && (
          <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out]">
            <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
              <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-[#FFD59F]/70">
                LITERARY HERITAGE
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#FFD59F]">
                Kalaam - The Official Poetry Club of NIT Rourkela
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                {settings?.about?.mission}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="bg-[#6a2536]/40 border border-[#FFD59F]/20 p-6 sm:p-8 rounded-xl space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#FFD59F]">
                  Our Core Pillars
                </h2>
                <ul className="space-y-4 text-sm font-light">
                  <li className="flex gap-3">
                    <CheckCircle className="text-[#FFD59F] w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base">
                        {settings?.about?.pillar1Title}
                      </h4>
                      <p className="text-gray-300 text-[11px] sm:text-xs mt-0.5">
                        {settings?.about?.pillar1Desc}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="text-[#FFD59F] w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base">
                        {settings?.about?.pillar2Title}
                      </h4>
                      <p className="text-gray-300 text-[11px] sm:text-xs mt-0.5">
                        {settings?.about?.pillar2Desc}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-[#FFD59F] text-[#4E1A27] p-6 sm:p-8 rounded-xl flex flex-col justify-between shadow-xl">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif">
                    Connect With Us
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    We are highly active across all prominent digital nodes.
                    Subscribe to our networks.
                  </p>
                </div>
                <div className="space-y-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#4E1A27]/20">
                  <a
                    href="https://www.instagram.com/kalaam_nitr/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-2 hover:bg-[#4E1A27]/10 rounded-lg transition font-semibold text-sm"
                  >
                    <Instagram className="w-5 h-5 text-red-700" /> @kalaam_nitr
                  </a>
                  <a
                    href="https://www.youtube.com/@kalaamnitr7728"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-2 hover:bg-[#4E1A27]/10 rounded-lg transition font-semibold text-sm"
                  >
                    <Youtube className="w-5 h-5 text-red-600" /> Kalaam NITR
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {(activeTab === "english" || activeTab === "hindi") && (
          <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#FFD59F] capitalize">
                  {activeTab} Cloud Library
                </h1>
                <p className="text-[11px] sm:text-xs text-gray-300 mt-1">
                  Explore our rich collection dynamically loaded via REST APIs.
                </p>
              </div>
              <div className="relative w-full sm:w-64 shrink-0">
                <input
                  type="text"
                  value={searchQuery[activeTab]}
                  onChange={(e) =>
                    setSearchQuery({
                      ...searchQuery,
                      [activeTab]: e.target.value,
                    })
                  }
                  placeholder="Search title or author..."
                  className="w-full bg-[#6a2536]/40 border border-[#FFD59F]/30 text-[#FFD59F] placeholder-[#FFD59F]/60 text-xs sm:text-sm px-4 py-2.5 sm:py-2 rounded-lg focus:outline-none focus:border-[#FFD59F] transition"
                />
                <Search className="absolute right-3 top-3 sm:top-2.5 w-4 h-4 text-[#FFD59F]/60" />
              </div>
            </div>

            <div className="relative rounded-xl border border-[#FFD59F]/30 bg-[#6a2536]/10 p-1 sm:p-2">
              <div className="flex flex-col w-full">
                {(activeTab === "english" ? englishBooks : hindiBooks)
                  .length === 0 ? (
                  <div className="py-12 text-center text-[#FFD59F]/60 italic text-sm">
                    No matching books found in this section.
                  </div>
                ) : (
                  (activeTab === "english" ? englishBooks : hindiBooks).map(
                    (book, idx) => (
                      <BookRow
                        key={book.id}
                        book={book}
                        idx={idx}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                        openModal={() =>
                          setBookModal({
                            isOpen: true,
                            bookId: book.id,
                            summarySize: 2,
                          })
                        }
                      />
                    ),
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "favorites" && (
          <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFD59F]">
                My Personal Vault
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-300 mt-1">
                Your saved books. Keep track of what touched your soul.
              </p>
            </div>

            {favoriteBooks.length === 0 ? (
              <div className="text-center py-12 sm:py-16 space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#6a2536]/40 flex items-center justify-center text-[#FFD59F]/40">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif">
                    No Favorites Added
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FFD59F]/60 mt-1">
                    Mark books from the Cloud Library as favorites.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {favoriteBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-[#6a2536]/40 border border-[#FFD59F]/30 p-5 sm:p-6 rounded-xl flex flex-col justify-between hover:border-[#FFD59F] transition duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold px-2 py-1 bg-[#FFD59F]/10 rounded">
                          {book.genre}
                        </span>
                        <button
                          onClick={(e) => toggleFavorite(book.id, e)}
                          className="text-red-700 hover:scale-110 transition"
                        >
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            book.coverUrl ||
                            "https://via.placeholder.com/60x84/4E1A27/FFD59F?text=Cover"
                          }
                          alt="Cover"
                          className="w-14 h-20 sm:w-16 sm:h-24 object-cover rounded border border-[#FFD59F]/20 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-xl font-bold font-serif text-[#FFD59F] truncate">
                            {book.title}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-[#FFD59F]/70 truncate">
                            By {book.author}
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-300 font-light italic leading-relaxed line-clamp-2 sm:line-clamp-3 mt-2">
                        {book.summary2}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setBookModal({
                          isOpen: true,
                          bookId: book.id,
                          summarySize: 2,
                        })
                      }
                      className="mt-4 w-full bg-[#FFD59F] text-[#4E1A27] font-bold text-xs py-2.5 sm:py-2 rounded hover:bg-[#e6b87e] transition"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "admin" && jwtToken && (
          <AdminDashboard
            books={books}
            setBooks={setBooks}
            api={api}
            token={jwtToken}
            showToast={showToast}
            navigateTo={navigateTo}
          />
        )}
      </main>

      <footer
        style={{ height: "55px" }}
        className="fixed bottom-0 left-0 w-full bg-[#FFD59F] text-[#4E1A27] flex items-center justify-between px-3 sm:px-8 z-40 shadow-inner"
      >
        <span className="text-[9px] sm:text-xs font-semibold tracking-wider">
          © 2026 KALAAM - SAC NITR
        </span>
        <div className="flex items-center gap-3 sm:gap-6 text-sm">
          {!jwtToken && (
            <button
              onClick={() => setAdminModalOpen(true)}
              className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 sm:py-1 bg-[#4E1A27] text-[#FFD59F] rounded hover:bg-[#6a2536] transition mr-1 sm:mr-4 flex items-center gap-1"
            >
              <UserCog className="w-3 h-3 hidden sm:block" /> Admin
            </button>
          )}
          <a href="#" className="hover:text-red-700 transition">
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a href="#" className="hover:text-red-600 transition">
            <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </footer>

      {toast && (
        <div className="fixed bottom-20 sm:bottom-20 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 w-[90%] sm:w-auto z-50 p-3 sm:p-4 rounded-xl border border-[#4E1A27]/20 shadow-lg bg-[#FFD59F] text-[#4E1A27] flex items-center gap-3 animate-[fadeIn_0.3s_ease-out]">
          {toast.type === "success" ? (
            <CheckCircle2 className="text-green-700 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          ) : (
            <XCircle className="text-red-600 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          )}
          <div className="text-xs font-bold font-serif tracking-wide">
            {toast.message}
          </div>
        </div>
      )}

      {bookModal.isOpen && (
        <BookDetailsModal
          book={books.find((b) => b.id === bookModal.bookId)}
          close={() =>
            setBookModal({ isOpen: false, bookId: null, summarySize: 2 })
          }
          summarySize={bookModal.summarySize}
          setSummarySize={(size) =>
            setBookModal({ ...bookModal, summarySize: size })
          }
          isFav={favorites.includes(bookModal.bookId)}
          toggleFav={() => toggleFavorite(bookModal.bookId)}
        />
      )}

      {adminModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#4E1A27] border border-[#FFD59F]/40 p-6 sm:p-8 rounded-xl max-w-sm w-full shadow-2xl space-y-5 sm:space-y-6">
            <div className="text-center">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFD59F] mx-auto mb-2" />
              <h3 className="text-lg sm:text-xl font-bold text-[#FFD59F] font-serif">
                Admin Auth
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-300 mt-1">
                Hint: admin
              </p>
            </div>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
              className="w-full bg-[#6a2536]/50 border border-[#FFD59F]/30 p-3 rounded text-center text-[#FFD59F] tracking-widest focus:outline-none focus:border-[#FFD59F]"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setAdminModalOpen(false)}
                className="flex-1 border border-[#FFD59F]/30 text-[#FFD59F] hover:bg-[#FFD59F]/10 font-bold py-2 rounded text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                disabled={authLoading}
                className="flex-1 bg-[#FFD59F] text-[#4E1A27] font-bold py-2 rounded text-sm hover:bg-[#e6b87e] transition shadow-md flex items-center justify-center"
              >
                {authLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Unlock"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
