import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import Hash from '../components/Hash.jsx'
import Domain from '../components/Domain.jsx'
import Threats from '../components/Threats.jsx'

import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/> 
  },
  {
    path: "/threat_hunting",
    element: <Threats />
  },
{
    path: "/hash",
    element: <Hash/>
  },
{
    path: "/domain",
    element: <Domain />
  },
]);



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
