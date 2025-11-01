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
          {/* fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </FluentWindow>
    </BrowserRouter>
  )
}
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import FluentWindow from './components/FluentWindow'
import Home from './pages/Home'
import Download from './pages/Download'
import Settings from './pages/Settings'
import Client from './pages/Client'
import Mods from './pages/Mods'
import Tools from './pages/Tools'
import DownloadLoad from './pages/DownloadLoad'
import Version from './pages/Version'
import BBS from './pages/BBS'
import Passport from './pages/Passport'
import Info from './pages/Info'
import Multiplayer from './pages/Multiplayer'
import BLDownload from './pages/BLDownload'
import Forum from './pages/Forum'
import MCVerDownloading from './pages/MCVerDownloading'
import PassportNotDone from './pages/PassportNotDone'
import DownloadOld from './pages/DownloadOld'
import ErrorPage from './pages/ErrorPage'
import PassportOld from './pages/PassportOld'

export default function App() {
  return (
    <FluentWindow>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download" element={<Download />} />
        <Route path="/bl-download" element={<BLDownload />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/mcver-downloading" element={<MCVerDownloading />} />
        <Route path="/passport-notdone" element={<PassportNotDone />} />
        <Route path="/download-old" element={<DownloadOld />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/passport-old" element={<PassportOld />} />
  <Route path="/client" element={<Client />} />
  <Route path="/download-load" element={<DownloadLoad />} />
  <Route path="/mods" element={<Mods />} />
  <Route path="/tools" element={<Tools />} />
  <Route path="/version" element={<Version />} />
  <Route path="/bbs" element={<BBS />} />
  <Route path="/passport" element={<Passport />} />
  <Route path="/multiplayer" element={<Multiplayer />} />
  <Route path="/info" element={<Info />} />
  <Route path="/settings" element={<Settings />} />
      </Routes>
    </FluentWindow>
  )
}
