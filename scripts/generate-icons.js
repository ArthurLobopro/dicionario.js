const fs = require("fs")
const path = require("path")
const { transform } = require("@svgr/core")

async function generateIcons() {
    const assets_path = path.resolve(__dirname, "../assets")
    const icons_out = path.resolve(__dirname, "../src/renderer/components/all-icons")
    const icon_exporter_path = path.resolve(__dirname, "../src/renderer/components/icons.tsx")

    if (!fs.existsSync(icons_out)) {
        fs.mkdirSync(icons_out)
    }

    const icons = fs.readdirSync(assets_path)
        .filter((file) => file.endsWith(".svg"))
        .map((file) => path.join(assets_path, file))

    const export_list = []

    for (const icon of icons) {
        const icon_name = path.basename(icon, ".svg")
        const component_name =
            icon_name
                .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
                .replace(/^[a-z]/, (g) => g.toUpperCase())

        const svg_content = fs.readFileSync(icon, "utf-8")

        const component_content = await transform(
            svg_content,
            {
                exportType: "named",
                namedExport: component_name,
                typescript: true,
                jsx: true,
                titleProp: true,
            },
            { componentName: component_name }
        )

        fs.writeFileSync(path.resolve(icons_out, `${component_name}.tsx`), component_content)

        export_list.push(`export * from "./all-icons/${component_name}"`)
    }

    fs.writeFileSync(icon_exporter_path, export_list.join("\n"), { encoding: "utf-8" })
}

if (process.argv[1] === __filename) {
    generateIcons().then(() => {
        console.log("Done!")
        process.exit()
    })
}

module.exports = { generateIcons }