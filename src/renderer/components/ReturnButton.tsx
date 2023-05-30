import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { CircleButton } from "./CircleButton"
import { ReturnIcon } from "./icons"

interface ReturnButtonProps {
    returnTo?: string
}

export const ReturnButton = memo(
    function ReturnButton({ returnTo = "/" }: ReturnButtonProps) {
        const navigate = useNavigate()

        return (
            <CircleButton title="Voltar" onClick={() => navigate(returnTo)} >
                <ReturnIcon />
            </CircleButton>
        )
    }
)