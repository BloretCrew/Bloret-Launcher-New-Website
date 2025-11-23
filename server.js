const express = require('express');
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');

const app = express();
const port = 3001; // 更改端口以避免冲突

// 用户访问记录中间件
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString('zh-CN');
  const ip = req.ip || req.connection.remoteAddress;
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${ip} ${method} ${url} - ${userAgent}`);
  next();
});

// 读取配置文件
function readConfig(){
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
}

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 开放整个 res 文件夹到 /res 路径
app.use('/res', express.static(path.join(__dirname, 'res')));

// 解析JSON请求体
app.use(express.json());

// 路由
app.get('/', (req, res) => {
  const config = readConfig();
  res.render('index', {
    title: 'Bloret Launcher - AI 驱动的 Minecraft 启动器',
    titles: config.titles,
    BLLatest: config.BLLatest,
    BLNewVersionDescription: config.BLNewVersionDescription,
    Description: config.Description,
    BetaVersion: config.Beta.version,
    BetaVersionName: config.Beta.versionName,
    BetaDescription: config.Beta.description,
    Beta: config.Beta,
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


// 测试背景图标的页面
app.get('/test-bg', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-background.html'));
});

// 新版本发布API
// app.post('/api/newversion/github', (req, res) => {
//   try {
//     const { key, beta, version, versionName, description } = req.body;
    
//     // 验证请求密钥
//     const config = readConfig();
//     if (key !== config.github_key) {
//       return res.status(401).json({ 
//         success: false, 
//         error: 'Invalid key' 
//       });
//     }
    
//     // 验证必填字段
//     if (!version || !versionName || !description) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Missing required fields: version, versionName, description' 
//       });
//     }
    
//     // 更新配置
//     if (beta) {
//       // 更新测试版配置
//       config.Beta = {
//         enabled: true,
//         version: version,
//         versionName: versionName,
//         description: description
//       };
//     } else {
//       // 更新正式版配置
//       config.BLLatest = version;
//       config.BLNewVersionDescription = description;
//       // 如果有正式版发布，可以选择禁用测试版
//       // config.Beta.enabled = false;
//     }
    
//     // 保存配置到文件
//     fs.writeFileSync(
//       path.join(__dirname, 'config.json'), 
//       JSON.stringify(config, null, 2),
//       'utf8'
//     );
    
//     res.json({ 
//       success: true, 
//       message: beta ? 'Beta version updated successfully' : 'Stable version updated successfully',
//       data: {
//         beta: beta,
//         version: version,
//         versionName: versionName,
//         description: description
//       }
//     });
    
//   } catch (error) {
//     console.error('Error updating version:', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Internal server error' 
//     });
//   }
// });