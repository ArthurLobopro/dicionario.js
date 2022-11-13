import { CreateElement } from "../../Util.js"

export function switcher({ onToggle, checked = falses }) {
    return CreateElement("div", {
        className: "switch",
        content: (`
        <input type="checkbox" ${checked ? "checked" : ''}>
        <span class="slider round"></span>`),
        onclick: event => {
            const input = event.currentTarget.querySelector("input")
            onToggle(!input.checked)
            input.checked = !input.checked
        }
    })
}