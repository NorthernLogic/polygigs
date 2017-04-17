const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = functions.database.ref('/gigs/{key}')
  .onWrite(event => {
    const gig = event.data.val();
    const key = event.params.key;

    if (gig.dateNotificationSent) {
      console.info(`Skipping {key}: Notification already sent.`);
      return;
    }

    if (!gig.isActive) {
      console.info(`Skipping {key}: Gig is not active.`);
    }

    return admin.messaging().sendToTopic('gig-notification', {
      notification: {
        title: 'PolyGig Posted',
        body: `${gig.posterCompany} is looking for a ${gig.title}`,
        clickAction : `https://polygigs.com/gig/${key}`,
        icon: 'https://polygigs.com/src/polymer-logo.png',
      },
    })
    .then(() => event.data.ref.set(Object.assign(
      gig,
      { dateNotificationSent: (new Date()).toISOString() }
    )));
});