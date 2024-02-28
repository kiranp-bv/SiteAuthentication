let mediaRecorder;
let chunks = []
const videoEle = document.querySelector("#live")
const videoSrcEle = document.querySelector("#videoSource")
const output = document.querySelector("#output")
const inputFileEle = document.querySelector("#inputfile")
const resultDiv = document.querySelector("#permissionresult")
const errorResultDiv = document.querySelector("#permissionresult")
const createBtn1 = document.querySelector("#createbtn1")
const createBtn2 = document.querySelector("#createbtn2")
const stopBtn = document.querySelector("#stopbtn")
const videocontainer = document.querySelector("#videocontainer")

videocontainer
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
    inputFileEle.click()
}

function create2(e) {
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
            logPermissions(['camera', 'microphone'])
            console.log("Error : ", err)
        });


}

function stop(e) {
    console.log("Stopping ....")
    mediaRecorder.stop()
    console.log("State: ", mediaRecorder.state)
}

function handleFileInput(e) {
    console.log("Handling file input");
    const uploadedFile = e?.target?.files[0];
    if (uploadedFile) {
        console.log("Type of uploaded file : ", typeof e?.target?.files[0] );
        const url = URL.createObjectURL(uploadedFile)
        videoEle.srcObject = null;
        videoEle.controls = true;
        videoEle.loop = true;
        videoSrcEle.src = url;
        videoEle.load()
        videocontainer.style.display = "block"
        // videoEle.play().then(() => {

        // }).catch(e => {
        //     alert("Error on file input play")
        //     console.log("Error on file input play : ", e)
        // });
        prepareToUpload(uploadedFile) 
    } else {
        alert("Uploaded file not found!")
    }
}

function prepareToUpload(file) {
    const filePromise = new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve({ localUrl: reader.result, blob: file })
        }
        reader.readAsDataURL(file)
      })
    
      filePromise.then(results => {
        console.log("File reader results : ", results);
      })
}

async function logPermissions(list = []) {
    const state1 = await check(list[0])
    const state2 = await check(list[1])
    console.log({ [list[0]]: state1, [list[1]]: state2 });
    // alert(`storage : ${storage} and camera : ${camera}`)
    resultDiv.innerHTML = `${list[0]} : ${state1} and ${list[1]} : ${state2}`
}

async function checkFileInput(e) {
    videocontainer.style.display = "block"
    logPermissions(['camera', 'storage-access'])

}


async function check(type = '') {
    try {
        const result = await navigator.permissions.query({ name: type })
        return result.state
    } catch (e) {
        errorResultDiv.innerHTML = `Permission query Error: ${e}`
    }
    // resultDiv.innerHTML = `Result of ${type} : ${result.state}`
    // alert(`Result of ${type} : ${result.state}`)
}

function handleVideoError(e){
    console.log("Video error : ", e
    );
}


createBtn1.addEventListener('click', create)
// createBtn2.addEventListener('click', create2)
// stopBtn.addEventListener('click', stop)
inputFileEle.addEventListener('change', handleFileInput)
inputFileEle.addEventListener('click', checkFileInput)
videoEle.addEventListener('error', handleVideoError)