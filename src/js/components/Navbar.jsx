import React from 'react';
import { Container, Group, NumberFormatter } from '@mantine/core';
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

const links = [
	{ link: '/home', label: 'Kezdőlap', needsLogin: false },
	{ link: '/loginstreak', label: "Napi jutalom", needsLogin: true},
	{ link: '/profile', label: 'Profil', needsLogin: true },
	{ link: '/giveaway', label: 'Nyereményjátékok', needsLogin: true },
	{ link: '/upgrader', label: 'Upgrader', needsLogin: true },
	{ link: '/topup', label: 'Töltsd fel az egyenleged!', needsLogin: true },
	{ link: '/login', label: 'Bejelentkezés', needsLogin: false, hideWhenLoggedIn: true },
	{ link: '/logout', label: 'Kijelentkezés', needsLogin: true },
];

export default function Navbar() {
  const authenticated = useSelector(state => state.auth.accessToken != null);
  const { profile } = useSelector(state => state.data);
  
  const items = links.map((link) => {
	const shouldRender = !link.needsLogin || (authenticated && link.needsLogin);
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
		  <Container size="xl" className="inner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Group gap={5} visibleFrom="xs">
			  {(profile && profile.username !== undefined) && <a style={{fontWeight: "bolder"}}>Üdvözlünk {profile.username}!</a> }
			  {items}
			  {(profile && profile.balance !== undefined) && <a style={{fontWeight: "bolder"}}>Egyenleged: <NumberFormatter prefix="$" fixedDecimalScale={true} decimalScale={2} value={profile.balance} /></a>}
			</Group>
		  </Container>
		</header>
		<Outlet/>
	</>
  );
}
