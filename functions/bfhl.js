const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors'); // To enable CORS
const mime = require('mime-types');

// Initialize Express
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Helper function to classify input data
const classifyData = (data) => {
    const numbers = [];
    const alphabets = [];
    let highestLowercase = '';

    data.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else if (/^[a-zA-Z]$/.test(item)) {
            alphabets.push(item);
            if (/[a-z]/.test(item) && (!highestLowercase || item > highestLowercase)) {
                highestLowercase = item;
            }
        }
    });

    return { numbers, alphabets, highestLowercase: highestLowercase ? [highestLowercase] : [] };
};

// POST /bfhl Route
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    // User info (hardcoded for now)
    const userId = 'prakhar_bhardwaj_04/03/2004'; // Replace with dynamic user ID
    const email = 'pb3885@srmist.edu.in';
    const rollNumber = 'RA2111003030420';

    // Classify the data
    const { numbers, alphabets, highestLowercase } = classifyData(data);

    // Handle file (if provided)
    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKB = 0;

    if (file_b64) {
        const fileBuffer = Buffer.from(file_b64, 'base64');
        fileMimeType = mime.lookup(fileBuffer);
        fileSizeKB = Buffer.byteLength(fileBuffer) / 1024;
        fileValid = !!fileMimeType;
    }

    // Add CORS headers explicitly here
    res.setHeader('Access-Control-Allow-Origin', 'https://<your-frontend-netlify-url>.netlify.app'); // Replace with your frontend URL
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Response
    res.json({
        is_success: true,
        user_id: userId,
        email: email,
        roll_number: rollNumber,
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercase,
        file_valid: fileValid,
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKB.toFixed(2)
    });
});

// GET /bfhl Route
app.get('/bfhl', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://<your-frontend-netlify-url>.netlify.app'); // Add CORS headers here too
    res.status(200).json({
        operation_code: 1
    });
});

// Export the handler for Netlify functions
module.exports.handler = serverless(app);
