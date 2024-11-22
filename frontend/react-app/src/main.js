const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

const { ipcMain, dialog } = require('electron');

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (result.canceled) {
    return null;
  }

  const selectedPath = result.filePaths[0];
  const directoryName = path.basename(selectedPath);
  return { path: selectedPath, name: directoryName };
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000');
//   mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
