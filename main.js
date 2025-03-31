const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs-extra");
const remoteMain = require("@electron/remote/main");

remoteMain.initialize();

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 250,
        frame: false,
        transparent: true,
        resizable: false,
        hasShadow: false,
        roundedCorners: true,
        backgroundColor: "#00000000",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    remoteMain.enable(mainWindow.webContents);
    mainWindow.loadFile("index.html");
});

ipcMain.handle("select-exe", async () => {
    const result = await dialog.showOpenDialog({
        filters: [{ name: "Executables", extensions: ["exe"] }],
        properties: ["openFile"],
    });
    return result.filePaths[0] || null;
});

ipcMain.handle("extract-icon", async (_, exePath, format) => {
    if (!exePath) return "Error: No EXE selected.";

    const result = await dialog.showSaveDialog({
        filters: [{ name: format.toUpperCase(), extensions: [format] }],
    });

    if (!result.filePath) return "Error: No output location selected.";

    try {
        const icon = await app.getFileIcon(exePath);
        await fs.writeFile(result.filePath, icon.toPNG());
        return "Success!";
    } catch (error) {
        return `Error: ${error.message}`;
    }
});

ipcMain.on("close-app", () => app.quit());
ipcMain.on("minimize-app", () => mainWindow.minimize());
