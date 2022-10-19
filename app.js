const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const CLIENT_ID = `${process.env.CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.CLIENT_SECRET}`;
const REDIRECT_URI = `${process.env.REDIRECT_URI}`;

const REFRESH_TOKEN = `${process.env.REFRESH_TOKEN}`;

console.log(CLIENT_ID, CLIENT_SECRET);

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const filePath = path.join(__dirname, "photo.jpg");

async function uploadFiles() {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: "Certificate.jpg",
        mimeType: "image/jpg",
      },
      media: {
        mimeType: "image/jpg",
        body: fs.createReadStream(filePath),
      },
    });

    console.log(response.data);
  } catch (e) {
    console.log(e.message);
  }
}

uploadFiles();

async function deleteFiles() {
  try {
    const response = await drive.files.delete({
      fileId: "1Hmj0aeGFXPIzwgfMEtlWRvXRBWKiaGcg",
    });

    console.log(response.data, response.status);
  } catch (error) {
    console.log(error.message);
  }
}

// deleteFiles();

async function generatePublicLink() {
  try {
    const fileId = "1RaJNVRZSNvRHAfhytckyQg2b3Bt0PtyB";
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId,
      fields: "webViewLink, webContentLink",
    });

    console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}

// generatePublicLink();
