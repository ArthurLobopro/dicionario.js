import { useNavigate } from "react-router-dom"
import { LeftArrow } from "./icons"

interface buttonProps {
    returnTo?: string
}

export function ReturnButton({ returnTo = "/" }: buttonProps) {
    const navigate = useNavigate()
    return (
        <LeftArrow title="Voltar" onClick={() => navigate(returnTo)} />
    )
}