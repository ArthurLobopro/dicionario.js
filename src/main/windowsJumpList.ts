import { app } from "electron"
import path from "node:path"

export function createJumpList() {
    app.setJumpList([
        {
            type: "tasks",
            items: [
                {
                    type: "task",
                    title: "Adicionar Palavra",
                    description: "Adicionar uma nova palavra ao dicionário",
                    args: ". --add-word",
                    program: process.execPath,
                    iconIndex: 0,
                },
                {
                    type: "task",
                    title: "Visualizar Palavras",
                    description: "Visualizar palavras cadastradas",
                    args: ". --view-words",
                    program: process.execPath,
                    iconIndex: 1,
                },
            ],
        },
    ])
}