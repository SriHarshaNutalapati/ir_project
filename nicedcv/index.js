import dcv from "./dcvjs/dcv.js"

let auth,
    connection,
    serverUrl;

function onPromptCredentials(auth, challenge) {
    console.log("Came here");
    if (challengeHasField(challenge, "username") && challengeHasField(challenge, "password")) {
        console.log("Came here If");
        auth.sendCredentials({username: "ubuntu", password: "Intern@123"})
    } else {
        console.log("Came here Else");
        // Challenge is requesting something else...
    }
}

function challengeHasField(challenge, field) {
    return challenge.requiredCredentials.some(credential => credential.name === field);
}

function onError(_, error) {
    console.log("Error during the authentication: ", error.message);
}

// We connect to the first session returned
function onSuccess(_, result) {
    let {sessionId, authToken} = {...result[0]};
    connect(sessionId, authToken);
}

function connect (sessionId, authToken) {
    console.log(sessionId, authToken);
    dcv.connect({
        url: serverUrl,
        sessionId: sessionId,
        authToken: authToken,
        divId: "dcv-display",
        callbacks: {
            firstFrame: () => console.log("First frame received")
        }
    }).then(function (conn) {
        console.log("Connection established!");
        connection= conn;
    }).catch(function (error) {
        console.log("Connection failed with error " + error.message);
    });
}

function main () {
    console.log("Setting log level to INFO");
    dcv.setLogLevel(dcv.LogLevel.INFO);
    serverUrl = "https://ec2-3-86-24-118.compute-1.amazonaws.com:8443/";
    console.log("Starting authentication with", serverUrl);
    auth = dcv.authenticate(
        serverUrl,
        {
            promptCredentials: onPromptCredentials,
            error: onError,
            success: onSuccess
        }
    );
}

console.log("Using NICE DCV Web Client SDK version " + dcv.version.versionStr);
document.addEventListener('DOMContentLoaded', main);