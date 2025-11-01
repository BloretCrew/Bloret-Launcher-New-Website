import React from 'react'

export default function Passport(){
  return (
    <div className="flex-col">
      <div className="titleRow">
        <div className="windowTitle">通行证</div>
      </div>

      <fluent-card className="card">
        <h4>通行证 / 登录</h4>
        <p className="muted">显示登录状态与登录方式（仅 UI）。</p>
      </fluent-card>
    </div>
  )
}
