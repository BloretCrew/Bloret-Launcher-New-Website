import React from 'react'

export default function Client(){
  return (
    <div className="flex-col">
      <div className="titleRow">
        <div className="windowTitle">客户端信息</div>
      </div>

      <fluent-card className="card">
        <h4>客户端</h4>
        <p className="muted">展示客户端版本、Java/Launcher 信息（仅 UI）。</p>
      </fluent-card>
    </div>
  )
}
