interface CircleButtonProps {
    onClick: () => void
    title: string
    children: React.ReactNode
    small?: boolean
    useDiv?: boolean
}

export function CircleButton(props: CircleButtonProps) {
    const Component = props.useDiv ? (props: any) => <div {...props} /> : (props: any) => <button {...props} />
    return (
        <Component
            className={`circle-button ${props.small ? "small" : ""}`}
            onClick={props.onClick} title={props.title}
            tabIndex={props.useDiv ? undefined : -1}
        >
            {props.children}
        </Component>
    )
}