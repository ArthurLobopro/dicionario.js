const { ipcMain, app, dialog, BrowserWindow } = require('electron')

const appPath = app.getAppPath()

ipcMain.on('app-path', (event) => {
    event.returnValue = appPath
})

ipcMain.on('open-devtolls', (event) => {
    const win = BrowserWindow.getFocusedWindow()
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

ipcMain.on('get-version', (event) => {
    event.returnValue = app.getVersion()
})