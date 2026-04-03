# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenFindBearings.OpenClaw 是一个轴承型号和品牌搜索的 AI Skill 项目。提供轴承相关的查询、解析和选型支持。

## Project Structure

```
.
├── skills/                          # AI Skills 目录
│   └── bearing-search/              # 轴承搜索 Skill
│       ├── SKILL.md                 # Skill 定义文件
│       ├── scripts/                 # 工具脚本
│       │   └── search_model.py      # 型号搜索脚本
│       └── references/              # 参考文档
│           ├── data-structure.md    # 数据结构设计
│           ├── model-codes.md       # 型号编码规则
│           └── brands.md            # 品牌参考信息
│
├── data/                            # 数据文件
│   ├── models/                      # 轴承型号数据
│   │   └── deep_groove.json         # 深沟球轴承数据
│   └── brands/                      # 品牌信息数据
│       ├── skf.json                 # SKF 品牌信息
│       └── nsk.json                 # NSK 品牌信息
│
├── src/                             # 源代码（待开发）
├── README.md
├── LICENSE
└── CLAUDE.md                        # 本文件
```

## Key Architecture

### Skill 系统

项目位于 `skills/bearing-search/`，遵循 Claude Code Skill 规范：
- `SKILL.md`：Skill 入口文件，包含元数据和功能描述
- `scripts/`：可执行脚本，用于具体查询任务
- `references/`：参考资料，按需加载到上下文

### 数据架构

数据与代码分离，存储在 `data/` 目录：
- `data/models/`：按轴承类型分类的 JSON 数据文件
- `data/brands/`：各品牌信息 JSON 文件

数据格式规范见 `skills/bearing-search/references/data-structure.md`

## Common Commands

### 搜索轴承型号

```bash
python skills/bearing-search/scripts/search_model.py 6204
python skills/bearing-search/scripts/search_model.py 6204-2RS
```

### 添加新型号数据

编辑 `data/models/` 下对应的 JSON 文件，遵循现有数据格式。

## Development Notes

- Skill 设计采用**渐进式披露**原则：SKILL.md 保持精简，详细信息放在 references/
- 型号数据采用 JSON 格式，便于程序读取和人工编辑
- 品牌对照表支持多品牌型号转换（SKF ↔ NSK ↔ FAG 等）

## Future Work

- [ ] 添加更多轴承类型数据（圆柱滚子、圆锥滚子、角接触等）
- [ ] 开发品牌搜索脚本
- [ ] 开发型号对照转换工具
- [ ] 添加选型推荐算法
