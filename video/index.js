let mediaRecorder;
let chunks = []
const videoEle = document.querySelector("#live")
const output = document.querySelector("#output")

function stopCamera(stream) {
    if (stream) {
        stream.getTracks().forEach((track) => {
            /* console.log("stop for each track : ", track.stop) */
            track.stop();
        })
        /* console.log("After stop : ", runningStream.getTracks()) */
    }

}

function initialize(stream) {
    chunks = []
    window.stream = stream;
    mediaRecorder = new MediaRecorder(window.stream, {
        mimeType: "video/webm"
    });

    mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
    }
    console.log("State: ", mediaRecorder.state)
    mediaRecorder.onerror = (event) => {
        console.log("Media recorder ERROR : ", event.error);
    }

    mediaRecorder.onstop = () => {
        stopCamera(window.stream);
        console.log("Final chunks : ", chunks)
        const blob = new Blob(chunks, {
            mimeType: "video/webm"
        })
        const url = URL.createObjectURL(blob)
        videoEle.src = url;
        videoEle.srcObject = null;
        videoEle.controls = true;
        videoEle.loop = true;
        videoEle.load()
        videoEle.play().then(() => {

        }).catch(e => {
            console.log("Error on play() : ", e)
        });
    };

    videoEle.src = null;
    videoEle.controls = false;
    videoEle.loop = false;
    videoEle.srcObject = window.stream;
}

function create(e) {
    console.log("Create clicked!")
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: true
        })
        .then((stream) => {
            initialize(stream)
            console.log("Starting the recording ...")
            console.log("MimeType : ", mediaRecorder.mimeType)

            mediaRecorder.start(1000);

        })
        .catch((err) => {
            alert("Permission denied")
            console.log("Error : ", err)
        });


}

function stop(e) {
    console.log("Stopping ....")
    mediaRecorder.stop()
    console.log("State: ", mediaRecorder.state)

}


document.querySelector("#createbtn").addEventListener('click', create)
document.querySelector("#stopbtn").addEventListener('click', stop)