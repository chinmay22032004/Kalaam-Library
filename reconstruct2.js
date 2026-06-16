import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

const poetryBlocks = `
        {activeTab === "poetry" && (
          <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out]">
            <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
              <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-[#FFD59F]/70">
                LITERARY MASTERS
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif text-[#FFD59F]">
                Poetry by Kalaam
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                Discover the immortal words of legendary poets. Select a profile to read their masterpieces.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {poets.map((poet) => (
                <div 
                  key={poet.id}
                  onClick={() => {
                    setSelectedPoet(poet);
                    setSelectedPoem(null);
                    navigateTo("poet_profile");
                  }}
                  className="cursor-pointer bg-[#6a2536]/40 border border-[#FFD59F]/30 p-6 rounded-xl flex flex-col items-center text-center hover:border-[#FFD59F] hover:-translate-y-1 transition-all duration-300 group"
                >
                  <img src={poet.avatar} alt={poet.name} className="w-24 h-24 rounded-full object-cover border-2 border-[#FFD59F] mb-4 group-hover:scale-105 transition" />
                  <h3 className="text-lg font-bold font-serif text-[#FFD59F]">{poet.name}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-300 font-light mt-2 line-clamp-3">
                    {poet.description}
                  </p>
                  <button className="mt-4 text-[#FFD59F] text-xs font-bold uppercase tracking-widest group-hover:text-[#e6b87e] flex items-center gap-1">
                    Read <Feather className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "poet_profile" && selectedPoet && (
          <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out]">
            <button 
              onClick={() => navigateTo("poetry")}
              className="text-[#FFD59F] text-sm font-bold flex items-center gap-2 hover:opacity-80 transition"
            >
              &larr; Back to Poets
            </button>
            
            <div className="bg-[#6a2536]/40 border border-[#FFD59F]/20 p-6 sm:p-10 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-10">
              <img src={selectedPoet.avatar} alt={selectedPoet.name} className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-[#FFD59F] shadow-lg shrink-0" />
              <div className="space-y-4 text-center md:text-left">
                <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#FFD59F]">
                  {selectedPoet.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed max-w-2xl">
                  {selectedPoet.bio}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl font-bold font-serif text-[#FFD59F] border-b border-[#FFD59F]/20 pb-2">
                Selected Poems
              </h2>
              <div className="flex flex-col space-y-4">
                {selectedPoet.poems.map((poem) => (
                  <div key={poem.id} className="bg-[#FFD59F]/5 border border-[#FFD59F]/20 rounded-xl shadow-inner overflow-hidden flex flex-col hover:border-[#FFD59F]/50 transition-all duration-300">
                    <div 
                      className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-[#FFD59F]/10 transition"
                      onClick={() => {
                        setSelectedPoem(poem);
                        setPoemSource("poet_profile");
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
            </div>
          </section>
        )}

        {activeTab === "poem_detail" && selectedPoem && (
          <section className="space-y-6 sm:space-y-8 animate-[fadeIn_0.4s_ease-in-out]">
            <button 
              onClick={() => {
                if (poemSource === "favorites") {
                  navigateTo("favorites");
                } else {
                  navigateTo("poet_profile");
                }
              }}
              className="text-[#FFD59F] text-sm font-bold flex items-center gap-2 hover:opacity-80 transition"
            >
              &larr; Back
            </button>

            <div className="bg-[#FFD59F]/5 border border-[#FFD59F]/20 p-8 sm:p-12 rounded-2xl shadow-xl relative overflow-hidden text-center max-w-4xl mx-auto flex flex-col items-center">
              <Quote className="absolute top-6 left-6 w-16 h-16 text-[#FFD59F]/10 transform -scale-x-100" />
              <Quote className="absolute bottom-6 right-6 w-16 h-16 text-[#FFD59F]/10" />
              
              <div className="relative z-10 flex flex-col items-center w-full">
                <div className="flex items-center gap-6 mb-8 justify-center">
                  <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#FFD59F]">
                    {selectedPoem.title}
                  </h1>
                  <button
                    onClick={(e) => toggleFavoritePoem(selectedPoem.id, e)}
                    className="text-red-700 hover:scale-110 transition bg-[#FFD59F]/10 p-3 rounded-full shrink-0"
                  >
                    <Heart className={\`w-6 h-6 sm:w-8 sm:h-8 \${favoritePoems.includes(selectedPoem.id) ? "fill-current" : ""}\`} />
                  </button>
                </div>
                
                <p className="text-lg sm:text-2xl text-[#FFD59F]/90 font-medium leading-loose whitespace-pre-wrap font-serif italic text-center max-w-2xl mx-auto">
                  {selectedPoem.content}
                </p>
              </div>
            </div>
          </section>
        )}
`;

// Insert the poetry blocks right before {(activeTab === "english" || activeTab === "hindi")
content = content.replace(
  '{(activeTab === "english" || activeTab === "hindi") && (',
  poetryBlocks + '\n        {(activeTab === "english" || activeTab === "hindi") && ('
);

// Add favorite poems section to favorites
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

content = content.replace(
  '{activeTab === "admin" && currentUser && currentUser.isAdmin && (',
  favoritePoemsSection + '\n        {activeTab === "admin" && currentUser && currentUser.isAdmin && ('
);

fs.writeFileSync('src/App.jsx', content);
