import { Link } from "react-router-dom"
import { LeftArrowIcon } from "./icons/LeftArrow"

interface buttonProps {
    returnTo?: string
}

export function ReturnButton({ returnTo = "/" }: buttonProps) {
    return (
        <Link to={returnTo}>
            <div className="left" title="Voltar">
                <LeftArrowIcon />
            </div>
        </Link>
    )
}