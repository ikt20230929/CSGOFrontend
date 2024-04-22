# CSGO Frontend
Ez a szoftver a [MIT licenc](LICENSE.txt) alatt áll.
A függőségekre vonatkozó szerzői jogi és licencadatok a [NOTICE.txt](NOTICE.txt)-ben találhatók.

## Az alkalmazás futtatása
1. Klónozd a Git-adattárat egy tetszőleges mappába:

*(Győződj meg róla, hogy a [Git](https://git-scm.com/downloads) telepítve van a parancs futtatása előtt!)*

`git clone https://github.com/ikt20230929/CSGOFrontend`

3. Lépj be a mappába

`cd CSGOFrontend`

4. Konfigurációs fájl szerkesztése

Az alkalmazás mappájában egy `config\settings-dev.js` nevű fájl található.

Nyisd meg, és váloztatsd meg az alábbi értékeket a környezetedhez képest:

- API_URL -> Változtatsd meg arra az elérési útra, ahonnan a Backend-et el lehet érni. (pl: https://example.com/api)

(Tipp: Ha csak helyileg teszteled az alkalmazást, akkor ezt a lépést kihagyhatod)

5. Futtasd az alkalmazást

*(Győződj meg róla, hogy a [Node.js](https://nodejs.org/en/download) telepítve van a parancs futtatása előtt!)*

Ha csak helyileg tesztelsz, futtasd a `npm run watch` parancsot, különben, kövesd az alábbi lépéseket a produkciós futtatáshoz:

```bash
# Másold át a fejlesztési konfigurációs fájlt a produkciós helyére.
copy config\settings-dev.js config\settings-prod.js
(Linux-on: cp config\settings-dev.js config\settings-prod.js)

# Az alkalmazás build-elése.
npm run build

# Másold a "public" mappa tartalmát a webszervered mappájába, például:
xcopy public C:\xampp\htdocs /s /e
(Linux-on: cp -Rv public /var/www/html)
```

## Tesztelés
Az egység teszteket a `npm test` paranccsal lehet futtatni.
