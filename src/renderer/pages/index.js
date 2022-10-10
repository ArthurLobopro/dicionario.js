import { CreateElement } from "../../Util.js"

const wrapper = CreateElement("div", {
    id: "wrapper",
    content: CreateElement("div", {
        id: "content",
        className: "page",
        content: CreateElement("header", {
            id: "header",
            content: `<h1>Dicionário Pessoal</h1>`
        })
    })
})

// document.body.appendChild(wrapper)