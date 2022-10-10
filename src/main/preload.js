const { electronFrame } = require('electron-frame/renderer')

window.addEventListener("DOMContentLoaded", () => {
    const frame = new electronFrame()
    frame.insert()
})