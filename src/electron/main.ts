import { Employee } from "../model/Employee";
import { BrowserWindow, app, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";

let win;
function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.setMenu(null)
    win.webContents.openDevTools();
    // load the dist folder from Angular
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, "./../browser/index.html"),
            protocol: "file:",
            slashes: true
        })
    );
    // The following is optional and will open the DevTools:
    // win.webContents.openDevTools()
    win.on("closed", () => {
        win = null;
    });
}
app.whenReady().then(() => {
    ipcMain.handle("get-employees", () => {
        return [
            new Employee("Foo", "Bar"),
            new Employee("The", "Quick"),
            new Employee("Brown", "Fox"),
            new Employee("Jumps", "Over"),
            new Employee("Lazy", "Dog")
        ]
    })
    createWindow();
})
// app.on("ready", createWindow);
// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});