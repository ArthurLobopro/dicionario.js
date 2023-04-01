export function LineTitle(props: { title: string, className?: string }) {
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