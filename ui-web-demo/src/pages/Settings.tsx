import React from 'react'
import { Button, Input } from '@fluentui/react-components'

export default function Settings(){
  return (
    <div className="flex-col">
      <div className="titleRow">
        <div className="windowTitle">设置</div>
      </div>

      <div className="card">
        <h3>常规设置</h3>
        <div className="mt8">
          <label className="muted">启动参数</label>
          <Input className="mt8" placeholder="例如: -Xmx2G -Dexample=true" />
        </div>

        <div className="mt8">
          <label className="muted">游戏目录</label>
          <Input className="mt8" placeholder="例如: /Users/you/.minecraft" />
        </div>

        <div className="mt12 settings-actions">
          <Button appearance="primary">保存</Button>
          <Button appearance="subtle">重置</Button>
        </div>
      </div>
    </div>
  )
}
