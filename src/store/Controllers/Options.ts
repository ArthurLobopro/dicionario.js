import { optionsStore } from "../Store/options"
import { StoreOptions } from "../ZodSchemas/options"

export class OptionsController {
    static get linux() {
        return optionsStore.get("linux")
    }

    static get darkMode() {
        return optionsStore.get("darkMode")
    }

    static set darkMode(value: boolean) {
        optionsStore.set("darkMode", value)
    }

    static get animations() {
        return optionsStore.get("animations")
    }

    static set animations(value: boolean) {
        optionsStore.set("animations", value)
    }

    static get frameTheme() {
        return optionsStore.get("frameTheme")
    }

    static set frameTheme(value: StoreOptions["frameTheme"]) {
        optionsStore.set("frameTheme", value)
    }

    static get frameStyle() {
        return optionsStore.get("frameStyle")
    }

    static set frameStyle(value: StoreOptions["frameStyle"]) {
        optionsStore.set("frameStyle", value)
    }

    static getOptions() {
        return optionsStore.store
    }

    static toggleDarkMode() {
        this.darkMode = !this.darkMode
    }

    static toggleAnimations() {
        this.animations = !this.animations
    }

    static toggleSystemTitleBar() {
        optionsStore.set("linux", {
            useSystemTitleBar: !this.linux.useSystemTitleBar,
        })
    }

    static setFrameTheme(frameTheme: StoreOptions["frameTheme"]) {
        this.frameTheme = frameTheme
    }

    static setFrameStyle(frameStyle: StoreOptions["frameStyle"]) {
        this.frameStyle = frameStyle
    }
}
