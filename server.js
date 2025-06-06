// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // 使用 Railway 提供的端口，或默认 3000

// 设置 Express 服务静态文件：从当前目录提供你的 HTML, CSS, JS
app.use(express.static(path.join(__dirname)));

// 对于所有其他路由，都返回 index.html （适合单页应用）
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器并监听指定端口
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
