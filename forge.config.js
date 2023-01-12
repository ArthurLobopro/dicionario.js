const { version } = require("./package.json")
const { execSync } = require("child_process")

module.exports = {
    packagerConfig: {
        icon: "./build/icon",
        ignore: [
            "\\.git",
            "\\.scss",
            "/build"
        ]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "dicionario",
                "setupIcon": "./build/icon.ico",
                "setupExe": `dicionario-${version}-setup.exe`,
                "iconUrl": "https://raw.githubusercontent.com/ArthurLobopro/dicionario.js/main/build/icon.ico"
            }
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: [
                "darwin"
            ]
        },
        {
            name: "@electron-forge/maker-deb",
            config: {}
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {}
        }
    ],
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
                repository: {
                    owner: "ArthurLobopro",
                    name: "dicionario.js"
                },
                prerelease: false,
                draft: true
            }
        }
    ],
    hooks: {
        async generateAssets() {
            return new Promise((resolve, reject) => {
                try {
                    console.log("Compiling TypeScript...")
                    execSync("yarn tsc")
                    console.log("Compiling SASS...")
                    execSync("yarn sass-compiler --compile")
                    resolve()
                } catch (error) {
                    reject(error)
                }
            })
        }
    }
}