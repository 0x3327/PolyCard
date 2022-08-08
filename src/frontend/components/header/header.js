import { ChevronLeft, PersonOutline } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../logo/logo";

export const Header = ({ showProfile=true, backPath, profilePath="/client/user-profile" }) => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <span className="logo-wrap">
                <Logo size={18} />
                {backPath ? (
                    <span
                        className="back-link"
                        onClick={() => navigate(backPath)}
                    >
                        <ChevronLeft/> Back
                    </span>
                ) : null}
            </span>

            {showProfile && <Link to={profilePath}><PersonOutline/></Link>}
        </header>
    );
};
