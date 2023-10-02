/* eslint-disable @typescript-eslint/ban-ts-comment */

import ZodElectronStore from "zod-electron-store"
import {
    StoreDictionaries,
    dictionariesSchema,
} from "../ZodSchemas/dictionaries"

export const dictionariesStore = new ZodElectronStore<StoreDictionaries>({
    schema: dictionariesSchema,
    name: "dictionaries",
})
