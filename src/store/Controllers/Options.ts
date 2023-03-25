import { StoreOptions } from "../Schemas"
import { options } from "../Store"

export class OptionsController {

    static get darkMode() {
        return options.get('darkMode')
    }

    static set darkMode(value: boolean) {
        options.set('darkMode', value)
    }

    static get frameTheme() {
        return options.get("frameTheme")
    }

    static set frameTheme(value: StoreOptions["frameTheme"]) {
        options.set('frameTheme', value)
    }

    static get frameStyle() {
        return options.get("frameStyle")
    }

    static set frameStyle(value: StoreOptions["frameStyle"]) {
        options.set('frameStyle', value)
    }

    static getOptions() {
        return options.store
    }

    static toggleDarkMode() {
        this.darkMode = !this.darkMode
    }

    static setFrameTheme(frameTheme: StoreOptions["frameTheme"]) {
        this.frameTheme = frameTheme
    }

    static setFrameStyle(frameStyle: StoreOptions["frameStyle"]) {
        this.frameStyle = frameStyle
    }
}