import { app, BrowserWindow, Menu, MenuItem } from "electron"
import path from "node:path"
import UpdateListener from "update-electron-app"
import Store from "zod-electron-store"
import { createJumpList } from "./windowsJumpList"

import { optionsStore } from "../store/Store/options"

import "electron-frame/main"
import "./events"

Store.initRenderer()

UpdateListener({
    notifyUser: false,
})

const isLinux = process.platform === "linux"

const appPath = app.getAppPath()

function setSpellCheck(win: BrowserWindow) {
    win.webContents.on("context-menu", (e, params) => {
        if (params.misspelledWord) {
            const menu = new Menu()

            for (const suggestion of params.dictionarySuggestions) {
                menu.append(
                    new MenuItem({
                        label: suggestion,
                        click: () =>
                            win.webContents.replaceMisspelling(suggestion),
                    }),
                )
            }

            menu.append(
                new MenuItem({
                    label: `Adicionar "${params.misspelledWord}" ao dicionário ortográfico`,
                    click: () =>
                        win.webContents.session.addWordToSpellCheckerDictionary(
                            params.misspelledWord,
                        ),
                }),
            )

            menu.popup()
        }
    })
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        frame: isLinux && optionsStore.store.linux.useSystemTitleBar,
        autoHideMenuBar: true,
        show: false,
        icon: path.join(appPath, "assets", "icon.png"),
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js"),
        },
    })

    if (app.isPackaged) {
        win.setMenu(null)
    }

    win.loadFile("public/index.html")

    win.once("ready-to-show", () => {
        win.show()
        win.center()
        win.focus()
    })

    setSpellCheck(win)

    createJumpList()

    if (process.argv.includes("--add-word")) {
        win.webContents.send("open-in", "/create")
    }

    if (process.argv.includes("--view-words")) {
        win.webContents.send("open-in", "/view")
    }

    if (process.argv.includes("--relaunch")) {
        win.webContents.send("open-in", "/config")
    }
}

const isUnicWindow = app.requestSingleInstanceLock()

if (!isUnicWindow) {
    app.quit()
} else {
    app.whenReady().then(createWindow)
}

app.on("second-instance", () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (win.isMinimized()) win.restore()
    win.center()
    win.focus()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// Faz com que o programa não inicie várias vezes durante a instalação
if (require("electron-squirrel-startup")) {
    app.quit()
}
