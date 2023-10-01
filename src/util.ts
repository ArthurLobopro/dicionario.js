import fs from "node:fs"

export function validateFolder(folder: string) {
    if (!folder) {
        throw new Error("Pasta inválida")
    }

    if (!fs.existsSync(folder)) {
        throw new Error("Pasta não encontrada")
    }
}
