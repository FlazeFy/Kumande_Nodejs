const admin = require('firebase-admin')
const serviceAccount = require('./kumande-64a66-firebase-adminsdk-maclr-efd41385aa.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'kumande-64a66.appspot.com'
});

const bucket = admin.storage().bucket()

module.exports = { bucket }
