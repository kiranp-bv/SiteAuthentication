let mediaRecorder;
let chunks = []
const videoEle = document.querySelector("#live")
const videoSrcEle = document.querySelector("#videoSource-mp4")
const output = document.querySelector("#output")
const inputFileEleCreate = document.querySelector("#inputfilecreate")
const inputFileEleUpload = document.querySelector("#inputfileupload")

const resultDiv = document.querySelector("#permissionresult")
const errorResultDiv = document.querySelector("#permissionresult")
const createBtn = document.querySelector("#createBtn")
const uploadBtn = document.querySelector("#uploadBtn")
const stopBtn = document.querySelector("#stopbtn")
const selectedFileNameEle = document.querySelector("#selectedFileName")
const submitBtn = document.querySelector("#submit")
const videoLinkEle = document.querySelector("#videolink")
let uploadedFile = null;
const options = {
    // mimeType: "video/mp4"
}
let currentType = 'mp4'
// alert("Init")

function getVideoSourceEle(type = 'video/mp4') {
    let type1 = 'mp4'
    switch (type) {
        case 'video/mp4':
            type1 = 'mp4';
            break;
        case 'video/avi':
            type1 = 'mov';
            break;

        case 'video/quicktime':
            type1 = 'mov'
            break;

        case 'video/mpeg':
            type1 = 'mpeg'
            break;
        case 'video/3gpp2':
            type1 = '3gpp2'
            break;


    }
    currentType = type
    return document.querySelector(`#videoSource-${type1}`)
}
function create(type = 'create') {
    if (type === 'create') {

        inputFileEleCreate.click()
    } else {
        inputFileEleUpload.click()
    }
}


function handleFileInput(e) {
    const uploadedFile = e?.target?.files[0];
    console.log("uploadedFile : ", uploadedFile);
    if (uploadedFile) {
        alert(`Uploaded video type : ${uploadedFile.type}`)
        videoLinkEle.style.display = "none"
        selectedFileNameEle.innerHTML = `${uploadedFile.name} // ${uploadedFile.type}` || 'Unknown'
        let srcEle = getVideoSourceEle(currentType)
        srcEle.src = null
        // reset src value for prev video type

        videocontainer.style.display = "block"
        console.log("Type of uploaded file : ", uploadedFile.type);
        const url = URL.createObjectURL(uploadedFile)
        srcEle = getVideoSourceEle(uploadedFile.type)
        videoEle.srcObject = null;
        videoEle.controls = true;
        videoEle.loop = true;
        srcEle.src = url;
        videoEle.load()
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

    filePromise.then(result => {
        uploadedFile = result;
        alert()
        console.log("File ready to be submitted to API : ", result.blob);
    })
}


function handleVideoError(e) {
    console.log("Video error : ", e
    );
}

function handleEvent(event) {
    console.log(`${event.type}`);
}

function submit() {
    var data = new FormData();
    data.append("apiversion", "5.5");
    data.append("contenttype", "review");
    data.append("video", uploadedFile.blob);

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            const res = this.responseText && JSON.parse(this.responseText)
            console.log("API Response : ", res);
            if (res) {
                videoLinkEle.style.display = "block"
                videoLinkEle.href = res.Video.VideoUrl
                videoLinkEle.style.color = "green"
                videoLinkEle.style.fontWeight = "bold"
            }
        }
    });
    xhr.open("POST", "https://qamedia.api.bazaarvoice.com/data/uploadvideo.json?PassKey=caVCg5HE3ecxMzeEpHKHF8seU6ixGfW8dVoiAkGJjA3HQ&displayCode=13928_15_0");

    xhr.send(data);
}

function loadedmetadata(e) {
    console.log("loadedmetadata duration: ", videoEle.duration);
}

function handleCancel(e) {
    console.log("Cancelled : ", e);
    alert("Cancelled")

}

createBtn.addEventListener('click', () => create('create'))
uploadBtn.addEventListener('click', () => create('upload'))
inputFileEleCreate.addEventListener('change', handleFileInput)
inputFileEleCreate.addEventListener('cancel', handleCancel)
inputFileEleUpload.addEventListener('change', handleFileInput)
inputFileEleUpload.addEventListener('cancel', handleCancel)
videoEle.addEventListener('error', handleVideoError)
videoEle.addEventListener('waiting', handleEvent)
videoEle.addEventListener('loadeddata', handleEvent)
videoEle.addEventListener('suspend', handleEvent)
videoEle.addEventListener('stalled', handleEvent)
videoEle.addEventListener("progress", handleEvent);
videoEle.addEventListener("canplay", handleEvent);
videoEle.addEventListener("canplaythrough", handleEvent);
videoEle.addEventListener("loadedmetadata", loadedmetadata);
submitBtn.addEventListener('click', submit)

