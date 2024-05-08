const express = require('express');
const opennode = require('opennode'); // Importujemy bibliotekę OpenNode
const app = express();
const port = 3000;

// Ustawiamy klucz API OpenNode
opennode.setCredentials('eebb7ea5-3358-4d1f-a430-d94e4fd613d3', 'live');

app.get('/getPaymentAddress', (req, res) => {
    const withdrawal = {
        type: 'ln',
        address: 'LNTB10N1PNZLD5FPP5UMF286C4F2X3YDXG7J4F6D8TR084F2T0KAWG063GPXZ62QNTWS6QDQVVF5HGCM0D9HQCQZZSXQYZ5VQSP56UT6UHQMLGA6UAZ4KAH9K07PVMVQKM03WHW40NNV5VSFU4SCXFZS9QYYSSQRUKYVEMGV708EADNEQ0978KXY6FT60UHY4G0WYCGHCX9RTSTC30RJP0E80HPX245TKN7KR505GZY3QF5ESRESF58ED469CLL85A9FESQKZZTQK',
        callback_url: 'https://example.com/webhook/opennode/withdrawal'
    };

    // Inicjujemy wypłatę przy użyciu OpenNode API
    opennode.initiateWithdrawalAsync(withdrawal)
        .then(withdrawal => {
            console.log('Withdrawal initiated:', withdrawal);
            res.send(withdrawal);
        })
        .catch(error => {
            console.error('Error initiating withdrawal:', error);
            res.status(500).send('Error initiating withdrawal');
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
