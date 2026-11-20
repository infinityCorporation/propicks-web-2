import React, { useState, useReducer } from 'react';
import './component-styles/sidebar.css';
import Logo from '../assets/PP_Logo.png';
import { useNavigate } from 'react-router-dom';

import home from '../assets/home_light.svg';
import search from '../assets/search.svg';
import arb from '../assets/arrow-up-circle.svg';
import plus from '../assets/plus.svg';
import scan from '../assets/book.svg';
import profile from '../assets/user.svg';
import settings from '../assets/settings.svg';
import plans from '../assets/shopping-bag.svg';
import box from '../assets/box.svg';
import group from '../assets/group.svg';

const Sidebar = () => {
    const navigate = useNavigate();

    const [shrinkSidebar, setShrinkSidebar] = useState(false);

    if(shrinkSidebar){
        return(
            <aside className="sidebar-shrunk">
                <div className="sidebar-header">
                    <img src={Logo} alt="Logo" className="logo-shrunk" onClick={() => {setShrinkSidebar(!shrinkSidebar)}} style={{cursor: 'pointer'}} />
                </div>
                <nav className="nav">
                    <ul>
                        <li><button className='sidebar-button' onClick={() => (navigate('/'))} ><img src={home} style={{marginBottom: '-2px', marginRight: '1px'}} /></button></li>
                        <li><button className='sidebar-button' onClick={() => (navigate('/explore'))} ><img src={search} style={{marginBottom: '-2px', marginRight: '1px'}} /></button></li>
                        <li><button className='sidebar-button' onClick={() => (navigate('/group'))} ><img src={group} style={{marginBottom: '-2px', marginRight: '1px'}} /></button></li>
                        <div className='sidebar-divider'></div>
                        <li><button className='sidebar-button' onClick={() => (navigate('/tools'))} ><img src={box} style={{marginBottom: '-4px', marginRight: '1px'}} height="22px" /></button></li>
                        <li><button className='sidebar-button' onClick={() => (navigate('/test-arbitrage'))} ><img src={arb} style={{marginBottom: '-2px', marginRight: '1px'}} /></button></li>
                        <li><button className='sidebar-button' onClick={() => (navigate('/positiveev'))} ><img src={plus} style={{marginBottom: '-2px', marginRight: '1px'}} /></button></li>
                        <li><button className='sidebar-button' onClick={() => (navigate('/betscanner'))} ><img src={scan} style={{marginBottom: '-2px', marginRight: '1px'}} /></button></li>
                        <div className='sidebar-divider'></div>
                        <li><button className='sidebar-button' onClick={() => (navigate('/test-profile'))} ><img src={profile} style={{marginBottom: '-2px', marginRight: '1px'}} /></button></li>
                        <li><button className='sidebar-button' onClick={() => (navigate('/plans'))}><img src={plans} style={{marginBottom: '-2px', marginRight: '1px'}} /></button></li>
                        <li><button className='sidebar-button' onClick={() => (navigate('/settings'))} ><img src={settings} style={{marginBottom: '-2px', marginRight: '1px'}} /></button></li>
                    </ul>
                </nav>
            </aside>
        )
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img src={Logo} alt="Logo" className="logo" onClick={() => {setShrinkSidebar(!shrinkSidebar)}} style={{cursor: 'pointer'}}  />
                <h1 onClick={() => {navigate("/test-dashboard")}} style={{cursor: 'pointer'}} >ProPicks</h1>
            </div>
            <nav className="nav">
                <ul>
                    <li><button className='sidebar-button' onClick={() => (navigate('/'))} ><img src={home} style={{marginBottom: '-2px', marginRight: '1px'}} /> Home</button></li>
                    <li><button className='sidebar-button' onClick={() => (navigate('/explore'))} ><img src={search} style={{marginBottom: '-2px', marginRight: '1px'}} /> Explore</button></li>
                    <li><button className='sidebar-button' onClick={() => (navigate('/groups'))} ><img src={group} style={{marginBottom: '-2px', marginRight: '1px'}} /> Groups</button></li>
                    <div className='sidebar-divider'></div>
                    <li><button className='sidebar-button' onClick={() => {navigate('/tools')}}><img src={box} style={{marginBottom: '-4px', marginRight: '1px'}} height="22px" /> Tools</button></li>
                    <li><button className='sidebar-button' onClick={() => (navigate('/test-arbitrage'))} ><img src={arb} style={{marginBottom: '-2px', marginRight: '1px'}} /> Arbitrage</button></li>
                    <li><button className='sidebar-button' onClick={() => (navigate('/positiveev'))} ><img src={plus} style={{marginBottom: '-2px', marginRight: '1px'}} /> Positive EV</button></li>
                    <li><button className='sidebar-button' onClick={() => (navigate('/betscanner'))} ><img src={scan} style={{marginBottom: '-2px', marginRight: '1px'}} /> Bet Scanner</button></li>
                    <div className='sidebar-divider'></div>
                    <li><button className='sidebar-button' onClick={() => (navigate('/test-account'))} ><img src={profile} style={{marginBottom: '-2px', marginRight: '1px'}} /> Profile</button></li>
                    <li><button className='sidebar-button' onClick={() => (navigate('/plans'))}><img src={plans} style={{marginBottom: '-2px', marginRight: '1px'}} /> Plans</button></li>
                    <li><button className='sidebar-button' onClick={() => (navigate('/settings'))} ><img src={settings} style={{marginBottom: '-2px', marginRight: '1px'}} /> Settings</button></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
