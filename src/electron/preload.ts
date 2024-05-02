import { Employee } from "../model/Employee";

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getEmployees: () => <Employee[]>ipcRenderer.invoke('get-employees')
})