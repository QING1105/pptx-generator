# Guizang Swiss Style Pack

> 来源: [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) Style B
> 瑞士国际主义风格，AGPL-3.0
> 翻译为 PptxGenJS 坐标

---

## 坐标映射公式

| HTML (vw/vh, 100vw×100vh) | PptxGenJS (10"×5.625") |
|---|---|
| `Xvw` | `X × 0.1"` |
| `Yvh` | `Y × 0.05625"` |
| `min(Xvw, Yvh)` 字号 | `min(X×9.6, Y×9.6)` pt（按 1280×720 估算） |
| `repeat(16, 1fr)` | 16 列，每列 `0.625"` |

canvas-card 默认 padding：`5.6vh 5vw 4.4vh` → `top:0.315" left:0.5" right:0.5" bottom:0.2475"`

---

## Theme Objects

### S1 · IKB Blue
```json
{ "primary": "0A0A0A", "secondary": "737373", "accent": "002FA7", "light": "F0F0EE", "bg": "FAFAF8" }
```
- Full-bleed accent 页用 `accent` 做 slide 背景，文字反白

### S2 · Lemon Yellow
```json
{ "primary": "0A0A0A", "secondary": "737373", "accent": "FFD500", "light": "F0F0EE", "bg": "FAFAF8" }
```
- accent 上文字必须用 `primary`（黑），不用白

### S3 · Lemon Green
```json
{ "primary": "0A0A0A", "secondary": "737373", "accent": "C5E803", "light": "F0F0EE", "bg": "FAFAF8" }
```
- 同上，accent 上文字用黑

### S4 · Safety Orange
```json
{ "primary": "0A0A0A", "secondary": "737373", "accent": "FF6B35", "light": "F0F0EE", "bg": "FAFAF8" }
```
- 白字加粗 `bold:true`

---

## 硬规则（违反即废）

1. **纯色** — 所有 fill 用纯色，禁止渐变
2. **直角** — `rectRadius: 0`，不用 ROUNDED_RECTANGLE
3. **无阴影** — 不使用 shadow 属性
4. **无透明度** — 不使用 transparency
5. **1px 发丝线** — `line: { color: theme.light, width: 0.5 }`
6. **字重倒挂** — 大字细（ExtraLight），小字粗。PptxGenJS 用 `fontSize` 控制：≥36pt → `bold:false`；≤18pt → `bold:true`
7. **单一 accent 色** — 一套 deck 只用一个 accent，不混色
8. **大标题左对齐** — 不放中间
9. **禁止标题下划线** — 不用 accent line 装饰标题

---

## Canvas Sizes

> **每个画布尺寸有独立的坐标表，不缩放。** 瑞士风格在不同尺寸下视觉密度独立调校。

### Canvas: 10"×5.625" (LAYOUT_16x9)

- **通用参数**：
  - 安全区：x:0.5"→9.5"，y:0.315"→5.1"（避开底部 nav 区 y>5.3"）
  - 字体：中文 `Microsoft YaHei`，英文 `Arial`（Inter/Helvetica 替代）
  - body 背景：`slide.background = { color: theme.bg }`

#### Cover（accent 满屏）
| 元素 | 坐标 | 字号 | 备注 |
|------|------|------|------|
| slide bg | — | — | `{ color: theme.accent }` |
| 主标题 | x:0.5, y:1.5, w:9 | 48–72 | `bold:false, color:theme.bg` |
| 副标 | x:0.5, y:3.0, w:9 | 18 | `color:theme.light` |
| 页脚 | x:0.5, y:4.8 | 12 | `color:theme.light` |

#### Standard
| 元素 | 坐标 | 字号 | 备注 |
|------|------|------|------|
| kicker | x:0.5, y:0.315 | 12 | `bold:true, color:theme.secondary` |
| 页码 | x:9.3, y:0.315 | 12 | `align:right, color:theme.secondary` |
| hairline | x:0.5, y:0.6, w:9 | — | `width:0.5, color:theme.light` |
| 主标题 | x:0.5, y:0.75 | 28–40 | `bold:false, color:theme.primary` |
| 正文区 | y:1.8→5.0 | — | 可用 2/3/4 列 grid |

#### Grid
| 列数 | col 宽 | gap |
|------|--------|-----|
| 2 列 | 4.3 | 0.4 |
| 3 列 | 2.8 | 0.3 |
| 4 列 | 2.05 | 0.2 |

#### KPI
| 元素 | 字号 | 备注 |
|------|------|------|
| 大数字 | 60–84 | `bold:false, color:theme.accent, 居中` |
| 标签 | 14 | `bold:true, color:theme.secondary, 数字下方` |

#### Ink 反转块
| 元素 | 备注 |
|------|------|
| 背景 | `fill: { color: theme.primary }, rectRadius: 0` |
| 文字 | `color: theme.bg` |

### Canvas: 13.33"×7.5" (WIDE)

- **通用参数**：
  - 安全区：x:0.7"→12.63"，y:0.42"→6.8"
  - 字体：同 10"×5.625"
  - body 背景：`slide.background = { color: theme.bg }`

#### Cover（accent 满屏）
| 元素 | 坐标 | 字号 | 备注 |
|------|------|------|------|
| slide bg | — | — | `{ color: theme.accent }` |
| 主标题 | x:0.7, y:2.0, w:11.93 | 60–84 | `bold:false, color:theme.bg` |
| 副标 | x:0.7, y:4.0, w:11.93 | 22 | `color:theme.light` |
| 页脚 | x:0.7, y:6.2 | 14 | `color:theme.light` |

#### Standard
| 元素 | 坐标 | 字号 | 备注 |
|------|------|------|------|
| kicker | x:0.7, y:0.42 | 14 | `bold:true, color:theme.secondary` |
| 页码 | x:12.3, y:0.42 | 14 | `align:right, color:theme.secondary` |
| hairline | x:0.7, y:0.8, w:11.93 | — | `width:0.5, color:theme.light` |
| 主标题 | x:0.7, y:1.0 | 36–48 | `bold:false, color:theme.primary` |
| 正文区 | y:2.2→6.5 | — | 可用 2/3/4 列 grid |

#### Grid
| 列数 | col 宽 | gap |
|------|--------|-----|
| 2 列 | 5.7 | 0.5 |
| 3 列 | 3.7 | 0.4 |
| 4 列 | 2.7 | 0.3 |

#### KPI
| 元素 | 字号 | 备注 |
|------|------|------|
| 大数字 | 72–96 | `bold:false, color:theme.accent, 居中` |
| 标签 | 16 | `bold:true, color:theme.secondary, 数字下方` |

#### Ink 反转块
| 元素 | 备注 |
|------|------|
| 背景 | `fill: { color: theme.primary }, rectRadius: 0` |
| 文字 | `color: theme.bg` |

---

## 不支持的 guizang 特性（PPTX 限制）
- WebGL ASCII 背景 → 用纯色 accent 替代
- Motion One 入场动画 → 静态，动画不翻译
- CSS `letter-spacing:-.04em` → 不翻译，PptxGenJS 不支持
- SVG mask（dot-mat/ring-mat） → 用几何形状近似
