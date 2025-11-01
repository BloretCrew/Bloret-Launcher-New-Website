import React from 'react'

export default function DownloadLoad(){
  return (
    <div className="flex-col">
      <div className="titleRow">
        <div className="windowTitle">下载进度</div>
      </div>

      <fluent-card className="card">
        <h4>正在下载：Bloret 1.20.1</h4>
        <p className="muted">准备下载 / 校验文件...</p>

        <div className="mt12">
          <fluent-progress max="100" value="25"></fluent-progress>
        </div>

        <div className="mt12 settings-actions">
          <fluent-button appearance="accent">暂停</fluent-button>
          <fluent-button appearance="stealth">取消</fluent-button>
        </div>
      </fluent-card>

      <fluent-card className="card">
        <h4>任务队列</h4>
        <p className="muted">列出当前排队的下载任务（UI 占位）。</p>
      </fluent-card>
    </div>
  )
}
