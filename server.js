const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schema and Model
const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  popularity: { type: Number, required: true },
});

const Language = mongoose.model('Language', languageSchema);

// CRUD Endpoints
app.get('/languages', async (req, res) => {
  const languages = await Language.find();
  res.json(languages);
});

app.post('/languages', async (req, res) => {
  const { name, popularity } = req.body;
  const newLanguage = new Language({ name, popularity });
  await newLanguage.save();
  res.json(newLanguage);
});

app.put('/languages/:id', async (req, res) => {
  const { id } = req.params;
  const { name, popularity } = req.body;
  const updatedLanguage = await Language.findByIdAndUpdate(
    id,
    { name, popularity },
    { new: true }
  );
  res.json(updatedLanguage);
});

app.delete('/languages/:id', async (req, res) => {
  const { id } = req.params;
  await Language.findByIdAndDelete(id);
  res.json({ message: 'Language deleted' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
