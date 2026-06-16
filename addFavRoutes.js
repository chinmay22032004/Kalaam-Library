import fs from 'fs';

let content = fs.readFileSync('server/server.js', 'utf8');

const favoritePoemRoutes = `
// POST /api/auth/me/favorite-poems
app.post('/api/auth/me/favorite-poems', auth, async (req, res) => {
  try {
    const { poemId } = req.body;
    if (!poemId) return res.status(400).json({ message: 'Poem ID required' });
    
    const user = await User.findById(req.user._id);
    if (!user.favoritePoems.includes(poemId)) {
      user.favoritePoems.push(poemId);
      await user.save();
    }
    res.json({ success: true, favoritePoems: user.favoritePoems });
  } catch (err) {
    res.status(500).json({ message: 'Error adding favorite poem' });
  }
});

// DELETE /api/auth/me/favorite-poems/:poemId
app.delete('/api/auth/me/favorite-poems/:poemId', auth, async (req, res) => {
  try {
    const { poemId } = req.params;
    const user = await User.findById(req.user._id);
    user.favoritePoems = user.favoritePoems.filter(id => id !== poemId);
    await user.save();
    res.json({ success: true, favoritePoems: user.favoritePoems });
  } catch (err) {
    res.status(500).json({ message: 'Error removing favorite poem' });
  }
});
`;

const target = `app.delete('/api/auth/me/favorites/:bookId', auth, async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id.toString() !== bookId);
    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Error removing favorite' });
  }
});`;

if (content.includes(target)) {
  content = content.replace(target, target + '\n\n' + favoritePoemRoutes);
  fs.writeFileSync('server/server.js', content);
} else {
  console.log('Target not found!');
}
