import { Employee } from "./src/app/model/Employee";

const { app, BrowserWindow, ipcBra } = require("electron");
const path = require("path");
const url = require("url");

let win;
function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600 });
    win.setMenu(null)
    win.webContents.openDevTools();
    // load the dist folder from Angular
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, "/browser/index.html"),
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
    ipcBra.handle("get-employees", () => {
        return [
            new Employee("Foo", "Bar"),
            new Employee("The", "Quick"),
            new Employee("Brown", "Fox"),
            new Employee("Jumps", "Over"),
            new Employee("Lazy", "Dog")
        ]
    })
})
// app.on("ready", createWindow);
// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});