import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

const poetsData = `
const POETS_DATA = [
  {
    id: "mirza-ghalib",
    name: "Mirza Ghalib",
    description: "The most prominent Urdu and Persian poet of the Mughal Empire.",
    avatar: "https://via.placeholder.com/150/4E1A27/FFD59F?text=Ghalib",
    bio: "Mirza Asadullah Baig Khan, known by his pen name Ghalib, was a classical Urdu and Persian poet.",
    poems: [
      {
        id: "ghalib-dil-e-nadaan",
        title: "Dil-e-Nadaan",
        content: "Dil-e-nadaan tujhe hua kya hai,\\nAakhir is dard ki dawa kya hai?\\n\\nHum hain mushtaq aur woh bezaar,\\nYa Ilahi yeh majra kya hai?"
      },
      {
        id: "ghalib-hazaron-khwahishen",
        title: "Hazaron Khwahishen",
        content: "Hazaron khwahishen aisi ke har khwahish pe dum nikle,\\nBahut nikle mere armaan, lekin phir bhi kam nikle."
      },
      {
        id: "ghalib-ishq-ne-ghalib",
        title: "Ishq Ne Ghalib",
        content: "Ishq ne Ghalib nikamma kar diya,\\nVarna hum bhi aadmi the kaam ke."
      },
      {
        id: "ghalib-har-ek-baat-pe",
        title: "Har Ek Baat Pe",
        content: "Har ek baat pe kehte ho tum ke tu kya hai,\\nTumhi kaho ke yeh andaz-e-guftagu kya hai?"
      }
    ]
  },
  {
    id: "faiz-ahmad",
    name: "Faiz Ahmad Faiz",
    description: "A celebrated revolutionary author and poet.",
    avatar: "https://via.placeholder.com/150/4E1A27/FFD59F?text=Faiz",
    bio: "Faiz Ahmad Faiz was an intellectual, revolutionary poet, and one of the most celebrated writers of the Urdu language.",
    poems: [
      {
        id: "faiz-mujh-se-pehli",
        title: "Mujh Se Pehli Si Muhabbat",
        content: "Mujh se pehli si muhabbat mere mehboob na maang,\\nMaine samjha tha ke tu hai toh darakhshaan hai hayaat."
      },
      {
        id: "faiz-hum-dekhenge",
        title: "Hum Dekhenge",
        content: "Hum dekhenge,\\nLazim hai ke hum bhi dekhenge.\\nWoh din ke jis ka waada hai,\\nJo lauh-e-azl mein likha hai."
      },
      {
        id: "faiz-gulon-mein-rang",
        title: "Gulon Mein Rang",
        content: "Gulon mein rang bhare baad-e-naubahaar chale,\\nChale bhi aao ke gulshan ka karobaar chale."
      },
      {
        id: "faiz-dasht-e-tanhai",
        title: "Dasht-e-Tanhai",
        content: "Dasht-e-tanhai mein aye jaan-e-jahan larzaan hain,\\nTeri aawaz ke saaye, tere honton ke saraab."
      }
    ]
  },
  {
    id: "jaun-elia",
    name: "Jaun Elia",
    description: "A prominent Urdu poet, philosopher, and scholar.",
    avatar: "https://via.placeholder.com/150/4E1A27/FFD59F?text=Jaun",
    bio: "Syed Hussain Jaun Asghar Naqvi, known as Jaun Elia, was an Urdu poet and philosopher known for his unconventional style.",
    poems: [
      {
        id: "jaun-aakhri-bar",
        title: "Aakhri Bar",
        content: "Kiya kaha ishq javidani hai!\\nAakhri bar mil rahay hain hum."
      },
      {
        id: "jaun-umar-guzregi",
        title: "Umar Guzregi",
        content: "Umar guzregi imtihaan mein kya,\\nDaag hi denge mujhko daan mein kya?"
      },
      {
        id: "jaun-naya-ek-rishta",
        title: "Naya Ek Rishta",
        content: "Naya ek rishta paida kyun karein hum,\\nBichhadna hai toh jhagda kyun karein hum?"
      },
      {
        id: "jaun-sharm-dehshat",
        title: "Sharm Dehshat",
        content: "Sharm, dehshat, jhijhak, pareshani,\\nNaaz se kaam kyun nahi leti?\\nAap, ji, magar, yeh sab kya hai,\\nTum mera naam kyun nahi leti?"
      }
    ]
  },
  {
    id: "parveen-shakir",
    name: "Parveen Shakir",
    description: "An iconic female Urdu poet and civil servant.",
    avatar: "https://via.placeholder.com/150/4E1A27/FFD59F?text=Parveen",
    bio: "Parveen Shakir was a Pakistani poet, teacher and a civil servant of the Government of Pakistan.",
    poems: [
      {
        id: "parveen-ku-ba-ku",
        title: "Ku-ba-ku",
        content: "Ku-ba-ku phail gayi baat shanasai ki,\\nUs ne khushbu ki tarah meri pazeerai ki."
      },
      {
        id: "parveen-woh-toh-khushbu",
        title: "Woh Toh Khushbu Hai",
        content: "Woh toh khushbu hai havaon mein bikhar jayega,\\nMasla phool ka hai phool kidhar jayega?"
      },
      {
        id: "parveen-kaisa-yeh-ishq",
        title: "Kaisa Yeh Ishq",
        content: "Kaisa yeh ishq hai, kaisa yeh khumar hai,\\nTu mera nahi hai, phir bhi tera intezaar hai."
      },
      {
        id: "parveen-chal-ne-ka-hausla",
        title: "Chal Ne Ka Hausla",
        content: "Chal ne ka hausla nahi, rukna muhaal kar diya,\\nIshq ke is safar ne toh, mujhko nidhaal kar diya."
      }
    ]
  }
];

export default function App() {
`;

content = content.replace('export default function App() {', poetsData);

// Remove the poets state
content = content.replace('  const [poets, setPoets] = useState([]);\n', '');

// Remove getPoets from initial fetch
content = content.replace(
`        const [booksData, settingsData, poetsData] = await Promise.all([
          api.getBooks(),
          api.getSettings(),
          api.getPoets(),
        ]);
        setBooks(booksData);
        setSettings(settingsData);
        setPoets(poetsData);`,
`        const [booksData, settingsData] = await Promise.all([
          api.getBooks(),
          api.getSettings(),
        ]);
        setBooks(booksData);
        setSettings(settingsData);`
);

// Fix favPoemsData to use POETS_DATA
content = content.replace(
`  const favPoemsData = useMemo(() => {
    return poets.flatMap((poet) => poet.poems || []).filter((poem) => favoritePoems.includes(poem.id));
  }, [favoritePoems, poets]);`,
`  const favPoemsData = useMemo(() => {
    return POETS_DATA.flatMap((poet) => poet.poems || []).filter((poem) => favoritePoems.includes(poem.id));
  }, [favoritePoems]);`
);

// Fix poets map instances
content = content.replace(/{poets.map\(/g, '{POETS_DATA.map(');

// Fix find index for poets
content = content.replace(/poets.find/g, 'POETS_DATA.find');

fs.writeFileSync('src/App.jsx', content);
