import { useContext, useMemo } from "react"
import { ViewContext } from "../../../contexts/ViewContext"
import { EmptySearch } from "./EmptySearch"
import { Word } from "./Word"

export function WordList() {
  const { words, search, reload, dictionary, modal, wrapperRef, searchRegex } =
    useContext(ViewContext)

  const filtered_words = useMemo(() => {
    return words.filter(({ word }) => searchRegex.test(word))
  }, [search, words.length, words])

  const list = useMemo(() => {
    return filtered_words.length === 0 ? (
      <EmptySearch />
    ) : (
      <div>
        <div className="word-wrapper" ref={wrapperRef}>
          {filtered_words.map((word) => (
            <Word
              word={word}
              reload={reload}
              dictionary={dictionary}
              modal={modal}
              key={word.word}
            />
          ))}
        </div>
      </div>
    )
  }, [filtered_words])

  return list
}
