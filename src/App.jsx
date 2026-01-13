import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './Components/header'

export default function Layout(){

    return(
        <>
            <Header/>
            <div>
               <Outlet/> 
            </div> 
        </>
    )
}
