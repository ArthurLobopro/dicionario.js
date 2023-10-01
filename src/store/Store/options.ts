import ZodElectronStore from "zod-electron-store"
import { StoreOptions, optionsSchema } from "../ZodSchemas/options"

export const optionsStore = new ZodElectronStore<StoreOptions>({
    name: "options",
    watch: true,
    schema: optionsSchema,
})
