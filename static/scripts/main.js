var socker;
var file;
var fileSpan = document.getElementById("file-span");

function start() {
        console.log(file);
    if (file == undefined) {
        file = document.getElementById("file").files[0];
    }

    if (file == undefined) {
        alert("Please, put file!")
        return;
    }

    canUpload = false;

    document.getElementById('send-file').style.color = "grey";

    let formData = new FormData();

    formData.append("file", file);
    
    fetch("/api/upload-file", {method: "POST", "body": formData})
        .then((response) => response.json())
        .then((json) => runListener(json.key))
}

function colorFromNum(num) {
    switch (num) {
        case "0":
            return "#AB2524";
        case "1":
            return "#6F4F28";
        case "2":
            return "#FFA421";
        case "3":
            return "#48A43F";
        case "4":
            return "#9DA3A6";
        case "5":
            return "#3481B8";

        default:
            return "#ffffff";
            break;
    }
}

function runListener(key) {
    socket = new WebSocket('/api/analyze');
    document.getElementById("phint-text").style.visibility = "hidden";
    const nodeList = document.querySelectorAll("span");
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].remove();
    }
    
    socket.onmessage = (ev) => {

        console.log('<<< ' + ev.data, 'blue');

        data = JSON.parse(ev.data)

        if (data.string != undefined) {
            var span = document.createElement("span");
            
            var str = data.string.split("@")[0]
            var color = colorFromNum(data.string.split("@")[1].trim())
            
            span.style = "background-color: " + color + ";";
            span.textContent = str + " ";

            document.getElementById("text").appendChild(span);
        }

        console.log(JSON.parse(ev.data))
    };

    socket.onclose = () => {
        console.log("CLOSE!");
        file = undefined;
        document.getElementById('send-file').disabled = false;
        canUpload = true;
    }

    socket.onopen = () => socket.send(key);
}

document.getElementById('send-file').onclick = ev => {
    if (!canUpload) {
            alert("You can't use it right now!")
            return;
    }
    ev.preventDefault();
    start();
};

document.getElementById("file").addEventListener("change", () => {
    fileSpan.textContent = document.getElementById("file").files[0].name;
})

var canUpload = true;
document.getElementById('upload_file').onclick = ev => {
    document.getElementById("file").click()
};

const dropZone = document.body;
if (dropZone) {
    let hoverClassName = 'hover';
  
    dropZone.addEventListener("dragenter", function(e) {
        e.preventDefault();
        dropZone.classList.add(hoverClassName);
    });
  
    dropZone.addEventListener("dragover", function(e) {
        e.preventDefault();
        dropZone.classList.add(hoverClassName);
    });
  
    dropZone.addEventListener("dragleave", function(e) {
        e.preventDefault();
        dropZone.classList.remove(hoverClassName);
    });
  
    // Это самое важное событие, событие, которое дает доступ к файлам
    dropZone.addEventListener("drop", function(e) {
        e.preventDefault();
        dropZone.classList.remove(hoverClassName);

        const files = Array.from(e.dataTransfer.files);
        console.log(files);
        file = files[0];
        // TODO что-то делает с файлами...
    });
}