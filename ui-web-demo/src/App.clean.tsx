import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FluentWindow from './components/FluentWindow'
import Home from './pages/Home'
import Download from './pages/Download'
import Tools from './pages/Tools'
import Version from './pages/Version'
import BBS from './pages/BBS'
import Mods from './pages/Mods'
import Multiplayer from './pages/Multiplayer'
import Passport from './pages/Passport'
import Settings from './pages/Settings'
import Info from './pages/Info'

export default function App() {
  return (
    <BrowserRouter>
      <FluentWindow>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/download" element={<Download />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/version" element={<Version />} />
          <Route path="/bbs" element={<BBS />} />
          <Route path="/mods" element={<Mods />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path="/passport" element={<Passport />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/info" element={<Info />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </FluentWindow>
    </BrowserRouter>
  )
}
