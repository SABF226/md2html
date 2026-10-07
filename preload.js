const { contextBridge, ipcRenderer } = require("electron");

const subscribe = (channel) => (callback) =>
  ipcRenderer.on(channel, (_event, payload) => callback(payload));

contextBridge.exposeInMainWorld("desktop", {
  onOpenFile: subscribe("open-file"),
  onDownloadDone: subscribe("download-done"),
});
