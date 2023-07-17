import { api } from "../../../store/Api"

interface PageProps {
  children: React.ReactNode
  id?: string
}

export function Page(props: PageProps) {
  return (
    <div
      className={["page", api.options.animations ? "" : "no-animations"].join(
        " ",
      )}
      {...props}
    >
      {props.children}
    </div>
  )
}
