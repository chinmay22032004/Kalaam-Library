import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf8');

// 1. Add poets to props
content = content.replace(
`export default function AdminDashboard({
  books,
  setBooks,
  api,`,
`export default function AdminDashboard({
  books,
  setBooks,
  poets = [],
  setPoets,
  api,`
);

// 2. Add hero and footer state
content = content.replace(
`  const [quoteForm, setQuoteForm] = useState({
    title: "Thought of the Day",
    quote: "",
    author: "",
  });`,
`  const [quoteForm, setQuoteForm] = useState({
    title: "Thought of the Day",
    quote: "",
    author: "",
  });
  const [heroForm, setHeroForm] = useState({
    title: "Poetry by Kalaam",
    subtitle: "Immerse yourself in timeless poetry. Read verses from legendary poets and feel the essence of Kalaam.",
    secondarySubtitle: "Kalaam Library"
  });
  const [footerForm, setFooterForm] = useState({
    text: "© 2026 KALAAM - SAC NITR"
  });

  // Poets Form
  const [poetForm, setPoetForm] = useState({
    name: "",
    bio: "",
    description: "",
    avatar: ""
  });
  
  // Poem Form mapped by poetId
  const [poemForms, setPoemForms] = useState({});
  const [poetLoading, setPoetLoading] = useState(false);
`
);

// 3. Load hero/footer in useEffect
content = content.replace(
`      if (settings.about) setAboutForm({ ...settings.about });
      if (settings.spotlight) setSpotlightForm({ ...settings.spotlight });
      if (settings.quote) setQuoteForm({ ...settings.quote });`,
`      if (settings.about) setAboutForm({ ...settings.about });
      if (settings.spotlight) setSpotlightForm({ ...settings.spotlight });
      if (settings.quote) setQuoteForm({ ...settings.quote });
      if (settings.hero) setHeroForm({ ...settings.hero });
      if (settings.footer) setFooterForm({ ...settings.footer });`
);

// 4. Update Settings API calls
content = content.replace(
`      const [updatedAbout, updatedSpotlight, updatedQuote] = await Promise.all([
        api.updateSettings("about", aboutForm, token),
        api.updateSettings("spotlight", spotlightForm, token),
        api.updateSettings("quote", quoteForm, token),
      ]);
      onSettingsChange?.({
        ...settings,
        about: updatedAbout,
        spotlight: updatedSpotlight,
        quote: updatedQuote,
      });`,
`      const [updatedAbout, updatedSpotlight, updatedQuote, updatedHero, updatedFooter] = await Promise.all([
        api.updateSettings("about", aboutForm, token),
        api.updateSettings("spotlight", spotlightForm, token),
        api.updateSettings("quote", quoteForm, token),
        api.updateSettings("hero", heroForm, token),
        api.updateSettings("footer", footerForm, token),
      ]);
      onSettingsChange?.({
        ...settings,
        about: updatedAbout,
        spotlight: updatedSpotlight,
        quote: updatedQuote,
        hero: updatedHero,
        footer: updatedFooter,
      });`
);

// 5. Add Poet/Poem API handlers
content = content.replace(
`  const handleUpdateAbout = async (e) => {`,
`  const handleAddPoet = async (e) => {
    e.preventDefault();
    setPoetLoading(true);
    try {
      const newPoet = await api.createPoet({ ...poetForm, poems: [] }, token);
      if (setPoets) {
        setPoets([...poets, newPoet]);
      }
      showToast("Poet added successfully.");
      setPoetForm({ name: "", bio: "", description: "", avatar: "" });
    } catch {
      showToast("Error adding poet.", "error");
    } finally {
      setPoetLoading(false);
    }
  };

  const handleDeletePoet = async (id, name) => {
    if (!confirm(\`Delete poet "\${name}" and all their poems?\`)) return;
    try {
      await api.deletePoet(id, token);
      if (setPoets) {
        setPoets(poets.filter(p => p.id !== id));
      }
      showToast(\`Deleted "\${name}".\`);
    } catch {
      showToast("Error deleting poet.", "error");
    }
  };

  const handleAddPoem = async (e, poetId) => {
    e.preventDefault();
    const poemData = poemForms[poetId];
    if (!poemData?.title || !poemData?.content) return;
    
    try {
      const poet = poets.find(p => p.id === poetId);
      const newPoem = { id: Date.now().toString(), ...poemData };
      const updatedPoems = [...(poet.poems || []), newPoem];
      
      const updatedPoet = await api.updatePoet(poetId, { poems: updatedPoems }, token);
      if (setPoets) {
        setPoets(poets.map(p => p.id === poetId ? updatedPoet : p));
      }
      showToast("Poem added.");
      setPoemForms({ ...poemForms, [poetId]: { title: "", content: "" } });
    } catch {
      showToast("Error adding poem.", "error");
    }
  };

  const handleDeletePoem = async (poetId, poemId) => {
    if (!confirm("Delete this poem?")) return;
    try {
      const poet = poets.find(p => p.id === poetId);
      const updatedPoems = (poet.poems || []).filter(p => p.id !== poemId);
      
      const updatedPoet = await api.updatePoet(poetId, { poems: updatedPoems }, token);
      if (setPoets) {
        setPoets(poets.map(p => p.id === poetId ? updatedPoet : p));
      }
      showToast("Poem deleted.");
    } catch {
      showToast("Error deleting poem.", "error");
    }
  };

  const handleUpdateAbout = async (e) => {`
);

