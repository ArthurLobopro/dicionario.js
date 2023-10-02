import { ipcRenderer } from "electron"
import z from "zod"
import { dictionariesSchema } from "./dictionaries"

const version = ipcRenderer.sendSync("get-version") as string

export const backupDataSchema = dictionariesSchema.extend({
    version: z.string().default(version),
})

export type backupData = z.infer<typeof backupDataSchema>
