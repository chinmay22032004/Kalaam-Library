import { X, Heart } from "lucide-react";

export default function BookDetailsModal({
  book,
  close,
  isFav,
  toggleFav,
}) {
  if (!book) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-details-title"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4"
    >
      <div className="bg-[#4E1A27] border border-[#FFD59F]/40 text-[#FFD59F] w-full h-full sm:max-w-lg sm:w-full sm:max-h-[90vh] sm:rounded-2xl rounded-none overflow-y-auto shadow-2xl flex flex-col justify-between scrollbar-hide">
        <div className="p-4 sm:p-6 border-b border-[#FFD59F]/15 flex justify-between items-start sticky top-0 bg-[#4E1A27] z-10">
          <div className="pr-4">
            <h3
              id="book-details-title"
              className="text-xl sm:text-2xl font-bold font-serif leading-tight"
            >
              {book.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#FFD59F]/70 mt-1">
              By {book.author}
            </p>
          </div>
          <button
            onClick={close}
            aria-label="Close book details"
            className="text-2xl hover:text-white transition p-1 shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <img
              src={
                book.coverUrl ||
                "https://via.placeholder.com/80x112/4E1A27/FFD59F"
              }
              alt="Cover"
              className="w-24 h-36 sm:w-20 sm:h-28 object-cover rounded border border-[#FFD59F]/20 shrink-0"
            />
            <div className="text-center sm:text-left w-full">
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-2 sm:mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#FFD59F]/15 px-2.5 py-1 rounded">
                  {book.genre}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#FFD59F]/15 px-2.5 py-1 rounded text-green-300">
                  {book.language}
                </span>
              </div>
              <p className="text-sm sm:text-sm text-gray-300 leading-normal">
                A brief overview of the book.
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-[#6a2536]/30 p-3 sm:p-4 rounded-xl border border-[#FFD59F]/10">
            <p className="text-sm sm:text-base leading-relaxed font-light italic transition-all duration-300">
              {book.summary}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-[#6a2536]/40 border-t border-[#FFD59F]/15 flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0">
          <button
            onClick={toggleFav}
            className="w-full sm:flex-1 bg-transparent hover:bg-[#FFD59F]/10 border border-[#FFD59F] font-bold py-2.5 sm:py-2 px-4 rounded text-xs transition flex items-center justify-center gap-1.5"
          >
            <Heart
              className={`w-4 h-4 ${isFav ? "text-red-700 fill-current" : ""}`}
            />{" "}
            {isFav ? "Saved" : "Add Favorite"}
          </button>
          <button
            onClick={close}
            className="w-full sm:flex-1 bg-[#FFD59F] text-[#4E1A27] hover:bg-[#e6b87e] font-bold py-2.5 sm:py-2 px-4 rounded text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
