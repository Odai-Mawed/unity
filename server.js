require('dotenv').config();

const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.text({ type: 'application/json' }));

// Statische Dateien im Verzeichnis "unityBuild/Build" servieren
app.use(express.static(path.join(__dirname, '..', 'unityBuild', 'Build' )));

// Route für /unity
app.get('/unity', (req, res) => {
  console.log("ich habe eine anfrage bekommen")
  res.sendFile(path.join(__dirname, '..', 'unityBuild', 'Build', 'index.html'));
});

const s3 = new AWS.S3();

let fileCounter = 1;


app.post('/upload', async (req, res) => {
  try {
    console.log(req.body)
//    const jsonData = JSON.parse(req.body);

    // Beispiel: Erstelle den Dateinamen mit einer incrementierten Zahl
  //  const fileName = `jsonFile${fileCounter++}.json`;

    // Beispiel: Lade den JSON-String in den S3-Bucket hoch
    //await s3
     // .putObject({
      //  Body: JSON.stringify(jsonData),
      //  Bucket: 'sever-1-bucket-1',
      //  Key: fileName
      //})
      //.promise();

    //console.log('Daten erfolgreich in S3 hochgeladen:', fileName);

    res.send('Daten erfolgreich hochgeladen!');
  } catch (error) {
    console.error('Fehler beim Hochladen der Daten:', error);
    res.status(500).send('Interner Serverfehler');
  }
});

const server = app.listen(port, () => {
  const address = server.address();
  console.log(`Server läuft auf http://${address.address}:${address.port}`);
});
