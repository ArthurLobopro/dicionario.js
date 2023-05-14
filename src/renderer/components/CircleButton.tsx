interface CircleButtonProps {
    onClick: () => void
    title: string
    children: React.ReactNode
}

export function CircleButton(props: CircleButtonProps) {
    return (
        <button
            className="circle-button"
            onClick={props.onClick} title={props.title}
        >
            {props.children}
        </button>
    )
}