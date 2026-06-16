import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add favPoemsData
content = content.replace(
`  const favoriteBooks = useMemo(
    () => books.filter((b) => favorites.includes(b.id)),
    [books, favorites],
  );`,
`  const favoriteBooks = useMemo(
    () => books.filter((b) => favorites.includes(b.id)),
    [books, favorites],
  );
  
  const favPoemsData = useMemo(() => {
    return poets.flatMap((poet) => poet.poems || []).filter((poem) => favoritePoems.includes(poem.id));
  }, [favoritePoems, poets]);`
);

// 2. Move Favorite Poems Section inside favorites tab
const favoritePoemsSection = `
            {/* Favorite Poems Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-[#FFD59F] border-b border-[#FFD59F]/20 pb-2">Favorite Poems</h2>
              {favPoemsData.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#6a2536]/40 flex items-center justify-center text-[#FFD59F]/40">
                    <Feather className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#FFD59F]/60">No favorite poems added yet.</p>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  {favPoemsData.map((poem) => (
                    <div key={poem.id} className="bg-[#FFD59F]/5 border border-[#FFD59F]/20 rounded-xl shadow-inner overflow-hidden flex flex-col hover:border-[#FFD59F]/50 transition-all duration-300">
                      <div 
                        className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-[#FFD59F]/10 transition"
                        onClick={() => {
                          setSelectedPoem(poem);
                          setPoemSource("favorites");
                          navigateTo("poem_detail");
                        }}
                      >
                        <h3 className="text-lg sm:text-xl font-bold font-serif text-[#FFD59F] group-hover:text-[#e6b87e]">{poem.title}</h3>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => toggleFavoritePoem(poem.id, e)}
                            className="text-red-700 hover:scale-110 transition z-20 relative p-2"
                          >
                            <Heart className={\`w-5 h-5 sm:w-6 sm:h-6 \${favoritePoems.includes(poem.id) ? "fill-current" : ""}\`} />
                          </button>
                          <svg className="w-5 h-5 text-[#FFD59F]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
`;

// It was inserted before {activeTab === "admin" ...
// We need to remove it from there, and put it inside the favorites section.

content = content.replace(favoritePoemsSection + '\n        {activeTab === "admin" && currentUser && currentUser.isAdmin && (', '{activeTab === "admin" && currentUser && currentUser.isAdmin && (');

// Now insert it at the end of the favorites section
content = content.replace(
`                  </div>
                ))}
              </div>
            )}
          </section>
        )}`,
`                  </div>
                ))}
              </div>
            )}

` + favoritePoemsSection + `
          </section>
        )}`
);

fs.writeFileSync('src/App.jsx', content);
