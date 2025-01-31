import React from 'react';
import { Header, HeaderName, HeaderNavigation, HeaderMenuItem } from '@carbon/react';
import { NavLink } from 'react-router-dom';
import { FiMail, FiCloud, FiHome } from 'react-icons/fi';
import { SiMailchimp } from 'react-icons/si';

function AppNavbar() {
  return (
    <Header aria-label="AOBG Internal Tools">
      <HeaderName href="/" prefix="">
        AOBG Internal Tools
      </HeaderName>
      <HeaderNavigation aria-label="AOBG Internal Tools">
        <HeaderMenuItem element={NavLink} to="/">
          <FiHome size={20} /> Home
        </HeaderMenuItem>
        <HeaderMenuItem element={NavLink} to="/distribution-groups">
          <FiMail size={20} /> Dist Groups
        </HeaderMenuItem>
        <HeaderMenuItem element={NavLink} to="/mailing-list">
          <SiMailchimp size={20} /> Mailing List
        </HeaderMenuItem>
        <HeaderMenuItem element={NavLink} to="/cloud-status">
          <FiCloud size={20} /> Cloud Status
        </HeaderMenuItem>
      </HeaderNavigation>
    </Header>
  );
}

export default AppNavbar;
