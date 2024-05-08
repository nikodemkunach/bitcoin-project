const express = require('express');
const opennode = require('opennode');
const QRCode = require('qrcode');

opennode.setCredentials('b4a59296-10a3-433b-ae0b-0a958a3c109e', 'dev');

const app = express();
const PORT = 3000;

const charge = {
    "amount": "0.01",
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

app.get('/', async (req, res) => {
    try {
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
                    h1 {
                        margin-bottom: 20px;
                        color: #333;
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
                    <h1>Scan QR Code to Make Payment</h1>
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
