const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const userRoot = path.join(__dirname, 'UserData');
const notesDir = path.join(userRoot, 'Documents', 'OrbisNotes');
const downloadsDir = path.join(userRoot, 'Downloads');

function ensureDirs() {
  [userRoot, notesDir, downloadsDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}
ensureDirs();

// GET /notes -> returns notes.txt content
app.get('/notes', (req, res) => {
  const file = path.join(notesDir, 'notes.txt');
  if (!fs.existsSync(file)) return res.send('');
  res.send(fs.readFileSync(file, 'utf8'));
});

// POST /notes -> save payload.content
app.post('/notes', (req, res) => {
  const content = req.body.content || '';
  const file = path.join(notesDir, 'notes.txt');
  fs.writeFileSync(file, content, 'utf8');
  res.json({ success: true });
});

// GET /files?path=Downloads  -> list contents of Orbis UserData folders
app.get('/files', (req, res) => {
  const rel = req.query.path || '.';
  const target = path.join(userRoot, rel);
  if (!fs.existsSync(target)) return res.status(404).json({ error: 'Not found' });
  const items = fs.readdirSync(target, { withFileTypes: true }).map(d => ({
    name: d.name,
    isDir: d.isDirectory()
  }));
  res.json(items);
});

// optional: receive uploaded files (simple)
const multer = require('multer');
const upload = multer({ dest: downloadsDir });
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ success: true, file: req.file });
});

app.listen(PORT, () => console.log(`📡 Orbis server listening on ${PORT}`));
