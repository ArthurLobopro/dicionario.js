import { Route, HashRouter as Router, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { ConfigScreen } from "./pages/Config"
import { ViewScreen } from "./pages/View"
import { CreateScreen } from "./pages/Create"

export function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateScreen />} />
                <Route path="/config" element={<ConfigScreen />} />
                <Route path="/view" element={<ViewScreen />} />
            </Routes>
        </Router>
    )
}