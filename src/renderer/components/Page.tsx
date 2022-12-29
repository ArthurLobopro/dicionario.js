interface PageProps {
    children: React.ReactNode
    id?: string
}

export function Page(props: PageProps) {
    return (
        <div className="page" {...props}>
            {props.children}
        </div>
    )
}
