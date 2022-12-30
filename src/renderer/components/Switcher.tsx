import { useEffect, useRef, useState } from "react"

export function Switcher({ onToggle, checked = false }: { onToggle: (checked: boolean) => void, checked?: boolean }) {
    const [isChecked, setIsChecked] = useState(checked)

    const ref = useRef(null as unknown as HTMLInputElement)

    useEffect(() => {
        ref.current.checked = isChecked
    }, [isChecked])

    return (
        <div className="switch" onClick={() => {
            setIsChecked(!isChecked)
            onToggle(!checked)
        }}>
            <input ref={ref} type="checkbox" defaultChecked={checked} onChange={() => onToggle(!checked)} />
            <span className="slider round"></span>
        </div>
    )
}