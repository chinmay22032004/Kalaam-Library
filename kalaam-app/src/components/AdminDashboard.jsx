import { useState, useEffect } from "react";
import { Shield, CloudUpload, Loader, Trash2 } from "lucide-react";

export default function AdminDashboard({
  books,
  setBooks,
  api,
  token,
  showToast,
  navigateTo,
  onAdminTransfer,
  currentUser,
  settings,
  onSettingsChange,
}) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [aboutLoading, setAboutLoading] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    genre: "",
    language: "english",
    availability: "Available",
    givenBy: "",
    coverUrl: "",
    summary2: "",
    summary4: "",
  });
  const [aboutForm, setAboutForm] = useState({
    mission: "",
    pillar1Title: "",
    pillar1Desc: "",
    pillar2Title: "",
    pillar2Desc: "",
  });
  const [spotlightForm, setSpotlightForm] = useState({
    title: "Spotlight: Historical Poet of the Day",
    name: "",
    description: "",
  });
  const [quoteForm, setQuoteForm] = useState({
    title: "Thought of the Day",
    quote: "",
    author: "",
  });

  const handleAddBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newBook = await api.addBook(bookForm, token);
      setBooks([...books, newBook]);
      showToast("Book added to database.");
      setBookForm({
        title: "",
        author: "",
        genre: "",
        language: "english",
        availability: "Available",
        givenBy: "",
        coverUrl: "",
        summary2: "",
        summary4: "",
      });
    } catch {
      showToast("Error adding book.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id, title) => {
    try {
      await api.deleteBook(id, token);
      setBooks(books.filter((b) => b.id !== id));
      showToast(`Deleted "${title}".`);
    } catch {
      showToast("Error deleting book.", "error");
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingUsers(true);
      try {
        const list = await api.getUsers(token);
        if (mounted) setUsers(list);
      } catch {
        showToast("Unable to fetch users.", "error");
      } finally {
        setLoadingUsers(false);
      }
    })();
    return () => (mounted = false);
  }, [api, showToast, token]);

  useEffect(() => {
    if (!settings) return;
    const id = window.setTimeout(() => {
      if (settings.about) setAboutForm({ ...settings.about });
      if (settings.spotlight) setSpotlightForm({ ...settings.spotlight });
      if (settings.quote) setQuoteForm({ ...settings.quote });
    }, 0);
    return () => window.clearTimeout(id);
  }, [settings]);

  const handleMakeAdmin = async (userId) => {
    if (!confirm("Transfer admin rights to this user?")) return;
    try {
      await api.transferAdmin(token, userId);
      const list = await api.getUsers(token);
      setUsers(list);
      showToast("Admin rights transferred.");
      onAdminTransfer?.("Admin rights transferred. You are no longer admin.");
    } catch (err) {
      showToast(err?.message || "Failed to transfer admin", "error");
      onAdminTransfer?.();
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Delete user ${userName}? This cannot be undone.`)) return;
    try {
      await api.deleteUser(token, userId);
      const list = await api.getUsers(token);
      setUsers(list);
      showToast(`Deleted user ${userName}.`);
    } catch (err) {
      showToast(err?.message || "Failed to delete user", "error");
    }
  };

  const handleUpdateAbout = async (e) => {
    e.preventDefault();
    setAboutLoading(true);
    try {
      const [updatedAbout, updatedSpotlight, updatedQuote] = await Promise.all([
        api.updateSettings("about", aboutForm, token),
        api.updateSettings("spotlight", spotlightForm, token),
        api.updateSettings("quote", quoteForm, token),
      ]);
      onSettingsChange?.({
        ...settings,
        about: updatedAbout,
        spotlight: updatedSpotlight,
        quote: updatedQuote,
      });
      showToast("Site content updated.");
    } catch (err) {
      showToast(err?.message || "Failed to update site content", "error");
    } finally {
      setAboutLoading(false);
    }
  };

  return (
    <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out] w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#FFD59F]/20 pb-4 gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFD59F]">
            Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-red-400 mt-1 font-semibold flex items-center gap-1">
            <Shield className="w-4 h-4" /> Authenticated Request
          </p>
        </div>
        <button
          onClick={() => navigateTo("home")}
          className="w-full sm:w-auto text-sm border border-[#FFD59F]/30 px-4 py-2 rounded hover:bg-[#FFD59F]/10 transition"
        >
          Exit Admin
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="flex flex-col gap-6 h-fit order-2 lg:order-1">
          <div className="bg-[#6a2536]/40 border border-[#FFD59F]/30 rounded-xl p-4 sm:p-6 w-full">
            <h2 className="text-lg sm:text-xl font-bold mb-4 border-b border-[#FFD59F]/20 pb-2">
              POST /api/books
            </h2>
            <form onSubmit={handleAddBook} className="space-y-4">
              {["title", "author", "givenBy"].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1 capitalize">
                    {field === "givenBy" ? "Given by" : field}
                  </label>
                  <input
                    required
                    value={bookForm[field]}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, [field]: e.target.value })
                    }
                    className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                  />
                </div>
              ))}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                    2-line summary
                  </label>
                  <textarea
                    rows={2}
                    value={bookForm.summary2}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, summary2: e.target.value })
                    }
                    className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    placeholder="Add a concise two line summary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                    4-line summary
                  </label>
                  <textarea
                    rows={3}
                    value={bookForm.summary4}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, summary4: e.target.value })
                    }
                    className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    placeholder="Add a full four line summary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                    Cover image URL
                  </label>
                  <input
                    value={bookForm.coverUrl}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, coverUrl: e.target.value })
                    }
                    placeholder="Paste the book image address here"
                    className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                    Language
                  </label>
                  <select
                    value={bookForm.language}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, language: e.target.value })
                    }
                    className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi/Urdu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                    Status
                  </label>
                  <select
                    value={bookForm.availability}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, availability: e.target.value })
                    }
                    className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Checked Out">Checked Out</option>
                  </select>
                </div>
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-[#FFD59F] text-[#4E1A27] font-bold py-3 sm:py-2.5 rounded hover:bg-[#e6b87e] transition shadow-md flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <CloudUpload className="w-4 h-4" />
                )}{" "}
                Save Book
              </button>
            </form>
          </div>

          <div className="bg-[#6a2536]/40 border border-[#FFD59F]/30 rounded-xl p-4 sm:p-6 w-full">
            <h2 className="text-lg sm:text-xl font-bold mb-4 border-b border-[#FFD59F]/20 pb-2">
              Edit Site Content
            </h2>
            <form onSubmit={handleUpdateAbout} className="space-y-6">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[#FFD59F] mb-3">
                  Spotlight Section
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Spotlight title
                    </label>
                    <input
                      value={spotlightForm.title}
                      onChange={(e) =>
                        setSpotlightForm({
                          ...spotlightForm,
                          title: e.target.value,
                        })
                      }
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Spotlight name
                    </label>
                    <input
                      value={spotlightForm.name}
                      onChange={(e) =>
                        setSpotlightForm({
                          ...spotlightForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Spotlight description
                    </label>
                    <textarea
                      rows={3}
                      value={spotlightForm.description}
                      onChange={(e) =>
                        setSpotlightForm({
                          ...spotlightForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[#FFD59F] mb-3">
                  Thought of the Day
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Quote title
                    </label>
                    <input
                      value={quoteForm.title}
                      onChange={(e) =>
                        setQuoteForm({ ...quoteForm, title: e.target.value })
                      }
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Quote text
                    </label>
                    <textarea
                      rows={3}
                      value={quoteForm.quote}
                      onChange={(e) =>
                        setQuoteForm({ ...quoteForm, quote: e.target.value })
                      }
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Quote author
                    </label>
                    <input
                      value={quoteForm.author}
                      onChange={(e) =>
                        setQuoteForm({ ...quoteForm, author: e.target.value })
                      }
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[#FFD59F] mb-3">
                  About Page
                </h3>
                <div>
                  <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                    Mission text
                  </label>
                  <textarea
                    rows={3}
                    value={aboutForm.mission}
                    onChange={(e) =>
                      setAboutForm({ ...aboutForm, mission: e.target.value })
                    }
                    className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Pillar 1 headline
                    </label>
                    <input
                      value={aboutForm.pillar1Title}
                      onChange={(e) =>
                        setAboutForm({
                          ...aboutForm,
                          pillar1Title: e.target.value,
                        })
                      }
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Pillar 1 detail
                    </label>
                    <textarea
                      rows={2}
                      value={aboutForm.pillar1Desc}
                      onChange={(e) =>
                        setAboutForm({
                          ...aboutForm,
                          pillar1Desc: e.target.value,
                        })
                      }
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Pillar 2 headline
                    </label>
                    <input
                      value={aboutForm.pillar2Title}
                      onChange={(e) =>
                        setAboutForm({
                          ...aboutForm,
                          pillar2Title: e.target.value,
                        })
                      }
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Pillar 2 detail
                    </label>
                    <textarea
                      rows={2}
                      value={aboutForm.pillar2Desc}
                      onChange={(e) =>
                        setAboutForm({
                          ...aboutForm,
                          pillar2Desc: e.target.value,
                        })
                      }
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={aboutLoading}
                className="w-full bg-[#FFD59F] text-[#4E1A27] font-bold py-3 rounded hover:bg-[#e6b87e] transition"
              >
                {aboutLoading ? "Saving..." : "Save Site Content"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#4E1A27] border border-[#FFD59F]/30 rounded-xl overflow-hidden flex flex-col h-fit order-1 lg:order-2 w-full">
          <div className="p-4 sm:p-6 border-b border-[#FFD59F]/20 bg-[#6a2536]/20">
            <h2 className="text-lg sm:text-xl font-bold">
              Manage Cloud Library
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-300 mt-1">
              Simulating documents fetched from MongoDB
            </p>
          </div>

          <div className="p-3 sm:p-4 space-y-4 border-b border-[#FFD59F]/10">
            <h3 className="text-sm sm:text-base font-bold">Users</h3>
            {loadingUsers ? (
              <div className="text-sm text-gray-300">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-sm text-gray-400">
                No users registered yet.
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between gap-3 bg-[#6a2536]/30 p-2 rounded"
                  >
                    <div>
                      <div className="font-bold text-sm text-[#FFD59F]">
                        {u.displayName || u.mobile}
                      </div>
                      <div className="text-xs text-gray-400">
                        {u.mobile}{" "}
                        {u.isAdmin && (
                          <span className="ml-2 text-[11px] px-2 py-0.5 bg-yellow-700 text-[#4E1A27] rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMakeAdmin(u.id)}
                          disabled={u.isAdmin}
                          className="text-xs bg-[#FFD59F] text-[#4E1A27] px-3 py-1 rounded font-bold"
                        >
                          Make Admin
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteUser(u.id, u.displayName || u.mobile)
                          }
                          disabled={u.isAdmin || u.id === currentUser?.id}
                          className="text-xs bg-red-600 text-white px-3 py-1 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 sm:p-4 space-y-3">
            {books.length === 0 ? (
              <p className="text-center py-6 text-[#FFD59F]/60 text-sm">
                Library is empty.
              </p>
            ) : (
              books.map((book) => (
                <div
                  key={book.id}
                  className="flex justify-between items-center bg-[#6a2536]/30 p-3 sm:p-4 rounded-lg border border-[#FFD59F]/10"
                >
                  <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                    <img
                      src={book.coverUrl || "https://via.placeholder.com/32"}
                      className="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded shrink-0"
                      alt="Cover"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#FFD59F] text-xs sm:text-sm truncate">
                        {book.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                        By {book.author}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBook(book.id, book.title)}
                    className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition flex items-center justify-center ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
