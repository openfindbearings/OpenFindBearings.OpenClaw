# OpenFindBearings.OpenClaw

OpenClaw 插件，用于轴承型号搜索和查询。

## 功能

- **轴承搜索**：按型号关键词、品牌、尺寸范围搜索轴承
- **型号查询**：精确查询轴承详情（尺寸、载荷、转速等）
- **热门推荐**：获取热门轴承列表

## 快速开始

### 安装依赖

```bash
cd src
npm install
```

### 构建

```bash
npm run build
```

### 安装到 OpenClaw

将 `openclaw.plugin.json` 和 `src/dist/` 目录配置到 OpenClaw 插件路径。

## 项目结构

```
.
├── openclaw.plugin.json    # 插件配置
├── src/                    # TypeScript 源码
│   ├── index.ts           # 插件入口
│   └── package.json
├── skills/                 # Claude Code Skill
│   └── bearing-search/
├── data/                   # 静态数据
│   ├── models/
│   └── brands/
└── CLAUDE.md              # 开发文档
```

## Tools

| Tool | 描述 |
|------|------|
| `bearing_search` | 搜索轴承产品 |
| `bearing_get_by_part` | 按精确型号查询 |
| `bearing_hot` | 热门轴承推荐 |

## 许可证

MIT
