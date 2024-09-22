const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();

// Enable CORS
app.use(cors());

app.use(express.json()); // To parse JSON request bodies

const PORT = process.env.PORT || 3000;

// Import Routes
const bfhlRoutes = require('./routes/bfhl');

// Use Routes
app.use('/bfhl', bfhlRoutes);

// Start Server
app.listen(PORT, () => {
    console.log("Server is running on port ${PORT}");
});