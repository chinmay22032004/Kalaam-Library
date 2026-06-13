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
      className="flex flex-col md:flex-row items-start md:items-center p-4 sm:p-6 gap-4 sm:gap-6 hover:bg-[#FFD59F]/5 transition cursor-pointer border-b border-[#FFD59F]/10 last:border-0"
    >
      <div className="flex items-start md:items-center gap-3 sm:gap-6 w-full">
        {/* Serial Number */}
        <div className="text-lg sm:text-2xl md:text-4xl font-serif font-bold text-[#FFD59F]/20 w-8 sm:w-12 md:w-16 text-center shrink-0">
          {idx + 1}
        </div>

        {/* Cover and Title */}
        <div className="flex flex-col items-center w-24 sm:w-32 md:w-40 shrink-0 space-y-2 sm:space-y-3">
          <div className="relative group w-full">
            <img
              src={
                book.coverUrl ||
                "https://via.placeholder.com/160x240/4E1A27/FFD59F?text=No+Cover"
              }
              alt="Cover"
              className="w-full aspect-2/3 object-cover rounded-md shadow-[0_8px_16px_rgba(0,0,0,0.4)] border border-[#FFD59F]/30 group-hover:scale-105 transition duration-300"
            />
          </div>
          <span className="font-bold font-serif text-center text-sm sm:text-base md:text-lg leading-tight w-full wrap-break-word line-clamp-2">
            {book.title}
          </span>
        </div>

        {/* Details & Actions */}
        <div className="flex flex-col grow justify-between h-full py-1 sm:py-2 space-y-3 md:space-y-0 min-w-0">
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-sm sm:text-base md:text-lg text-[#FFD59F] font-semibold truncate">
              By {book.author}
            </h4>

            <div className="flex flex-wrap gap-2 items-center">
              <span
                className={`${isAvail ? "bg-green-900/40 text-green-400 border-green-700/50" : "bg-red-900/40 text-red-400 border-red-700/50"} border px-2 sm:px-3 py-1 rounded-sm text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider font-semibold flex items-center gap-1`}
              >
                {isAvail ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}{" "}
                {book.availability || "Available"}
              </span>
            </div>

            <div className="bg-[#4E1A27]/50 rounded p-2 sm:p-3 border border-[#FFD59F]/10 w-full mt-1 sm:mt-2 max-w-full">
              <p className="text-sm sm:text-sm md:text-xs text-gray-300 flex items-center flex-wrap">
                <HandHeart className="w-3 h-3 mr-1 sm:mr-1.5 text-[#FFD59F]/70 shrink-0" />
                <span>
                  Given By:{" "}
                  <span className="font-bold text-[#FFD59F] ml-1">
                    {book.givenBy || "Kalaam"}
                  </span>
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-3 md:mt-auto">
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={(e) => toggleFavorite(book.id, e)}
                className="flex-1 sm:flex-none w-full sm:w-10 h-10 rounded border border-[#FFD59F]/30 hover:bg-[#FFD59F]/10 text-sm transition flex items-center justify-center shadow-md"
              >
                <Heart
                  className={`w-4 h-4 ${isFav ? "text-red-700 fill-current" : ""}`}
                />
              </button>
              <button className="w-full sm:w-auto bg-[#FFD59F] text-[#4E1A27] text-sm sm:text-sm font-bold px-4 sm:px-6 py-2 h-10 sm:h-auto rounded hover:bg-[#e6b87e] transition shadow-md flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4 shrink-0" />{" "}
                <span className="truncate">View Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
