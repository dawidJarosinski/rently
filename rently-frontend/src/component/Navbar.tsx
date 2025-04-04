import { Link } from "react-router-dom";
import Logo from "../component/Logo";

const Navbar = () => {
    return ( 
    <nav className="w-full flex justify-between items-center p-4 bg-white shadow">
        <Logo />
        <div className="flex gap-4">
            <Link to="/register-host">
                <button type="button" className="text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg shadow-purple-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Start renting your house</button>
            </Link>
            <Link to="/register">
                <button type="button" className="text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg shadow-purple-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Sign Up</button>
            </Link>
            <Link to="/login">
                <button type="button" className="text-white bg-gradient-to-r from-[#B24EFF] to-[#FC56FF] hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg shadow-purple-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Sign In</button>
            </Link>
        </div>
    </nav>
    );
};
export default Navbar;
