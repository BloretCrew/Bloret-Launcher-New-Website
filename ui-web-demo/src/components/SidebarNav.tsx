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
  // download icon fallback -> use loading3.gif as visual download indicator
  { key: 'download', to: '/download', label: '下载', icon: '/icons/loading3.gif' },
]

const scrollItems: NavItem[] = [
  { key: 'tools', to: '/tools', label: '工具', icon: '/icons/exeapps.png' },
  { key: 'version', to: '/version', label: '版本管理', icon: '/icons/app-icon.svg' },
  { key: 'bbs', to: '/bbs', label: 'Bloret BBS', icon: '/icons/github.png' },
  { key: 'mods', to: '/mods', label: 'Mods', icon: '/icons/Grass_Block.png' },
  { key: 'multiplayer', to: '/multiplayer', label: '联机', icon: '/icons/OnlineClient.gif' },
]

const bottomItems: NavItem[] = [
  { key: 'passport', to: '/passport', label: '通行证', icon: '/icons/qq.png' },
  { key: 'settings', to: '/settings', label: '设置', icon: '/icons/favicon.ico' },
  { key: 'info', to: '/info', label: '关于', icon: '/icons/bloret.png' },
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
        <span className="nav-fallback">{it.label[0]}</span>
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
