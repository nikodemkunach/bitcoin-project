// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
// Dodaj tę linijkę przed obsługą głównej strony w pliku server.js
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Obsługa żądania głównej strony
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Obsługa żądania płatności
app.post('/createInvoice', async (req, res) => {
    try {
        // Tworzenie faktury w OpenNode
        const response = await axios.post('https://api.opennode.com/v2/charges', {
            amount: req.body.amount,
            currency: 'USD', // lub inna wspierana waluta
            description: req.body.description,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'YOUR_API_KEY', // Zastąp 'YOUR_API_KEY' swoim kluczem API OpenNode
            },
        });

        res.json({ invoice: response.data.data });
    } catch (error) {
        console.error('Błąd przy tworzeniu faktury:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na porcie ${PORT}`);
});
