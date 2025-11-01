import React from 'react'
import { Link, useLocation } from 'react-router-dom'

type NavItem = {
  key: string
  to: string
  label: string
  icon?: string
}

const topItems: NavItem[] = [
  { key: 'home', to: '/', label: '主页', icon: '/icons/home.png' },
  { key: 'download', to: '/download', label: '下载', icon: '/icons/download.png' },
]

const scrollItems: NavItem[] = [
  { key: 'tools', to: '/tools', label: '工具', icon: '/icons/tools.png' },
  { key: 'version', to: '/version', label: '版本管理', icon: '/icons/app.png' },
  { key: 'bbs', to: '/bbs', label: 'Bloret BBS', icon: '/icons/bbs.png' },
  { key: 'mods', to: '/mods', label: 'Mods', icon: '/icons/mods.png' },
  { key: 'multiplayer', to: '/multiplayer', label: '联机', icon: '/icons/client.png' },
]

const bottomItems: NavItem[] = [
  { key: 'passport', to: '/passport', label: '通行证', icon: '/icons/passport.png' },
  { key: 'settings', to: '/settings', label: '设置', icon: '/icons/settings.png' },
  { key: 'info', to: '/info', label: '关于', icon: '/icons/info.png' },
]

function RenderItem({ it }: { it: NavItem }) {
  const loc = useLocation()
  const active = loc.pathname === it.to || (it.to === '/' && loc.pathname === '/')
  return (
    <Link key={it.key} to={it.to} className={`nav-item ${active ? 'active' : ''}`} title={it.label}>
      {it.icon ? (
        // browser will resolve /icons/* from public folder
        // fallback: if icon not present, browser shows broken image — acceptable for placeholder
        <img src={it.icon} alt={it.label} className="nav-icon" />
      ) : (
        <span style={{ fontSize: 14 }}>{it.label[0]}</span>
      )}
    </Link>
  )
}

export default function SidebarNav() {
  return (
    <nav className="sidebar">
      <div className="top-group">
        {topItems.map((it) => (
          <RenderItem key={it.key} it={it} />
        ))}
      </div>

      <div className="sidebar-gap" />

      <div className="scroll-group">
        {scrollItems.map((it) => (
          <RenderItem key={it.key} it={it} />
        ))}
      </div>

      <div className="nav-spacer" />

      <div className="bottom-group">
        {bottomItems.map((it) => (
          <RenderItem key={it.key} it={it} />
        ))}
      </div>
    </nav>
  )
}
