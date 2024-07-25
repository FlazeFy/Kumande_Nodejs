const { collection, addDoc } = require('firebase/firestore')
const { db } = require('../../configs/firebase')
const path = require('path');
const { bucket } = require('../../configs/firebase_admin');

const add_firestore = async (data, ref) => {
    try {
        const docRef = await addDoc(collection(db, ref), data)
        return docRef.id
    } catch (err) {
        throw err
    }
};

const add_storage = async (filePath) => {
    try {
        const fileName = path.basename(filePath)
        const file = bucket.file(`analyze/${fileName}`)

        await bucket.upload(filePath, {
            destination: `analyze/${fileName}`,
        });

        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1)
        const formattedExpirationDate = expirationDate.toISOString()

        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: formattedExpirationDate
        });

        return url
    } catch (err) {
        return `Failed to analyze the photo: ${err}`
    }
};

module.exports = { add_firestore, add_storage }
