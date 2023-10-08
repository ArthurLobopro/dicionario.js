const path = require("path")

const { generateIcons } = require("svg-react-icon")

const assets_path = path.resolve(__dirname, "../assets")
const icons_out = path.resolve(__dirname, "../src/renderer/components/icons")
const icon_exporter_path = path.resolve(__dirname, "../src/renderer/components/icons/index.ts")

async function generate() {
    return await generateIcons({
        exporterPath: icon_exporter_path,
        srcDir: assets_path,
        outDir: icons_out,
        exporterFinalBlankLine: true
    })
}

if (process.argv[1] === __filename) {
    generate().then(() => {
        console.log("Done!")
        process.exit()
    })
}

module.exports.generateIcons = generate