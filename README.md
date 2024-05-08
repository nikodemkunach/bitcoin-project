# Generator Kodów QR Płatności OpenNode

To jest program w Node.js, który generuje kod QR płatności za pomocą API OpenNode i wyświetla go na stronie internetowej razem z URL hostowanego formularza płatności.

## Wymagania wstępne

Przed uruchomieniem tej aplikacji upewnij się, że masz zainstalowany Node.js na swoim systemie.

## Instalacja

1. Sklonuj to repozytorium na swój komputer:

2. Przejdź do katalogu projektu:

3. Zainstaluj zależności za pomocą npm:
npm install express opennode qrcode


## Konfiguracja

Musisz skonfigurować swoje dane uwierzytelniające API OpenNode w pliku `server.js`. Zastąp `'TWÓJ_KLUCZ_API'` i `'ŚRODOWISKO'` swoim rzeczywistym kluczem API i środowiskiem (lub `'live'`, lub `'dev'`).

```javascript
opennode.setCredentials('TWÓJ_KLUCZ_API', 'ŚRODOWISKO');

Użycie
Aby uruchomić serwer, wykonaj następującą komendę:

node server.js

Gdy serwer jest uruchomiony, otwórz przeglądarkę internetową i przejdź pod adres http://localhost:3000, aby zobaczyć kod QR płatności i URL hostowanego formularza płatności.
