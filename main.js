const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs-extra");
const remoteMain = require("@electron/remote/main");

remoteMain.initialize();

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 300,
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

// Select EXE File
ipcMain.handle("select-exe", async () => {
    const result = await dialog.showOpenDialog({
        filters: [{ name: "Executables", extensions: ["exe"] }],
        properties: ["openFile"],
    });
    return result.filePaths[0] || null;
});

// Extract Icon & Always Save as PNG
ipcMain.handle("extract-icon", async (_, exePath) => {
    if (!exePath) return "Error: No EXE selected.";

    const result = await dialog.showSaveDialog({
        filters: [{ name: "PNG", extensions: ["png"] }],
    });

    if (!result.filePath) return "Error: No output location selected.";

    try {
        const icon = await app.getFileIcon(exePath);
        await fs.writeFile(result.filePath, icon.toPNG());
        return "Successfully saved icon!";
    } catch (error) {
        return `Error: ${error.message}`;
    }
});

// Window Controls
ipcMain.on("close-app", () => app.quit());
ipcMain.on("minimize-app", () => mainWindow.minimize());
