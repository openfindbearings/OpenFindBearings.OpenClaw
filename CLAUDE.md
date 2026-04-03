# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenFindBearings.OpenClaw 是一个轴承型号和品牌搜索的 OpenClaw 插件项目。提供轴承相关的查询、解析和选型支持。

## Project Structure

```
.
├── openclaw.plugin.json             # OpenClaw 插件配置文件
├── src/                             # TypeScript 源代码
│   ├── index.ts                     # 插件入口，注册 Tools
│   ├── package.json                 # npm 配置
│   ├── tsconfig.json                # TypeScript 配置
│   └── @types/
│       └── openclaw-plugin-sdk.d.ts # SDK 类型定义
│
├── skills/                          # Claude Code Skills（文档/知识库）
│   └── bearing-search/
│       ├── SKILL.md
│       ├── scripts/search_model.py
│       └── references/
│           ├── data-structure.md
│           ├── model-codes.md
│           └── brands.md
│
├── data/                            # 静态数据
│   ├── models/deep_groove.json
│   └── brands/
│       ├── skf.json
│       └── nsk.json
│
├── README.md
├── LICENSE
└── CLAUDE.md
```

## Key Architecture

### OpenClaw 插件系统

插件基于 OpenClaw SDK，暴露三个主要工具：

| Tool | 用途 |
|------|------|
| `bearing_search` | 按条件搜索轴承（型号、品牌、尺寸范围） |
| `bearing_get_by_part` | 按精确型号查询详情 |
| `bearing_hot` | 获取热门轴承推荐 |

数据源：后端 API (https://api.515813.xyz/api/)

### Skills（知识库）

`skills/bearing-search/` 包含轴承相关的参考资料：
- 型号编码规则文档
- 品牌对照表
- 本地搜索脚本（离线使用）

## Common Commands

### 构建插件

```bash
cd src
npm install
npm run build
```

### 本地型号搜索（离线）

```bash
python skills/bearing-search/scripts/search_model.py 6204
```

## Tool Parameters

### bearing_search

- `keyword`: 型号或品牌关键词
- `partNumber`: 精确型号
- `min/maxInnerDiameter`: 内径范围 (mm)
- `min/maxOuterDiameter`: 外径范围 (mm)
- `min/maxWidth`: 宽度范围 (mm)
- `brandId`: 品牌 ID
- `bearingTypeId`: 轴承类型 ID
- `page`/`pageSize`: 分页

### bearing_get_by_part

- `partNumber`: 精确型号（如 6205-2RS）

### bearing_hot

- `count`: 返回数量
