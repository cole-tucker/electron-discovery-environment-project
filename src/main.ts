import {app, BrowserWindow} from 'electron';
import * as path from "path";

let mainWindow: Electron.BrowserWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    });

    mainWindow.loadFile(path.join(__dirname, "../index.html"));

    mainWindow.on('closed', () => {
        mainWindow = null;
    })
})