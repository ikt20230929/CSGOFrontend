import React from "react";
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";


const router = createBrowserRouter([
	{
	  	path: "/",
	  	element: <div>Hello React!</div>,
	}
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);