import { auth, GoogleAuthProvider, signInWithPopup, signOut, db, setDoc,doc, getDoc } from './firebaseInit.js'; // Adjust the import as necessary

$(document).ready(function() {
    $("#header-placeholder").load("header.html", function() {
        bindHeaderEvents(); // Bind events after loading the header
        //updateUserInfo(); // Optionally update user info
    });
});

function bindHeaderEvents() {
    $('#signUpButton').on('click', function() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(function(result) {
                const user = result.user;
                console.log('User signed up:', user.displayName);

                const userRef = doc(collection(db, 'users'), user.uid);
                setDoc(userRef, {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    score: 0  // Initial score
                }).then(() => {
                    console.log('User data saved to Firestore.');
                });

                $('#username-display').text(user.displayName);
                $('#user-score').text('Score: 0');
                $('#signUpButton').hide();
                $('#signOutButton').show();
            })
            .catch(function(error) {
                console.error('Error during sign-up:', error);
            });
    });

    $('#signInButton').on('click', function() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(async function(result) {
            const user = result.user;

            // Update the display name
            $('#username-display').text(user.displayName);

            // Fetch the user's score from Firestore
            const userRef = doc(db, 'users', user.uid);
            try {
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    const userScore = userData.score || 0; // Default to 0 if no score is found

                    // Display the actual score in the header
                    $('#user-score').text(`Score: ${userScore}`);
                } else {
                    console.log("User data not found, initializing score to 0.");
                    $('#user-score').text('Score: 0'); // Default if user data doesn't exist yet
                }
            } catch (error) {
                console.error("Error fetching user score:", error);
                $('#user-score').text('Score: 0'); // Fallback in case of error
            }

            // Set the user's profile picture
            $('#user-profile-pic').attr('src', user.photoURL || 'default-avatar.png').show();

            // Hide sign-in/up buttons and show sign-out button
            $('#signInButton, #signUpButton').hide();
            $('#signOutButton').show();
        })
        .catch(function(error) {
            console.error('Sign-in error:', error);
        });
});


    $('#signOutButton').on('click', function() {
        signOut(auth).then(() => {
            $('#username-display').text('Guest');
            $('#user-score').text('Score: 0');
            $('#user-profile-pic').attr('src', 'default-avatar.png');
            $('#signInButton, #signUpButton').show();
            $('#signOutButton').hide();
        }).catch((error) => {
            console.error('Sign-out error:', error);
        });
    });
}

function updateUserInfo() {
    const user = firebase.auth().currentUser;

    if (user) {
        $('#username-display').text(user.displayName);
        $('#user-score').text(`Score: ${userScore}`); // Replace with actual score logic
        $('#user-profile-pic').attr('src', user.photoURL || 'default-avatar.png').show();
        $('#signInButton, #signUpButton').hide();
        $('#signOutButton').show();
    } else {
        $('#username-display').text('Guest');
        $('#user-score').text('Score: 0');
        $('#signInButton, #signUpButton').show();
        $('#signOutButton').hide();
    }
}
