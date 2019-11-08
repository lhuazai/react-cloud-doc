const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 640,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  const urlLocation = isDev ? 'http://localhost:3000' : 'url'
  mainWindow.loadURL(urlLocation)
})