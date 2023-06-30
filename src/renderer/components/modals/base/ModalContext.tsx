import { createContext } from "react"

interface ModalContextProps {
    onClose: (confirm: boolean) => void
}

export const ModalContext = createContext<ModalContextProps>({} as ModalContextProps)