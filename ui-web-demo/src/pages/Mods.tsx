import React from 'react'

export default function Mods(){
  return (
    <div className="flex-col">
      <div className="titleRow">
        <div className="windowTitle">模组 / Mods</div>
      </div>

      <fluent-card className="card">
        <p className="muted">列出安装的模组（UI 展示），支持开关、版本信息、描述。</p>
      </fluent-card>
    </div>
  )
}
