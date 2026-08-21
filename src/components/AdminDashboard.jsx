import { useState, useEffect } from "react";
import { 
  Shield, CloudUpload, Loader, Trash2, Edit, Save,
  ArrowLeft, Users, BookOpen, Layout, PlusCircle 
} from "lucide-react";

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
  const [activeView, setActiveView] = useState("grid"); // grid, users, books, content, add, edit

  const [editingBookId, setEditingBookId] = useState(null);
  const [isNewGenre, setIsNewGenre] = useState(false);
  const [isEditNewGenre, setIsEditNewGenre] = useState(false);
  const [editBookForm, setEditBookForm] = useState({
    title: "", author: "", genre: "", language: "english",
    givenBy: "", coverUrl: "", summary: "", copies: 1,
  });

  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [aboutLoading, setAboutLoading] = useState(false);
  
  const [bookForm, setBookForm] = useState({
    title: "", author: "", genre: "", language: "english",
    givenBy: "", coverUrl: "", summary: "", copies: 1,
  });
  
  const [aboutForm, setAboutForm] = useState({
    mission: "", pillar1Title: "", pillar1Desc: "",
    pillar2Title: "", pillar2Desc: "",
  });
  
  const [spotlightForm, setSpotlightForm] = useState({
    title: "Spotlight: Historical Poet of the Day", name: "", description: "",
  });
  
  const [quoteForm, setQuoteForm] = useState({
    title: "Thought of the Day", quote: "", author: "",
  });

  const handleEditClick = (book) => {
    setEditingBookId(book.id);
    setIsEditNewGenre(false);
    setEditBookForm({
      title: book.title || "",
      author: book.author || "",
      genre: book.genre || "",
      language: book.language || "english",
      givenBy: book.givenBy || "",
      coverUrl: book.coverUrl || "",
      summary: book.summary || "",
      copies: book.copies || 1,
    });
    setActiveView("edit");
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedBook = await api.updateBook(editingBookId, editBookForm, token);
      setBooks(books.map(b => b.id === editingBookId ? updatedBook : b));
      showToast("Book updated successfully.");
      setActiveView("books");
      setEditingBookId(null);
      setIsEditNewGenre(false);
    } catch {
      showToast("Error updating book.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newBook = await api.addBook(bookForm, token);
      setBooks([...books, newBook]);
      showToast("Book added to database.");
      setBookForm({
        title: "", author: "", genre: "", language: "english",
        givenBy: "", coverUrl: "", summary: "", copies: 1,
      });
      setIsNewGenre(false);
      setActiveView("grid");
    } catch {
      showToast("Error adding book.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    try {
      await api.deleteBook(id, token);
      setBooks(books.filter((b) => b.id !== id));
      showToast(`Deleted "${title}".`);
    } catch {
      showToast("Error deleting book.", "error");
    }
  };

  const handleIssueUser = async (book, userId) => {
    if (!userId) return;
    try {
      const issuedUsers = [...(book.issuedUsers || []), userId];
      const updatedBook = await api.updateBook(book.id, { issuedUsers }, token);
      setBooks(books.map((b) => (b.id === book.id ? updatedBook : b)));
      showToast("Copy issued successfully.");
    } catch {
      showToast("Error issuing copy.", "error");
    }
  };

  const handleReturnCopy = async (book, userId) => {
    try {
      const issuedUsers = (book.issuedUsers || []).filter(id => id !== userId);
      const updatedBook = await api.updateBook(book.id, { issuedUsers }, token);
      setBooks(books.map((b) => (b.id === book.id ? updatedBook : b)));
      showToast("Copy returned successfully.");
    } catch {
      showToast("Error returning copy.", "error");
    }
  };

  useEffect(() => {
    let mounted = true;
    if (activeView === "users" || activeView === "books") {
      (async () => {
        setLoadingUsers(true);
        try {
          const list = await api.getUsers(token);
          if (mounted) setUsersList(list);
        } catch {
          showToast("Unable to fetch users.", "error");
        } finally {
          if (mounted) setLoadingUsers(false);
        }
      })();
    }
    return () => (mounted = false);
  }, [activeView, api, showToast, token]);

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
      setUsersList(list);
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
      setUsersList(list);
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
      setActiveView("grid");
    } catch (err) {
      showToast(err?.message || "Failed to update site content", "error");
    } finally {
      setAboutLoading(false);
    }
  };

  // --- Sub-Renders ---

  const existingGenres = [...new Set(books.map(b => b.genre).filter(Boolean))].sort();

  const renderGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 animate-[fadeIn_0.3s_ease-out]">
      {[
        { id: "users", title: "Users Data", icon: Users, desc: "Manage registered users and permissions" },
        { id: "books", title: "Existing Books", icon: BookOpen, desc: "Issue, return, edit and delete books in the library" },
        { id: "content", title: "Site Content", icon: Layout, desc: "Edit the about page, spotlight and quotes" },
        { id: "add", title: "Add New Book", icon: PlusCircle, desc: "Insert a new book into the cloud library" }
      ].map((card) => (
        <button
          key={card.id}
          onClick={() => setActiveView(card.id)}
          className="bg-[#6a2536]/20 border border-[#FFD59F]/30 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-[#6a2536]/50 hover:border-[#FFD59F] transition group text-center shadow-md"
        >
          <div className="p-4 bg-[#4E1A27] rounded-full group-hover:scale-110 transition border border-[#FFD59F]/20">
            <card.icon className="w-10 h-10 text-[#FFD59F]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#FFD59F] mb-2">{card.title}</h3>
            <p className="text-sm text-[#FFD59F]/70">{card.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );

  const renderUsers = () => (
    <div className="bg-[#4E1A27] border border-[#FFD59F]/30 rounded-xl overflow-hidden animate-[fadeIn_0.3s_ease-out] shadow-xl">
      <div className="p-4 sm:p-6 border-b border-[#FFD59F]/20 bg-[#6a2536]/20 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" /> Users Data
        </h2>
        <button onClick={() => setActiveView("grid")} className="flex items-center gap-1 text-sm bg-[#6a2536] hover:bg-[#FFD59F]/20 px-3 py-1.5 rounded transition border border-[#FFD59F]/30 shadow">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        {loadingUsers ? (
          <div className="text-sm text-gray-300">Loading users...</div>
        ) : usersList.length === 0 ? (
          <div className="text-sm text-gray-400">No users registered yet.</div>
        ) : (
          <div className="space-y-3">
            {usersList.map((u) => (
              <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#6a2536]/30 p-4 rounded-lg border border-[#FFD59F]/10">
                <div className="flex items-center gap-3">
                  {u.profilePicture ? (
                    <img src={u.profilePicture} alt="User" className="w-12 h-12 rounded-full border-2 border-[#FFD59F]/20 object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#4E1A27] text-[#FFD59F] flex items-center justify-center font-bold text-xl border-2 border-[#FFD59F]/20">
                      {(u.displayName || u.email || u.mobile || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-[#FFD59F] flex items-center gap-2 text-sm sm:text-base">
                      {u.displayName || "Unknown User"}
                      {u.isAdmin && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-700 text-[#4E1A27] rounded font-bold uppercase">Admin</span>}
                    </div>
                    <div className="text-xs text-gray-300 flex flex-col sm:flex-row sm:gap-3 mt-1">
                      <span title={u.email}>📧 {u.email || "No Email"}</span>
                      <span title={u.mobile}>📱 {u.mobile || "No Mobile"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleMakeAdmin(u.id)} disabled={u.isAdmin} className="text-xs bg-[#FFD59F] text-[#4E1A27] px-3 py-2 rounded font-bold disabled:opacity-50">Make Admin</button>
                  <button onClick={() => handleDeleteUser(u.id, u.displayName || u.mobile)} disabled={u.isAdmin || u.id === currentUser?.id} className="text-xs bg-red-600 text-white px-3 py-2 rounded font-bold disabled:opacity-50">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderBooks = () => {
    const totalEnglish = books.filter(b => b.language === 'english').reduce((sum, b) => sum + (b.copies || 1), 0);
    const totalHindi = books.filter(b => b.language === 'hindi').reduce((sum, b) => sum + (b.copies || 1), 0);
    const totalBooks = totalEnglish + totalHindi;

    return (
      <div className="bg-[#4E1A27] border border-[#FFD59F]/30 rounded-xl overflow-hidden animate-[fadeIn_0.3s_ease-out] shadow-xl">
        <div className="p-4 sm:p-6 border-b border-[#FFD59F]/20 bg-[#6a2536]/20 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> Existing Books
          </h2>
          <button onClick={() => setActiveView("grid")} className="flex items-center gap-1 text-sm bg-[#6a2536] hover:bg-[#FFD59F]/20 px-3 py-1.5 rounded transition border border-[#FFD59F]/30 shadow">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-6">
          {/* Library Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-[#6a2536]/30 p-3 sm:p-4 rounded-lg border border-[#FFD59F]/20">
            <div className="flex flex-col items-center text-center">
              <span className="text-xs sm:text-sm text-[#FFD59F]/80 font-semibold uppercase tracking-wider">English</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#FFD59F]">{totalEnglish}</span>
            </div>
            <div className="flex flex-col items-center text-center border-l border-r border-[#FFD59F]/20">
              <span className="text-xs sm:text-sm text-[#FFD59F]/80 font-semibold uppercase tracking-wider">Hindi/Urdu</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#FFD59F]">{totalHindi}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-xs sm:text-sm text-[#FFD59F]/80 font-semibold uppercase tracking-wider">Total</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#FFD59F]">{totalBooks}</span>
            </div>
          </div>

          {books.length === 0 ? (
            <p className="text-center py-6 text-[#FFD59F]/60">Library is empty.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
            {books.map((book) => (
              <div key={book.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#6a2536]/30 p-4 rounded-lg border border-[#FFD59F]/10 gap-4">
                <div className="flex items-center gap-4">
                  <img src={book.coverUrl || "https://via.placeholder.com/32"} className="w-12 h-16 object-cover rounded shadow border border-[#FFD59F]/10" alt="Cover" />
                  <div>
                    <h4 className="font-bold text-[#FFD59F] text-sm sm:text-base">{book.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">By {book.author}</p>
                    <span className={`inline-block mt-1.5 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-sm ${
                      book.availability === "Available" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"
                    }`}>
                      {book.availability} ({(book.copies || 1) - (book.issuedUsers?.length || 0)} left)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  {((book.copies || 1) - (book.issuedUsers?.length || 0) > 0) && (
                    <select
                      value=""
                      onChange={(e) => handleIssueUser(book, e.target.value)}
                      className="bg-[#4E1A27] border border-[#FFD59F]/20 text-[#FFD59F] text-xs rounded px-2 py-2 w-full sm:w-32 outline-none focus:border-[#FFD59F] shadow-sm"
                    >
                      <option value="">Issue to...</option>
                      {usersList.filter(u => !book.issuedUsers?.includes(u.id)).map((u) => (
                        <option key={u.id} value={u.id}>{u.displayName || u.mobile || "User"}</option>
                      ))}
                    </select>
                  )}
                  <button onClick={() => handleEditClick(book)} className="w-full sm:w-10 h-10 rounded border border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white transition flex items-center justify-center shadow-sm" title="Edit Book">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteBook(book.id, book.title)} className="w-full sm:w-10 h-10 rounded border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition flex items-center justify-center shadow-sm" title="Delete Book">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {book.issuedUsers && book.issuedUsers.length > 0 && (
                  <div className="w-full sm:w-auto bg-black/20 p-2.5 rounded max-h-24 overflow-y-auto min-w-[200px] border border-[#FFD59F]/5">
                    <span className="text-[10px] text-[#FFD59F]/60 font-bold uppercase tracking-wider mb-1 block">Issued To:</span>
                    {book.issuedUsers.map(userId => {
                      const user = usersList.find(u => u.id === userId);
                      return (
                        <div key={userId} className="flex justify-between items-center gap-2 text-xs text-gray-300 py-1 border-b border-[#FFD59F]/5 last:border-0">
                          <span className="truncate flex-1" title={user?.displayName || user?.mobile}>{user?.displayName || user?.mobile || 'Unknown User'}</span>
                          <button onClick={() => handleReturnCopy(book, userId)} className="text-red-400 hover:text-red-300 font-bold bg-red-900/20 px-2 py-0.5 rounded ml-2 text-[10px]">Return</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

  const renderContent = () => (
    <div className="bg-[#4E1A27] border border-[#FFD59F]/30 rounded-xl overflow-hidden animate-[fadeIn_0.3s_ease-out] shadow-xl">
      <div className="p-4 sm:p-6 border-b border-[#FFD59F]/20 bg-[#6a2536]/20 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Layout className="w-6 h-6" /> Site Content
        </h2>
        <button onClick={() => setActiveView("grid")} className="flex items-center gap-1 text-sm bg-[#6a2536] hover:bg-[#FFD59F]/20 px-3 py-1.5 rounded transition border border-[#FFD59F]/30 shadow">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
      <div className="p-4 sm:p-6">
        <form onSubmit={handleUpdateAbout} className="space-y-8">
          <div className="bg-[#6a2536]/30 p-5 rounded-lg border border-[#FFD59F]/10">
            <h3 className="text-lg font-bold text-[#FFD59F] mb-4 border-b border-[#FFD59F]/10 pb-2">Spotlight Section</h3>
            <div className="grid grid-cols-1 gap-4">
              <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Spotlight Title</label><input value={spotlightForm.title} onChange={e => setSpotlightForm({...spotlightForm, title: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
              <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Spotlight Name</label><input value={spotlightForm.name} onChange={e => setSpotlightForm({...spotlightForm, name: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
              <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Spotlight Description</label><textarea rows={3} value={spotlightForm.description} onChange={e => setSpotlightForm({...spotlightForm, description: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
            </div>
          </div>
          
          <div className="bg-[#6a2536]/30 p-5 rounded-lg border border-[#FFD59F]/10">
            <h3 className="text-lg font-bold text-[#FFD59F] mb-4 border-b border-[#FFD59F]/10 pb-2">Thought of the Day</h3>
            <div className="grid grid-cols-1 gap-4">
              <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Quote Title</label><input value={quoteForm.title} onChange={e => setQuoteForm({...quoteForm, title: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
              <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Quote Text</label><textarea rows={3} value={quoteForm.quote} onChange={e => setQuoteForm({...quoteForm, quote: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
              <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Quote Author</label><input value={quoteForm.author} onChange={e => setQuoteForm({...quoteForm, author: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
            </div>
          </div>

          <div className="bg-[#6a2536]/30 p-5 rounded-lg border border-[#FFD59F]/10">
            <h3 className="text-lg font-bold text-[#FFD59F] mb-4 border-b border-[#FFD59F]/10 pb-2">About Page</h3>
            <div className="grid grid-cols-1 gap-4">
              <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Mission Text</label><textarea rows={3} value={aboutForm.mission} onChange={e => setAboutForm({...aboutForm, mission: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Pillar 1 Headline</label><input value={aboutForm.pillar1Title} onChange={e => setAboutForm({...aboutForm, pillar1Title: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
                <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Pillar 1 Detail</label><textarea rows={2} value={aboutForm.pillar1Desc} onChange={e => setAboutForm({...aboutForm, pillar1Desc: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Pillar 2 Headline</label><input value={aboutForm.pillar2Title} onChange={e => setAboutForm({...aboutForm, pillar2Title: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
                <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Pillar 2 Detail</label><textarea rows={2} value={aboutForm.pillar2Desc} onChange={e => setAboutForm({...aboutForm, pillar2Desc: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
              </div>
            </div>
          </div>
          <button type="submit" disabled={aboutLoading} className="w-full bg-[#FFD59F] text-[#4E1A27] font-bold py-4 rounded-lg hover:bg-[#e6b87e] transition text-lg shadow-lg">
            {aboutLoading ? "Saving..." : "Save All Site Content"}
          </button>
        </form>
      </div>
    </div>
  );

  const renderEditBook = () => (
    <div className="bg-[#4E1A27] border border-[#FFD59F]/30 rounded-xl overflow-hidden max-w-2xl mx-auto animate-[fadeIn_0.3s_ease-out] shadow-xl">
      <div className="p-4 sm:p-6 border-b border-[#FFD59F]/20 bg-[#6a2536]/20 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Edit className="w-6 h-6" /> Edit Book
        </h2>
        <button onClick={() => { setActiveView("books"); setEditingBookId(null); }} className="flex items-center gap-1 text-sm bg-[#6a2536] hover:bg-[#FFD59F]/20 px-3 py-1.5 rounded transition border border-[#FFD59F]/30 shadow">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
      <div className="p-4 sm:p-6">
        <form onSubmit={handleUpdateBook} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Title</label><input required value={editBookForm.title} onChange={e => setEditBookForm({...editBookForm, title: e.target.value})} className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
            <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Author</label><input required value={editBookForm.author} onChange={e => setEditBookForm({...editBookForm, author: e.target.value})} className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
            <div>
              <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Genre</label>
              {!isEditNewGenre ? (
                <select 
                  required 
                  value={editBookForm.genre} 
                  onChange={e => {
                    if (e.target.value === "___NEW___") {
                      setIsEditNewGenre(true);
                      setEditBookForm({ ...editBookForm, genre: "" });
                    } else {
                      setEditBookForm({ ...editBookForm, genre: e.target.value });
                    }
                  }}
                  className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                >
                  <option value="" disabled>Select a genre...</option>
                  {existingGenres.map(g => <option key={g} value={g}>{g}</option>)}
                  <option value="___NEW___" className="font-bold text-[#e6b87e]">+ Add New Genre</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input 
                    required 
                    value={editBookForm.genre} 
                    onChange={e => setEditBookForm({...editBookForm, genre: e.target.value})} 
                    placeholder="Type new genre..."
                    className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" 
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditNewGenre(false);
                      setEditBookForm({ ...editBookForm, genre: existingGenres[0] || "" });
                    }}
                    className="bg-[#6a2536] text-[#FFD59F] px-4 rounded text-sm hover:bg-[#FFD59F]/20 transition shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Given By</label><input required value={editBookForm.givenBy} onChange={e => setEditBookForm({...editBookForm, givenBy: e.target.value})} className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
          </div>
          <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Summary</label><textarea rows={4} value={editBookForm.summary} onChange={e => setEditBookForm({...editBookForm, summary: e.target.value})} className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" placeholder="Add a book summary" /></div>
          <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Cover Image URL</label><input value={editBookForm.coverUrl} onChange={e => setEditBookForm({...editBookForm, coverUrl: e.target.value})} placeholder="Paste the book image address here" className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Language</label>
              <select value={editBookForm.language} onChange={e => setEditBookForm({...editBookForm, language: e.target.value})} className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none">
                <option value="english">English</option>
                <option value="hindi">Hindi/Urdu</option>
              </select>
            </div>
            <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Number of Copies</label><input type="number" min="1" value={editBookForm.copies} onChange={e => setEditBookForm({...editBookForm, copies: parseInt(e.target.value) || 1})} className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
          </div>
          <button disabled={loading} type="submit" className="w-full bg-[#FFD59F] text-[#4E1A27] font-bold py-4 rounded-lg hover:bg-[#e6b87e] transition shadow-md flex justify-center items-center gap-2 mt-4 text-lg">
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
          </button>
        </form>
      </div>
    </div>
  );

  const renderAddBook = () => (
    <div className="bg-[#4E1A27] border border-[#FFD59F]/30 rounded-xl overflow-hidden max-w-2xl mx-auto animate-[fadeIn_0.3s_ease-out] shadow-xl">
      <div className="p-4 sm:p-6 border-b border-[#FFD59F]/20 bg-[#6a2536]/20 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <PlusCircle className="w-6 h-6" /> Add New Book
        </h2>
        <button onClick={() => setActiveView("grid")} className="flex items-center gap-1 text-sm bg-[#6a2536] hover:bg-[#FFD59F]/20 px-3 py-1.5 rounded transition border border-[#FFD59F]/30 shadow">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
      <div className="p-4 sm:p-6">
        <form onSubmit={handleAddBook} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Title</label><input required value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
            <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Author</label><input required value={bookForm.author} onChange={e => setBookForm({...bookForm, author: e.target.value})} className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
            <div>
              <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Genre</label>
              {!isNewGenre ? (
                <select 
                  required 
                  value={bookForm.genre} 
                  onChange={e => {
                    if (e.target.value === "___NEW___") {
                      setIsNewGenre(true);
                      setBookForm({ ...bookForm, genre: "" });
                    } else {
                      setBookForm({ ...bookForm, genre: e.target.value });
                    }
                  }}
                  className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                >
                  <option value="" disabled>Select a genre...</option>
                  {existingGenres.map(g => <option key={g} value={g}>{g}</option>)}
                  <option value="___NEW___" className="font-bold text-[#e6b87e]">+ Add New Genre</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input 
                    required 
                    value={bookForm.genre} 
                    onChange={e => setBookForm({...bookForm, genre: e.target.value})} 
                    placeholder="Type new genre..."
                    className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" 
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsNewGenre(false);
                      setBookForm({ ...bookForm, genre: existingGenres[0] || "" });
                    }}
                    className="bg-[#6a2536] text-[#FFD59F] px-4 rounded text-sm hover:bg-[#FFD59F]/20 transition shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Given By</label><input required value={bookForm.givenBy} onChange={e => setBookForm({...bookForm, givenBy: e.target.value})} className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
          </div>
          <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Summary</label><textarea rows={4} value={bookForm.summary} onChange={e => setBookForm({...bookForm, summary: e.target.value})} className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" placeholder="Add a book summary" /></div>
          <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Cover Image URL</label><input value={bookForm.coverUrl} onChange={e => setBookForm({...bookForm, coverUrl: e.target.value})} placeholder="Paste the book image address here" className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Language</label>
              <select value={bookForm.language} onChange={e => setBookForm({...bookForm, language: e.target.value})} className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none">
                <option value="english">English</option>
                <option value="hindi">Hindi/Urdu</option>
              </select>
            </div>
            <div><label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Number of Copies</label><input type="number" min="1" value={bookForm.copies} onChange={e => setBookForm({...bookForm, copies: parseInt(e.target.value) || 1})} className="w-full bg-[#3b131b] border border-[#FFD59F]/20 rounded p-3 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none" /></div>
          </div>
          <button disabled={loading} type="submit" className="w-full bg-[#FFD59F] text-[#4E1A27] font-bold py-4 rounded-lg hover:bg-[#e6b87e] transition shadow-md flex justify-center items-center gap-2 mt-4 text-lg">
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <CloudUpload className="w-5 h-5" />} Add Book to Library
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out] w-full max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#FFD59F]/20 pb-4 gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFD59F]">Admin Portal</h1>
          <p className="text-xs sm:text-sm text-red-400 mt-1 font-semibold flex items-center gap-1">
            <Shield className="w-4 h-4" /> Authenticated Dashboard
          </p>
        </div>
        <button onClick={() => navigateTo("home")} className="w-full sm:w-auto text-sm border border-[#FFD59F]/30 px-4 py-2 rounded hover:bg-[#FFD59F]/10 transition font-bold">
          Exit Admin
        </button>
      </div>
      
      {activeView === "grid" && renderGrid()}
      {activeView === "users" && renderUsers()}
      {activeView === "books" && renderBooks()}
      {activeView === "content" && renderContent()}
      {activeView === "add" && renderAddBook()}
      {activeView === "edit" && renderEditBook()}
      
    </section>
  );
}
