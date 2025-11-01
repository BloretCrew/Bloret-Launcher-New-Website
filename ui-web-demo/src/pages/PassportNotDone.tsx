import React from 'react'

export default function PassportNotDone(){
  return (
    <div className="flex-col">
      <div className="titleRow">
        <div className="windowTitle">未完成的账号操作</div>
      </div>
      <fluent-card className="card">
        <h4>账号未完成项</h4>
        <p className="muted">列出尚未完成的账号绑定或验证步骤（占位）。</p>
      </fluent-card>
    </div>
  )
}
