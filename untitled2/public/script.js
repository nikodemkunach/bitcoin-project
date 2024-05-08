document.addEventListener('DOMContentLoaded', function() {
    // Pobranie adresu płatności z serwera
    fetch('/getPaymentAddress')
        .then(response => response.json()) // Używamy .json() zamiast .text(), ponieważ oczekujemy odpowiedzi w formacie JSON
        .then(data => {
            // Wygenerowanie kodu QR na podstawie otrzymanego adresu płatności
            const qrCodeContainer = document.getElementById('qrCode');
            const qrCode = new QRCode(qrCodeContainer, {
                text: data.paymentAddress, // Zmieniamy na odpowiednie pole zawierające adres płatności
                width: 200,
                height: 200
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
