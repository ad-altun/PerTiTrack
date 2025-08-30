import {Outlet} from 'react-router-dom'
import Header from "../components/common/Header.tsx";
import Navigation from "../components/common/Navigation.tsx";

export default function Root() {
    return (
        <div>
            <Header/>
            <Navigation/>
            <Outlet/>
        </div>
    );
};
