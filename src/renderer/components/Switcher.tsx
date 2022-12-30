import { useEffect, useRef, useState } from "react"

export function Switcher({ onToggle, checked = false }: { onToggle: (checked: boolean) => void, checked?: boolean }) {
    const [isChecked, setIsChecked] = useState(checked)

    const ref = useRef(null as unknown as HTMLInputElement)

    useEffect(() => {
        ref.current.checked = isChecked
    }, [isChecked])

    function HandleClick() {
        setIsChecked(!isChecked)
        onToggle(!checked)
    }

    return (
        <div className="switch" onClick={HandleClick}>
            <input ref={ref} type="checkbox" defaultChecked={checked} onChange={() => onToggle(!checked)} />
            <span className="slider round"></span>
        </div>
    )
}