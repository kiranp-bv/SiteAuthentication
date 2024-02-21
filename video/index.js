let mediaRecorder;
let chunks = []
const videoEle = document.querySelector("#live")
const videoSrcEle = document.querySelector("#videoSource")
const output = document.querySelector("#output")
const inputFileEle = document.querySelector("#inputfile")
const resultDiv = document.querySelector("#permissionresult")
const options = {
    // mimeType: "video/webm"
}

// alert("Init")

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
    mediaRecorder = new MediaRecorder(window.stream, options);

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
        const blob = new Blob(chunks, options)
        const url = URL.createObjectURL(blob)
        videoSrcEle.src = url;
        videoEle.srcObject = null;
        videoEle.controls = true;
        videoEle.loop = true;
        videoEle.load()
        videoEle.play().then(() => {

        }).catch(e => {
            console.log("Error on play() : ", e)
        });
    };

    videoSrcEle.src = null;
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

function handleFileInput(e) {
    if (inputFileEle.disabled) {
        alert(`inputFileEle.disabled : ${inputFileEle.disabled}`)
    }
    console.log("inputFileEle disabled???: ", inputFileEle.disabled);
}

async function checkFileInput(e) {
    const storage = await check("storage-access")
    const camera = await check("camera")
    console.log("permission storage: ", storage);
    console.log("permission camera: ", camera);
    // alert(`storage : ${storage} and camera : ${camera}`)
    resultDiv.innerHTML = `storage : ${storage} and camera : ${camera}`

}


async function check(type) {
    const result = await navigator.permissions.query({ name: type })
    // resultDiv.innerHTML = `Result of ${type} : ${result.state}`
    // alert(`Result of ${type} : ${result.state}`)
    return result.state
}


document.querySelector("#createbtn").addEventListener('click', create)
document.querySelector("#stopbtn").addEventListener('click', stop)
inputFileEle.addEventListener('change', handleFileInput)
inputFileEle.addEventListener('click', checkFileInput)