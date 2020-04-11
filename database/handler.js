const admin = require("firebase-admin")
const serviceAccount = require("../secrets/serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://uptimechecker-1ad70.firebaseio.com"
  });

const db = admin.firestore();
exports.db = db;