const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  console.log('Received file:', req.file.originalname);
  res.send({ message: 'File uploaded successfully' });
});

app.listen(PORT, () => console.log(`Mock server running on http://localhost:${PORT}`));
