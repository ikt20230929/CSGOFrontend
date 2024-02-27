import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import TopUpPage from "./pages/TopUpPage";
import GiveawayPage from "./pages/GiveawayPage";
import HomePage from "./pages/HomePage";
import CasePage from "./pages/CasePage";
import '@mantine/core/styles.css';
import '../css/styles.css';
import { Loader, MantineProvider } from "@mantine/core";
import TwoFactorPage from "./pages/TwoFactorPage";
import Navbar from "./components/Navbar";
import LoginStreak from "./pages/LoginStreak";
import UpgradePage from "./pages/UpgradePage";
import { Provider, useSelector } from 'react-redux';
import store from './store';
import { AuthenticatedRoute } from "./components/AuthenticatedRoute";
import { fetchProfile } from "./Globals";
import CenteredContainer from "./components/CenteredContainer";
import LogoutPage from "./pages/LogoutPage";
import UserOptionsPage from "./pages/UserOptionsPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Navbar />,
		children: [
			{
				path: "/",
				element: <MainPage />,
			},
			{
				path: "/login",
				element: <LoginPage />
			},
			{
				path: "/login/totp",
				element: <TwoFactorPage />
			},
			{
				path: "/register",
				element: <RegisterPage />
			},
			{
				path: "/profile",
				element: <AuthenticatedRoute><ProfilePage /></AuthenticatedRoute>
			},
			{
				path: "/topup",
				element: <AuthenticatedRoute><TopUpPage /></AuthenticatedRoute>

			},
			{
				path: "/giveaway",
				element: <AuthenticatedRoute><GiveawayPage /></AuthenticatedRoute>
			},
			{
				path: "/home",
				element: <HomePage />
			},
			{
				path: "/upgrader",
				element: <UpgradePage />
			},
			{
				path: "/loginstreak",
				element: <AuthenticatedRoute><LoginStreak /></AuthenticatedRoute>
			},
			{
				path: "/logout",
				element: <AuthenticatedRoute><LogoutPage /></AuthenticatedRoute>
			},
			{
				path: "/casepage/:caseId",
				element: <CasePage/>
			},
			{
				path: "/options",
				element: <AuthenticatedRoute><UserOptionsPage /></AuthenticatedRoute>
			}
		]
	}
]);

export default function App() {
	const [loaded, setLoaded] = useState(false);
	const loggedIn = useSelector(state => state.auth).accessToken != null;

	useEffect(() => {
		if (loggedIn) {
			fetchProfile().then(() => {
				setLoaded(true);
			});
		} else {
			// No point in trying to load session data if we don't have a session token.
			// We'll just do it when the user logs in instead.
			setLoaded(true);
		}
	}, []);

	if (!loaded) {
		return (
			<CenteredContainer>
				<Loader />
				<h1>Töltés...</h1>
			</CenteredContainer>
		)
	}

	return (
		<RouterProvider router={router} />
	)
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<MantineProvider defaultColorScheme="dark">
				<App />
			</MantineProvider>
		</Provider>
	</StrictMode>);