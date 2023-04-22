interface LineTitleProps {
    title: string
    className?: string
}

export function LineTitle(props: LineTitleProps) {
    return (
        <div
            className={["line-title", props?.className].join(" ")}
        >
            <div className="spacer"></div>
            <span className="title">{props.title}</span>
            <div className="spacer"></div>
        </div>
    )
}