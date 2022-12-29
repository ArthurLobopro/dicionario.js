interface HeaderProps {
    title: string,
    left?: JSX.Element
}

export function Header(props: HeaderProps) {
    return (
        <header className="grid-fill-center gap">
            {props.left}
            <h1>{props.title}</h1>
        </header>
    )
}