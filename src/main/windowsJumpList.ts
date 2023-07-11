import { app } from "electron"

export function createJumpList() {
    if (process.platform !== "win32") return

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
