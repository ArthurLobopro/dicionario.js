import { useEffect, useRef, useState } from "react"
import { api } from "../../../store/Api"
import { Header, Page, ReturnButton } from "../../components/base"
import { useModal } from "../../hooks/useModal"
import { AppearanceSection } from "./components/AppearanceSection"
import { DictionarySection } from "./components/DictionarySection"
import { OthersSection } from "./components/OthersSection"
import { WindowSection } from "./components/WindowSection"

export function ConfigScreen() {
  const modal = useModal()

  const wrapperRef = useRef<HTMLDivElement>(null)

  const [hasSrollbar, setHasScrollbar] = useState(false)

  useEffect(() => {
    const new_hasScrollbar =
      !!wrapperRef.current &&
      wrapperRef.current?.scrollHeight > wrapperRef.current?.clientHeight

    if (hasSrollbar !== new_hasScrollbar) {
      setHasScrollbar(new_hasScrollbar)
    }
  }, [wrapperRef])

  return (
    <Page id="config">
      {modal.content}
      <Header title="Configurações" left={<ReturnButton />} />
      <div className="dashed-border">
        <div style={{ height: "100%", position: "relative" }}>
          <div
            className={`config-wrapper ${hasSrollbar ? "has-scrollbar" : ""}`}
            ref={wrapperRef}
          >
            <div className="lines">
              <AppearanceSection />

              <WindowSection />

              <DictionarySection modal={modal} />

              <OthersSection />
            </div>

            <span className="version">{`Versão ${api.version}`}</span>
          </div>
        </div>
      </div>
    </Page>
  )
}
