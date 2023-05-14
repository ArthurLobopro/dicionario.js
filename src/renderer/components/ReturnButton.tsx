import { useNavigate } from "react-router-dom"
import { ReturnIcon } from "./icons"
import { CircleButton } from "./CircleButton"

interface ReturnButtonProps {
    returnTo?: string
}

export function ReturnButton({ returnTo = "/" }: ReturnButtonProps) {
    const navigate = useNavigate()
    return (
        <CircleButton title="Voltar" onClick={() => navigate(returnTo)} >
            <ReturnIcon />
        </CircleButton>
    )
}