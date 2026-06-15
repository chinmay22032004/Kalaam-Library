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
      className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-5 gap-4 hover:bg-[#FFD59F]/5 transition cursor-pointer border-b border-[#FFD59F]/10 last:border-0 group"
    >
      {/* Serial Number & Cover */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-xl sm:text-2xl font-serif font-bold text-[#FFD59F]/20 w-6 sm:w-8 text-center shrink-0">
          {idx + 1}
        </div>
        <img
          src={
            book.coverUrl ||
            "https://via.placeholder.com/160x240/4E1A27/FFD59F?text=No+Cover"
          }
          alt="Cover"
          className="w-16 h-24 sm:w-20 sm:h-32 object-cover rounded shadow-md border border-[#FFD59F]/20 group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col grow min-w-0 py-1 space-y-1 w-full">
        <h3 className="font-bold font-serif text-lg sm:text-xl text-[#FFD59F] truncate">
          {book.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 truncate">
          By <span className="font-semibold text-gray-200">{book.author}</span>
        </p>

        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <span
            className={`${isAvail ? "bg-green-900/40 text-green-400 border-green-700/50" : "bg-red-900/40 text-red-400 border-red-700/50"} border px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1 shrink-0`}
          >
            {isAvail ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}{" "}
            {book.availability || "Available"}
          </span>

          <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
            <HandHeart className="w-3 h-3 text-[#FFD59F]/60" />
            Given By: <span className="text-[#FFD59F]/90 font-medium">{book.givenBy || "Kalaam"}</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-row items-center gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
        <button
          onClick={(e) => toggleFavorite(book.id, e)}
          className="p-2 sm:p-2.5 rounded border border-[#FFD59F]/30 hover:bg-[#FFD59F]/10 text-sm transition flex items-center justify-center shadow-sm shrink-0"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isFav ? "text-red-700 fill-current" : ""}`}
          />
        </button>
        <button className="flex-1 sm:flex-none bg-[#FFD59F] text-[#4E1A27] text-xs sm:text-sm font-bold px-4 py-2.5 rounded hover:bg-[#e6b87e] transition shadow-md flex items-center justify-center gap-2 whitespace-nowrap">
          <BookOpen className="w-4 h-4" />
          <span>Details</span>
        </button>
      </div>
    </div>
  );
}
