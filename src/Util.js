/**
 * 
 * @param {*} type 
 * @param {string | HTMLElement} content 
 */

function StringToElement(str) {
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