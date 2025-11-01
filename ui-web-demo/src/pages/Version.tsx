import React from 'react'

export default function Version(){
  return (
    <div className="flex-col">
      <div className="titleRow">
        <div className="windowTitle">版本管理</div>
      </div>

      <fluent-card className="card">
        <h4>版本管理</h4>
        <p className="muted">这里展示已安装版本、可管理的版本及自定义版本（UI 展示）。</p>
      </fluent-card>
    </div>
  )
}
