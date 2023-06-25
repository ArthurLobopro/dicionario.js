const { version } = require("./package.json")
const { execSync } = require("child_process")
const { generateIcons } = require("./scripts/generate-icons.js")
const path = require("path")

module.exports = {
    packagerConfig: {
        icon: "./build/icon",
        ignore: [
            "\\.git",
            "\\.scss",
            "\\.ts",
            "\\.tsx",
            "/build",
            "/\\.vscode"
        ]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "dicionario",
                setupIcon: "./build/icon.ico",
                setupExe: `dicionario-${version}-setup.exe`,
                iconUrl: "https://raw.githubusercontent.com/ArthurLobopro/dicionario.js/main/build/icon.ico"
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
            config: {
                name: "dicionario.js",
                productName: "Dicionario.js",
                categories: [
                    "Utility",
                    "Education"
                ],
                description: "Dicionário onde você cadastra suas próprias palavras e definições.",
                genericName: "Dicionario.js",
                icon: path.resolve(__dirname, "./assets/icon.png"),
                options: {
                    maintainer: 'Arthur Lobo',
                    homepage: 'https://github.com/ArthurLobopro/dicionario.js#readme'
                }
            },
            platforms: [
                "linux"
            ]
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {},
            platforms: []
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
            return new Promise(async (resolve, reject) => {
                try {
                    console.log("Generating icons...")
                    await generateIcons()
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