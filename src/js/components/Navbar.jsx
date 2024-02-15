import React from 'react';
import { Container, Group, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

const links = [
  { link: '/home', label: 'Kezdőlap' },
  { link: '/loginstreak', label: "Napi jutalom"},
  { link: '/profile', label: 'Profil' },
  { link: '/giveaway', label: 'Nyereményjátékok' },
  { link: '/topup', label: 'Töltsd fel az egyenleged!' },
];

const formatCurrency = (amount) => {
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function Navbar({ profileData }) {
  const items = links.map((link) => (
    <NavLink
      key={link.label}
      to={link.link}
      className="link">
		{link.label}
    </NavLink>
  ));

  return (
	<>
		<header className="header">
		  <Container size="md" className="inner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
		  {profileData && <a style={{fontWeight: "bolder"}}>Üdvözlünk {profileData.profile.username}!</a> }
			<Group gap={5} visibleFrom="xs">
			  {items}
			</Group>
			{profileData && <span className="navbar-text">
			  Egyenleged: {formatCurrency(profileData.profile.balance)}
			</span>}
		  </Container>
		</header>
		<Outlet/>
	</>
  );
}
