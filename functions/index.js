const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

admin.initializeApp();

exports.addUser = functions.https.onCall((data, context) => {
  const { name } = data;

  const db = admin.firestore();

  return db
    .collection("users")
    .add({
      name,
      signupTimestamp: FieldValue.serverTimestamp(),
    })
    .then(() => {
      return { message: "successfully added user", success: true };
    })
    .catch((error) => {
      throw new functions.https.HttpsError("unknown", error.message, error);
    });
});