import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { CircleButton } from "./CircleButton"
import { ReturnIcon } from "./icons"

interface ReturnButtonProps {
    returnTo?: string
    onClick?: () => boolean | Promise<boolean>
}

export const ReturnButton = memo(
    function ReturnButton({ returnTo = "/", onClick }: ReturnButtonProps) {
        const navigate = useNavigate()

        async function handleClick() {
            if (typeof onClick === "function") {
                const result = await onClick()
                if (result === false) return
            }

            navigate(returnTo)
        }

        return (
            <CircleButton title="Voltar" onClick={handleClick} >
                <ReturnIcon />
            </CircleButton>
        )
    }
)