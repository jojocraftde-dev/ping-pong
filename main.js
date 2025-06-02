const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: false,   // Allows exiting fullscreen
    frame: true,         // Title bar visible
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.setMenuBarVisibility(false);
  win.maximize();  // Starts in fullscreen
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
