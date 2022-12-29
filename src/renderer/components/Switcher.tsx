import { useEffect, useState } from "react"

export function Switcher({ onToggle, checked = false }: { onToggle: (checked: boolean) => void, checked?: boolean }) {
    const [isChecked, setIsChecked] = useState(checked)

    useEffect(() => {
        const input = document.querySelector(".switch>input[type=checkbox]") as HTMLInputElement
        input.checked = isChecked
    }, [isChecked])

    return (
        <div className="switch" onClick={() => {
            setIsChecked(!isChecked)
            onToggle(!checked)
        }}>
            <input type="checkbox" defaultChecked={checked} onChange={() => onToggle(!checked)} />
            <span className="slider round"></span>
        </div>
    )
}