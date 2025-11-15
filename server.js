const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001; // 更改端口以避免冲突

// 读取配置文件
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Bloret Launcher - AI 驱动的 Minecraft 启动器',
    titles: config.titles,
    BLLatest: config.BLLatest,
    backgroundIcons: config.backgroundIcons || []
  });
});

// 启动服务器
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// 错误处理
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is already in use, trying ${port + 1}`);
    setTimeout(() => {
      server.close();
      app.listen(port + 1, () => {
        console.log(`Server is running at http://localhost:${port + 1}`);
      });
    }, 1000);
  } else {
    console.error(err);
  }
});
app.get('/Windows11.png', (req, res) => {
  const filePath = path.join(__dirname, 'Windows11.png');
  res.sendFile(filePath);
});

app.get('/BLlight.png', (req, res) => {
  const filePath = path.join(__dirname, 'BLlight.png');
  res.sendFile(filePath);
});

app.get('/BL.png', (req, res) => {
  const filePath = path.join(__dirname, 'BL.png');
  res.sendFile(filePath);
});

// 添加 res/icons 路径的路由
app.get('/res/icons/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'res', 'icons', req.params.filename);
  res.sendFile(filePath);
});

// 测试背景图标的页面
app.get('/test-bg', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-background.html'));
});