import { ipcMain, app, dialog, BrowserWindow, autoUpdater } from 'electron'

const appPath = app.getAppPath()

ipcMain.on('app-path', (event) => {
    event.returnValue = appPath
})

ipcMain.on('open-devtolls', (event) => {
    const win = BrowserWindow.fromId(event.sender.id) as BrowserWindow
    win.webContents.openDevTools({
        mode: 'undocked'
    })
})

ipcMain.on('get-folder', (event) => {
    return dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: "Selecione uma pasta para exportar:"

    }).then(result => {
        if (result.canceled) {
            event.returnValue = "canceled"
        } else {
            event.returnValue = result.filePaths[0]
        }
    }).catch(err => {
        console.log(err)
    })
})

ipcMain.on("get-file", (event) => {
    return dialog.showOpenDialog({
        properties: ['openFile'],
        title: "Selecione um arquivo para importar:",
        filters: [
            { name: 'JSON', extensions: ['json'] }
        ]
    }).then(result => {
        if (result.canceled) {
            event.returnValue = "canceled"
        } else {
            event.returnValue = result.filePaths[0]
        }
    }).catch(err => {
        console.log(err)
    })
})

ipcMain.on('get-version', (event) => {
    event.returnValue = app.getVersion()
})

autoUpdater.on("update-downloaded", (...props) => {
    const [event, releaseNotes, releaseName, releaseDate, updateUrl] = props
    ipcMain.emit("update-downloaded", event, releaseNotes, releaseName, releaseDate, updateUrl)
    const mainWindow = BrowserWindow.getAllWindows()[0]
    mainWindow.webContents.send("update-downloaded")
})

ipcMain.on("install-update", () => {
    autoUpdater.quitAndInstall()
})