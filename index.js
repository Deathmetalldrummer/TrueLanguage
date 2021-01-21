var admin = require("firebase-admin");
var serviceAccount = require("./adminConfig.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

