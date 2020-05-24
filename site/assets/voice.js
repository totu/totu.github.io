const main = document.querySelector("#main");
(() => {main.innerHTML = "connecting...";})();

// Create PeerJS connection
const peer = new Peer();
let conn = null;
let stream;
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

const drawUI = (id) => {
    // Set up interface
    main.innerHTML = "";
    const idShower = document.createElement("div");
    idShower.id = "my-id";
    main.appendChild(idShower);
    const idBox = document.createElement("input");
    idBox.id = "dest-id";
    idBox.type = "text";
    idBox.placeholder = "Who you wanna call?";
    main.appendChild(idBox);
    const callBtn = document.createElement("input");
    callBtn.type = "button";
    callBtn.value = "call";
    main.appendChild(callBtn);
    callBtn.addEventListener("click", (e) => {
        const destId = document.querySelector("#dest-id").value;
        if (destId != "" || destId != undefined || destId != null) {
            console.log("calling " + destId + "...");
            peer.call(destId, stream);
        }
    });
    idShower.innerHTML = "Your ID: " + peer.id;
    console.log("Your ID: " + peer.id);

}

document.addEventListener("DOMContentLoaded", () => {
    // Connect to peerJs server
    peer.on('open', (id) => {
        drawUI(id);
    });

    // Set up mic
    navigator.getUserMedia (
        {video: false, audio: true},
        function success(audioStream) {
            console.log('mic is open');
            stream = audioStream;
            if (cb) cb(null, stream);
        },
        function error(err) {
            console.log("couldn't connect to mic");
            if (cb) cb(err);
        }
    );

    // Handle peer connection
    peer.on('call', (call) => {
        // Answer the call, providing our mediaStream
        console.log("incoming call")
        call.answer(stream);
        call.on("stream", (stream) => {
            console.log(stream);
            const audio = document.createElement("audio")
            audio.autoplay = true;
            audio.srcObject = stream;
            main.appendChild(audio);
        });
    });

});
