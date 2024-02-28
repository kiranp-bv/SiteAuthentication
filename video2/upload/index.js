

const inputFileEle = document.querySelector("#inputfile")
inputFileEle.addEventListener('change', handleFileInput)
function handleFileInput(e) {
    console.log("Handling file input");
    const uploadedFile = e?.target?.files[0];
}