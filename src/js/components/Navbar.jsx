import React, { Fragment } from 'react';
import { Avatar, Container, Group, Menu, NumberFormatter } from '@mantine/core';
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import admin from '../public/assets/admin.png';
import calendar from '../public/assets/calendar.png';
import give from '../public/assets/give.png';
import home from '../public/assets/home.png';
import logout from '../public/assets/logout.png';
import money from '../public/assets/money.png';
import settings from '../public/assets/settings.png';
import upgrade from '../public/assets/upgrade.png';
import user from '../public/assets/user.png';


const links = [
	{ link: '/home', label: 'Kezdőlap', needsLogin: false },
	{ link: '/loginstreak', label: "Napi jutalom", needsLogin: true},
	{ link: '/giveaway', label: 'Nyereményjátékok', needsLogin: true },
	{ link: '/upgrader', label: 'Upgrader', needsLogin: true },
	{ link: '/login', label: 'Bejelentkezés', needsLogin: false, hideWhenLoggedIn: true }
];

const menuLinks = [
	{ link: '/profile', label: 'Profil', needsLogin: true },
	{ link: '/topup', label: 'Töltsd fel az egyenleged!', needsLogin: true },
	{ link: '/options', label: 'Beállítások', needsLogin: true, divider: true },
	{ link: '/adminpage', label: 'Admin felület', needsLogin: true},
	{ link: '/logout', label: 'Kijelentkezés', needsLogin: true }
];

export default function Navbar() {
	const authenticated = useSelector(state => state.auth.accessToken != null);
	const { profile } = useSelector(state => state.data);
	const isAdmin = profile && profile.userIsAdmin;
  
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
  
	const menuItems = menuLinks.map((link) => {
	  const shouldRender = !link.needsLogin || (authenticated && link.needsLogin);
	  if (!shouldRender || (authenticated && link.hideWhenLoggedIn)) {
		return null;
	  }
  
	  if (isAdmin && link.link === '/adminpage') {
		return (
		  <Fragment key={link.label}>
			<Menu.Item
			  component={NavLink}
			  to={link.link}
			  className="link">
			  {link.label}
			</Menu.Item>
			{link.divider && <Menu.Divider />}
		  </Fragment>
		);
	  }
  
	  if (link.link !== '/adminpage') {
		return (
		  <Fragment key={link.label}>
			<Menu.Item
			  component={NavLink}
			  to={link.link}
			  className="link">
			  {link.label}
			</Menu.Item>
			{link.divider && <Menu.Divider />}
		  </Fragment>
		);
	  }
  
	  return null; 
	});
  
	return (
	  <>
		<header className="header">
		  <Container fluid={true} size="xl" className="inner" style={{ textAlign: 'center', width: "100%", maxWidth: "100%" }}>
			<img width="75px" src="/assets/aim4gain_logo.png"></img>
			<Group span={{ xs: 12, sm: 6, md: 4, lg: 3 }} visibleFrom="xs" justify='center'>
			  {items}
			</Group>
			{authenticated &&
			  <Group span={{ xs: 12, sm: 6, md: 4, lg: 3 }} visibleFrom="xs" justify='flex-end'>
				<Menu shadow='md' keepMounted={true} position='bottom-end' offset={15} styles={{
				  dropdown: {
					backgroundColor: 'rgba(0, 0, 0, 0.8)'
				  }
				}}>
				  <Menu.Target>
					<Avatar radius="xl" style={{ cursor: 'pointer' }} src={null} alt="Profil">{(profile && profile.userName !== undefined) && profile.userName.toUpperCase()[0]}</Avatar>
				  </Menu.Target>
				  <Menu.Dropdown>
					{(profile && profile.userName !== undefined) && <a style={{ fontWeight: "bolder" }}>Üdvözlünk {profile.userName}!</a>}
					<br />
					{(profile && profile.userBalance !== undefined) && <a style={{ fontWeight: "bolder" }}>Egyenleged: <NumberFormatter prefix="$" fixedDecimalScale={true} decimalScale={2} value={profile.userBalance} /></a>}
					<Menu.Divider />
					{menuItems}
				  </Menu.Dropdown>
				</Menu>
			  </Group>
			}
		  </Container>
		</header>
		<Outlet />
	  </>
	);
  }
  