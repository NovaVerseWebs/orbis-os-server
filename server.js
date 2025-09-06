const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const notesDir = path.join(__dirname, 'UserData', 'Documents', 'OrbisNotes');
if (!fs.existsSync(notesDir)) fs.mkdirSync(notesDir, { recursive: true });

app.get('/notes', (req, res) => {
  const file = path.join(notesDir, 'notes.txt');
  if (fs.existsSync(file)) {
    res.send(fs.readFileSync(file, 'utf-8'));
  } else {
    res.send('');
  }
});

app.post('/notes', (req, res) => {
  const file = path.join(notesDir, 'notes.txt');
  fs.writeFileSync(file, req.body.content || '');
  res.send({ success: true });
});

app.listen(3000, () => console.log("📡 Orbis server running at http://localhost:3000"));
