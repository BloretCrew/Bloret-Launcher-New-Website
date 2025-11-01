import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Select } from '@fluentui/react-components'
import ProgressBar from '../components/ProgressBar'

type VersionItem = {
  id: string
  title: string
  subtitle?: string
  progress: number
  status: 'idle' | 'downloading' | 'paused' | 'installed'
}

const initialVersions: VersionItem[] = [
  { id: '1', title: 'Bloret 1.21.8', subtitle: '稳定版 • 推荐', progress: 0, status: 'idle' },
  { id: '2', title: 'Bloret 1.21.7', subtitle: '历史版本', progress: 0, status: 'idle' },
]

export default function Download() {
  const [versions, setVersions] = useState<VersionItem[]>(initialVersions)
  const timers = useRef<Record<string, number>>({})

  useEffect(() => {
    return () => {
      // cleanup timers
      Object.values(timers.current).forEach((id) => window.clearInterval(id))
    }
  }, [])

  function startDownload(id: string) {
    setVersions((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'downloading' } : v)))

    if (timers.current[id]) return

    timers.current[id] = window.setInterval(() => {
      setVersions((prev) =>
        prev.map((v) => {
          if (v.id !== id) return v
          const next = Math.min(100, v.progress + Math.floor(Math.random() * 10) + 5)
          if (next >= 100) {
            // finish
            window.clearInterval(timers.current[id])
            delete timers.current[id]
            return { ...v, progress: 100, status: 'installed' }
          }
          return { ...v, progress: next }
        }),
      )
    }, 800)
  }

  function pauseDownload(id: string) {
    setVersions((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'paused' } : v)))
    if (timers.current[id]) {
      window.clearInterval(timers.current[id])
      delete timers.current[id]
    }
  }

  function cancelDownload(id: string) {
    pauseDownload(id)
    setVersions((prev) => prev.map((v) => (v.id === id ? { ...v, progress: 0, status: 'idle' } : v)))
  }

  return (
    <div className="flex-col">
      <div className="titleRow">
        <div className="windowTitle">下载</div>
      </div>

      <div className="two-col">
        <section className="left">
          <fluent-card className="card">
            <div className="row">
              <div>
                <h3>可用版本</h3>
                <div className="muted">选择并安装你想要的版本</div>
              </div>
              <fluent-button appearance="accent">刷新</fluent-button>
            </div>

            <div className="version-list mt12">
              {versions.map((v) => (
                <div key={v.id} className="version-item card">
                  <div className="row">
                    <div>
                      <div className="muted" style={{ fontWeight: 600 }}>
                        {v.title}
                      </div>
                      <div className="muted">{v.subtitle}</div>
                    </div>

                    <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                      <ProgressBar value={v.progress} />
                      {v.status === 'idle' && (
                        <Button appearance="primary" onClick={() => startDownload(v.id)}>
                          安装
                        </Button>
                      )}
                      {v.status === 'downloading' && (
                        <>
                          <Button appearance="primary" onClick={() => pauseDownload(v.id)}>
                            暂停
                          </Button>
                          <Button appearance="subtle" onClick={() => cancelDownload(v.id)}>
                            取消
                          </Button>
                        </>
                      )}
                      {v.status === 'paused' && (
                        <>
                          <Button appearance="primary" onClick={() => startDownload(v.id)}>
                            继续
                          </Button>
                          <Button appearance="subtle" onClick={() => cancelDownload(v.id)}>
                            取消
                          </Button>
                        </>
                      )}
                      {v.status === 'installed' && (
                        <Button appearance="subtle">打开</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </fluent-card>
        </section>

        <aside className="right">
          <Card className="card">
            <h3>版本详情</h3>
            <p className="muted">选择一个版本查看详情：发布说明、文件大小、依赖等（示例）。</p>

            <div className="mt12">
              <div className="muted">下载方式</div>
              <Select className="mt8" defaultValue="bloret">
                <option value="bloret">Bloret Launcher</option>
                <option value="cmcl">CMCL</option>
              </Select>
            </div>

            <div className="mt12">
              <Button appearance="primary">开始下载</Button>
              <Button appearance="subtle">打开文件夹</Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
