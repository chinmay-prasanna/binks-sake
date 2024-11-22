const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectDirectory: async () => await ipcRenderer.invoke('select-directory'),
});
