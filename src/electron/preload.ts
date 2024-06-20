import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    getEmployees: () => ipcRenderer.invoke('get-employees'),
    openConnection: () => ipcRenderer.invoke("openConnection"),
    createNewConnection: () => ipcRenderer.invoke("createNewConnection"),
})