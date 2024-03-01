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
	{ link: '/options', label: 'Beállítások', needsLogin: true },
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
			<img width="75px" src='https://cdn.discordapp.com/attachments/945254887460044820/1213053983187406908/logo.png?ex=65f4138f&is=65e19e8f&hm=f0afb11377cedf380cccb79209e795e553542a39cf7bb2f07e88b1a1c242a2b0&'></img>
			  {(profile && profile.userName !== undefined) && <a style={{fontWeight: "bolder"}}>Üdvözlünk {profile.userName}!</a> }
			  {items}
			  {(profile && profile.userBalance !== undefined) && <a style={{fontWeight: "bolder"}}>Egyenleged: <NumberFormatter prefix="$" fixedDecimalScale={true} decimalScale={2} value={profile.userBalance} /></a>}
			</Group>
		  </Container>
		</header>
		<Outlet/>
	</>
  );
}
