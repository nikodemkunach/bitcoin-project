const express = require('express');
const opennode = require('opennode');
const QRCode = require('qrcode');
const bodyParser = require('body-parser');

opennode.setCredentials('b4a59296-10a3-433b-ae0b-0a958a3c109e', 'dev');

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
    "success_url": "https://yoursuccessurl.com",
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
            <title>Enter Amount</title>
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
                input {
                    padding: 10px;
                    font-size: 16px;
                    margin-bottom: 20px;
                    border: 2px solid #333;
                    border-radius: 8px;
                    width: 200px;
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
                <h1>Enter Amount to Donate</h1>
                <form action="/generate-qr" method="post">
                    <input type="number" name="amount" step="0.01" min="0" required>
                    <button type="submit">Generate QR Code</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

app.post('/generate-qr', async (req, res) => {
    try {
        const amount = req.body.amount;
        const charge = { ...chargeTemplate, amount };

        const chargeResponse = await opennode.createCharge(charge);
        const payreq = chargeResponse.lightning_invoice.payreq;
        const hostedCheckoutURL = chargeResponse.hosted_checkout_url;
        const qrCodeDataURL = await QRCode.toDataURL(payreq);

        // Logowanie informacji do konsoli
        console.log("Charge Response:", chargeResponse);
        console.log("Payment Request:", payreq);
        console.log("Hosted Checkout URL:", hostedCheckoutURL);

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
                    .checkout-url {
                        background-color: #fff;
                        padding: 10px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .checkout-url p {
                        margin: 0;
                        color: #333;
                    }
                    .checkout-url a {
                        color: #007bff;
                        text-decoration: none;
                        word-break: break-all;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Daj BTC biednym studenciakom</h2>
                    <h1>Scan QR Code to Make Payment</h1>
                    <h3>Amount to Pay: ${amount} ${charge.currency}</h3>
                    <img src="${qrCodeDataURL}" alt="QR Code">
                    <div class="checkout-url">
                        <p>Hosted Checkout URL:</p>
                        <a href="${hostedCheckoutURL}" target="_blank">${hostedCheckoutURL}</a>
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send(`${error.status} | ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
