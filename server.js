const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Konfigurieren Sie den AWS-SDK mit Ihren Anmeldeinformationen
aws.config.update({
  accessKeyId: 'IHR_ACCESS_KEY',
  secretAccessKey: 'IHR_SECRET_KEY',
  region: 'IHR_REGION', // z.B. 'us-east-1'
});

const s3 = new aws.S3();

// Spezifiziere das Zielverzeichnis für die hochgeladenen Dateien
const upload = multer({ dest: 'uploads/' });

// POST-Anfrage-Endpunkt für den Datei-Upload
app.post('/upload', upload.single('excelFile'), (req, res) => {
    // Die hochgeladene Datei ist unter req.file verfügbar
    const uploadedFile = req.file;

    // Zielordner für die gespeicherten Excel-Dateien auf S3
    const targetFolder = 's3-uploads/';

    // Erstellen Sie einen Stream aus der Datei
    const fileStream = fs.createReadStream(uploadedFile.path);

    // Konfigurieren Sie die Parameter für den S3-Upload
    const params = {
        Bucket: 'IHR_S3_BUCKET_NAME',
        Key: path.join(targetFolder, uploadedFile.originalname),
        Body: fileStream,
    };

    // Führen Sie den S3-Upload durch
    s3.upload(params, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Fehler beim Hochladen der Datei aufgetreten.');
        }

        // Datei auf S3 erfolgreich hochgeladen
        console.log('Datei erfolgreich auf S3 hochgeladen:', data.Location);

        // Löschen Sie die lokale Datei nach dem Hochladen auf S3
        fs.unlinkSync(uploadedFile.path);

        res.status(200).json({ message: 'Datei erfolgreich hochgeladen und auf S3 gespeichert.' });
    });
});

// Starte den Server
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
