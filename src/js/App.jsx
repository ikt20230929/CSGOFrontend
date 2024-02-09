import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import TopUpPage from "./pages/TopUpPage";
import '@mantine/core/styles.css';
import '../css/styles.css';
import { MantineProvider } from "@mantine/core";
import TwoFactorPage from "./pages/TwoFactorPage";
import Navbar from "./components/Navbar";

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
				element: <ProfilePage />
			},
			{
				path: "/topup",
				element: <TopUpPage />
			}
		]
	}
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<MantineProvider defaultColorScheme="auto">
			<RouterProvider router={router} />
		</MantineProvider>
	</StrictMode>);