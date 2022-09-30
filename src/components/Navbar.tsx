import { Link } from 'react-router-dom'
const logo = require('../assets/logo.png')

const Navbar = () => {
    return (
        <section className="navbar">
            <img id="moral" className="logo" src={logo} alt="USSR" />
            <div className="links">
                <Link to={"/"}>Home</Link>
                <Link to={"/socks"}>Add Socks</Link>
                <Link to={"/history"}>Add History</Link>
                <Link to={"/locations"}>Add Location</Link>
                <Link to={"/officers"}>Add Officer</Link>
                <Link to={"/history"}>Add History</Link>
            </div>
        </section>
    )
}

export default Navbar