# SSL/HTTPS 设置指南

## 概述
已添加 SSL/HTTPS 支持来修复 WebKit 的安全连接错误。服务器现在支持同时运行 HTTP 和 HTTPS，并自动将 HTTP 请求重定向到 HTTPS。

## 文件修改

### 新增文件
- `server.key` - SSL 私钥（自签名）
- `server.cert` - SSL 证书（自签名）

### 修改文件
- `server.js` - 添加了 HTTPS 支持

## 技术细节

### 端口配置
- **HTTP 端口**: 3001（重定向到 HTTPS）
- **HTTPS 端口**: 3443

### 功能特性
1. **双协议支持**: 同时运行 HTTP 和 HTTPS 服务器
2. **自动重定向**: HTTP 请求自动重定向到 HTTPS
3. **错误处理**: 如果端口被占用，自动升级到下一个可用端口
4. **自签名证书**: 开发环境使用自签名证书

## 用法

### 启动服务器
```bash
npm start
```

服务器输出示例：
```
HTTP Server is running at http://localhost:3001 (redirecting to HTTPS)
HTTPS Server is running at https://localhost:3443
```

### 访问应用
- HTTPS（推荐）: `https://localhost:3443`
- HTTP（自动重定向）: `http://localhost:3001` → `https://localhost:3443`

## 浏览器提示

访问时浏览器可能显示"安全连接警告"，因为这是自签名证书。这在开发环境中是正常的。

### Chrome/Edge
1. 点击"继续前往"或"高级"
2. 点击"继续前往 localhost"

### Firefox
1. 点击"接受风险并继续"

## 生产环境配置

在生产环境中，应该：
1. 使用由受信任的证书颁发机构（CA）签名的证书
2. 更新 `sslOptions` 中的证书路径
3. 建议配置使用环境变量：

```javascript
const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || 'server.key'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || 'server.cert')
};
```

## 故障排除

### 证书相关错误
如果看到 `ENOENT: no such file or directory, open 'server.key'`：
```bash
# 重新生成自签名证书
openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365 -subj "/CN=localhost"
```

### 端口占用错误
如果 3001 或 3443 被占用，服务器会自动使用下一个可用端口。检查控制台输出找到实际的运行端口。

## WebKit 兼容性
HTTPS 支持修复了 WebKit 无法建立安全连接的问题，确保应用在所有支持 HTTPS 的浏览器中正常运行。
