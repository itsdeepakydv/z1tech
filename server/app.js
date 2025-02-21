require('dotenv').config();
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
//const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

//connectDB();

app.use(cors());
app.use(express.json());
app.use('/api', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
