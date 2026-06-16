import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Replace Hero Section Buttons
const heroRegex = /<div className="pt-6 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center relative z-20 w-full sm:w-auto">[\s\S]*?<\/div>/;
const newHeroButton = `<div className="pt-6 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center relative z-20 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        showToast("Please login to view the poetry section.", "info");
                        return;
                      }
                      navigateTo("poetry");
                    }}
                    className="w-full sm:w-auto bg-[#FFD59F] text-[#4E1A27] hover:bg-[#e6b87e] font-bold py-3 sm:py-2.5 px-8 rounded-lg transition transform active:scale-95 shadow-[0_4px_14px_rgba(255,213,159,0.3)] text-xs sm:text-sm uppercase tracking-wider"
                  >
                    Poetry by Kalaam
                  </button>
                </div>`;

if (heroRegex.test(content)) {
  content = content.replace(heroRegex, newHeroButton);
  console.log('Hero replaced');
} else {
  console.log('Hero not found');
}

// 2. Add POETRY to desktop nav
const desktopNavRegex = /<button[\s\S]*?onClick=\{\(\) => navigateTo\("about"\)\}[\s\S]*?>[\s\S]*?ABOUT[\s\S]*?<\/button>/;
const newDesktopNav = `<button
                onClick={() => navigateTo("poetry")}
                className={\`px-3 py-1.5 rounded font-semibold text-sm hover:bg-[#4E1A27] hover:text-[#FFD59F] transition \${activeTab === "poetry" ? "bg-[#4E1A27] text-[#FFD59F]" : ""}\`}
              >
                POETRY
              </button>
              <button
                onClick={() => navigateTo("about")}
                className={\`px-3 py-1.5 rounded font-semibold text-sm hover:bg-[#4E1A27] hover:text-[#FFD59F] transition \${activeTab === "about" ? "bg-[#4E1A27] text-[#FFD59F]" : ""}\`}
              >
                ABOUT
              </button>`;

if (desktopNavRegex.test(content)) {
  content = content.replace(desktopNavRegex, newDesktopNav);
  console.log('Desktop nav replaced');
} else {
  console.log('Desktop nav not found');
}

// 3. Add POETRY to mobile nav
const mobileNavRegex = /<button[\s\S]*?onClick=\{\(\) => navigateTo\("about"\)\}[\s\S]*?>[\s\S]*?ABOUT KALAAM[\s\S]*?<\/button>/;
const newMobileNav = `<button
                  onClick={() => navigateTo("poetry")}
                  className={\`w-full text-left px-4 py-3 rounded font-bold tracking-wider text-sm hover:bg-[#FFD59F]/10 \${activeTab === "poetry" ? "bg-[#FFD59F]/10 text-[#FFD59F]" : "text-gray-300"}\`}
                >
                  POETRY
                </button>
                <button
                  onClick={() => navigateTo("about")}
                  className={\`w-full text-left px-4 py-3 rounded font-bold tracking-wider text-sm hover:bg-[#FFD59F]/10 \${activeTab === "about" ? "bg-[#FFD59F]/10 text-[#FFD59F]" : "text-gray-300"}\`}
                >
                  ABOUT KALAAM
                </button>`;

if (mobileNavRegex.test(content)) {
  content = content.replace(mobileNavRegex, newMobileNav);
  console.log('Mobile nav replaced');
} else {
  console.log('Mobile nav not found');
}

fs.writeFileSync('src/App.jsx', content);
