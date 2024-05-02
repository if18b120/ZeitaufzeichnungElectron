import { Employee } from "../angular/app/model/Employee";

const { contextBridge, ipcMain } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getEmployees: () => <Employee[]>ipcMain.invoke('get-employees')
})