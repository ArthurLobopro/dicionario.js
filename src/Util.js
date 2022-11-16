const fs = require("fs")
const path = require('path')

export const appPath = ipcRenderer.sendSync("app-path")
export const assetsPath = path.join(appPath, "assets")

/**
 * 
 * @param {*} type 
 * @param {string | HTMLElement} content 
 */

export function StringToElement(str) {
    console.log(str)
    const wrapper = document.createElement('template')
    wrapper.innerHTML = str
    return wrapper.content.childNodes
}

export function CreateElement(type, { content = '', ...props } = {}) {
    const element = document.createElement(type)

    if (typeof content === 'string') {
        element.innerHTML = content
    } else if (content instanceof HTMLElement) {
        element.appendChild(content)
    } else if (content instanceof Array) {
        content.forEach((item) => {
            if (item in [null, false, undefined]) return

            if (typeof item === 'string') {
                if (item.includes('<') && item.includes('>')) {
                    StringToElement(item).forEach((child) => {
                        element.appendChild(child)
                    })
                } else {
                    element.appendChild(document.createTextNode(item))
                }
            } else if (item instanceof HTMLElement) {
                element.appendChild(item)
            }
        })
    }

    for (const [key, value] of Object.entries(props)) {
        element[key] = value
    }

    return element
}

export function loadSVG(...PathSegments) {
    return fs.readFileSync(path.resolve(...PathSegments), { encoding: "utf-8" })
}

export function formatDate(datestring) {
    const pad2 = (n) => String(n).padStart(2, '0')

    const date = new Date(datestring)

    const year = date.getFullYear()
    const month = pad2(date.getMonth() + 1)
    const day = pad2(date.getDate())

    const hours = pad2(date.getHours())
    const minutes = pad2(date.getMinutes())

    return `${day}/${month}/${year} ${hours}:${minutes}`
}