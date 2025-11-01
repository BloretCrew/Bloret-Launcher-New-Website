import React from 'react'
import { Button, Avatar, Card } from '@fluentui/react-components'

export default function Home(){
  return (
    <div className="flex-col">
      <div className="section-header">
        <div className="title-large">Bloret Launcher</div>

        <div className="search-bar">
          <input className="search-large" placeholder="关于 Minecraft 的任何问题，可以问络可哦 ~" />
          <Button appearance="primary" className="search-action">发送</Button>
        </div>
      </div>

      <div className="section-title">信息</div>

      <Card className="info-card">
        <div className="inner-panel">
          <Avatar name="Bloret" size={56} shape="square" />
          <div className="info-body">
            <div className="muted info-title">Bloret</div>
            <div className="muted">Bloret 百络谷 | 冬季新程</div>
            <div className="muted">bloret.net &nbsp;&nbsp; 10 / 2025</div>
          </div>
        </div>
      </Card>

      <div className="card">
        <h3>络可推荐时间段</h3>
        <p className="muted">欢迎来到 Bloret 百络谷！夏天的风吹来，新旅程也开始了～让我来帮你看看什么时候去玩最合适吧！</p>
      </div>

      <div className="bottom-panel">
        <div className="user-info">
          <Avatar name="Detritalw" size={36} />
          <div>
            <div className="muted">您好, Detritalw</div>
            <div className="muted">将使用 [离线登录] Detritalw 来登录 Minecraft</div>
          </div>
        </div>
        <div className="controls">
          <select className="version-select" aria-label="version-select">
            <option>1.21.8</option>
          </select>
          <Button appearance="primary">启动</Button>
        </div>
      </div>
    </div>
  )
}
