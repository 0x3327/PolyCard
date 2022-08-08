import { Button } from "../../../components/button/button"
import { Header } from "../../../components/header/header"

export const StoreUserProfile = () => {
    return (
        <div className="store-user-profile">
            <Header backPath="/store/home"/>
            <p className="screen-title">User Profile</p>

            <Button
                title="Show api code"
                type="full-size"
            />
            <Button
                title="Logout"
                type="full-size"
            />
        </div>
    )
}