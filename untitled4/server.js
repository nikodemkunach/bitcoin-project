// Kod serwera Node.js

const express = require('express');
const app = express();
const path = require('path');

// Ustawienie ścieżki do plików statycznych (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Nasłuchuje na porcie 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
