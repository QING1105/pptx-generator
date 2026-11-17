# Guizang Magazine Style Pack

> 来源: [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) Style A
> 电子杂志 × 电子墨水风格，AGPL-3.0
> 翻译为 PptxGenJS 坐标

---

## Theme Objects

### M1 · Ink Classic
```json
{ "primary": "0A0A0B", "secondary": "18181A", "accent": "0A0A0B", "light": "E8E5DE", "bg": "F1EFEA" }
```
- 杂志感最强，默认推荐

### M2 · Indigo Porcelain
```json
{ "primary": "0A1F3D", "secondary": "152A4A", "accent": "0A1F3D", "light": "E4E8EC", "bg": "F1F3F5" }
```
- 冷静理性，适合研究/数据

### M3 · Forest Ink
```json
{ "primary": "1A2E1F", "secondary": "253D2C", "accent": "1A2E1F", "light": "ECE7DA", "bg": "F5F1E8" }
```
- 自然/文化主题

### M4 · Kraft Paper
```json
{ "primary": "2A1E13", "secondary": "3A2A1D", "accent": "2A1E13", "light": "E0D0B6", "bg": "EEDFC7" }
```
- 温暖怀旧，人文主题

### M5 · Dune
```json
{ "primary": "1F1A14", "secondary": "2D2620", "accent": "1F1A14", "light": "E3D7BF", "bg": "F0E6D2" }
```
- 克制高级，设计/艺术

---

## 硬规则

1. **双色调** — 只用 primary(墨) + bg(纸) + light(纸色变体)，不用高亮 accent
2. **衬线标题** — 英文用 Georgia，中文用 Microsoft YaHei（无衬线替代）
3. **正文字体** — Calibri / Microsoft YaHei
4. **暖纸底色** — slide 背景用 `theme.bg`（不是纯白）
5. **直角或微小圆角** — `rectRadius: 0~0.03`
6. **大留白** — 页面不要填满，下半部留空
7. **禁止纯黑纯白** — 墨色和纸色都是微暖色调，不用 #000000 / #FFFFFF
8. **WebGL 流体背景** → 静态纯色 bg 替代（PPTX 不支持）

---

## Canvas Sizes

> **每个画布尺寸有独立的坐标表，不缩放。**视觉节奏（留白、字间距、图文密度）按尺寸独立调校。

### Canvas: 10"×5.625" (LAYOUT_16x9)

- **通用参数**：
  - 安全区：x:0.6"→9.4"，y:0.4"→5.0"
  - 字体：中文 `Microsoft YaHei`，英文标题 `Georgia`，英文正文 `Calibri`
  - slide 背景：`{ color: theme.bg }`

#### Cover
| 元素 | 坐标 | 字号 | 备注 |
|------|------|------|------|
| 大标题 | x:0.8, y:1.2, w:8.4 | 44-60 | `bold:false` |
| 副标/引子 | x:0.8, y:3.0 | 16 | `italic:true` |
| 元信息行 | x:0.8, y:4.8 | 11 | |
| hairline | x:0.8, y:2.8, w:2 | — | `width:1` |

#### Standard
| 元素 | 坐标 | 字号 | 备注 |
|------|------|------|------|
| kicker | x:0.6, y:0.4 | 11 | `bold:true, characterSpacing:2` |
| hairline | x:0.6, y:0.65, w:8.8 | — | `width:0.5` |
| 标题 | x:0.6, y:0.8 | 32-40 | `bold:false` |
| lead | x:0.6, y:2.0 | 14 | `italic:true` |
| 正文 | x:0.6, y:2.6 | 13 | |

#### Full-Image
| 元素 | 坐标 | 字号 |
|------|------|------|
| 图片区 | x:0.6, w:8.8, y:1.0, h:3.5 | — |
| caption | 图片下方 | 11 `italic:true` |

#### Quote
| 元素 | 坐标 | 字号 |
|------|------|------|
| 大引号 | — | 72 `opacity:30%` |
| 引用文字 | — | 24 `italic:true, 居中` |
| 出处 | — | 13 |

### Canvas: 13.33"×7.5" (WIDE)

- **通用参数**：
  - 安全区：x:0.9"→12.43"，y:0.5"→6.5"
  - 字体：同 10"×5.625"
  - slide 背景：`{ color: theme.bg }`

#### Cover
| 元素 | 坐标 | 字号 | 备注 |
|------|------|------|------|
| kicker | x:1.1, y:0.7 | 12 | `bold:true, characterSpacing:3` |
| 大标题 | x:1.1, y:1.8, w:11.1 | 54-66 | `bold:false, lineSpacingMultiple:1.12` |
| 副标/引子 | x:1.1, y:4.2 | 18 | `italic:true` |
| 元信息行 | x:1.1, y:6.0 | 13 | |
| hairline | x:1.1, y:3.9, w:3 | — | `width:1.2` |

#### Standard
| 元素 | 坐标 | 字号 | 备注 |
|------|------|------|------|
| kicker | x:0.9, y:0.5 | 12 | `bold:true, characterSpacing:2` |
| hairline | x:0.9, y:0.85, w:11.53 | — | `width:0.5` |
| 标题 | x:0.9, y:1.1 | 36-44 | `bold:false` |
| lead | x:0.9, y:2.4 | 16 | `italic:true` |
| 正文 | x:0.9, y:3.0 | 14 | |

#### Full-Image
| 元素 | 坐标 | 字号 |
|------|------|------|
| 图片区 | x:0.9, w:11.53, y:1.2, h:4.5 | — |
| caption | 图片下方 | 12 `italic:true` |

#### Quote
| 元素 | 坐标 | 字号 |
|------|------|------|
| 大引号 | — | 84 `opacity:30%` |
| 引用文字 | — | 28 `italic:true, 居中` |
| 出处 | — | 15 |

#### Data Grid (2×2 / 3×2)
| 元素 | 坐标 | 字号 |
|------|------|------|
| 标题 | x:0.9, y:1.1 | 32-38 |
| 单格 | w:5.5, h:2.0, gap:0.4 | — |
| 格内标签 | — | 12 `bold:true` |
| 格内文字 | — | 11 |

#### Flowchart (横向 4 节点)
| 元素 | 坐标 | 字号 |
|------|------|------|
| 节点宽 | w:2.5, gap:0.45 | — |
| 节点起始 x | `(13.33 - 4*2.5 - 3*0.45) / 2 = 0.99` | — |
| 节点内标题 | — | 14 `bold:true, align:center` |
| 节点内正文 | — | 11 `align:center` |
| 箭头 | gap 区间 | 20 `align:center` |

---

## 不支持的 guizang 特性
- WebGL shader 流体背景 → 纯色 bg 替代
- Motion One 翻页动画 → 静态
- `letter-spacing` 收紧 → 不翻译
- ASCII 噪点纹理 → 不翻译
