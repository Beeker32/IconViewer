const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
    const exePath = document.getElementById("exe-path");

    document.getElementById("select-exe").addEventListener("click", async () => {
        const file = await ipcRenderer.invoke("select-exe");
        if (file) exePath.innerText = file;
    });

    document.getElementById("extract-icon").addEventListener("click", async () => {
        if (exePath.innerText === "No file selected") {
            alert("Please select an EXE file.");
            return;
        }
        const result = await ipcRenderer.invoke("extract-icon", exePath.innerText);
        alert(result);
    });

    document.getElementById("close-btn").addEventListener("click", () => {
        ipcRenderer.send("close-app");
    });

    document.getElementById("minimize-btn").addEventListener("click", () => {
        ipcRenderer.send("minimize-app");
    });
});
