import fs from "fs"
import path from 'path'
import { ipcRenderer } from "electron"

export const appPath = ipcRenderer.sendSync("app-path") as string
export const assetsPath = path.join(appPath, "assets")

export function StringToElement(str: string) {
    const wrapper = document.createElement('template')
    wrapper.innerHTML = str
    return wrapper.content.childNodes
}

type falsi = null | false | undefined

type propsType = {
    // content?: string | HTMLElement | null | false | undefined | HTMLElement[] | falsi[] | string[]
    content?: any
    [key: string]: any
}

export function CreateElement(type: string, { content = '', ...props }: propsType = {}) {
    const element = document.createElement(type)

    if (typeof content === 'string') {
        element.innerHTML = content
    } else if (content instanceof HTMLElement) {
        element.appendChild(content)
    } else if (content instanceof Array) {
        content.forEach((item) => {
            //@ts-ignore
            if ([null, false, undefined].includes(item)) return

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
        //@ts-ignore
        element[key] = value
    }

    return element
}

export function loadSVG(...PathSegments: string[]) {
    return fs.readFileSync(path.resolve(...PathSegments), { encoding: "utf-8" })
}

export function formatDate(datestring: string) {
    const pad2 = (n: any) => String(n).padStart(2, '0')

    const date = new Date(datestring)

    const year = date.getFullYear()
    const month = pad2(date.getMonth() + 1)
    const day = pad2(date.getDate())

    const hours = pad2(date.getHours())
    const minutes = pad2(date.getMinutes())

    return `${day}/${month}/${year} ${hours}:${minutes}`
}