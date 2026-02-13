const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const upload = require('express-fileupload');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// ✅ FIXED CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(upload());

// uploads folder serve
const uploadsDirectory = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDirectory));

// routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// test route
app.get('/', async (req, res) => {
  res.send('Backend running 🚀');
});

// error middleware
app.use(notFound);
app.use(errorHandler);

// DB connect + server start
connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server Started on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(error => console.error(error));
