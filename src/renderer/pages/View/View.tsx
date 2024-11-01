import { useCallback, useMemo, useRef, useState } from "react"
import { api } from "../../../store/Api"
import { Header, If, Page, ReturnButton } from "../../components/base"
import { AddWordModal } from "../../components/modals/word"
import { SelectDictionary } from "../../components/selects/Dictionary"
import { ViewContext } from "../../contexts/ViewContext"
import { useModal } from "../../hooks/useModal"
import { useQuery } from "../../hooks/useQuery"
import { useSearch } from "../../hooks/useSearch"
import { EmptyPage } from "./components/EmptyPage"
import { RightContent } from "./components/RightContent"
import { WordList } from "./components/WordList"

export function ViewScreen() {
  const query = useQuery()

  const [dictionary, setDictionary] = useState(() => {
    try {
      return api.dictionaries.getDictionary(query.get("dictionary") as string)
    } catch (error) {
      return api.dictionaries.defaultDictionary
    }
  })

  const getWords = () => dictionary.Words.words

  const words = useMemo(getWords, [dictionary])
  const modal = useModal()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { search, setSearch, searchRegex } = useSearch()

  function reload() {
    try {
      setDictionary(api.dictionaries.getDictionary(dictionary.name))
    } catch (error) {
      setDictionary(api.dictionaries.defaultDictionary)
    }
  }

  const handleAddWord = useCallback(() => {
    modal.open(
      <AddWordModal
        dictionary={dictionary}
        onClose={(added) => {
          added && reload()
          modal.close()
        }}
      />,
    )
  }, [dictionary])

  return (
    <Page id="view">
      <ViewContext.Provider
        value={{
          modal,
          search,
          words,
          dictionary,
          wrapperRef,
          handleAddWord,
          setSearch,
          reload,
          searchRegex,
        }}
      >
        {modal.content}
        <Header
          title={
            <SelectDictionary
              titleMode={true}
              onChange={(name: string) => {
                if (name !== dictionary.name) {
                  setDictionary(api.dictionaries.getDictionary(name))
                }
              }}
              default_value={dictionary.name}
            />
          }
          left={<ReturnButton />}
          right={<RightContent />}
        />

        <If condition={words.length > 0} else={<EmptyPage />}>
          <WordList />
        </If>
      </ViewContext.Provider>
    </Page>
  )
}
