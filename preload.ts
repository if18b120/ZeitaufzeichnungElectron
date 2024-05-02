import { Employee } from "./src/app/model/Employee";

const { contextBridge, ipcMain } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getEmployees: () => <Employee[]>ipcMain.invoke('get-employees')
})