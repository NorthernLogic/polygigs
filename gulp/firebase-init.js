if (!process.env.FIREBASE_ADMIN_CERT_PATH) {
  // https://drive.google.com/open?id=0B8K9kwqtiGO8TTNvTFhYUmJ4UDg
  // export FIREBASE_ADMIN_CERT_PATH=absolute_or_relative_path/polygigs-firebase-adminsdk-h1d5y-22f98d5057.json
  throw new Error('FIREBASE_ADMIN_CERT_PATH is not set on env!');
}

const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_ADMIN_CERT_PATH);

let refCount = 0;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://polygigs.firebaseio.com'
});

const db = admin.database();
db.goOffline();

module.exports = {
  openDatabase: () => {
    refCount += 1;
    db.goOnline();
    return db;
  },
  closeDatabase: () => {
    refCount -= 1;
    if (refCount === 0) {
      db.goOffline();
    }
  },
};
