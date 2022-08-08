import { Outlet } from "react-router-dom"
import PerfectScrollbar from 'react-perfect-scrollbar'


export const StoreAppRoot = () => {
    return (
        <div className="store-app-root">
            <div className="gradient-wrap">
                <PerfectScrollbar>
                <div className="app-wrapper">
                    <Outlet/>
                </div>
                </PerfectScrollbar>
            </div>
        </div>
    )
}