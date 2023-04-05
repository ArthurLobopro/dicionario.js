import { Link } from "react-router-dom"
import { LeftArrow } from "./icons"

interface buttonProps {
    returnTo?: string
}

export function ReturnButton({ returnTo = "/" }: buttonProps) {
    return (
        <Link to={returnTo} title="Voltar">
            <LeftArrow />
        </Link>
    )
}