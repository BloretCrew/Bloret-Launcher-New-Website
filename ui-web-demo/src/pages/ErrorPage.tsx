import React from 'react'

export default function ErrorPage(){
  return (
    <div className="flex-col">
      <div className="titleRow">
        <div className="windowTitle">错误</div>
      </div>
      <fluent-card className="card">
        <h4>错误（占位）</h4>
        <p className="muted">显示错误信息或日志。</p>
      </fluent-card>
    </div>
  )
}
