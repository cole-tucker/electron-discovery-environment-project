import {app, BrowserWindow} from 'electron';
let win = null

app.on('ready', () => {
    win = new BrowserWindow()
    win.setBounds({x: 0, y: 0, width: 800, height: 600})
})