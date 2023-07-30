import { useContext, useMemo } from "react"
import { ViewContext } from "../../../contexts/ViewContext"
import { EmptySearch } from "./EmptySearch"
import { Word } from "./Word"

export function WordList() {
  const { words, search, reload, dictionary, modal, wrapperRef } =
    useContext(ViewContext)

  const filter = useMemo(() => new RegExp(`^${search.trim()}`), [search])

  const filtered_words = useMemo(() => {
    return words.filter(([word]) => filter.test(word))
  }, [filter, words.length, words])

  const list = useMemo(() => {
    return filtered_words.length === 0 ? (
      <EmptySearch />
    ) : (
      <div>
        <div className="word-wrapper" ref={wrapperRef}>
          {filtered_words.map(([word, word_props]) => (
            <Word
              word={{ ...word_props, word }}
              reload={reload}
              dictionary={dictionary}
              modal={modal}
              key={word}
            />
          ))}
        </div>
      </div>
    )
  }, [filtered_words])

  return list
}
