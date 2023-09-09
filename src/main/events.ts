import { BrowserWindow, app, autoUpdater, dialog, ipcMain } from "electron"

const appPath = app.getAppPath()

// Main events

ipcMain.on("app-path", (event) => {
    event.returnValue = appPath
})

ipcMain.on("open-devtolls", (event) => {
    const win = BrowserWindow.fromId(event.sender.id) as BrowserWindow
    win.webContents.openDevTools({
        mode: "undocked",
    })
})

ipcMain.on("get-folder", async (event) => {
    const win = BrowserWindow.fromId(event.sender.id) as BrowserWindow
    try {
        const result = await dialog.showOpenDialog(win, {
            properties: ["openDirectory"],
            title: "Selecione uma pasta para exportar:",
        })
        if (result.canceled) {
            event.returnValue = "canceled"
        } else {
            event.returnValue = result.filePaths[0]
        }
    } catch (err) {
        console.log(err)
    }
})

ipcMain.on("get-file", async (event) => {
    try {
        const result = await dialog.showOpenDialog({
            properties: ["openFile"],
            title: "Selecione um arquivo para importar:",
            filters: [{ name: "JSON", extensions: ["json"] }],
        })
        if (result.canceled) {
            event.returnValue = "canceled"
        } else {
            event.returnValue = result.filePaths[0]
        }
    } catch (err) {
        console.log(err)
    }
})

ipcMain.on("get-version", (event) => {
    event.returnValue = app.getVersion()
})

ipcMain.on("relaunch", () => {
    const ignored_args = ["--relaunch", "--add-word", "--view-words"]

    const args = process.argv
        .slice(1)
        .filter((arg) => !ignored_args.includes(arg))
        .concat(["--relaunch"])

    app.relaunch({ args })
    app.quit()
})

ipcMain.on("isDev", (event) => {
    event.returnValue = app.isPackaged
})

// Update events
autoUpdater.on("update-downloaded", (...props) => {
    const [event, releaseNotes, releaseName, releaseDate, updateUrl] = props
    ipcMain.emit(
        "update-downloaded",
        event,
        releaseNotes,
        releaseName,
        releaseDate,
        updateUrl,
    )
    const mainWindow = BrowserWindow.getAllWindows()[0]
    mainWindow.webContents.send("update-downloaded")
})

ipcMain.on("install-update", () => {
    autoUpdater.quitAndInstall()
})

ipcMain.on("get-system-language", (event) => {
    event.returnValue = app.getLocale()
})

ipcMain.on("get-available-languages", (event) => {
    const win = BrowserWindow.fromId(event.sender.id) as BrowserWindow
    event.returnValue = win.webContents.session.availableSpellCheckerLanguages
})

ipcMain.on("update-spellchecker", (event, languages: string[]) => {
    const win = BrowserWindow.fromId(event.sender.id) as BrowserWindow
    win.webContents.session.setSpellCheckerLanguages(
        languages || [app.getLocale()],
    )
})

type pathName = Parameters<typeof app.getPath>[0]

ipcMain.on("get-path", (event, pathName: pathName) => {
    event.returnValue = app.getPath(pathName)
})
