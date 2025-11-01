import React, { PropsWithChildren } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './fluent-window.css'
import SidebarNav from './SidebarNav'

export default function FluentWindow({ children }: PropsWithChildren) {
  const loc = useLocation()

  return (
    <div className="fluent-window">
      <aside className="sidebar">
        <SidebarNav />
      </aside>
      <section className="main-area">
        <header className="titlebar">
          <div className="titlebar-left">
            <img src="/icons/bloret.png" alt="app" className="app-icon" />
            <div className="title-text">
              <div className="windowTitle">Bloret Launcher</div>
              <div className="subtitle muted">将本软件的 UI 以网页形式展示</div>
            </div>
          </div>

          <div className="titlebar-right">
            <fluent-button appearance="stealth" aria-label="Minimize">—</fluent-button>
            <fluent-button appearance="stealth" aria-label="Maximize">▢</fluent-button>
            <fluent-button appearance="stealth" aria-label="Close">✕</fluent-button>
          </div>
        </header>

        <main className="content">{children}</main>
      </section>
    </div>
  )
}
