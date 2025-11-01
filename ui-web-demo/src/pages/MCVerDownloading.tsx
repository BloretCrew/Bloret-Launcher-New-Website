import React from 'react'

export default function MCVerDownloading(){
  return (
    <div className="flex-col">
      <div className="titleRow">
        <div className="windowTitle">MC 版本 下载中</div>
      </div>
      <fluent-card className="card">
        <h4>版本下载</h4>
        <p className="muted">显示 Minecraft 版本下载进度（占位）。</p>
        <fluent-progress max="100" value="42"></fluent-progress>
      </fluent-card>
    </div>
  )
}
