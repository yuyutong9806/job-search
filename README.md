# 秋招信息汇总网站

一个现代化的秋季校园招聘信息管理平台。

## 功能特性

### 📊 首页仪表板
- 快速查看招聘统计信息
- 公司总数、开放职位数、收藏数量

### 🏢 公司列表
- 浏览所有招聘公司信息
- 按公司名称或职位名称搜索
- 按行业筛选公司
- 查看职位详情和截止日期
- 添加、删除或修改公司信息

### ⏰ 招聘时间表
- 按截止日期排序的时间轴视图
- 显示距离截止日期的剩余天数
- 快速掌握招聘节奏

### ❤️ 我的收藏
- 收藏感兴趣的公司
- 快速访问重要的职位信息
- 支持批量清空操作

## 功能亮点

✨ **完全本地存储** - 所有数据保存在浏览器本地存储，无需后端服务器
✨ **响应式设计** - 完美支持桌面、平板和手机设备
✨ **实时搜索和筛选** - 快速找到感兴趣的公司和职位
✨ **数据持久化** - 关闭浏览器后数据仍然保留
✨ **简洁易用** - 直观的用户界面，上手即用

## 快速开始

### 本地开发

```bash
# 方式1: 使用 Python 内置服务器
python3 -m http.server 8000 --directory public

# 方式2: 使用 Node.js
npx http-server public

# 方式3: 使用 Live Server (VS Code 扩展)
# 右键点击 public/index.html 选择 "Open with Live Server"
```

然后访问 `http://localhost:8000`

### 部署到 Netlify

#### 方式1: 通过 GitHub (推荐)

1. 创建 GitHub 仓库
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/recruitment-hub.git
git branch -M main
git push -u origin main
```

2. 登录 [Netlify](https://app.netlify.com)
3. 点击 "New site from Git"
4. 选择 GitHub 仓库
5. 配置：
   - Build command: `echo 'Static site - no build needed'`
   - Publish directory: `public`
6. 点击 "Deploy site"

#### 方式2: 直接拖拽部署

1. 登录 [Netlify](https://app.netlify.com)
2. 将 `public` 文件夹直接拖拽到 Netlify
3. 等待部署完成

#### 方式3: 使用 Netlify CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod --dir=public
```

## 项目结构

```
recruitment-hub/
├── public/                 # 发布目录
│   ├── index.html         # 主页面
│   ├── css/
│   │   └── styles.css     # 样式文件
│   └── js/
│       └── script.js      # 脚本文件
├── src/                   # 源文件（可选，用于存储原始文件）
│   ├── css/
│   ├── js/
│   └── data/
├── docs/                  # 文档目录
├── package.json           # 项目配置
├── netlify.toml          # Netlify 配置
├── .gitignore            # Git 忽略文件
└── README.md             # 项目说明
```

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计和响应式布局
- **JavaScript (ES6+)** - 业务逻辑和交互
- **LocalStorage** - 本地数据存储

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 其他现代浏览器

## 功能使用指南

### 添加公司信息
1. 进入"公司列表"页面
2. 点击"+ 添加公司"按钮
3. 填写公司信息（名称、行业、职位、截止日期等）
4. 点击"保存"

### 搜索和筛选
- 使用搜索框按公司名称或职位搜索
- 使用行业筛选器按行业分类
- 支持实时搜索和多条件组合

### 收藏公司
- 点击公司卡片上的"☆ 收藏"按钮
- 已收藏的公司会显示"★ 已收藏"
- 在"我的收藏"页面查看所有收藏的公司

### 查看时间表
- 在"时间表"页面查看所有有截止日期的职位
- 按截止日期自动排序
- 显示距离截止日期的剩余天数

## 数据备份和导出

你可以通过浏览器的开发者工具导出数据：

1. 打开浏览器开发者工具 (F12)
2. 进入 Console 标签
3. 运行命令：`JSON.stringify(app.companies)`
4. 复制输出的数据并保存为 JSON 文件

或使用以下命令进行 JSON 格式的备份：
```javascript
// 导出数据
const data = {
  companies: app.companies,
  favorites: [...app.favorites]
};
console.log(JSON.stringify(data, null, 2));

// 导入数据
app.companies = data.companies;
app.favorites = new Set(data.favorites);
app.saveData();
```

## 扩展功能建议

- [ ] 支持导入/导出 JSON 数据
- [ ] 支持导出为 Excel
- [ ] 添加提醒功能（截止日期提醒）
- [ ] 支持多个浏览器标签页同步
- [ ] 添加公司评分和评论功能
- [ ] 支持本地文件保存
- [ ] 添加暗黑模式
- [ ] 多语言支持

## 许可证

MIT License

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 常见问题

**Q: 我的数据会丢失吗？**
A: 不会。所有数据都保存在浏览器的 LocalStorage 中，除非你清除浏览器缓存，否则数据会一直保留。

**Q: 支持多设备同步吗？**
A: 目前不支持，但可以通过导出/导入 JSON 数据实现跨设备同步。

**Q: 如何在手机上使用？**
A: 网站完全响应式，在手机浏览器中打开相同的网址即可使用。

**Q: 可以离线使用吗？**
A: 目前需要网络连接，但可以通过添加 Service Worker 实现离线功能。

## 联系方式

有任何问题或建议，欢迎提交 Issue。
