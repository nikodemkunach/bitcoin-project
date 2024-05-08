const apiKey = 'TUTAJ_WPROWADŹ_SWÓJ_KLUCZ_API';
const paymentAddress = 'TUTAJ_WPROWADŹ_ADRES_LIGHTNING';

function generateQRCode(invoice) {
    const qrContainer = document.getElementById('qr-code');
    qrContainer.innerHTML = '';

    const qr = new QRCode(qrContainer, {
        text: invoice,
        width: 200,
        height: 200
    });
}

function getLightningPaymentCode() {
    const opennode = require('opennode');
    opennode.setCredentials(apiKey, 'live');

    const withdrawal = {
        type: 'ln',
        address: paymentAddress,
        callback_url: 'https://example.com/webhook/opennode/withdrawal'
    };

    opennode.initiateWithdrawalAsync(withdrawal)
        .then(withdrawal => {
            generateQRCode(withdrawal.invoice);
            document.getElementById('invoice').innerText = withdrawal.invoice;
        })
        .catch(error => {
            console.error(`${error.status} | ${error.message}`);
        });
}

// Wywołaj funkcję przy załadowaniu strony
window.onload = getLightningPaymentCode;
