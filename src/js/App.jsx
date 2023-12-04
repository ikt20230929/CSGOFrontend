import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import '@mantine/core/styles.css';
import { MantineProvider } from "@mantine/core";
import TwoFactorPage from "./pages/TwoFactorPage";

const router = createBrowserRouter([
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
	}
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<MantineProvider defaultColorScheme="auto">
			<RouterProvider router={router} />
		</MantineProvider>
	</StrictMode>);