import fs from "node:fs"
import path from "node:path"
import { validateFolder } from "../../util"
import { dictionariesStore } from "../Store"
import { backupDataSchema } from "../ZodSchemas/exportdata"
import { DictionariesController } from "./Dictionaries"

function getDateToSave() {
    const now = new Date()

    const day = String(now.getDate()).padStart(2, "0")
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const year = String(now.getFullYear())

    const hour = String(now.getHours()).padStart(2, "0")
    const minute = String(now.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day}_${hour}-${minute}`
}

export class DataExporter {
    static exportDictionary(name: string, folder: string) {
        validateFolder(folder)

        const dictionary = DictionariesController.getDictionary(name)

        const content = dictionary.export()

        const exportName = name.replace(/ /g, "_").toLowerCase()

        const filePath = path.resolve(
            folder,
            `${exportName}_${getDateToSave()}.json`,
        )

        fs.writeFileSync(filePath, content)
    }

    static exportData(folder: string, compress = false) {
        validateFolder(folder)

        const data = backupDataSchema.parse(dictionariesStore.store)

        const filePath = path.resolve(
            folder,
            `dictionaries-backup_${getDateToSave()}.json`,
        )

        const content = JSON.stringify(data, null, compress ? 0 : 4)

        fs.writeFileSync(filePath, content)
    }
}
