import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx'
import './index.css'

import ErrorPage from './components/404.tsx'
import Dashboard from './components/Dashboard.tsx'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx';
import EventsList from './components/Events.tsx';
import TicketList from './components/Tickets.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/*' element={<ErrorPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/events' element={<EventsList />} />
        <Route path='/tickets' element={<TicketList />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
