interface CircleButtonProps {
    onClick: () => void
    title: string
    children: React.ReactNode
    small?: boolean
}

export function CircleButton(props: CircleButtonProps) {
    return (
        <button
            className={`circle-button ${props.small ? "small" : ""}`}
            onClick={props.onClick} title={props.title}
            tabIndex={-1}
        >
            {props.children}
        </button>
    )
}