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
      className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 gap-5 sm:gap-8 hover:bg-[#FFD59F]/5 transition cursor-pointer border-b border-[#FFD59F]/10 last:border-0 group"
    >
      {/* Serial Number & Cover (Visual Dominates Left) */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0 w-full sm:w-auto">
        <div className="text-2xl sm:text-3xl font-serif font-bold text-[#FFD59F]/20 w-8 sm:w-10 text-center shrink-0">
          {idx + 1}
        </div>
        <img
          src={
            book.coverUrl ||
            "https://via.placeholder.com/160x240/4E1A27/FFD59F?text=No+Cover"
          }
          alt="Cover"
          className="w-24 h-36 sm:w-32 sm:h-48 md:w-40 md:h-56 object-cover rounded shadow-lg border border-[#FFD59F]/20 group-hover:scale-[1.03] transition duration-300 shrink-0"
        />
      </div>

      {/* Main Content (Text Dominates Right) */}
      <div className="flex flex-col grow min-w-0 py-2 space-y-3 w-full">
        <div>
          <h3 className="font-bold font-serif text-xl sm:text-2xl md:text-3xl text-[#FFD59F] leading-tight line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mt-1">
            By <span className="font-semibold text-gray-200">{book.author}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap pt-1 sm:pt-2">
          <span
            className={`${isAvail ? "bg-green-900/40 text-green-400 border-green-700/50" : "bg-red-900/40 text-red-400 border-red-700/50"} border px-3 py-1 rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 shrink-0`}
          >
            {isAvail ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}{" "}
            {book.availability || "Available"}
          </span>

          <span className="text-xs sm:text-sm text-gray-400 flex items-center gap-1.5 bg-[#4E1A27]/50 rounded border border-[#FFD59F]/10 px-3 py-1">
            <HandHeart className="w-3.5 h-3.5 text-[#FFD59F]/60" />
            Given By: <span className="text-[#FFD59F]/90 font-medium">{book.givenBy || "Kalaam"}</span>
          </span>
        </div>

        {/* Actions pushed to bottom of text block */}
        <div className="flex flex-row items-center gap-3 pt-3 mt-auto w-full justify-start sm:justify-start lg:justify-end">
          <button
            onClick={(e) => toggleFavorite(book.id, e)}
            className="p-2 sm:p-3 rounded border border-[#FFD59F]/30 hover:bg-[#FFD59F]/10 text-sm transition flex items-center justify-center shadow-sm shrink-0"
          >
            <Heart
              className={`w-5 h-5 ${isFav ? "text-red-700 fill-current" : ""}`}
            />
          </button>
          <button className="flex-1 sm:flex-none bg-[#FFD59F] text-[#4E1A27] text-sm sm:text-base font-bold px-6 py-2 sm:py-3 rounded hover:bg-[#e6b87e] transition shadow-md flex items-center justify-center gap-2 whitespace-nowrap">
            <BookOpen className="w-5 h-5" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
