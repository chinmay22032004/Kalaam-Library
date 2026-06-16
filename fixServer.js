import fs from 'fs';

let content = fs.readFileSync('server/server.js', 'utf8');

const poetRoutes = `
// --- POET ROUTES ---

// GET /api/poets
app.get('/api/poets', async (req, res) => {
  try {
    const poets = await Poet.find({});
    // Transform _id to id for frontend
    const formattedPoets = poets.map(p => {
      const poetObj = p.toObject();
      poetObj.id = poetObj._id.toString();
      delete poetObj._id;
      if (poetObj.poems) {
        poetObj.poems = poetObj.poems.map(poem => {
          poem.id = poem._id ? poem._id.toString() : poem.id;
          delete poem._id;
          return poem;
        });
      }
      return poetObj;
    });
    res.json(formattedPoets);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: 'Error fetching poets', error: err.message });
  }
});

// POST /api/poets
app.post('/api/poets', auth, admin, async (req, res) => {
  try {
    const poet = new Poet(req.body);
    await poet.save();
    
    const poetObj = poet.toObject();
    poetObj.id = poetObj._id.toString();
    delete poetObj._id;
    if (poetObj.poems) {
      poetObj.poems = poetObj.poems.map(poem => {
        poem.id = poem._id ? poem._id.toString() : poem.id;
        delete poem._id;
        return poem;
      });
    }
    
    res.status(201).json(poetObj);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: 'Error creating poet', error: err.message });
  }
});

// PUT /api/poets/:id
app.put('/api/poets/:id', auth, admin, async (req, res) => {
  try {
    const poet = await Poet.findById(req.params.id);
    if (!poet) {
      return res.status(404).json({ message: 'Poet not found' });
    }
    Object.assign(poet, req.body);
    await poet.save();
    
    const poetObj = poet.toObject();
    poetObj.id = poetObj._id.toString();
    delete poetObj._id;
    if (poetObj.poems) {
      poetObj.poems = poetObj.poems.map(poem => {
        poem.id = poem._id ? poem._id.toString() : poem.id;
        delete poem._id;
        return poem;
      });
    }
    
    res.json(poetObj);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: 'Error updating poet', error: err.message });
  }
});

// DELETE /api/poets/:id
app.delete('/api/poets/:id', auth, admin, async (req, res) => {
  try {
    const poet = await Poet.findByIdAndDelete(req.params.id);
    if (!poet) {
      return res.status(404).json({ message: 'Poet not found' });
    }
    res.json({ success: true, message: 'Poet deleted successfully' });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: 'Error deleting poet', error: err.message });
  }
});

`;

content = content.replace('// --- AUTHENTICATION ROUTES ---', poetRoutes + '// --- AUTHENTICATION ROUTES ---');

fs.writeFileSync('server/server.js', content);
