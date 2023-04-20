import { useNavigate } from "react-router-dom"
import { LeftArrow } from "./icons"

interface ReturnButtonProps {
    returnTo?: string
}

export function ReturnButton({ returnTo = "/" }: ReturnButtonProps) {
    const navigate = useNavigate()
    return (
        <LeftArrow title="Voltar" onClick={() => navigate(returnTo)} />
    )
}