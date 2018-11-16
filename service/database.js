function DB() {
  // Get a reference to the database service
  this.database = firebase.database();
  this.beskeder = [];

  this.addmes = function (mes) {
    var uid = firebase.auth().currentUser.uid;
    var besked = {
      uid: uid,
      fra: "ukendt",
      besked: mes,
      oprettet: Date.now()
    };

    var k = firebase.database().ref().child('posts').push().key;
    firebase.database().ref('/beskeder/' + k).set(besked);
  }

  this.listen = function () {
    // var userId = firebase.auth().currentUser.uid;
    var db = this;
    return firebase.database().ref("beskeder/").on('value', function(snapshot) {
      var beskeder = snapshot.val();
      db.beskeder = [];
      for (var k in beskeder) {
        db.beskeder.push(beskeder[k]);
      }

      app.setBeskeder(db.beskeder);
      console.log("Du har skrevet: ", snapshot.val());
    });
  }

  this.listen();
}

function User() {

  this.signin = function (email, password) {
    var errorFunc = function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.error("Fejl med at logge ind", error);
    };
    
    if (email && password) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(errorFunc);
    } else {
        firebase.auth().signInAnonymously().catch(errorFunc);
    }
  }

  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;

    console.log("Du er logget ind som", user);
  } else {
    // User is signed out.
    // ...
    console.log("Du er logget af");
  }
});
}
