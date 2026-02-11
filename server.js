const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const favicon = require('serve-favicon');

const app = express();
const port = 3000; // HTTP port
const httpsPort = 3001; // HTTPS port

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

// 添加HTTP到HTTPS重定向中间件（必须在其他中间件之前）
app.use((req, res, next) => {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host').replace(':' + port, ':' + httpsPort) + req.url);
  }
  next();
});

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

// 开放整个 .well-known 文件夹到 /.well-known 路径
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

// 开放 dbtest 文件夹到 /dbtest 路径
app.use('/dbtest', express.static(path.join(__dirname, 'dbtest')));

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
app.get('/spr_activity', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'spr_activity.html'));
});

// 启动HTTPS服务器
const httpsServer = https.createServer(sslOptions, app).listen(httpsPort, () => {
  console.log(`HTTPS Server is running at https://localhost:${httpsPort}`);
});

// 启动HTTP服务器（重定向到HTTPS）
const httpServer = app.listen(port, () => {
  console.log(`HTTP Server is running at http://localhost:${port} (redirecting to HTTPS)`);
});

// 错误处理
httpsServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${httpsPort} is already in use, trying ${httpsPort + 1}`);
    setTimeout(() => {
      httpsServer.close();
      https.createServer(sslOptions, app).listen(httpsPort + 1, () => {
        console.log(`HTTPS Server is running at https://localhost:${httpsPort + 1}`);
      });
    }, 1000);
  } else {
    console.error(err);
  }
});

httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is already in use, trying ${port + 1}`);
    setTimeout(() => {
      httpServer.close();
      app.listen(port + 1, () => {
        console.log(`HTTP Server is running at http://localhost:${port + 1}`);
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

// 获取 Bloret Launcher 配置信息的 API
app.get('/api/info', (req, res) => {
  try {
    const config = readConfig();
    
    // 构建测试版信息
    let betaInfo;
    if (config.Beta.enabled){
      console.log('Beta version is enabled:', config.Beta.version);
      betaInfo = {
        enabled: true,
        version: config.Beta.version,
        versionName: config.Beta.versionName,
        description: config.Beta.description
      };
    } else {
      betaInfo = { enabled: false };
    }

    // 构建下载地址信息
    let downloads = {};
    
    // 正式版下载地址
    if (config.BLLatest) {
      downloads.stable = {
        gitcode: {
          exe: `https://gitcode.com/Bloret/Bloret-Launcher-Setup/releases/download/26R/Bloret-Launcher-Setup.exe`,
          zip: `https://gitcode.com/Bloret/Bloret-Launcher/releases/download/${config.BLLatest}/Bloret-Launcher-Windows.zip`
        },
        github: {
          exe: `https://github.com/BloretCrew/Bloret-Launcher-Setup/releases/latest/download/Bloret-Launcher-Setup.exe`,
          zip: `https://github.com/BloretCrew/Bloret-Launcher/releases/latest/download/Bloret-Launcher-Windows.zip`
        }
      };
    }
    
    // 测试版下载地址
    if (config.Beta.enabled && config.Beta.version) {
      downloads.beta = {
        gitcode: {
          exe: `https://gitcode.com/Bloret/Bloret-Launcher/releases/download/${config.Beta.version}/Bloret-Launcher-Setup.exe`,
          zip: `https://gitcode.com/Bloret/Bloret-Launcher/releases/download/${config.Beta.version}/Bloret-Launcher-Windows.zip`
        },
        github: {
          exe: `https://github.com/BloretCrew/Bloret-Launcher/releases/download/${config.Beta.version}/Bloret-Launcher-Setup.exe`,
          zip: `https://github.com/BloretCrew/Bloret-Launcher/releases/download/${config.Beta.version}/Bloret-Launcher-Windows.zip`
        }
      };
    }

    const blInfo = {
      latestVersion: config.BLLatest,
      description: config.Description,
      newVersionDescription: config.BLNewVersionDescription,
      beta: betaInfo,
      downloads: downloads,
      BLTips: config.BLTips || [],
      activity: config.activity
    };
    
    res.json(blInfo);
    
  } catch (error) {
    console.error('Error reading config for /api/info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to read configuration',
      message: error.message
    });
  }
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