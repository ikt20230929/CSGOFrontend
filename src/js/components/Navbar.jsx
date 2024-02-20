import React from 'react';
import { Container, Group } from '@mantine/core';
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

const links = [
	{ link: '/home', label: 'Kezdőlap', needsLogin: false },
	{ link: '/loginstreak', label: "Napi jutalom", needsLogin: true},
	{ link: '/profile', label: 'Profil', needsLogin: true },
	{ link: '/giveaway', label: 'Nyereményjátékok', needsLogin: true },
	{ link: '/topup', label: 'Töltsd fel az egyenleged!', needsLogin: true },
	{ link: '/login', label: 'Bejelentkezés', needsLogin: false, hideWhenLoggedIn: true },
	{ link: '/logout', label: 'Kijelentkezés', needsLogin: true },
];
const formatCurrency = (amount) => {
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function Navbar({ profileData }) {
  const authenticated = useSelector(state => state.auth.accessToken != null);
  const { profile } = useSelector(state => state.data);
  
  const items = links.map((link) => {
    const shouldRender = authenticated === link.needsLogin || (!authenticated && link.needsLogin === false);
    if (!shouldRender || (authenticated && link.hideWhenLoggedIn)) {
      return null;
    }

    return (
      <NavLink
        key={link.label}
        to={link.link}
        className="link">
        {link.label}
      </NavLink>
    );
  });

  return (
	<>
		<header className="header">
		  <Container size="md" className="inner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
		  {profile && <a style={{fontWeight: "bolder"}}>Üdvözlünk {profile.username}!</a> }
			<Group gap={5} visibleFrom="xs">
			  {items}
			</Group>
			{profile && <span className="navbar-text">
			  Egyenleged: {formatCurrency(profile.balance)}
			</span>}
		  </Container>
		</header>
		<Outlet/>
	</>
  );
}
