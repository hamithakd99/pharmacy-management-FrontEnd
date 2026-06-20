import { Link } from "react-router-dom";

function Header() {
    return (
        <div>
            <div>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    );
}

export default Header;