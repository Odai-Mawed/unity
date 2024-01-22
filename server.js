require('dotenv').config();

const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const app = express();
const port = 3000;


const s3 = new AWS.S3();

// Zähler für den Dateinamen
let fileCounter = 1;

const storage = multer.memoryStorage();  // Datei wird im Arbeitsspeicher gehalten

const upload = multer({ storage: storage });

app.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    // Erstelle den Dateinamen mit einer incrementierten Zahl
    const fileName = `file${fileCounter++}.xlsx`;

    // Lade die Datei in den S3-Bucket hoch
    await s3
      .putObject({
        Body: req.file.buffer,
        Bucket: 'sever-1-bucket-1',
        Key: fileName
      })
      .promise();

    console.log('Datei erfolgreich in S3 hochgeladen:', fileName);

    res.send('Datei erfolgreich hochgeladen!');
  } catch (error) {
    console.error('Fehler beim Hochladen der Datei:', error);
    res.status(500).send('Interner Serverfehler');
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
