const express = require('express');
const opennode = require('opennode');
const QRCode = require('qrcode');
const bodyParser = require('body-parser');

opennode.setCredentials('4c60af75-4eb0-4a44-bb12-d158daa42743', 'live');

const app = express();
const PORT = 3000;

// Middleware do parsowania ciała żądań POST
app.use(bodyParser.urlencoded({ extended: true }));

const chargeTemplate = {
    "description": "płatność za usługę",
    "currency": "PLN",
    "customer_email": "sample@sample.com",
    "notif_email": "sample@sample.com",
    "customer_name": "nakamoto",
    "order_id": "21",
    "callback_url": "https://yourwebhook.com",
    "success_url": "http://localhost:3000/success",
    "auto_settle": false,
    "ttl": 10
};

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Enter Details</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                h1 {
                    color: #333;
                    margin-bottom: 20px;
                }
                form {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                label {
                    margin-bottom: 5px;
                }
                input, select {
                    padding: 10px;
                    font-size: 16px;
                    margin-bottom: 20px;
                    border: 2px solid #333;
                    border-radius: 8px;
                    width: 300px;
                }
                button {
                    padding: 10px 20px;
                    font-size: 16px;
                    color: #fff;
                    background-color: #007bff;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Przekaż datek na studentów</h1>
                <form action="/generate-qr" method="post">
                    <label for="description">Opis:</label>
                    <input type="text" id="description" name="description" required>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                    <label for="notif_email">Email do powiadomień:</label>
                    <input type="email" id="notif_email" name="notif_email" required>
                    <label for="name">Imię i Nazwisko:</label>
                    <input type="text" id="name" name="name" required>
                    <label for="currency">Waluta:</label>
                    <select id="currency" name="currency" required>
                        <option value="PLN">PLN</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                    <label for="amount">Kwota:</label>
                    <input type="number" id="amount" name="amount" step="0.01" min="0" required>
                    <button type="submit">Generate QR Code</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

app.post('/generate-qr', async (req, res) => {
    try {
        const { description, email, notif_email, name, currency, amount } = req.body;
        const charge = {
            ...chargeTemplate,
            amount,
            currency,
            customer_email: email,
            customer_name: name,
            notif_email: notif_email,
            description: description
        };

        const chargeResponse = await opennode.createCharge(charge);
        const payreq = chargeResponse.lightning_invoice.payreq;
        const qrCodeDataURL = await QRCode.toDataURL(payreq);

        // Renderowanie strony z kodem QR
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment QR Code</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f0f0f0;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    h1, h2, h3 {
                        color: #333;
                    }
                    h2 {
                        margin-bottom: 10px;
                    }
                    h1 {
                        margin-bottom: 10px;
                    }
                    h3 {
                        margin-bottom: 20px;
                    }
                    img {
                        max-width: 80%;
                        height: auto;
                        border: 2px solid #333;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Daj BTC biednym studenciakom</h2>
                    <h1>Zeskanuj kod QR i przekaż datek</h1>
                    <h3>Kwota do przekazania: ${amount} ${currency}</h3>
                    <img src="${qrCodeDataURL}" alt="QR Code">
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send(`${error.status} | ${error.message}`);
    }
});

app.get('/success', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <titlePayment Success</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                h1 {
                    color: #333;
                    margin-bottom: 20px;
                }
                p {
                    color: #333;
                    font-size: 18px;
                    text-align: center;
                    max-width: 600px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Płatność zakończona sukcesem!</h1>
                <p>Dziękujemy za Twoją płatność. Środki zostały pomyślnie przekazane na rzecz biednych studentów. Możesz zamknąć tę stronę.</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
