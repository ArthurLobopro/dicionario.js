import { useNavigate } from "react-router-dom"
import { ReturnIcon } from "./icons"

interface ReturnButtonProps {
    returnTo?: string
}

export function ReturnButton({ returnTo = "/" }: ReturnButtonProps) {
    const navigate = useNavigate()
    return (
        <div>
            <ReturnIcon title="Voltar" onClick={() => navigate(returnTo)} />
        </div>
    )
}