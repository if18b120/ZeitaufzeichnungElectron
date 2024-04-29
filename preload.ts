import { Employee } from "./src/app/model/Employee";

const { contextBridge, ipcBra } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getEmployees: () => <Employee[]>ipcBra.invoke('get-employees')
})