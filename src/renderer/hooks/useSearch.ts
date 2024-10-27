import { useMemo, useState } from "react"

export function useSearch() {
  const [search, setSearch] = useState("")

  const searchRegex = useMemo(() => {
    const treatedSearch = search
      .toLowerCase()
      .replace(/a/g, "(a|á|ã|à|â)")
      .replace(/e/g, "(e|é|ê|ẽ)")
      .replace(/i/g, "(i|í|ì)")
      .replace(/o/g, "(o|õ|ô|ó)")
      .replace(/u/g, "(u|ú|û|ũ)")
      .replace(/c/g, "(c|ç)")

    return new RegExp(`^${treatedSearch}`)
  }, [search])

  console.log(searchRegex)

  return {
    search,
    searchRegex,
    setSearch,
  }
}
