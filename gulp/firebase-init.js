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
