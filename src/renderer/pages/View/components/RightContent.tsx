import { useContext, useEffect, useMemo, useState } from "react"
import { CircleButton, If } from "../../../components/base"
import { AddIcon, ScrollTopIcon, SearchIcon } from "../../../components/icons"
import { ViewContext } from "../../../contexts/ViewContext"
import { InputChangeEvent, InputFocusEvent } from "../../../types"
import { Menu } from "./Menu"

export function RightContent() {
  const { handleAddWord, search, setSearch, words, wrapperRef } =
    useContext(ViewContext)

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener("scroll", () => {
        if (
          (wrapperRef.current?.scrollTop as number) >
          window.outerHeight * 2
        ) {
          setResetScroll(true)
        }
        if ((wrapperRef.current?.scrollTop as number) === 0) {
          setResetScroll(false)
        }
      })
    }
  }, [wrapperRef.current])

  const [inputVisibility, setInputVisibility] = useState(false)
  const [resetScroll, setResetScroll] = useState(false)

  const search_input = useMemo(() => {
    const handle_change = (e: InputChangeEvent) => setSearch(e?.target.value)

    const handle_blur = (e: InputFocusEvent) => {
      e?.target.value === "" && setInputVisibility(false)
    }

    return (
      <input
        type="search"
        className="simple"
        placeholder="Pesquisar"
        onChange={handle_change}
        onBlur={handle_blur}
        value={search}
        autoFocus
      />
    )
  }, [search])

  return (
    <div className="flex gap-4">
      <div className="flex align-center">
        <If condition={words.length > 0}>
          <If condition={!inputVisibility} else={search_input}>
            <CircleButton
              title="Mostrar barra de pesquisa"
              onClick={() => setInputVisibility(true)}
            >
              <SearchIcon />
            </CircleButton>
          </If>
        </If>
      </div>

      <If condition={resetScroll}>
        <CircleButton
          title="Rolar para o topo"
          onClick={() => {
            wrapperRef.current?.scrollTo({ top: 0, behavior: "smooth" })
            setTimeout(() => setResetScroll(false), 100)
          }}
        >
          <ScrollTopIcon />
        </CircleButton>
      </If>

      <CircleButton onClick={handleAddWord} title="Adicionar palavra">
        <AddIcon className="add-button" />
      </CircleButton>

      <Menu />
    </div>
  )
}