// 6. Add Hero and Footer to Settings Form
content = content.replace(
`              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[#FFD59F] mb-3">
                  Spotlight Section
                </h3>`,
`              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[#FFD59F] mb-3">
                  Hero Section
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Poetry Main Title
                    </label>
                    <input
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Poetry Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                      Library Title
                    </label>
                    <input
                      value={heroForm.secondarySubtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, secondarySubtitle: e.target.value })}
                      className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[#FFD59F] mb-3">
                  Footer Section
                </h3>
                <div>
                  <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">
                    Footer Text
                  </label>
                  <input
                    value={footerForm.text}
                    onChange={(e) => setFooterForm({ ...footerForm, text: e.target.value })}
                    className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] focus:border-[#FFD59F] outline-none"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[#FFD59F] mb-3">
                  Spotlight Section
                </h3>`
);

// 7. Insert the Poets Management UI
const poetsUI = `
          {/* POETS MANAGEMENT */}
          <div className="bg-[#6a2536]/40 border border-[#FFD59F]/30 rounded-xl p-4 sm:p-6 w-full">
            <h2 className="text-lg sm:text-xl font-bold mb-4 border-b border-[#FFD59F]/20 pb-2">
              Manage Poets
            </h2>
            <form onSubmit={handleAddPoet} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Name</label>
                  <input required value={poetForm.name} onChange={e => setPoetForm({...poetForm, name: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Avatar URL</label>
                  <input required value={poetForm.avatar} onChange={e => setPoetForm({...poetForm, avatar: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Short Description</label>
                <input required value={poetForm.description} onChange={e => setPoetForm({...poetForm, description: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#FFD59F]/80 mb-1">Full Biography</label>
                <textarea required rows={3} value={poetForm.bio} onChange={e => setPoetForm({...poetForm, bio: e.target.value})} className="w-full bg-[#4E1A27] border border-[#FFD59F]/20 rounded p-2 text-sm text-[#FFD59F] outline-none" />
              </div>
              <button disabled={poetLoading} type="submit" className="w-full bg-[#FFD59F] text-[#4E1A27] font-bold py-2 rounded hover:bg-[#e6b87e] transition">
                {poetLoading ? "Adding..." : "Add New Poet"}
              </button>
            </form>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {poets.map(poet => (
                <div key={poet.id} className="bg-[#4E1A27] p-4 rounded-lg border border-[#FFD59F]/20">
                  <div className="flex justify-between items-center mb-3 border-b border-[#FFD59F]/10 pb-2">
                    <div className="flex items-center gap-3">
                      <img src={poet.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                      <h4 className="font-bold text-[#FFD59F]">{poet.name}</h4>
                    </div>
                    <button onClick={() => handleDeletePoet(poet.id, poet.name)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="pl-2 space-y-3">
                    <h5 className="text-xs font-bold text-[#FFD59F]/80">Poems ({poet.poems?.length || 0})</h5>
                    {poet.poems?.map(poem => (
                      <div key={poem.id} className="flex justify-between items-center text-xs bg-black/20 p-2 rounded">
                        <span>{poem.title}</span>
                        <button onClick={() => handleDeletePoem(poet.id, poem.id)} className="text-red-400 hover:text-red-300 ml-2">Delete</button>
                      </div>
                    ))}
                    
                    <form onSubmit={(e) => handleAddPoem(e, poet.id)} className="mt-3 space-y-2 pt-2 border-t border-[#FFD59F]/10">
                      <input 
                        placeholder="Poem Title" 
                        required
                        value={poemForms[poet.id]?.title || ""}
                        onChange={e => setPoemForms({...poemForms, [poet.id]: { ...poemForms[poet.id], title: e.target.value }})}
                        className="w-full bg-[#6a2536]/40 border border-[#FFD59F]/20 rounded p-1.5 text-xs text-[#FFD59F] outline-none" 
                      />
                      <textarea 
                        placeholder="Poem Content" 
                        required
                        rows={3}
                        value={poemForms[poet.id]?.content || ""}
                        onChange={e => setPoemForms({...poemForms, [poet.id]: { ...poemForms[poet.id], content: e.target.value }})}
                        className="w-full bg-[#6a2536]/40 border border-[#FFD59F]/20 rounded p-1.5 text-xs text-[#FFD59F] outline-none" 
                      />
                      <button type="submit" className="w-full bg-[#FFD59F]/20 hover:bg-[#FFD59F]/30 text-[#FFD59F] text-xs font-bold py-1.5 rounded transition">
                        Add Poem
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
`;

content = content.replace(
  '<div className="lg:col-span-2 bg-[#4E1A27] border border-[#FFD59F]/30 rounded-xl overflow-hidden flex flex-col h-fit order-1 lg:order-2 w-full">',
  poetsUI + '\n        <div className="lg:col-span-2 bg-[#4E1A27] border border-[#FFD59F]/30 rounded-xl overflow-hidden flex flex-col h-fit order-1 lg:order-2 w-full">'
);

fs.writeFileSync('src/components/AdminDashboard.jsx', content);
