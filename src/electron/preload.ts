import { Employee } from "../model/Employee";

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getEmployees: () => <Promise<Employee[]>>ipcRenderer.invoke('get-employees'),
    openConnection: () => <Promise<Error>>ipcRenderer.invoke("openConnection"),
    createNewConnection: () => <Promise<Error>>ipcRenderer.invoke("createNewConnection"),
})