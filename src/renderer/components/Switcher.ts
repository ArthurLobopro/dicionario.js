import { CreateElement } from "../../Util"

export function switcher({ onToggle, checked = false }: { onToggle: (checked: boolean) => void, checked?: boolean }) {
    return CreateElement("div", {
        className: "switch",
        content: (`
        <input type="checkbox" ${checked ? "checked" : ''}>
        <span class="slider round"></span>`),
        onclick: (event: Event) => {
            const input = (event.currentTarget as HTMLElement).querySelector("input") as HTMLInputElement
            onToggle(!input.checked)
            input.checked = !input.checked
        }
    })
}