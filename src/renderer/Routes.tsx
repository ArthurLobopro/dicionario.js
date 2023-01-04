import { Route, HashRouter as Router, Routes } from "react-router-dom"
import { ConfigScreen } from "./pages/Config"
import { CreateScreen } from "./pages/Create"
import { Home } from "./pages/Home"
import { UpdateScreen } from "./pages/Update"
import { ViewScreen } from "./pages/View"

export function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateScreen />} />
                <Route path="/update/:word" element={<UpdateScreen />} />
                <Route path="/config" element={<ConfigScreen />} />
                <Route path="/view" element={<ViewScreen />} />
            </Routes>
        </Router>
    )
}