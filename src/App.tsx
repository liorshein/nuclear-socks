import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import './styles/general.scss'

const App = () => {
    return (
        <main>
            < Navbar />
            <Outlet />
        </main>
    )
}

export default App