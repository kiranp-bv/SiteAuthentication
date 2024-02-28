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


function create(e) {
    inputFileEle.click()
}


function handleFileInput(e) {
    console.log("Handling file input");
    const uploadedFile = e?.target?.files[0];
    if (uploadedFile) {
        console.log("Type of uploaded file : ", typeof e?.target?.files[0] );
        // const url = URL.createObjectURL(uploadedFile)
        // videoEle.srcObject = null;
        // videoEle.controls = true;
        // videoEle.loop = true;
        // videoSrcEle.src = url;
        // videoEle.load()
        // videocontainer.style.display = "block"
        // videoEle.play().then(() => {

        // }).catch(e => {
        //     alert("Error on file input play")
        //     console.log("Error on file input play : ", e)
        // });
        // prepareToUpload(uploadedFile) 
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


async function checkFileInput(e) {
    // videocontainer.style.display = "block"

}


function handleVideoError(e){
    console.log("Video error : ", e
    );
}


createBtn1.addEventListener('click', create)
inputFileEle.addEventListener('change', handleFileInput)
inputFileEle.addEventListener('click', checkFileInput)
videoEle.addEventListener('error', handleVideoError)