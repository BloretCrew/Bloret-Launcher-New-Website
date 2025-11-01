import React from 'react'

export default function Info(){
  return (
    <div className="flex-col">
      <div className="titleRow">
        <div className="windowTitle">关于</div>
      </div>

      <fluent-card className="card">
        <h4>关于 Bloret Launcher</h4>
        <p className="muted">这里放置版本信息、作者、License 等（示例）。</p>
      </fluent-card>
    </div>
  )
}
