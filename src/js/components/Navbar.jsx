import React, { Fragment } from 'react';
import { Avatar, Burger, Container, Drawer, Group, Image, Menu, NumberFormatter } from '@mantine/core';
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';


const links = [
	{ link: '/home', label: 'Kezdőlap', Image: '/assets/home.png', needsLogin: false },
	{ link: '/loginstreak', label: "Napi jutalom", Image: '/assets/calendar.png', needsLogin: true },
	{ link: '/giveaway', label: 'Nyereményjátékok', Image: '/assets/give.png', needsLogin: true },
	{ link: '/upgrader', label: 'Upgrader', Image: '/assets/upgrade.png', needsLogin: true },
	{ link: '/login', label: 'Bejelentkezés', needsLogin: false, hideWhenLoggedIn: true }
];

const menuLinks = [
	{ link: '/profile', label: 'Profil', Image: '/assets/user.png', needsLogin: true },
	{ link: '/topup', label: 'Töltsd fel az egyenleged!', Image: '/assets/money.png', needsLogin: true },
	{ link: '/options', label: 'Beállítások', Image: '/assets/setting.png', needsLogin: true, divider: true },
	{ link: '/adminpage', label: 'Admin felület', needsLogin: true },
	{ link: '/logout', label: 'Kijelentkezés', Image: '/assets/logout.png', needsLogin: true }
];

export default function Navbar() {
	const authenticated = useSelector(state => state.auth.accessToken != null);
	const { profile } = useSelector(state => state.data);
	const isAdmin = profile && profile.userIsAdmin;
	const [opened, { toggle: toggle, close: close }] = useDisclosure();
	const noMenuRoot = useMediaQuery(`(max-width: 767px)`);

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
				<img src={link.Image} style={{ width: "20px", float: "left", marginRight: "10px" }}></img>
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
					{noMenuRoot ? (<>
						<NavLink to={link.link} className="link">
							<img src='/assets/admin.png' style={{ width: "20px", float: "left", marginRight: "10px" }}></img>
							{link.label}
						</NavLink>
						{link.divider && <hr />}
					</>) : (<>
						<Menu.Item component={NavLink} to={link.link} className="link">
							<img src='/assets/admin.png' style={{ width: "20px", float: "left", marginRight: "10px" }}></img>
							{link.label}
						</Menu.Item>
						{link.divider && <Menu.Divider />}
					</>)}
				</Fragment>
			);
		}

		if (link.link !== '/adminpage') {
			return (
				<Fragment key={link.label}>
					{noMenuRoot ? (<>
						<NavLink to={link.link} className="link">
							<img src={link.Image} style={{ width: "20px", float: "left", marginRight: "10px" }}></img>
							{link.label}
						</NavLink>
						{link.divider && <hr />}
					</>) : (<>
						<Menu.Item component={NavLink} to={link.link} className="link">
							<img src={link.Image} style={{ width: "20px", float: "left", marginRight: "10px" }}></img>
							{link.label}
						</Menu.Item>
						{link.divider && <Menu.Divider />}
					</>)}
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
					<Group span={{ xs: 12, sm: 6, md: 4, lg: 3 }} visibleFrom="sm" justify='center'>
						{items}
					</Group>
					{authenticated &&
						<Group span={{ xs: 12, sm: 6, md: 4, lg: 3 }} visibleFrom="sm" justify='flex-end'>
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
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" aria-label="Navigációs menü" />
					<Drawer opened={opened} onClose={close} padding="md" size="xs" hiddenFrom='sm'>
						{authenticated && <>
							{(profile && profile.userName !== undefined) && <a style={{ fontWeight: "bolder" }}>Üdvözlünk {profile.userName}!</a>}
							<br />
							{(profile && profile.userBalance !== undefined) && <a style={{ fontWeight: "bolder" }}>Egyenleged: <NumberFormatter prefix="$" fixedDecimalScale={true} decimalScale={2} value={profile.userBalance} /></a>}
							<hr />
						</>}
						{items}
						{authenticated && <>
							<hr />
							{menuItems}
						</>}
					</Drawer>
				</Container>
			</header>
			<Outlet />
		</>
	);
}