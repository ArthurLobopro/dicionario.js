const { execSync } = require("child_process")

const package = require("./package.json")

const { version } = package

module.exports = {
    packagerConfig: {
        icon: "./build/icon",
        ignore: [
            "\\.git",
            "\\.scss",
            "/build",
            "/tsconfig.json",
            "/.vs-code",
            "/sass-compiler.config.js",
            "/forge.config.js"
        ]
    },
    rebuildConfig: {},
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
        generateAssets: async (forgeConfig, platform, arch) => {
            return new Promise((resolve, reject) => {
                try {
                    execSync("yarn tsc")
                    execSync("yarn sass-compiler --compile")
                    resolve(true)
                } catch (error) {
                    reject(error)
                }
            })
        }
    }
}