import { useState } from "react";
import { Shield, CloudUpload, Loader, Trash2 } from "lucide-react";

export default function AdminDashboard({
  books,
  setBooks,
  api,
  token,
  showToast,
  navigateTo,
}) {
  const [loading, setLoading] = useState(false);
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
              {["title", "author", "genre"].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1 capitalize">
                    {field}
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
