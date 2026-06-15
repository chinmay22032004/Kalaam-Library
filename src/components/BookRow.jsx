import {
  CheckCircle2,
  XCircle,
  HandHeart,
  Heart,
  BookOpen,
} from "lucide-react";

export default function BookRow({
  book,
  idx,
  favorites,
  toggleFavorite,
  openModal,
}) {
  const isFav = favorites.includes(book.id);
  const isAvail = book.availability === "Available" || !book.availability;

  return (
    <div
      onClick={openModal}
      className="flex flex-col p-4 sm:p-6 gap-4 hover:bg-[#FFD59F]/5 transition cursor-pointer border-b border-[#FFD59F]/10 last:border-0 group"
    >
      {/* Top Section: Image (Left) + Text (Right) */}
      <div className="flex flex-row items-start gap-3 sm:gap-6 w-full">
        {/* Serial Number & Cover (Left) */}
        <div className="flex items-start sm:items-center gap-2 sm:gap-4 shrink-0">
          <div className="text-xl sm:text-3xl font-serif font-bold text-[#FFD59F]/20 w-6 sm:w-10 text-right shrink-0 mt-1 sm:mt-0">
            {idx + 1}
          </div>
          <img
            src={
              book.coverUrl ||
              "https://via.placeholder.com/160x240/4E1A27/FFD59F?text=No+Cover"
            }
            alt="Cover"
            className="w-20 h-28 sm:w-32 sm:h-48 object-cover rounded shadow-lg border border-[#FFD59F]/20 group-hover:scale-[1.03] transition duration-300 shrink-0"
          />
        </div>

        {/* Main Content (Right) */}
        <div className="flex flex-col grow min-w-0 space-y-1.5 sm:space-y-3">
          <div>
            <h3 className="font-bold font-serif text-lg sm:text-2xl md:text-3xl text-[#FFD59F] leading-snug line-clamp-2 sm:line-clamp-none">
              {book.title}
            </h3>
            <p className="text-xs sm:text-base md:text-lg text-gray-300 mt-0.5 sm:mt-1">
              By <span className="font-semibold text-gray-200">{book.author}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap pt-1">
            <span
              className={`${isAvail ? "bg-green-900/40 text-green-400 border-green-700/50" : "bg-red-900/40 text-red-400 border-red-700/50"} border px-2 py-1 sm:px-3 rounded text-[9px] sm:text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 w-fit shrink-0`}
            >
              {isAvail ? (
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              ) : (
                <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              )}{" "}
              {book.availability || "Available"}
            </span>

            <span className="text-[9px] sm:text-sm text-gray-400 flex items-center gap-1.5 bg-[#4E1A27]/50 rounded border border-[#FFD59F]/10 px-2 py-1 sm:px-3 w-fit max-w-full">
              <HandHeart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFD59F]/60 shrink-0" />
              <span className="truncate">Given By: <span className="text-[#FFD59F]/90 font-medium">{book.givenBy || "Kalaam"}</span></span>
            </span>
          </div>
        </div>
      </div>

      {/* Actions (Bottom) */}
      <div className="flex flex-row items-center gap-3 pt-2 w-full">
        <button
          onClick={(e) => toggleFavorite(book.id, e)}
          className="p-2 sm:p-3 rounded border border-[#FFD59F]/30 hover:bg-[#FFD59F]/10 text-sm transition flex items-center justify-center shadow-sm shrink-0"
        >
          <Heart
            className={`w-5 h-5 sm:w-6 sm:h-6 ${isFav ? "text-red-700 fill-current" : ""}`}
          />
        </button>
        <button className="flex-1 bg-[#FFD59F] text-[#4E1A27] text-sm sm:text-base font-bold py-2 sm:py-3 rounded hover:bg-[#e6b87e] transition shadow-md flex items-center justify-center gap-2 whitespace-nowrap">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
}
