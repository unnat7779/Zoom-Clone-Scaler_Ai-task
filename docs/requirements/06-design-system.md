# 06 — Design System: components, states, tokens (agent `ds`)

**Scope:** every reusable visual primitive in Zoom Workplace web (`app.zoom.us/wc/*`): the five button families, form controls, overlays (tooltip, popover, menu, dialog, toast), feedback (banner, badge, tag, avatar, presence, skeleton, spinner, scrollbar), the type, spacing, radius, shadow and z-index scales, motion, focus rules and breakpoints.
**Captured:** 2026-10-07, PWA build `web_client_pwa/7.2.0.3239`, 1366×768, light theme. The dark column comes from Zoom's own dark tokens (`.zoom-theme--dark` / `.common-header-theme--dark` / `.prism-dark`). No dark page was rendered.
**Method:** I downloaded every stylesheet the page loads. That includes the CSS-in-JS sheets, which have no URL, so I read them from `document.styleSheets` (see §1). I parsed them with a script that resolves `var()` chains against the token tables, and checked them against live `getComputedStyle` reads on the header, home, Meetings tab, Join modal, New-meeting popover, profile menu and tooltip.
**Legend:** [M] = read from production CSS or the live DOM. [D] = inferred or recommended. Colours are `#RRGGBB` or `#RRGGBBAA`. "→" means "resolves to". "dk" means the dark-theme value.
**Companion file:** `docs/requirements/06-tokens.css` (paste-ready custom properties: 973 lines, light theme plus a dark override block).

---

## 0. Corrections to PRD.md

| PRD § | PRD says | Measured [M] |
|---|---|---|
| 5.2 / 5.2.1 | One token set. `--zoom-color-text-stronger-neutral #222325` is "primary text". | **There are two token systems on the page.** **zoom-ui** (`--zoom-color-*`, used by the header, profile menu, calendar widget and promo widgets) uses `#222325`. **Prism** (React, `.prism-light`, used by the Join modal, New-meeting popover, tooltips, Admin Center and the Activity bell) uses unprefixed tokens where `--text-stronger-neutral` and `--icon-stronger-neutral` are **`#2A2B2D`**. Prism also has 48 tokens with no same-named zoom-ui token (`--fill-subtle-*`, `--text-inverse-*`, `--component-input-border #C1C6CE`, file-type colours, …). Where the names match, the real value differences are `--text-stronger-neutral` and `--icon-stronger-neutral` (`#2A2B2D` vs `#222325`), `--fill-elevated-stronger` (`#FFFFFFE5` vs `#FFFFFFF2`), `--border-success` (`#48AD67` vs `#4BAD67`) and `--state-subtle-warning-*` (`#B36200xx` vs `#B26200xx`). Use `#2A2B2D` for text inside tooltips and popovers; use `#222325` elsewhere. |
| 5.3 Motion [D] | Popovers and menus fade and scale in 120 ms ease-out. Tab hover bg animates over 150 ms. Header/toolbar slide over 200 ms. | **Prism popper (tooltip, popover):** `opacity .3s cubic-bezier(.4,0,.2,1)`, no scale. **zoom-ui tooltip / info-popover:** `opacity .2s, transform .2s cubic-bezier(.4,0,.2,1)`, from `scale(0)` and `opacity 0`. **Dialogs:** keyframe `fade-in-linear-in .3s`, which is opacity 0→1 plus `translateY(-20px)`→0. **Left-rail tab hover has no transition** (instant); only `transform .3s ease` is used, for drag-reorder. **Home action buttons:** `transform .15s ease, box-shadow .15s ease`. Full list in §2.5. |
| 5.3 Focus | `outline: 2px solid #4B96F1; outline-offset: 2px` on `:focus-visible`. | Three models coexist. (1) **PWA global:** `:focus{outline:2px solid #2D8CFF;outline-offset:1px}`, suppressed by `[data-whatintent=mouse] :focus{outline:none!important}` (the what-input library). (2) **Prism:** `2px solid #4B96F1`, offset 2px, only under `body.prism-navigation-with-keyboard`. (3) **zoom-ui:** `2px solid #4B96F1` under `.is-vue3-keyboard-event`. Buttons add `outline-offset:2px`; inputs and select use an **inset box-shadow** instead. Recommended clone rule: §2.6. |
| 5.3 Radii | "popover 10px" | Prism Popover radius **10** (New-meeting popover). zoom-ui floating menus (profile menu) radius **12**. zoom-ui popover container **16**, complex popover **24**. Prism tooltip **4**. |
| 5.4 Button / secondary | Hover bg is `#6E76801F` over `#F1F4F6` [D]. | Hover **replaces** the background with `#6E76801F` (translucent; on white it reads as `#EDEEEF`). Label → `#0C60C8`. Active: bg `#6E76806B`, label `#084085`. Disabled: bg `#ADB1B840`, label `#ADB1B8`. Same for zoom-ui, common-header, monetization-widgets and Prism `prism-3`. |
| 5.4 Button / primary | No loading or focus state. | Loading keeps the resting colours on hover and active (`.is-loading` / `.prism-Button-loading`). The spinner sits inside: zoom-ui `.zoom-loading.is-inlined-in-button` at inset −1px, radius 8 (sm 6), bg `#FFFFFFCC`. Focus: §2.6. |
| 5.4 Button / start (Meetings) | Only the default state is given. | `z-button-type-normal`: hover **and** active = `linear-gradient(0deg,#00000017,#00000017), #0E72ED` (≈ `#0D68D8`). Disabled: bg `#F2F2F7`, label `#909096`. Focus: `outline:2px solid #4793F1; outline-offset:2px`. |
| 5.4 Button / tertiary-outline | Hover bg `#F7F9FA`, label `#0E71EB`. | Correct. Also `:focus` gives bg `#F1F4F6`, label `#0E71EB`. `.disabled` gives bg `#FFF`, label `#6E7680`. The Delete variant hovers to label **`#E02828`**. Children are spaced with `margin-right:4px` (no `gap`). |
| 5.4 Button / text | "hover underline [D]" | Text buttons **do not underline**. They change colour only: `#0D6BDE` → hover `#0C60C8` → active `#084085`. Only `.zoom-link` underlines on hover and active. |
| 5.4 Input | Focus is a 1px `#4B96F1` border. Placeholder `#ADB1B8` [D]. | zoom-ui input focus = border `#4B96F1` **plus** `box-shadow: inset 0 0 0 1px #4B96F1` (2px visual ring). Placeholder **`#686F79`**; on hover it turns `#5E646D` and the field bg turns `#6E76801F`. `#ADB1B8` is only for disabled placeholders. **The Join-modal input itself has `outline:none` and no `:focus` rule, so it shows no focus change** [M]. Use the zoom-ui focus ring [D]. |
| 5.4 Select list [D] | Items 32px tall, padding `7px 8px`, selected text `#0D6BDE` plus a check. | zoom-ui select option: `min-height:32px; padding:6px 8px; radius 8`, hover `#6E76801F`. The selected item keeps text `#222325` and shows a 16px check icon in `#222325` (`margin-left:8px`). The list sits in `.zoom-floating` (radius 12, 1px `#DFE3E8`, `--zoom-box-shadow`). Dropdown menu padding is 12px. Group title is 12/16 `#686F79`, padding 8. Only the **profile-menu** rows use `padding:7px 8px`. |
| 5.4 Checkbox | Label `#232333`, no hover state. | zoom-ui label `#222325`. Hover: bg `#6E76801F`. Press: bg `#6E76806B`. Checked hover `#0C60C8`, checked press `#084085`. Transition `.2s cubic-bezier(.71,-.46,.29,1.46)`. **The New-meeting popover uses a different PWA checkbox** (`zm-pwa-checkbox`): border `#BABACC`, checked `#0E71EB` with `border:0`, disabled `#D0E3FB`, focus `outline:2px solid #2D8CFF` offset 1px. |
| 5.4 Avatar palette [D] | `#9053C2 #0D6BDE #247F40 #B36200 #007C7C #2974A8 #DA1639 #CF4B0A` | Zoom's avatar colour classes (zoom-ui and common-header) are exactly **8**: green `#247F40`, purple `#9053C2`, teal `#007C7C`, steel `#2974A8`, gray `#555B62`, orange **`#9D3B0F`**, yellow `#B36200`, red `#DA1639`. There is no blue and no `#CF4B0A`. The 10px radius is a Workplace override (`.common-header-avatar{border-radius:10px}`); zoom-ui's default is a circle. |
| 5.4 Popover (light) | radius 10–12 | Prism Popover: radius 10, padding 12, max-width 360, `--shadow-md`. zoom-ui `.zoom-floating`: radius 12, `--zoom-box-shadow`, z-index 2000. Both have a 1px `#DFE3E8` border. |
| 5.4 Modal overlay | `rgba(0,0,0,.2)` | Correct for the Join modal (`.join-meeting-modal__overlay.pwa-modal__overlay--on{background:#0003}`). The **default** PWA overlay is `rgba(255,255,255,.75)`. zoom-ui `.zoom-overlay` is `#00000033` (dk `#00000085`). |
| 5.4 Toast [D] | Bottom-centre, bg `#222325`, 3 s. | The PWA uses react-toastify with Zoom overrides: **white** card, 1px `#C1C6CE` border, radius 10, min-height 40, shadow `0 24px 48px rgba(19,22,25,.2), 0 12px 24px rgba(19,22,25,.1)`, `backdrop-filter:blur(10px)`. The container is **top** (`top:50px`), width 320. Title `#131619` bold, body 14/20. Icon colours: success `#268543`, info `#0E72ED`, warn `#B36200`, failure `#E8173D`. zoom-ui toast: white, 400px wide, radius 16, padding 16. A dark translucent toast is **not** used in the Workplace shell. |
| 5.4 (missing) Tooltip | — | The header (Activity Center bell) and the Meetings tab use **Prism Tooltip: white**: bg `#FFF`, 1px `#DFE3E8`, radius 4, padding `3px 6px`, 12/16 400 `#2A2B2D`, `--shadow-sm`, z 1500, 8px below the trigger, no arrow. It mounts about 10 ms after `pointerenter` (no enter delay) and fades in over `.3s`. The zoom-ui tooltip is **dark**: `#000000A3` plus `blur(15px)`, white 12/16, padding `2px 6px`, radius 4. |
| 6.1 Profile avatar | Presence dot 10×10 `#09A639` with a 2px white ring. | The dot is `.common-header-avatar__status-icon`, an inline SVG. There are 10 presence glyphs (§6.5); "Available" is the 8-unit green circle drawn at 10×10. While the user is in a meeting, the glyph is a 16×10 orange camera (`#FF5500`). The 2px ring comes from the SVG/position (top −2.5px, right −5.28px), not from a CSS border. |
| 11 Responsive | 768 / 1200 breakpoints. | The PWA CSS breakpoints are **1150, 1080/1081, 1024, 800, 768/767, 745, 680, 675, 645, 280** (width) and **720** (height, car "vehicle" mode only). See §2.7. |

---

## 1. Sources and which component family is used where

Captured from live Zoom Workplace application stylesheets.

| # | Sheet | Size | Library / content |
|---|---|---|---|
| 1 | `https://us05st1.zoom.us/web_client_pwa/7.2.0.3239/css/main.css` (= `zoomcss/main.css`) | 257 KB | PWA shell: header, rail, home, meetings, join modal, `z-button`, `zm-pwa-checkbox`, focus model |
| 2 | `…/css/main-chunk-other.css` (= `zoomcss/other.css`) | 290 KB | `common-header-*` (zoom-ui build for the header and profile menu) + `zmu-*` (meeting UI kit) + `--zoom-color-*` tokens |
| 3 | `https://gstatic.zoom.us/fe-static/fe-home-destination/widget/promo-carousel-widget.B94NjE5Z.css` | 824 KB | `monetization-widgets-*` (zoom-ui build for the Upgrade button and promo carousel) |
| 4 | `https://st1.zoom.us/fe-static/nx-chat/7.0.5.20876.0928/style.css` (also inlined) | 4.7 MB | Team Chat (nx-chat): its own `:root` theme, MUI, `ui-*` |
| 5–9 | `https://zcal.zoom.us/static/css/{chunk-zoom-ui.be6b3ccd, chunk-zoom-libs.d852c094, app.33d0302d, 7908.bf31e129, sidebar.04f7241b}.css` | 237 / 121 / 775 / 83 / 80 KB | Calendar widget (shadow DOM of `<calendar-widget-app>`). **`chunk-zoom-ui` is the canonical zoom-ui library** (`.zoom-*`) and the reference for §4–§7. |
| 10 | inline `<style data-prism="prism-common|prism-light|prism-dark|Typography|FocusTrap|Popper|Button|Popover|ToggleButton|Tooltip">` | 3–159 KB | **Prism** design system (React). Sheets are injected lazily: `Popper`, `FocusTrap` and `Typography` appear only after a tooltip, modal or popover first opens. |
| 11 | inline emotion `<style data-emotion="css">`, 1355 rules | 264 KB | MUI-based `ui-Button`, `ui-Banner`, `ui-Popover`, `ui-Dialog`, `ui-Checkbox`, `ui-Spinning` |
| 12 | inline emotion `.css-13qub5o` (3 rules) | 0.7 KB | Admin Center header link |
| 13 | inline `.pwa-modal__*` (6 rules), react-toastify + Zoom overrides (82 + 30 rules), `#pwa-presence-icon-styles` (10 rules), `.zds-html` (75 rules), embla carousel (15 rules) | — | PWA modal shell, toasts, presence glyphs |
| 14 | shadow DOM of `calendar-widget-app`: `[data-sun-ui]` (820 KB, Zoom Docs `zds`), `#global-zindex` (`--z-index-*` 171–316), styled-components (8) | — | Docs SDK, not used by the clone |

Cross-origin iframe `https://ai.zoom.us/unify?...` (AI Companion) was not readable. No extra CSS loads on `/wc/meetings`. The meeting client's own CSS was not loaded during capture; its kit is the `zmu-*` rules in `other.css`.

### 1.2 Component family → where it appears [M]
| Surface | Element | Family and classes | Rendered |
|---|---|---|---|
| Header | Back / Forward | **ui-Button** `ui-Button-iconButton ui-Button-tertiary ui-Button-small ui-Button-disabled` (MUI `MuiButton-text`) | 24×24, radius 6, colour `#ADB1B8` when disabled, glyph 14px |
| Header | History | ui-Button iconButton tertiary small | 24×24, radius 6, colour `#2A2B2D` |
| Header | Search trigger | ui-Button secondary `MuiButton-fullWidth`, overridden by `.global-search-entry_searchCluster .global-search-header-button{background:#ECEFF1;border-radius:8px;height:32px}` | 410×32, 14/20, `#3D4349`, `transition:none` |
| Header | Admin Center | **prism-Button** `prism-Button-tertiary prism-Button-small` plus emotion `.css-13qub5o` override | 102×32, padding `6px 8px`, radius 12, 14/20 400 `#555B62`, ls −.15px |
| Header | Download | bespoke `DownloadNav_link` | 91×32, padding `6px 14px`, radius 12, bg `#F1F4F6`, 14/18 `#0D6BDE` |
| Header | Upgrade | **monetization-widgets-button** `--md --primary` (zoom-ui) | 85×32, padding `6px 14px`, radius 12, 14/18 **500** |
| Header | Activity Center bell | **prism-Button** `prism-Button-icon prism-Button-tertiary prism-Button-medium` + `prism-ToggleButton-root` + `prism-Tooltip-trigger` | 32×32, radius 999 (emotion override), glyph 16px `#555B62` |
| Header | Profile | **common-header-button** `--md is-pure-text --text` containing `common-header-avatar--md --purple` | button 32×32 radius 4; avatar 32×32 radius 10, bg `#9053C2`, 14/32 600 white |
| Left rail | Home / Chat / Meetings / Contacts / Settings | bespoke `.home-header__tab` | 72×56, radius 8 (§3.6) |
| Home | New meeting / Join / Schedule | bespoke `.main__action-btn` | 56×56, radius 20 (§3.6) |
| Home | New-meeting chevron | bespoke `.start-label__icon` | 17×17, radius 30%, colour `#0404138F`; hover/focus bg `#F2F2F7` |
| Home | Recordings / Summaries / My Notes | bespoke `.home-hub-entries_entry` | 189×56, radius 16, border 1px `#DFE3E8`; focus-visible `2px solid #0E72ED` offset 2 |
| Home | New-meeting popover | **prism-Popover** + `prism-Typography body-1` + `zm-pwa-checkbox` | §5.2 |
| Home | Promo card "Get offer" | monetization-widgets-button `--small --primary` (+ local override) | 70×24, radius 24, padding `3px 10px`, 12/18 |
| Home | Calendar widget (shadow DOM) | **zoom-button** `--md --secondary` ("Today, Oct 7", overridden to transparent/700/`2px 8px`), `--sm --tertiary` icon buttons (24×24 circle), "Today" `--sm --tertiary` with a 1px `#98A0A9` border | — |
| Join modal | Cancel / Join | **prism-Button** `prism-Button-medium prism-Button-secondary|primary` + `.join-meeting-modal__button` overrides | 71×32 / 55×32, padding `6px 14px`, radius 12, no border |
| Profile menu | Rows, banner, Upgrade, "Download the Zoom app" | **common-header** floating/profile/banner/button | §5.2, §6.1 |
| Meetings tab | Start | **z-button** `z-button-size-32 z-button-type-normal` | 75×32, radius 8, padding `0 20px`, 14/20 700, bg `#0E72ED` |
| Meetings tab | Copy Invitation / Edit / Delete | z-button `size-32 type-tertiary` + `.meetings__detail-btn-*` | 162×32 / 85×32, bg `#FFF`, border 1px `#DFE3E8`, label `#131619` |
| Meetings tab | "Add a calendar" | link with `prism-Popover-trigger`, 14/14 `#0D6BDE` | — |
| Meetings tab | Promo carousel | monetization-widgets-button `--md --primary`, `--md --overlay` (32 circle), `--sm --tertiary` icon (24 circle) | — |
| Meeting client (iframe) | All controls | `zmu-*` kit from `other.css` (not rendered during capture) | §3.5 |

**Recommendation for the clone [D]:** build **one** button component with the **zoom-ui API** (`variant: primary | secondary | secondary-neutral | tertiary | text | overlay`, `danger: boolean`, `size: sm | md | lg`, `iconOnly`, `loading`, `disabled`). Its values equal Prism `prism-3` and every PWA override (h32, padding `6px 14px`, radius 12). Add three bespoke components: `HomeActionButton`, `RailTab`, and `OutlineButton`/`StartButton` (the z-button look) for the Meetings tab.

---

## 2. Foundations

### 2.1 Colour systems [M]
Full lists are in `06-tokens.css`: layer 1 (256 `--zoom-color-*`), layer 3b (Prism, 249 colour tokens) and the dark block. The roles used most:

| Role | zoom-ui token | Light | Dark | Prism token (light) |
|---|---|---|---|---|
| Page / app background | `bg-darker-neutral` | `#F1F4F6` | `#040506` | same |
| Card / popover / dialog bg | `fill-default`, `bg-default` | `#FFFFFF` | `#222325` / `#131619` | same |
| Secondary button, search, subtle fill | `fill-subtle-neutral` | `#F1F4F6` | `#313235` | same |
| Hover surface (solid) | `fill-subtler-neutral` | `#F7F9FA` | `#2A2B2D` | same |
| Primary fill | `fill-global-primary` | `#0D6BDE` | `#0D6BDE` | same |
| Primary hover / press | `state-primary-hover` / `-press` | `#0C60C8` / `#084085` | `#7DB4F7` / `#084085` | same |
| Translucent hover / press | `state-subtle-neutral-hover` / `-press` | `#6E76801F` / `#6E76806B` | `#6E768054` / `#0000006B` | same |
| Primary-tinted hover / press (Prism tertiary) | `state-subtle-primary-hover` / `-press` | `#0E72ED1F` / `#0E72ED6B` | `#0E72ED54` / `#0000006B` | same |
| Text strongest | `text-stronger-neutral` | **`#222325`** | `#F7F9FA` | **`#2A2B2D`** |
| Text strong / icons | `text-strong-neutral`, `icon-strong-neutral` | `#555B62` | `#DFE3E8` | same |
| Text secondary / placeholder | `text-neutral` | `#686F79` | `#939BA4` | same |
| Placeholder on hover | `state-neutral-hover` | `#5E646D` | `#B6BAC0` | same |
| Link / primary text | `text-primary` | `#0D6BDE` | `#4B96F1` | same |
| Error text | `text-error` | `#DA1639` | `#FF6682` | same |
| Disabled text / bg | `state-disable` / `state-subtle-disable` | `#ADB1B8` / `#ADB1B840` | `#596069` / `#59606940` | same |
| Disabled primary-tinted | `state-subtle-primary-disable` | `#AACDF8` | `#2B4588` | same |
| Input border | `border-input` | `#C1C6CE` | `#555B62` | `--component-input-border #C1C6CE` |
| Divider / card border | `border-subtle-neutral` | `#DFE3E8` | `#313235` | same |
| Checkbox / radio border | `border-neutral` | `#939BA4` | `#686F79` | same |
| Toggle border | `border-strong-neutral` | `#555B62` | `#C1C6CE` | same |
| Focus ring / focused border | `border-primary` | `#4B96F1` | `#0D6BDE` | same |
| Error border | `border-error` | `#FF6682` | `#DA1639` | same |
| Overlay scrim | `underlay-dark` | `#00000033` | `#00000085` | same |
| Drop-shadow colour | `underlay-dropShadow` | `#00000014` | `#0000007A` | same |
| Tooltip (dark style) | `state-contrary-strong-transparent-hover` | `#000000A3` | `#FFFFFFCC` | same |
| Overlay-button hover | `component-button-overlay-hover` | `#313131CC` | — | Prism uses `#0000007A` |
| Selected toggle / secondary tab | `toggle-button-background-selected` | `#ECF4FD` | `#1B2749` | `--component-toggleButton-…-selected-default #ECF4FD` |

**PWA-only hard-coded colours** (no token) are listed in `06-tokens.css` layer 4: `#FF742E`, `#0E71EB`, `#0E72ED`, `#2D8CFF`, `#4793F1`, `#232333`, `#131619`, `#747487`, `#6E7680`, `#909096`, `#F2F2F7`, `#EDEDF3`, `#BABACC`, `#D0E3FB`, `#E7F1FD`, `#ECEFF1`, `#DE2828`, `#E02828`. The header sets its own variables inline on `.waffle-header_waffleHeaderContainer`: `--pwa-header-text #555b62; --pwa-header-text-hover #0c60c8; --pwa-header-text-press #084085; --pwa-header-item-hover #6e76801f; --pwa-header-item-press #6e76803d; --pwa-header-search-surface #f1f4f6; --pwa-header-download-color #0d6bde`.

### 2.2 Typography [M]

**Font stacks**
| Where | `font-family` |
|---|---|
| PWA `body,html` (whole shell) | `system-ui,SF Pro,Segoe UI,Almaden Sans,Roboto,Ubuntu,Helvetica,Arial` (no generic fallback) |
| Prism components (`--typography-fontFamily`) | `system-ui,Roboto,Segoe UI Emoji,Segoe UI Symbol,Segoe UI,Apple Color Emoji,Twemoji Mozilla,Noto Color Emoji,Android Emoji,SF Mono,Almaden Sans,Roboto Mono,Ubuntu Mono,Helvetica,Arial` |
| ui-Button / ui-* (MUI) | `system-ui, Roboto, "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji", "SF Pro", "Almaden Sans", Ubuntu, Helvetica, Arial` |
| common-header (`.common-header-fonts`, `.common-header-context`) | `system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,Chinese Quotes,Inter var,Inter,ui-sans-serif,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji` |
| `code` | `source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace` |

On macOS every stack resolves to SF Pro (`system-ui`), so the clone only needs `--font-app`. Font smoothing comes from the calendar shadow DOM (`-webkit-font-smoothing: antialiased`); main.css does not set it.

**Type scale.** Prism tokens and zoom-ui classes share sizes and line-heights; zoom-ui uses heavier title weights.
| Style | Size / line-height | Prism weight | zoom-ui weight |
|---|---|---|---|
| display | 44/48 | 700 | 700 |
| headline-1 | 40/44 | 700 | 700 |
| headline-2 | 36/40 | 700 | 700 |
| title-1 / title-1-emphasis | 24/28 | 400 / 600 | — / **700** |
| title-2 / title-2-emphasis | 20/24 | 400 / 600 | — / **700** |
| title-3 / title-3-emphasis | 16/20 | 400 / 600 | 400 / **700** |
| body-1 / body-1-emphasis | 14/18 | 400 / 600 | 400 / 600 |
| paragraph-1 | 14/20 | 400 | 400 |
| body-2 / body-2-emphasis | 12/16 | 400 / 600 | 400 / 600 |
| caption / caption-emphasis | 10/16 | 400 / 500 | 400 / 500 |
| label (uppercase in Prism) | Prism 10/12, zoom-ui **8/12** | 600 | 600 |

**Combinations actually used in PWA `main.css`** (font-size / line-height / weight / letter-spacing, ignoring vehicle and feedback rules; most frequent first):
| Size | LH | Weight | LS | Count | Examples |
|---|---|---|---|---|---|
| 14px | 24px | 400 | — | 9 | contacts list, logout modal |
| 14px | 20px | inherit/400 | — | 12 | header custom nav text, banners, account card |
| 13px | 16px | inherit/400 | — | 8 | `.upcoming__header-day`, `.upcoming_time`, `.upcoming__footer`, `.upcoming__detail` |
| 16px | 24px | 700 | — | 5 | `.z-button-size-48`, chat post title |
| 14px | 18px | 400 | **−.15px** | 4 | `DownloadNav_link`, download CTAs (also the Join modal label, input and buttons) |
| 14px | 18px | inherit | — | 4 | header panel, help menu |
| 12px | 16px | 400 | — | 7 | `.meeting-history-item__number`, banners |
| 16px | 24px | 600 | — | 3 | banner titles |
| 16px | 20px | 400 | — | 3 | `.home__day` |
| 24px | 29px | 700 | — | 3 | `.meetings__detail-topic`, contact name |
| 14px | 20px | 500 | — | 3 | `.meeting-history-item__topic` |
| 14px | 20px | 700 | — | 2 | `.z-button-size-32` |
| 18px | 21px | 700 | — | 2 | `.upcoming__detail-topic`, `.meetings__pmi-number` |
| 14px | 16px | 400 | — | 2 | home action labels (`.main__action-* span`) |
| 20px | 24px | 700 | −.45px | 1 | `.join-meeting-modal__title` |
| 22px | 24px | 600 | — | 1 | header "Workplace" text |
| 40px | 40px | 600 | .37px | 1 | `.home__time` (clock) |
| 20px | 28px | 600 | — | 1 | `.my-account-card__name` |
| 16px | 20px | 590 | −.31px | 2 | download CTA titles (SF Pro semibold = 590) |

Letter-spacing values in main.css: `−.15px` (11×, buttons, header and inputs), `−.31px`, `−.45px`, `.12px` (rail labels), `.37px` (clock), `.02em`, `−.02em`, `−.01em`.

### 2.3 Spacing, radius, shadow, z-index [M]
**Spacing scale.** Values seen in `gap` and `padding`: **2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32**, plus 48 and 60 for large layout gaps. Component internals: icon–label gap 4 (buttons) or 8 (menus, checkbox, avatar text); menu padding 12; card and banner padding 16; dialog padding 32; section gap 24.

**Radius scale.** Count in main.css / other.css:
| Radius | Typical use |
|---|---|
| 3px | webkit scrollbar thumb (legacy), popper arrow corner |
| 4px | tooltip, checkbox, skeleton line, text button, pure-text profile button |
| 5–6px | tag (5), sm input addon, header 24px icon buttons (6), small Prism buttons (6) |
| 8px | rail tab, menu item, z-button 32, search field, sm input / textarea, segmented tab label (6–7) |
| 10px | avatar (Workplace), Prism popover, toast, Prism large button |
| 12px | md/lg buttons (Workplace look), inputs, select, content card, banner, profile menu, floating menus |
| 16px | hub-entry card, zoom-ui popover container, toast (zoom-ui), info popover |
| 20px | home action buttons (56px) |
| 24px | complex popover |
| 30px | home action buttons at 88px (non-standard layout) |
| 32px | dialogs (Join modal, zoom-dialog, message box) |
| 999px / 100% | pill (sm buttons), icon-only buttons, toggle, segmented control, badges, round avatars |

**Shadow scale**
| Token | Value | Used by |
|---|---|---|
| `--shadow-xs` (Prism) | `0 4px 8px 0 rgba(0,0,0,.08)` | Prism anchor button |
| `--shadow-sm` (Prism) = `--zoom-box-shadow-small` | `0 4px 8px 0 #00000014, 0 2px 4px 0 #00000014` | Prism tooltip, date picker, segmented thumb, dark tooltip |
| `--zoom-box-shadow-xs` | `0 2px 4px 0 #00000014, 0 4px 8px 0 #00000014` | — |
| `--shadow-md` (Prism) = `--zoom-box-shadow` | `0 12px 24px 0 #00000014, 0 6px 12px 0 #00000014` | popovers, profile menu, floating menus, zoom-dialog, toast (zoom-ui) |
| Join modal (same values, reversed order) | `0 6px 12px 0 #00000014, 0 12px 24px 0 #00000014` | `.join-meeting-modal` |
| `--shadow-lg` = `--zoom-box-shadow-large` | `0 24px 48px 0 #00000014, 0 12px 24px 0 #00000014` | ui-Popover paper |
| PWA toast | `0 24px 48px rgba(19,22,25,.2), 0 12px 24px rgba(19,22,25,.1)` | Toastify |
| Home action hover | `0 4px 11px 0 #B3B3B3` | `.main__action-btn:hover` |
| Legacy menus | `0 8px 24px #2323331A` (11×), `0 0 15px #00000026`, `0 0 10px 1px rgba(0,0,0,.075)` (zmu paper) | meeting history, info panel, zmu |
| Input focus ring (legacy) | `0 0 0 3px #0E72ED2E`; error `0 0 0 3px #DE282829`; double ring `0 0 0 2px #FFF, 0 0 0 4px #0E72ED` | invite modal, create contact, zmu switch |
| Dialog header and footer divider (elevated) | `0 1px 0 0 #00000014` / `0 -1px 0 0 #00000014` | `.zoom-dialog__header.is-elevated` |

**Z-index scale**
| Layer | Value | Source |
|---|---|---|
| base | 1 | Prism `--zIndex-base` |
| inline dropdowns (meeting history) | 10 | main.css |
| loading mask | 100 (fullscreen 9999) | zoom-ui `.zoom-loading` |
| Prism overlay | 1000 | `--zIndex-overlay` |
| **PWA modal overlay (Join)** | **1001** | inline style on `.pwa-modal__overlay` |
| zmu tooltip | 1010 | main.css |
| Drawer | 1200 | Prism |
| Dialog, Popover, Dropdown, DatePicker, TimePicker, ColorPicker | 1300 | Prism (also ui-Dialog, ui-Popover) |
| Toast, Snackbar | 1400 | Prism |
| **Tooltip** | **1500** | Prism (measured on the bell tooltip) |
| react-select menu portal | 1999 | main.css |
| zoom-ui floating (menus, tooltips) | 2000 | `.zoom-floating` |
| react-toastify | 9999 | `--toastify-z-index` |
| standalone-PWA top hairline | 100000 | `html:before` |

### 2.4 Elevation by surface [M]
Card (content card): no shadow. Popover and menu: 1px `#DFE3E8` border plus `--shadow-md`. Tooltip: 1px border plus `--shadow-sm` (Prism white), or no border plus `--shadow-sm` plus blur (zoom-ui dark). Dialog: no border plus `--shadow-md`. Toast: 1px `#C1C6CE` plus a large shadow.

### 2.5 Motion — every transition and animation, by component [M]
| Component | Property | Duration | Easing / notes |
|---|---|---|---|
| Home action button (`.main__action-btn`) | `transform, box-shadow` | .15s | `ease`. Hover/focus: `translateY(-4px)` plus shadow `0 4px 11px 0 #B3B3B3`. Disabled: `transition:unset`. |
| Left rail tab | `transform` | .3s | `ease`; for drag-reorder only (`.orderBarUp/Down` ±100%). **Hover bg changes instantly.** |
| Rail "More" list | `height` | .3s | ease |
| Header items (Admin Center, Download, profile) | — | none | instant |
| ui-Button (Back/Forward/History) | `background-color, box-shadow, border-color` | .25s | `cubic-bezier(.4,0,.2,1)` (MUI). The search trigger overrides this to `transition:none`. |
| Prism Button | — | none declared | instant. Prism `home` and `fab` variants use `all .3s cubic-bezier(0,0,.2,1)`. |
| Prism Popper (tooltip, popover) | `opacity` | .3s | `cubic-bezier(.4,0,.2,1)`; no scale or translate. Tooltip mounts about 10 ms after pointerenter. |
| zoom-ui tooltip / info-popover / common-header tooltip | `opacity, transform` | .2s | `cubic-bezier(.4,0,.2,1)`; enter-from `opacity:0; scale(0)` |
| zoom-ui zoom-in-top / bottom (floating menus) | `transform, opacity` | .3s | `cubic-bezier(.23,1,.32,1)`; `scaleY(0)`→1, origin top/bottom |
| zoom-ui zoom-in-center | `all` | .3s | `cubic-bezier(.55,0,.1,1)`, from `opacity:0; scaleX(0)`; zoom-in-left from `scale(.45)` |
| Dialog / overlay (zoom-ui) | keyframe `fade-in-linear-in` / `-out` | .3s | opacity 0→1 plus `translateY(-20px)`→0 (and reverse) |
| Message box | keyframe `modal-fade-in` / `-out` | .3s | opacity |
| zoom-ui toast | `opacity, transform` (+ `top` when centred) | .3s | enter from `translateX(100%)` (right) or `translate(-50%,-100%)` (top-centre) |
| PWA toast (Toastify) | bounce keyframes | `animation-duration:10ms !important` | Zoom effectively **disables** the entrance animation |
| Banner | `opacity` | .3s | fade on close |
| Checkbox box | `border-color, background-color` | .2s | `cubic-bezier(.71,-.46,.29,1.46)` |
| Radio knob | `transform` | .15s | `ease-in`, `scale(0)`→`scale(1)` |
| Toggle core / knob | `transform` (core), `all` (knob `:after`) | .3s | default ease |
| zmu switch | `border-color, background-color`; knob `all` | .3s | — |
| Segmented item text | `color` | .1s | `ease-in-out` |
| Tabs nav and active bar | `all` | .3s | `ease-in-out` |
| Scrollbar track | `opacity` | .3s | `ease-out` (appears on hover) |
| Scrollbar thumb | `background-color` | .3s | — |
| Loading mask | `opacity` | .3s | — |
| Collapse | `max-height, padding-top, padding-bottom` | .3s | `ease-in-out` |
| Global search panel loading | `opacity` (visibility delayed .16s) | .16s | ease |
| Hover tip (My notes) | `opacity, visibility` | .12s | ease |
| Invite modal inputs | `border-color, box-shadow, background-color` | .15s | ease |
| Waffle menu items | `transform` / `background-color` | .2s / .15s | — |
| zmu-btn, zmu-checkbox | `all` | .2s | `ease-in` |
| Spinner (zoom-ui, 8 spokes) | `spinner-fade` | .8s | linear, infinite; spoke delays −.3, −.2, −.1, 0, −.7, −.6, −.5, −.4s |
| Spinner circle | `loading-circle` (rotate) | 1s | linear, infinite |
| PWA `.z-loading`, `.contacts-lists-loading i`, Schedule-disabled spinner | `rotate-infinite` | 1s | linear, infinite (webclient loading icon 1.5s) |
| ui-Spinning | `antSpinRotate` | 1.5s | linear, infinite |
| zmu loading | `loadingCircle` / `rotate` | 1s / 1.5s | linear |
| Skeleton | `skeleton-pulse` | 1.5s | `ease-in-out`, infinite: opacity 1→.33→1, scale 1→.99→1 |
| App boot progress bar | `AppLoading_progress-bar-animation` | .95s | `ease-in-out 10ms infinite alternate`, `translateX(-90%)`→`310px` |
| Chat "jump" loading letters | `jump_WordsBounce` | 1.4s | ease-in-out infinite, 0.1s stagger |
| zmu toast / countdown | `fadeout` | .6s / .5s (delay .6s) | — |

Keyframe source: Appendix B.18.

### 2.6 Focus rules [M] and the clone rule [D]
| System | Selector | Style |
|---|---|---|
| PWA global | `:focus` | `outline: 2px solid #2D8CFF; outline-offset: 1px` |
| PWA global (mouse) | `[data-whatintent=mouse] :focus` | `outline: none !important` |
| Prism (all components) | `:where(html,body).prism-navigation-with-keyboard .prism-Button-root:focus-visible` | `outline: 2px solid #4B96F1; outline-offset: 2px` (fab and anchor buttons the same) |
| Prism baseline | `.prism-light :where(.prism-baseline-root.prism-baseline-focus :focus-visible)` | `outline: none` |
| zoom-ui buttons, links, tags, menus | `.is-vue3-keyboard-event .zoom-*:focus` | `outline: 2px solid #4B96F1` (buttons and options have `outline-offset:2px`; tabs `-2px`) |
| zoom-ui inputs, textarea, select | `:focus` (any modality) | border `#4B96F1` + `box-shadow: inset 0 0 0 1px #4B96F1`; error variant uses `#FF6682` |
| ui-Button | `.ui-Button-focusVisible, :focus-visible` | `outline: 2px solid rgb(75,150,241); outline-offset: 2px` |
| z-button | `:focus` | `outline: 2px solid #4793F1; outline-offset: 2px`; `:disabled{outline:none}` |
| Rail tab | `.home-header__tab:focus` | inherits the global ring with `outline-offset: -4px` (inside the tab) |
| Hub entry, Invite close | `:focus-visible` | `outline: 2px solid #0E72ED` (`--zoom-color-border-focus` fallback); offset 2px |
| Download link | `:focus-visible` | `outline: 2px solid #0D6BDE; offset 2px` plus hover colours |
| zm-pwa-checkbox | `.checkbox--focused .checkbox__mark` | `outline: 2px solid #2D8CFF; outline-offset: 1px` |
| zmu | `.zmu-btn__outline--blue:focus` | `2px solid #0E71EB`, offset 1px (white variant on dark) |

**Clone rule [D]:** `:focus-visible { outline: 2px solid var(--zoom-color-border-primary); outline-offset: 2px }` everywhere. Rail tabs use offset `-4px`. Text fields use the inset-shadow ring on `:focus`. This reproduces what keyboard users see in Zoom; mouse users never see a ring.

### 2.7 Media queries and breakpoints [M]
| Query (main.css unless noted) | Rules | What changes |
|---|---|---|
| `min-width:1150px` | 2 | Header left and right zones get `flex-basis:0; flex-grow:0` so the search bar centres. |
| `max-width:1080px` / `min-width:1081px` | 13 + 5 / 7 | **Search collapses to a 32×32 icon button.** Label and "⌘ + K" are hidden, bg transparent; hover `#52528017`, press `#5252802E`. History mount is hidden. **Admin Center is hidden.** At ≥1081 the search item stretches to fill its slot. |
| `max-width:1024px` | 6 | Home cards stack (`flex-direction:column; width:96%`). Billing and calendar widgets go full width. Discover-products popover becomes full-screen under the 64px header. AI Companion panel insets 12px. |
| `max-width:800px` | 2 | Header logo hidden. |
| `max-width:768px` (+ other.css 767/768/769) | 9 (+12) | Header logo text hidden. Admin, Download and Upgrade slots hidden. Index buttons become full width, 48px, radius 12. **Profile menu and waffle menu become full-screen sheets** (radius 0, no border, no shadow; a mobile header with bg `#F7F9FA` and 16/32 500 title appears). |
| `max-width:745px` | 3 | Search container hidden; the icon-only search anchor is shown. |
| `max-width:680px` | 1 | `.upcoming` (upcoming meetings panel) hidden. |
| `min-width:675px` | 1 | `.join` page column fixed at 410px. |
| `min-width:645px` / `720px` | 2 / 2 | Contacts: list 50% / 360px, detail panel shown. |
| `max-width:280px` | 4 | Home actions stack; New-meeting option panel is 180px wide. |
| `max-height:720px` | 31 | Car ("vehicle") UI only; ignore. |
| `display-mode:standalone` | 1 | 1px `bg-darker-neutral` hairline at the top of an installed PWA. |
| `(hover:none) and (pointer:coarse)` (other.css) | 1 | Waffle links ignore pointer events on touch. |
| zoom-ui grid (other.css) | — | `hidden-xs-only` ≤767, `sm` 768–1023, `md` 1024–1439, `lg` 1440–1919, `xl` ≥1920 |
| ui-Button `(hover:none)` | many | On touch devices hover styles are reset to the resting colours. |

---

## 3. Buttons

### 3.1 zoom-ui button — `.zoom-button` (≡ `.common-header-button` ≡ `.monetization-widgets-button`) [M]
Used for Upgrade, the promo card, the calendar widget and the profile-menu banner. This is the **reference look for the clone** (it equals Prism `prism-3`).

**Base:** `display:inline-flex; align-items:center; justify-content:center; border:none; outline-offset:2px; white-space:nowrap; font: 400 14px/18px inherit;`. Adjacent buttons get `margin-left:8px` (full-width stacked: `margin-top:8px`). Icon–label spacing is `margin-left:4px` on the label (`is-reverse` puts it on the right).

**Sizes**
| Size | Height | Padding | Tertiary padding | Radius | Font | Inner icon | Icon-only box / glyph / radius |
|---|---|---|---|---|---|---|---|
| sm | 24 | `2px 10px` | `2px 8px` | **999px** (pill) | 12/16 | 12 | 24×24 / 14 / 100% |
| md | 32 | `6px 14px` | `6px 8px` | **12** | 14/18 | 14 | 32×32 / 16 / 100% |
| lg | 40 | `6px 16px` | `6px 12px` | **12** | 14/18 | 14 | 40×40 / 18 / 100% |

**Variants × states** (light; dark in parentheses where it differs). Text weight is 400 except primary, primary-danger and overlay, which are **500**.
| Variant | Default bg / text | Hover | Active | Disabled (`.is-*-disabled`) |
|---|---|---|---|---|
| primary | `#0D6BDE` / `#FFF` | bg `#0C60C8` (dk `#7DB4F7`) | bg `#084085` | bg `#ADB1B840` (dk `#59606940`), text `#ADB1B8` (dk `#596069`), `cursor:not-allowed` |
| primary-danger | `#DA1639` / `#FFF` | `#C41434` (dk `#F38498`) | `#830D23` | as primary |
| secondary | `#F1F4F6` (dk `#313235`) / `#0D6BDE` (dk `#4B96F1`) | bg `#6E76801F` (dk `#6E768054`), text `#0C60C8` (dk `#7DB4F7`) | bg `#6E76806B` (dk `#0000006B`), text `#084085` | bg `#ADB1B840`, text `#ADB1B8` |
| secondary + icon-only | `#0000000A` (dk `#FFFFFF0A`) / `#222325` (dk `#F7F9FA`) | bg `#6E76801F` | bg `#6E76806B` | as above |
| secondary-danger | `#F1F4F6` / `#DA1639` (dk `#FF6682`) | bg `#6E76801F`, text `#C41434` | bg `#6E76806B`, text `#830D23` | as above |
| secondary-neutral | `#0000000A` / `#222325` | bg `#6E76801F` | bg `#6E76806B` | as above |
| tertiary | transparent / `#0D6BDE` | bg `#6E76801F`, text `#0C60C8` | bg `#6E76806B`, text `#084085` | transparent, text `#ADB1B8` |
| tertiary + icon-only | transparent / `#555B62` (dk `#DFE3E8`) | bg `#6E76801F`, icon unchanged | bg `#6E76806B` | transparent, `#ADB1B8` |
| tertiary-danger | transparent / `#DA1639` | bg `#6E76801F`, text `#C41434` | bg `#6E76806B`, text `#830D23` | transparent, `#ADB1B8` |
| text | transparent / `#0D6BDE` | text `#0C60C8` (no bg, no underline) | text `#084085` | text `#ADB1B8` |
| text `.is-pure-text` | `height:auto; padding:0; radius 4`; `-small` = 12/16 | | | |
| text-danger | transparent / `#DA1639` | `#C41434` | `#830D23` | `#ADB1B8` |
| overlay | `#0000006B` + `backdrop-filter:blur(15px)` / `#FFF` | bg `#313131CC` | bg `#000000CC` | bg `#0000006B`, text `#ADB1B8` |

- **Focus:** `:focus` keeps the resting text colour with `outline:none`. With the keyboard (`.is-vue3-keyboard-event`): `outline: 2px solid #4B96F1` (dk `#0D6BDE`) at offset 2px.
- **Loading** (`.is-loading`): `cursor:not-allowed`; `:hover` and `:active` styles are suppressed (`:not(.is-loading)`). Spinner layer: `.zoom-loading.is-inlined-in-button { top:-1px; left:-1px; width:calc(100% + 2px); height:calc(100% + 2px); border-radius:8px }` (sm: 6px), bg `#FFFFFFCC`, with `.zoom-spinners` 16px inside. A label next to the inner icon gets `.is-visible-hidden`.
- **Split button** (`.zoom-dropdown__buttons-group`): main part has the right radii removed. The trigger part gets `border-left:1px solid #DFE3E8` and radius `0 12px 12px 0` (sm 999). An expanded primary stays `#084085`; an expanded secondary stays `#6E76806B`. Secondary inside a group = bg `#0000000A`, text `#222325`.

### 3.2 Prism Button — `.prism-Button-root` (React; Join modal, Admin Center, Activity bell) [M]
The PWA loads the **default Prism theme**, not `.prism-3`, so raw Prism buttons differ from the Workplace look. The PWA overrides each use site, so the Join buttons render as zoom-ui md. Base: `display:inline-flex; border:1px solid; box-sizing:border-box; font-weight: primary 500, others 400; gap 4px`, no transition.

**Sizes** (default theme → `prism-3`)
| Size | min-height | min-width | Padding (block / inline) | Radius | Font | Affix icon |
|---|---|---|---|---|---|---|
| small | 24 | 47 | 3 / 8 → **10** | 6 → **12** | 12/16 400 | 12 |
| medium | 32 | 60 | 5 / 12 → **14** | 8 → **12** | 14/18 400 | 14 |
| large | 40 | 73 | 9 / 16 | 10 → **12** | 16/20 → **14/18** | 16 → **14** |
| extraLarge | 48 | 81 | 13 / 20 | 12 | 16/20 | 16 |
| tertiary inline padding | | | 8 / 12 / 16 / 20 → 8 / **8** / **12** / **16** | | | |
| text (link-style) | auto | auto | 0 | 2 / 4 / 6 / 6 | 10/16, 14/18, 16/20, 24/28 600 | |
| icon-only | 24 / 32 / 40 / 48 square | | 0 | 6 / 8 / 10 / 12 → **50%** | | 14 / 16 / 18 / 20 |

**Variants × states, default theme (light; dark in parentheses)**
| Variant | Default bg / fg / border | Hover | Active |
|---|---|---|---|
| primary | `#0D6BDE` / `#FFF` / `#0D6BDE` | `#0C60C8` (dk `#7DB4F7`), border same | `#084085` |
| secondary | `#FFF` (dk `#222325`) / **`#2A2B2D`** (dk `#F7F9FA`) / **`#939BA4`** (dk `#686F79`) | bg `#6E76801F` | bg `#6E76806B` (dk `#0000006B`) |
| tertiary | transparent / `#0D6BDE` (dk `#4B96F1`) | bg **`#0E72ED1F`**, fg `#0C60C8` | bg `#0E72ED6B`, fg `#084085` |
| overlay | `#0000006B` / `#FFF` | `#0000007A` | `#000000CC` |
| text | transparent / `#0D6BDE` | fg `#0C60C8` | fg `#084085` |
| danger primary | `#DA1639` / `#FFF` | `#C41434` | `#830D23` |
| danger secondary | `#FFF` / `#DA1639` / border `#FF6682` | bg `#E8173D1F` | bg `#E8173D6B` |
| danger tertiary | transparent / `#DA1639` | bg `#E8173D1F`, fg `#C41434` | bg `#E8173D6B`, fg `#830D23` |
| danger text | transparent / `#DA1639` | `#C41434` | `#830D23` |
| icon primary / secondary / overlay | as the text variants | | |
| icon tertiary | transparent / `#2A2B2D` | bg `#6E76801F` | bg `#6E76806B` |
| **disabled** primary | bg `#ADB1B840`, fg `#ADB1B8`, border `#ADB1B840` (dk `#59606940` / `#596069`) | no change | no change |
| disabled secondary | bg `#FFF`, fg `#ADB1B8`, border `#ADB1B840` | | |
| disabled tertiary / overlay | transparent or `#0000006B`, fg `#ADB1B8` | | |
| disabled text / danger-text | fg `#AACDF8` / `#F7BAC6` | | |

**`prism-3` overrides** (the Zoom 2025 look; not active in the PWA but identical to its overrides):
- secondary = `#F1F4F6` / `#0D6BDE` / transparent border, hover `#6E76801F` + `#0C60C8`, active `#6E76806B` + `#084085`
- tertiary hover/active use **neutral** `#6E76801F` / `#6E76806B`
- danger-secondary = `#F1F4F6` / `#DA1639`
- all disabled borders transparent; disabled secondary bg `#ADB1B840`; disabled text `#ADB1B8`
- icon secondary = `#0000000A` / `#2A2B2D` with `blur(30px)`; icon tertiary fg `#555B62`; icon radius 50%
- hero = `#F7F9FA` bg
- home variant = 60×60, radius 20, no border, `#0B5CFF` with radial gradient `#508AFF`, shadow `0 4px 8px rgba(44,104,255,.12)` → hover `0 8px 8px rgba(44,104,255,.24)` and `translateY(-4px)`; highlight variant `#FF5F0F`/`#FFAA00`; danger variant `#DA1639`/`#FF6682`; `transition: .3s cubic-bezier(0,0,.2,1)`. Prism ships this home-action variant, but the PWA uses its own (§3.6).

- **Focus:** `outline:2px solid #4B96F1; outline-offset:2px`, only when `html/body.prism-navigation-with-keyboard`.
- **Loading:** `.prism-Button-loading`: hover and active keep the resting colours, `box-shadow:none`. With `loadingPositionCenter` the label and affix get `visibility:hidden` and `.prism-Button-mask` (absolute, inset 0, flex-centred) shows `.prism-Button-iconLoading`, coloured `#0000008F` (white on primary and overlay).
- **ToggleButton** (Activity bell, `prism-ToggleButton-root`): fg `#2A2B2D`, transparent → hover `#6E76801F` → press `#6E76806B`. Selected: fg `#0D6BDE`, bg `#ECF4FD`; selected hover `#0E72ED66`, selected press `#0E72ED8F` (`prism-3`: `#F2F8FF` / `#0E72ED1F` / `#0E72ED6B`). Disabled fg `#ADB1B8`. Disabled-selected fg `#AACDF8`, bg `#F2F8FF`.
- **PWA site overrides:**
  - `.join-meeting-modal__button{border:none;border-radius:12px;box-shadow:none;font-size:14px;height:32px;letter-spacing:-.15px;line-height:18px;min-height:32px;min-width:unset;padding:6px 14px}`
  - Cancel: `background:#F1F4F6; color:#0D6BDE`
  - Join `:disabled`: `background:#ADB1B840; color:#ADB1B8`
  - Admin Center (`.css-13qub5o`): `color:#555B62; 14px/20px 400; ls -.15px; radius 12; h32; padding 6px 8px; bg transparent`; `:hover,:focus-visible{bg #6E76801F; color #0C60C8}`; `:active,[aria-expanded=true]{bg #6E76803D; color #084085}`

### 3.3 ui-Button — MUI-based, emotion (header Back/Forward/History, search trigger) [M]
Base: `border:1px solid`, `transition: background-color .25s, box-shadow .25s, border-color .25s cubic-bezier(.4,0,.2,1)`, `text-transform:none`. Icon margins: start `0 4px 0 0`, end `4px 0 0 0`. Uses **solid** hover/press colours instead of translucent ones.

| Size | Height | min-width | Padding | Font | Radius | Icon (svg) | Icon-only box / glyph / radius |
|---|---|---|---|---|---|---|---|
| extraSmall | — | — | — | — | — | — | 20 / 12 / 6 |
| small | 24 | 47 | `4px 8px` | 12/16 400 | 6 | 12 (svg 14) | **24 / 14 / 6** (header back/forward/history) |
| medium | 32 | 60 | `6px 12px` | 14/20 400 | 8 | 14 (svg 16) | 32 / 16 / 8 |
| large | 40 | 73 | `10px 16px` | 16/20 **500** | 10 | 16 (svg 18) | 40 / 18 / 10 |
| extraLarge | 48 | 81 | `14px 20px` | 18/20 500 | 12 | 18 (svg 20) | 48 / 20 / 12 |

| Variant | Default bg / fg / border | Hover | Active | Disabled |
|---|---|---|---|---|
| primary | `#0D6BDE` / `#FFF` / `#0D6BDE` | `#0C60C8` | `#084085` | bg and border `rgba(173,177,184,.25)`, fg `#ADB1B8` |
| secondary | `#FFF` / `#2A2B2D` / `#939BA4` | **`#EDEEEF`** | **`#C2C6CA`** | bg `#FFF`, fg `#ADB1B8`, border `rgba(173,177,184,.25)` |
| tertiary (text) | transparent / `#0D6BDE` | bg `rgba(14,114,237,.12)`, fg **`#2057B1`** | bg `rgba(14,114,237,.42)`, fg `#2057B1` | fg `#AACDF8` |
| tertiary (icon) | transparent / `#2A2B2D` | bg `rgba(110,118,128,.12)` | bg `rgba(110,118,128,.42)` | fg `#ADB1B8` |
| overlay (icon) | `rgba(0,0,0,.42)` / `#FFF` | `rgba(0,0,0,.48)` | `rgba(0,0,0,.8)` | fg `#ADB1B8` |
| danger | `#DA1639` / `#FFF` | `#C41434` | `#830D23` | — |
| danger secondary | `#FFF` / `#DA1639` / `#FF6682` | `#FCE3E7` | `#F59EAE` | — |
| danger tertiary | transparent / `#DA1639` | `rgba(232,23,61,.12)` | `rgba(232,23,61,.42)` | — |

- Focus: `:focus-visible` / `.ui-Button-focusVisible` → `outline: 2px solid #4B96F1; outline-offset:2px`.
- Loading: colours are frozen at rest. `.ui-Button-loadingMask` (absolute, inset −1px (secondary 0), radius per size, bg `rgba(255,255,255,.48)`) centres `.ui-Button-loadingIcon` 16px in `rgba(0,0,0,.56)`. Icon-only loading greys the glyph to `rgba(255,255,255,.48)` (primary) or `rgba(0,0,0,.56)` (others).
- `@media (hover:none)` resets hover to the resting colours.
- Header Back/Forward show a disabled fg of `#ADB1B8` when there is no history (measured).

### 3.4 z-button — PWA legacy (Meetings tab) [M]
Base: `inline-flex; border:none; border-radius:6px; padding:6px; white-space:nowrap`. Children are spaced with `margin-right` (4px at 24/32, 8px at 40/48). Focus: `2px solid #4793F1`, offset 2. `:disabled{outline:none}`.

| Size | Height | Padding | Radius | Font |
|---|---|---|---|---|
| 24 | 24 | `0 10px` | 6 | 13/20 |
| 32 | 32 | `0 20px` | 8 | **14/20 700** |
| 40 | 40 | `0 24px` | 10 | 700, lh 24 |
| 48 | 48 | `12px 24px` | 12 | 16/24 700 |

| Type | Default | Hover | Active | `.disabled` |
|---|---|---|---|---|
| normal (Start) | bg `#0E72ED`, fg `#FFF` | `linear-gradient(0deg,#00000017,#00000017), #0E72ED` (≈ `#0D68D8`) | same as hover | bg `#F2F2F7`, fg `#909096` |
| primary (outlined) | bg `#FFF`, border 1px `#0E72ED`, fg `#0E71EB` | bg gradient over `#0E72ED`, border transparent, fg `#FFF` | same | bg `#F2F2F7`, fg `#909096` |
| secondary | bg `#F1F4F6`, fg `#131619` | `#DFE3E8` | `#C1C6CE` | bg `#F1F4F6`, fg `#6E7680` |
| icon | none, fg `#131619`, padding 0 | `#DFE3E8` | `#C1C6CE` | bg `#F1F4F6`, fg `#6E7680` |
| destructive | bg `#DE2828`, fg `#FFF` | gradient 9% black (≈ `#CA2424`) | gradient 18% black (≈ `#B62121`) | `#F2F2F7` / `#909096` |
| text | bg `#FFF`, fg `#0E72ED` | bg `#E7F1FD`, fg `#0862D1` | gradient over `#D7E6F8`, fg `#0862D1` | `#F2F2F7` / `#909096` |
| dark | bg `#FFF`, border 1px `#909096`, fg `#232333` | gradient over `#FFF` (≈ `#E8E8E8`) | same | `#F2F2F7` / `#909096` |
| **tertiary** (Copy Invitation / Edit; via `.meetings__detail-btn-copy|edit|msg-channel`) | bg `#FFF`, border 1px `#DFE3E8`, fg `#131619` | bg `#F7F9FA`, fg `#0E71EB` | (`:focus`) bg `#F1F4F6`, fg `#0E71EB` | bg `#FFF`, fg `#6E7680` |
| tertiary Delete (`.meetings__detail-btn-delete`) | as tertiary | bg `#F7F9FA`, fg **`#E02828`** | focus bg `#F1F4F6`, fg `#E02828` | as tertiary |

Meetings-tab layout: `.meetings__detail-btns{display:flex;flex-wrap:wrap;margin:32px 0}`, children `margin:0 16px 10px 0`, leading icon 12px.

### 3.5 zmu-btn — meeting-UI legacy kit (other.css) [M]
Base: `h32; padding 0 16px; radius 8; border 1px #BABABA; bg #FFF; fg #232333; 14px; line-height 1; transition: all .2s ease-in; outline: 2px solid transparent; outline-offset:1px`. Hover: bg `#EBEBEB`, border `#ADADAD`.

| Variant | Default | Hover |
|---|---|---|
| `--primary` | bg `#0E71EB`, no border, fg `#FFF` | `#2681F2` |
| `--ghost` | transparent, fg `#232333` | bg `#E7F1FD` |
| `--danger` | `#E02828` | `red` |
| `--brown` | `#8B231B` | border `#8B1716` |
| `--sm` | radius 4, 12px, padding `0 6px`, width 60 | |
| `--lg` | h44, radius 4, 16px, width 250 | |
| `--disabled` | opacity .6, `pointer-events:none` | |
| `--icon-only` | 16×16 circle, no border | |

Focus: `.zmu-btn__outline--blue:focus{outline:2px solid #0E71EB;outline-offset:1px}` (white variant on dark). Loading: `.loading` 26×26, `margin-left:10px`, `rotate 1.5s linear infinite`. Icons 16px with 4px gap.

### 3.6 Bespoke PWA buttons [M]
| Component | Spec |
|---|---|
| **Home action** (`.main__action-btn`, standard layout) | 56×56, radius 20, padding 14, glyph 28 (`svg 28×28`), `margin-bottom:12px`, no border. Label 14/16 400 `#6E7680`, nowrap; disabled label `#909096`. **Orange** (New meeting, Return): `#FF742E` → `:active #E56829`, `:disabled #F9CBB7`. **Blue** (Join, Schedule, My notes, Search): `#0E71EB` → `:active #0C63CE`, `:disabled #B1C7F6`. Hover and focus: `translateY(-4px)` + `box-shadow:0 4px 11px 0 #B3B3B3`, `transition: transform .15s ease, box-shadow .15s ease`. Disabled: no transform, shadow or transition, `cursor:auto`. A disabled Schedule shows a rotating spinner (`rotate-infinite 1s linear infinite`) in `:before`. |
| **New-meeting chevron** (`.start-label__icon`) | No bg or border, radius 30%, fg `#0404138F`, `margin-left:4px`, padding `.125em` (renders 17×17); hover/focus bg `#F2F2F7`. |
| **Rail tab** (`.home-header__tab`) | 72×56 (min 72/56), radius 8, padding `12px 0 8px`, fg `#555B62` (dk `#DFE3E8`). Hover: bg `#6E76801F`, fg `#222325`. Selected: bg `#FFF` (dk `#222325`), fg `#222325`; the selected-with-hover state keeps white. Focus: global ring at `outline-offset:-4px`. `.isNotDragging:hover` has a transparent bg during drag. Selected tabs render four 10px corner pieces (`.shape1–4`, `#FFF` / `#E2E6E9`, radius 10/8) to create the "tab merges into card" notch. Tabs are separated by a 2px gap. |
| **Header item** (Admin Center) | §3.2 site override. |
| **Download link** (`DownloadNav_link`) | h32, padding `6px 14px`, radius 12, bg `#F1F4F6`, fg `#0D6BDE` 14/18 400 ls −.15px. `:hover,:focus-visible` bg `#6E76801F` fg `#0C60C8`. `:active` bg `#6E76803D` fg `#084085`. Focus-visible outline `2px solid #0D6BDE` offset 2. |
| **Search trigger** | 410×32 (≤1080px: 32×32 icon), bg `#ECEFF1`, radius 8. Themed header: bg `#FFFFFF29`, hover `#FFFFFF38`, press `#FFFFFF47`. Collapsed icon hover `#52528017`, press `#5252802E`. Focus-visible `2px solid #4B96F1` offset 2. |
| **Hub entry** (`.home-hub-entries_entry`) | 189×56 link, bg `#FFF`, border 1px `#DFE3E8`, radius 16, padding `8px 16px`. Focus-visible `2px solid #0E72ED` offset 2. Hover is not in CSS [D: `bg #F7F9FA`]. |
| **Meetings refresh** (`.meetings-container__left-header__refresh`) | 21×23, radius 4, padding 4, bg `#FFF`. |

---

## 4. Form controls

### 4.1 Text input — zoom-ui `.zoom-input` [M]
| Size | Inner height | Padding | Radius | Font | Leading icon | Trailing icon |
|---|---|---|---|---|---|---|
| sm | 24 | `4px 7px` (leaded `5px/23px`, trailed right 25) | 8 | 12/16 | top 6, left 8, 12px | top 4, right 6 |
| md | 32 | `6px 11px` (leaded `7px/27px`, trailed right 31) | 12 | 14/18 | top 9, left 10, 14px, `#686F79` | top 7, right 8 |
| lg | 40 | `6px 15px` (leaded `11px/31px`, trailed right 35) | 12 | 14/18 (addons 16/20) | top 13, left 14 | top 11, right 14 |

| State | Border | Bg | Text / placeholder | Extra |
|---|---|---|---|---|
| default | 1px `#C1C6CE` (dk `#555B62`) | transparent | `#222325` / `#686F79` | `outline:none` (`:focus-visible`) |
| hover (not focus, disabled, readonly or bare) | same | **`#6E76801F`** (dk `#6E768054`) | placeholder `#5E646D` (dk `#B6BAC0`) | |
| focus | `#4B96F1` (dk `#0D6BDE`) | transparent | | `box-shadow: inset 0 0 0 1px #4B96F1` |
| error `.is-errored` | `#FF6682` (dk `#DA1639`) | | | focus shadow `inset 0 0 0 1px #FF6682` |
| disabled | `#ADB1B840` | — | `#ADB1B8` / `#ADB1B8` | `cursor:not-allowed` |
| readonly | `#C1C6CE` | `#F7F9FA` (dk `#2A2B2D`) | `#686F79` | `cursor:not-allowed` |
| prepend / append addon | 1px `#C1C6CE`, joined edge none | `#F7F9FA` | `#686F79` 14/18 | padding `6px 7px`, radius `12px 0 0 12px` / `0 12px 12px 0` |
| counter | — | — | 12/16 `#686F79`; exceeded `#DA1639` | `.is-counted{padding-bottom:20px}` |

**Join-modal input (PWA)**: 384×40, bg `#FFF`, 1px `#C1C6CE`, radius 12, padding `6px 40px 6px 16px`, 14/18 `#222325`, ls −.15px, `outline:none`, **no focus style**. The history toggle is 24×24 at right 8 / top 30, radius 999, fg `#555B62`, glyph 14, hover/focus bg `#F1F4F6`.
**zmu text input** (meeting kit): wrapper h40, 1px `#BABABA`, radius 10, padding `7px 12px`; focused border `#0E71EB`; selection `#E7F1FD`.
**Legacy invite-modal input**: focus `box-shadow: 0 0 0 3px #0E72ED2E`, error `0 0 0 3px #DE282829`, `transition .15s ease`.

### 4.2 Textarea — `.zoom-textarea` [M]
Default 60px tall, padding `8px 12px`, radius 12, 14/18, `resize:vertical`. sm: 48px, padding 8, radius 8, 12/16. lg: 72px, padding `12px 16px`. All states equal the input. Counter `margin-top:4px` 12/16.

### 4.3 Select — `.zoom-select-input`, `.zoom-select-option` [M]
- **Field:** 1px `#C1C6CE`, radius 12 (sm 8), `cursor:pointer`.
  - Wrapper: min-height 30 (sm 22, lg 38); padding left 11 / right 31 (sm 7/25, lg 15/35); with a lead icon, left 27 (sm 23, lg 31).
  - Value span 14/18 `#222325`; placeholder `#686F79`; disabled `#ADB1B8`.
  - Chevron is absolute at right 9 (sm 5, lg 13), vertically centred. Clear icon at the same spot.
  - Hover: bg `#6E76801F`, placeholder `#5E646D`. Keyboard focus: border `#4B96F1` + inset 1px. Error: border `#FF6682`. Disabled: border `#ADB1B840`.
  - Multi-select tags: `margin:4px 4px 0 0`.
- **Option:**
  - `display:flex; min-height:32px; padding:6px 8px; radius 8`.
  - Content 14/18 `#222325`, description `#686F79`.
  - Hover: bg `#6E76801F`. Keyboard focus: outline `2px solid #4B96F1` offset 2.
  - Disabled: `#ADB1B8`.
  - Selected: checkmark icon 16px `#222325`, `margin-left:8px`; siblings of the selected option reserve `padding-right:32px`.
- **Group:** title padding 8, 12/16 `#686F79`. Between groups: `padding-bottom:16px` and a 1px `#DFE3E8` rule inset 8px at bottom 8.
- **Listbox item** (generic menu row): min-height 32, padding `6px 8px`, **radius 12**, bg `#FFF`, 14/18 `#222325`.
  - Left/right slots get an 8px gap; desc 12/16 `#686F79`; icon 16.
  - Option hover `#6E76801F`, active `#6E76806B`.
  - `.is-hairline` adds a 1px `#DFE3E8` bottom rule (radius 0 on hover).
  - Danger `#DA1639`; disabled `#ADB1B8`.

### 4.4 Checkbox [M]
| Part | zoom-ui `.zoom-checkbox` | PWA `.zm-pwa-checkbox` (New-meeting popover) |
|---|---|---|
| Box | 16×16, radius 4, 1px `#939BA4` (dk `#686F79`), `top:2px` | 16×16, radius 4, 1px **`#BABACC`**, glyph font-size 10, fg `#FFF` |
| Hover | bg `#6E76801F`, border `#939BA4` | — |
| Press | bg `#6E76806B` | — |
| Checked | bg and border `#0D6BDE`; check = rotated 45° L drawn with 2 bars (2×9 at 7,3 and 5×2 at 4,10), colour `#F7F9FA` (dk `#1D1E20`) | bg **`#0E71EB`**, `border:0`, white check icon |
| Checked hover / press | `#0C60C8` / `#084085` | — |
| Indeterminate | bg `#0D6BDE`, bar 10×2 at top 6, left 2, radius 2, `#F7F9FA` | — |
| Disabled | label `#ADB1B8`; box border `#ADB1B8`, bg `#ADB1B840` | mark bg `#D0E3FB`, border 1px `#F1F4F6`; text `#6E7680` |
| Disabled checked | bg and border `#AACDF8` (dk `#2B4588`) | — |
| Label | `margin-left:8px; padding:1px 0`, 14/18, `#222325` | `margin-left:8px`, 14px `#232333` |
| Description | 12/16 `#686F79`, `margin-top:4px; padding-left:22px` | — |
| Focus | keyboard: `outline 2px solid #4B96F1` offset 2 on the box | `.checkbox--focused` → `2px solid #2D8CFF` offset 1 |
| Motion | `border-color .2s, background-color .2s cubic-bezier(.71,-.46,.29,1.46)` | none |
| Group | horizontal `margin-right:24px`; vertical `margin-top:8px`; menu style rows `padding:6px 8px` | — |

ui-Checkbox (emotion): label `margin-inline-start:6px`, 14/20 `#2A2B2D`, description 14/20 `#686F79` indented 26px. zmu-checkbox: 16px icon images, label 14px, focus `2px solid #0E71EB` offset 1.

### 4.5 Radio — `.zoom-radio` [M]
16×16 circle, 1px `#939BA4`, `margin-right:8px`. Hover bg `#6E76801F`, press `#6E76806B`. Checked: bg and border `#0D6BDE`, white knob 8×8 (`transition: transform .15s ease-in`, `scale(0)`→`scale(1)`). Checked hover `#0C60C8`, press `#084085`. Disabled: border `#ADB1B8`, bg `#ADB1B840`, label `#ADB1B8`. Disabled checked: bg and border `#ADB1B8`. Label 14/18 `#222325`. Wrapper min-height 20. Horizontal group `margin-right:32px`; vertical `margin-bottom:8px`. Title 14/18 600, `margin-bottom:8px`. Description 12/16 `#686F79`, `padding-left:24px`. Keyboard focus outline `2px solid #4B96F1`.

### 4.6 Toggle / switch — `.zoom-toggle` [M]
| Size | Track | Knob off | Knob on | Shift |
|---|---|---|---|---|
| md | 36×20, radius 999 | 12×12 at left 3, bottom 3 | 16×16 at bottom 1 | `translateX(14px)` |
| sm | 28×16, radius 8 | 9×9 at bottom 2.5 | 12×12 at bottom 1 | `translateX(10px)` |

| State | Track | Knob |
|---|---|---|
| off | 1px `#555B62` (dk `#C1C6CE`) border, bg `#FFF` (dk `#222325`) | `#555B62` (dk `#DFE3E8`) |
| off hover / press | bg `#6E76801F` / `#6E76806B` | — |
| on | bg and border `#0D6BDE` | `#FFF` |
| on hover / press | `#0C60C8` / `#084085` | — |
| disabled off | border `#DFE3E8`, bg transparent | `#ADB1B840` |
| disabled on | bg and border `#AACDF8` | `#FFFFFF7A` |
| loading | knob hidden (shown again when on); 12px spinner at left 1 (right 2 when on) | |

Focus: `2px solid #4B96F1` offset 2 (keyboard). Motion: track `transform .3s`, knob `transition:.3s`. **zmu-switch** (meeting kit): 40×24, radius 12, off `#747487`, on `#0E71EB`, knob 20×20 white at left 1 → 17, `transition .3s`; focus `0 0 0 2px #FFF, 0 0 0 4px #0E71EB`; disabled opacity .6.

### 4.7 Segmented control — `.zoom-segment-list` / `.zoom-segment-item` [M]
- **Track:** `display:inline-block; padding:2px; radius 999; bg #0000000A (dk #FFFFFF0A); backdrop-filter: blur(15px)`. `.is-block` makes it full width with equal items.
- **Item:**
  - `min-height:28px; padding:0 8px; gap:4px; radius 999`; 14/18 400 `#222325`; items 2px apart; `transition: color .1s ease-in-out`.
  - Hover (not active): bg `#6E76801F`. Press: bg `#6E76806B`.
  - **Active:** bg `#FFFFFFCC` (dk `#313235E6`), `box-shadow: 0 4px 8px 0 #00000014, 0 2px 4px 0 #00000014`, `blur(15px)`. A sliding thumb (`.zoom-segment-list-thumb`) has the same style.
  - Disabled `#ADB1B8`. Focus-visible `2px solid #4B96F1` offset 2. Icon 14px.
- **PWA "app-segmented-tabs"** (Prism Tabs override in main.css): list bg `#52528017`, radius 8, height 24, `margin:16px 12px`. Tab: 11px 700 `#747487`, padding `0 10px`, radius 7. Selected: bg `#FFF` + `0 1px 4px #22223014`.

### 4.8 Tabs — `.zoom-tabs` [M]
- **Primary (underline):**
  - Nav line 1px `#DFE3E8` at bottom.
  - Items 14/18 **500** `#686F79`, `padding:4px 0; margin-right:16px`; the label inside has `padding:3px 2px; radius 6; gap 4`.
  - Hover: label bg `#6E76801F`, fg `#5E646D`. Press: label bg `#6E76806B`, fg `#3E4349`.
  - **Active:** fg `#222325`, no hover bg. Active bar 1px `#0D6BDE` (dk `#4B96F1`), `transition: all .3s ease-in-out`.
  - Disabled `#ADB1B8`.
  - Large: 16px 600, item `padding:4px 0`, label `padding:6px 2px`.
  - Overflow: 32px scroll buttons with 16px white fade gradients.
  - Keyboard focus outline `2px solid #4B96F1` offset −2.
- **Secondary (pill):** no line or bar. Items `padding:3px 6px; radius 999; margin-right:8px; bg #0000000A; weight 400`; hover `#6E76801F`; press `#6E76806B`; **active bg `#ECF4FD` (dk `#1B2749`), label `#0D6BDE`**; disabled bg `#F7F9FA`, label `#ADB1B8`.
- **zmu-tabs** (meeting kit): active `#2D8CFF`, disabled `#00000040`, focus `1px solid #2D8CFF` offset 1, bar spacing 20px.

---

## 5. Overlays

### 5.1 Tooltip [M]
| Property | **Prism Tooltip** (PWA header bell, Meetings "Copy Invitation") | **zoom-ui / common-header tooltip** (`.zoom-floating.is-tooltip` + `.zoom-tooltip`) | zmu |
|---|---|---|---|
| Background | `#FFFFFF` | `#000000A3` (dk `#FFFFFFCC`) + `backdrop-filter: blur(15px)` | white paper, radius 12, padding 16, shadow `0 0 10px 1px rgba(0,0,0,.075)`; settings tip radius 8, padding 10, 13px `#222230`, shadow `0 4px 10px #0000004D` |
| Border | 1px `#DFE3E8` | none | 1px `#EBEBEB` |
| Text | 12/16 400 **`#2A2B2D`** | 12/16 400 `#FFFFFF` (dk `#131619`) | — |
| Radius | 4 | 4 | — |
| Padding | `3px 6px` | `2px 6px` | — |
| Shadow | `--shadow-sm` | `--zoom-box-shadow-small` | — |
| Max width | 360 | 320, `overflow-wrap:break-word` | — |
| Arrow | none by default (`withArrow` variant: arrow 8px ×1.414, radius `50% 0 4px 0`, padding 12, radius 10, 14/18, `--shadow-md`) | 14×14 rotated square with 1px border, corner radius 3 | 12×12 rotated |
| z-index | 1500 | 2000 | 1010 |
| Offset | 8px below the trigger (bell bottom 48 → tooltip top 56) | — | — |
| Delay | enter ≈ 0 (DOM mounted ≤10 ms after `pointerenter`) | not in CSS [D: 0 ms enter, 0 ms leave] | — |
| Motion | `opacity .3s cubic-bezier(.4,0,.2,1)` | `opacity .2s, transform .2s cubic-bezier(.4,0,.2,1)`, from `scale(0)` | — |
| Shortcut label | `#686F79`, `margin-inline-start:6px` (`prism-3`: white, wrapped in "( )") | — | — |

`prism-3` tooltip (not active in the PWA) = the dark zoom-ui look: bg `#000000A3` + blur(15px), padding `1px 5px`, no border, white.

### 5.2 Popover / menu [M]
| Property | **Prism Popover** (New-meeting options) | **zoom-ui floating menu** (`.zoom-floating`, dropdowns, select lists, profile menu) | ui-Popover (emotion) |
|---|---|---|---|
| Bg / border | `#FFF` / 1px `#DFE3E8` | `#FFF` (dk `#222325`) / 1px `#DFE3E8` (dk `#313235`) | `#FFF` / 1px `#DFE3E8` |
| Radius | **10** (complex 10; `prism-3`: 16 / 24) | **12**; `.is-popover-container` 16, complex 24 | 8 |
| Shadow | `--shadow-md` | `--zoom-box-shadow` (= md) | `0 24px 48px #00000014, 0 12px 24px #00000014` |
| Padding | body 12 (`prism-3` 16); complex 12 (24). PWA sets `.start-meeting-popover .prism-Popover-body{padding:0!important}` | dropdown menu 12; zoom-popover 16, complex 24 | 12, width 250, max 400 |
| Max width | 360 | zoom-popover 360; info-popover 320 | 400 |
| Title | `margin-bottom:4px`, `#2A2B2D` | 14/18 600, `mb 4`; complex 20/24 700, `mb 16` | 16/20 600 |
| Close button | inset −6px, `margin-inline-start:8px` | absolute top 16, right 16 (complex 24) | right −6, top −6 |
| Footer | `margin-top:16px; gap:8px; justify-content:flex-end` | `.zoom-popover__actionable{margin-top:16px;text-align:right}` (complex 24) | `margin-top:16px`, OK button `margin-inline-start:8px` |
| Arrow | 8px × 1.414 square, radius `50% 0 4px 0` (`prism-3` 10.5px, 3px) | 14×14, border 1px, corner radius 3 | 1em × .71em |
| z-index | 1300 (`--zIndex-Popover`) | 2000 | 1300 |
| Motion | `opacity .3s cubic-bezier(.4,0,.2,1)` | `zoom-in-top`: `transform .3s, opacity .3s cubic-bezier(.23,1,.32,1)` from `scaleY(0)` | — |
| Offset | 8px from the trigger (chevron bottom 313 → popover top 321) | profile menu top 52 (avatar bottom 48 → 4px), right-aligned to the avatar | — |

**Menu rows**
| Row type | Height | Padding | Radius | Font / colour | Hover / active |
|---|---|---|---|---|---|
| zoom-ui dropdown item | min 28 | `6px 8px` | 8 | 14/18 `#222325`, icon `margin-right:8px` | `#6E76801F` / `#6E76806B`; disabled `#ADB1B8`; danger `#DA1639` (disabled danger `#F7BAC6`) |
| zoom-ui dropdown group | — | 8; later groups `margin-top:8px; padding-top:16px` with a 1px `#DFE3E8` line inset 8 | 8 | 12/16 `#686F79` | — |
| **Profile menu row** (common-header) | 32 | content `7px 8px` | 8 | 14/18 `#222325`, 16px icon + 8px gap, trailing chevron 14px | `#6E76801F` / `#6E76806B`; `.is-active` bg `#6E76801F` |
| Profile separator | 9 | `padding-top:8px` + 1px `#DFE3E8` border-top (`margin:8px 8px 0` when empty) | — | section label 12/16 `#686F79` | — |
| Profile identity row | 52 | — | 8 | avatar 32 (radius 10) + name 14/18 `#222325` + email 12/16 `#686F79` | — |
| **New-meeting option block** (PWA) | 50 | 16 | 0 | 14px `#232333`; 1px `#EDEDF3` bottom border except the last | **bg `#0E71EB`, text `#FFF`** (also `[aria-expanded=true]`) |
| **Meeting-history row** (Join dropdown) | 32 | `0 12px` | — | topic 14/20 500 `#131619`; number 12/16 `#6E7680`; 13/24 | hover/focus bg `#0E72ED`, all text `#FFF` |
| Meeting-history container | — | — | 8 | bg `#FFF`, border 1px `#BABACC33`, shadow `0 8px 24px #2323331A`, `top:calc(100% + 4px)`, z 10 | "Clear history" `#4793F1` 500, 32px |

Profile menu container [M]: 268 wide at x=1082, y=52, 1px `#DFE3E8`, radius 12, `--shadow-md`, inner padding 12 (rows at x=1095), scrollable with the zoom-ui scrollbar (§6.8). Info banner and button: §6.1.

### 5.3 Dialog / modal [M]
| Property | **PWA Join modal** (`.join-meeting-modal`) | zoom-ui `.zoom-dialog` | zoom-ui message box | ui-Dialog (emotion) |
|---|---|---|---|---|
| Overlay | `.pwa-modal__overlay--on`, `position:fixed; inset:0`, overridden to `#0003`. Default PWA overlay is `rgba(255,255,255,.75)`. z 1001. Centred via `.pwa-modal__content--centered` (flex). | `.zoom-overlay` `#00000033` (dk `#00000085`), `overflow:auto` | same | backdrop `rgba(0,0,0,.2)`, z 1300 |
| Width | `min(448px, 100vw - 48px)`; max-height `min(100vh - 40px, 520px)` | sm 448 / md 684 / lg 920 / fullscreen 100% (radius 0) | 448 | 560 (`--dialog-margin:32px`) |
| Radius | **32** | 32 | 32 | — |
| Shadow | `0 6px 12px #00000014, 0 12px 24px #00000014` | `--zoom-box-shadow` | same | — |
| Padding | 32 all round | header `32px 32px 24px`; body `0 32px`; footer 32 | 32 | title `24px 24px 16px`; content `24px 24px 4px`; footer 24 |
| Title | 20/24 700 `#222325`, ls −.45px | 20/24 700 `#222325`, `padding-right:40px` | 20/24 700 | 20/24 600 `#2A2B2D` |
| Body | label 14/18 `mb 4`; form `margin-top:24px` | 14/18 `#222325` | 14/18 | 14/20 |
| Footer | `display:flex; gap:16px; justify-content:flex-end; margin-top:32px` | `text-align:right`; adjacent buttons 8px apart | `display:flex; gap:8px` (`padding-top:32px`) | divider `inset 0 1px #DFE3E8` until scrolled to the bottom |
| Close button | none | zoom-button sm/md tertiary icon at absolute top 28, right 32 | — | right 24, top 24 |
| Elevated header / footer | — | `box-shadow: 0 1px 0 0 #00000014` / `0 -1px 0 0 #00000014` | — | title divider `inset 0 -1px #DFE3E8` |
| Motion | none in CSS (react-modal) | `fade-in-linear-in/out .3s` | `modal-fade-in/out .3s` | — |
| Focus trap | Prism FocusTrap sentinel (`position:fixed`) | — | — | — |

Drawer (zoom-ui): close at absolute top 28, right 32 (same as dialog).

### 5.4 Toasts [M]
| Property | **PWA toast** (react-toastify + `.zm__toast-*`) | zoom-ui `.zoom-toast` | zmu notification |
|---|---|---|---|
| Container | `top:50px`, width 320 (toastify default), z 9999, padding 4 | fixed, right/left 16 or centred (`translateX(-50%)`) | inline, `max-width:70%`, `margin-top:10px` |
| Card | bg `#FFF`, 1px `#C1C6CE`, radius 10, min-height 40, padding 8 (body 2), shadow `0 24px 48px rgba(19,22,25,.2), 0 12px 24px rgba(19,22,25,.1)`, `backdrop-filter:blur(10px)` | width 400, padding 16, 1px `#DFE3E8`, radius 16, `--zoom-box-shadow` | success `#E4F7EB`/`#1C7E41`; info `#000000B3`/`#F5F5F5`; error `#FFE8E8`/`#B22424`; warning `#FCF6ED`/`#775111`; primary `#0E71EB`/`#FFF`; sizes 14/18 `8px 12px`, 16/22 `8px 12px`, 16/22 `12px` |
| Icon | 24px, padding `0 15px 0 6px`; success `#268543`, info `#0E72ED`, warn `#B36200`, failure `#E8173D` | `align-self:flex-start` | — |
| Text | title bold `#131619` `mb 4`; desc `#131619` 14/20 | title 14/18 600 `mb 4`; content 14/20; body `margin:0 12px` | — |
| Close | `margin-right:8px`, `#131619`, svg 14×14, hover opacity .8 | — | — |
| Motion | `animation-duration:10ms !important` (instant) | `opacity .3s, transform .3s`, slide from `translateX(100%)` | `fadeout .6s` |

---

## 6. Feedback

### 6.1 Banner — `.zoom-banner` / `.common-header-banner` [M]
Box: `padding:16px; border:1px solid; radius 12; opacity 1; transition: opacity .3s`. `.is-closable` adds `padding-right:47px`, with the close button at absolute top 13, right 13. `.is-bleed` = no radius, bottom border only. Layout: icon (20px, `align-self:start`) → body (`margin:0 8px 0 12px`) → actions (`align-self:start`; bottom actions `margin-top:8px`). Title 14/18 **600**; content 14/18 400 (`margin-top:4px` when gapped). Text `#222325`.

| Variant | Bg | White layer (`background-image: linear-gradient(...)`) | Border | Icon colour | Dark bg / border |
|---|---|---|---|---|---|
| info | `#F2F8FF` | `#FFFFFF99` | `#A8CCF8` | `#3B90F7` | `#1A2A52` / `#213C77` |
| success | `#F2FFF6` | `#FFFFFF66` | `#9ECEAD` | `#09A639` | `#123019` / `#174823` |
| warning | `#FFF9F2` | `#FFFFFF80` | `#E1BD93` | `#B36200` (dk `#C28030`) | `#492B0D` / `#5D350E` |
| danger | `#FFF2F5` | `#FFFFFF99` | `#F6AAB8` | `#FF2638` | `#54171A` / `#771D23` |

Profile-menu banner [M]: 242×120, info variant, icon hidden (`.common-header-profile__upgrade-banner .common-header-banner__icon{display:none}`). Title "Get more from Zoom" 14/18 600. Body 12/16. Button `common-header-button--sm --primary` 101×24, radius 999, padding `2px 10px`, 12/16 500.
ui-Banner (emotion): min-height 52, padding 16. Info `#F2F8FF`/`#4B96F1`; success `#F2FFF6`/`#48AD67`; warning `#FFF9F2`/`#C28030`; error `#FFF2F5`/`#FF6682`. Icon 20 (info `#3B90F7`, success `#09A639`, warn `#FFD700`, error `#FF2638`). Message 14/20 `#2A2B2D`; title 16 600. Inline variant: radius 8, padding 8, min-height 36.

### 6.2 Badge — `.zoom-badge` [M]
| Type | Spec |
|---|---|
| Notifier dot | 8×8 circle `#DA1639`; xs 6, md 12, lg 16, xl 18; `.is-blue` `#0D6BDE` (dk `#A8CCF8`); positioned `top:0; right:0; translate(30%,-30%)` |
| Counter | `padding:2px 4px; radius 9999`, bg `#DA1639`, fg `#FFF`, 8/12 600 (sm padding `1px 3px`); round 16×16 (sm 14); `.is-blue`, `.is-grey` (`#F1F4F6`/`#686F79`) |
| Custom (label chip) | max-height 16, padding `0 4px`, radius 999, 1px border, 10/16 500 (sm 8/12 600, padding `1px 4px`). blue `#F2F8FF`/`#A8CCF8`/`#2057B1`; gray `#F7F9FA`/`#DFE3E8`/`#555B62`; green `#F2FFF6`/`#9ECEAD`/`#196830`; orange `#FFF7F2`/`#FFAB81`/`#9D3B0F`; yellow `#FFF9F2`/`#E1BD93`/`#884B0A`; red `#FFF2F5`/`#F6AAB8`/`#AF1E30`; purple `#F7F2FB`/`#EBDDF6`/`#73439A`; cyan `#D4FCFB`/`#61F6F2`/`#006462` (bg/border/text) |
| Cut-out | 1.5px solid `#FFF` (dk `#131619`) ring |
| Top-right anchor | `translate(50%,-50%)` |

### 6.3 Tag — `.zoom-tag` [M]
`min-height:20px; padding:2px 6px; radius 5; bg #F7F9FA`. Label 12/16 400, max-width 144, ellipsis. Adjacent tags 6px apart. sm: min-height 16, padding `0 4px`, radius 4. lg: min-height 24, radius 6. Danger: 1px `#FF6682`, fg `#DA1639`. Disabled: bg `#ADB1B840`, fg `#ADB1B8`. Close icon 16px, radius 4, `margin-left:4px`, hover `#6E76801F`, press `#6E76806B`. Avatar inside: 16×16 (lg 20), `margin-right:4px`.

### 6.4 Avatar — `.zoom-avatar` / `.common-header-avatar` [M]
| Size | Box | Initials font | Icon font |
|---|---|---|---|
| xs | 20 | 8 | 12 |
| sm (default) | 24 | 10 | 14 |
| md | 32 | 14 | 18 |
| lg | 40 | 16 | 20 |
| lgm | 48 | 20 | 24 |
| lx | 64 | 24 | 28 |
| lgx | 80 | 36 | 40 |
| xl | 110 | 44 | 48 |

- Initials: `#FFFFFF`, weight 600, `line-height = box`, centred.
- **Radius: Workplace 10px** (`.common-header-avatar, .common-header-avatar__inner{border-radius:10px}`). zoom-ui default: 999px (circle).
- `.is-maximum` (group "+N") widths: xs 32, sm 40, md 48, lg 56.
- Icon fallback: bg `#F1F4F6`, fg `#686F79`.
- **Background palette** (class → colour): `--green #247F40`, `--purple #9053C2`, `--teal #007C7C`, `--steel #2974A8`, `--gray #555B62`, `--orange #9D3B0F`, `--yellow #B36200`, `--red #DA1639`. The current user renders `--purple`. The palette index is chosen in JS; recommended clone rule: `hash(userId) % 8` in the order listed [D].
- Interactive (`.is-interactive`): hover overlay `:after` `#0000001F` (dk `#FFFFFF54`), active `#0000006B`, disabled `#FFFFFF99`. Keyboard focus `2px solid #4B96F1` offset 2. The PWA header avatar container shows hover `:after #52528017` and active `#5252802E`.

### 6.5 Presence [M]
Glyphs are 10×10 SVGs (viewBox 8×8; meeting 9×8), drawn as `::before` (`display:inline-block; 10×10; margin-right:10px; vertical-align:middle`) or inline in `.common-header-avatar__status-icon` (absolute, top −2.5px, right −5.28px on a 32px avatar). The legacy `.presence__container` is a 10×10 white circle with 1px white border and padding 5, at `top:0; right:0; translate(40%,-40%)`.

| Status | Colour | Glyph | File |
|---|---|---|---|
| Available | `#09A639` | filled circle | `ds-presence-available.svg` |
| Mobile | `#09A639` | phone outline | `ds-presence-mobile.svg` |
| Busy | `#FF2638` | circle with × cut-out | `ds-presence-busy.svg` |
| Do not disturb | `#FF2638` + white bar | circle with − | `ds-presence-dnd.svg` |
| Away | `#8E9194` + white clock hands | clock | `ds-presence-away.svg` |
| Out of office | `#8E9194` | × over outline | `ds-presence-ooo.svg` |
| Offline | `#8E9194` | ring (1.2-unit stroke) | `ds-presence-offline.svg` |
| In a meeting | `#FF5500` | camera (16×10 on the header avatar) | `ds-presence-meeting.svg` |
| In calendar event | `#FF5500` | calendar | `ds-presence-calendar.svg` |
| On a call (PBX) | `#FF5500` | phone handset | `ds-presence-pbx.svg` |

Status icon colours (`.zoom-status-icon`, 20px): success `#09A639`, danger `#FF2638`, warning `#B36200`, info `#3B90F7`.

### 6.6 Skeleton [M]
`.zoom-skeleton__item{width:100%;height:20px;border-radius:4px;background:#0000000A}` (dk `#FFFFFF0A`). The profile-menu skeleton measured `rgba(0,0,0,.04)`, 20px bars in 32px rows with padding `6px 8px`, widths 146/183/133/163. Spacing `.is-has-space{margin-top:8px}`; last text line 66% wide. Circle 60×60; button 60×32 radius 8. Image placeholder svg 22% in `#6E7680`. Animated: `skeleton-pulse 1.5s ease-in-out infinite`. PRD §12's "`#F1F4F6` blocks radius 12" are for page-level placeholders and remain [D].

### 6.7 Spinners and loading [M]
- **zoom-spinners**: 8 spokes. Box 16 (sm) / 24 (smx) / 32 (md) / 48 (lg). Spoke width 2/3/4/6 px with equal radius, height 25%, at `top:38%; left:46%`. Each spoke rotated in 45° steps from −135° with `translateY(-120%)`. Colour `#0000008F` (dk `#FFFFFF7A`); `.is-light` `hsla(0,0%,100%,.48)`; `.is-dark` `rgba(0,0,0,.56)`. Animation `spinner-fade .8s linear infinite`. Circle style: colour `#0D6BDE`, `loading-circle 1s linear infinite`.
- **Loading mask** `.zoom-loading`: absolute inset 0, z 100 (fullscreen fixed, 9999), bg `#FFFFFFCC` (dk `#000000CC`), `transition:opacity .3s`. Text 12/16 (`.is-lg` 14/18) `#222325`, `margin-top:8px`. `.zoom-loading__wrapper.is-active`: padding 16, radius 16, bg `#FFFFFFB3` + blur(15px).
- **ui-Spinning**: 16px, 8 spikes 2×4 black at opacity .4 → .08, `antSpinRotate 1.5s linear infinite`; text 10px.

### 6.8 Scrollbars [M]
| Type | Spec |
|---|---|
| zoom-ui overlay scrollbar (profile menu, calendar) | Track absolute right/bottom 0, z 10, radius 6, **6px** wide (vertical starts at top 2); opacity 0 → 1 on container hover, focus or scroll (`opacity .3s ease-out`). Thumb `#0000006B` (dk `#FFFFFF54`); dragging `#0000008F`; radius inherited; hit-area widened 12px via `:after`; `transition: background-color .3s`. |
| PWA webkit lists (meetings groups, upcoming, contacts, meeting history) | `::-webkit-scrollbar{width:8px}` (invitation content and settings 6px). Track `#0000000F`, radius 3, `inset 0 0 5px #00000014`. Thumb `#0000001F`, radius 3, `inset 0 0 10px #0003`. |
| Language dialog | 6px, transparent track, thumb `#13161980` radius 5, hover `#555`. |
| Hidden | `.zoom-scrollbar__wrap--hidden` → `scrollbar-width:none` / `::-webkit-scrollbar{display:none}`. |

### 6.9 Link and divider [M]
`.zoom-link`: `inline-flex; radius 4`, fg `#0D6BDE` (dk `#4B96F1`), no underline. Hover: **underline** + `#0C60C8`. Active: underline + `#084085`. Disabled `#ADB1B8`. Arrow icon `margin-left:4px`. Sizes: sm 12/16, md 14/18, lg and xl 16/20. Divider: 1px `#DFE3E8` (dk `#313235`); balanced variant inset 16/16; indent variant left 32.

---

## 7. `tokens.css` (summary of `docs/requirements/06-tokens.css`)
1. **Layer 1:** all 256 `--zoom-color-*` light values (verbatim, normalised to `#RRGGBB[AA]`).
2. **Layer 2:** `--zoom-base-outline`, `--zoom-box-shadow-{xs,small,,large}`.
3. **Layer 3:** Prism `--typography-*` (fontSize, lineHeight and fontWeight for display … paragraph-1), `--zIndex-*`, `--shadow-{xs,sm,md,lg}`, plus every Prism semantic colour (`--bg-*`, `--fill-*`, `--text-*`, `--icon-*`, `--border-*`, `--state-*`, `--component-*`).
4. **Layer 4:** `--zc-*` PWA hard-coded colours.
5. **Layer 5:** component variables:
   - `--font-*`, `--focus-ring*`, `--ease-*`, `--dur-*`
   - `--btn-*`: Workplace look with every variant, state and size, plus `--prism-btn-*` default-theme metrics
   - `--home-action-*`, `--header-item-*`, `--rail-tab-*`, `--zbtn-*`
   - `--input-*`, `--textarea-*`, `--menu-*`, `--popover-*`, `--popper-*`, `--tooltip-*`, `--dialog-*`, `--banner-*`
   - `--check-*`, `--radio-*`, `--toggle-*`, `--seg-*`, `--tabs-*`
   - `--avatar-*` (8 palette colours), `--presence-*` (10 statuses)
   - `--badge-*`, `--tag-*`, `--skeleton-*`, `--spinner-*`, `--scrollbar-*`, `--toast-*`
   - keyframes `spinner-fade`, `loading-circle`, `rotate-infinite`, `skeleton-pulse`, `fade-in-linear-in/out`, `modal-fade-in/out`, `fadeout`
6. **Layer 6:** `[data-theme="dark"]` overrides for every zoom-ui and Prism colour that changes in dark. Set the attribute on `<html>`.

Example (Workplace primary button, zoom-ui md):
```css
.btn { display:inline-flex; align-items:center; justify-content:center; gap:var(--btn-gap); height:var(--btn-height-md); padding:var(--btn-padding-md);
       border:none; border-radius:var(--btn-radius-md); font:var(--btn-font-weight) var(--btn-font-size)/var(--btn-line-height) var(--font-app);
       letter-spacing:var(--letter-spacing-tight); white-space:nowrap; cursor:pointer; outline-offset:var(--focus-ring-offset); }
.btn--primary { background:var(--btn-primary-bg); color:var(--btn-primary-fg); font-weight:var(--btn-font-weight-strong); }
.btn--primary:hover:not(.is-loading) { background:var(--btn-primary-bg-hover); }
.btn--primary:active:not(.is-loading) { background:var(--btn-primary-bg-active); }
.btn:disabled, .btn.is-disabled { background:var(--btn-disabled-bg); color:var(--btn-disabled-fg); cursor:not-allowed; }
.btn:focus-visible { outline:var(--focus-ring); }
```

---

## 8. Files saved
- **Screenshots:** none. Everything in this spec is numeric from CSS and DOM; the shell is already covered by `01–17-*.jpg`.
- **Icons (10)** in `docs/reference/icons/`: `ds-presence-available.svg`, `ds-presence-busy.svg`, `ds-presence-dnd.svg`, `ds-presence-away.svg`, `ds-presence-ooo.svg`, `ds-presence-offline.svg`, `ds-presence-calendar.svg`, `ds-presence-meeting.svg`, `ds-presence-pbx.svg`, `ds-presence-mobile.svg`. All are 10×10 with their multi-colour fills kept (not `currentColor`). Colours are listed in §6.5.
- **Raw CSS:** `scratchpad/ds/*.css` (9 external sheets) and `scratchpad/ds/inline/*.css` (Prism ×10, emotion ×2, toastify ×2, pwa-modal, presence, zds, calendar shadow-DOM sheets). Parser and resolver: `scratchpad/ds/tools/{css.py,rg.py,prismbtn.py,gentokens.py,genapx.py}`.

---

## Appendix A — Resolved state tables were generated by script
Every colour in §3–§6 was produced by `tools/rg.py` / `tools/prismbtn.py`. They resolve each `var(--zoom-color-…)` and Prism chain against `tokens.json` (light/dark) and the Prism `.prism-light` / `.prism-dark` sheets. To re-verify a value: `python3 tools/rg.py '<selector regex>' zcal-ui` prints the rule with `light /dk dark [token]` annotations.

## Appendix B — Trimmed raw CSS per component (verbatim, unresolved)
High-contrast (`.zoom-theme--highContrast`) rules, data-URI images and vehicle/feedback rules are removed. Long rules are cut with "…".

### B.1 prism-Button — root variables (default Prism theme, as used in the PWA)

Source: `inline <style data-prism="Button"> (CSS-in-JS), saved as scratchpad/ds/inline/prism-Button.css` [M]

```css
.prism-Button-root, .prism-Button-css-var {
  --prism-Button-fontFamily: var(--typography-fontFamily);
  --prism-Button-focusOutlineColor: var(--border-primary);
  --prism-Button-focusOutlineOffset: 2px;
  --prism-Button-small-height: auto;
  --prism-Button-small-minHeight: 24px;
  --prism-Button-small-width: auto;
  --prism-Button-small-minWidth: 47px;
  --prism-Button-small-paddingBlock: 3px;
  --prism-Button-small-paddingInline: 8px;
  --prism-Button-small-borderRadius: 6px;
  --prism-Button-small-fontSize: var(--typography-fontSize-body-2);
  --prism-Button-small-lineHeight: var(--typography-lineHeight-body-2);
  --prism-Button-small-fontWeight: var(--typography-fontWeight-body-2);
  --prism-Button-small-iconSize: var(--typography-fontSize-body-2);
  --prism-Button-small-gap: 4px;
  --prism-Button-medium-height: auto;
  --prism-Button-medium-minHeight: 32px;
  --prism-Button-medium-width: auto;
  --prism-Button-medium-minWidth: 60px;
  --prism-Button-medium-paddingBlock: 5px;
  --prism-Button-medium-paddingInline: 12px;
  --prism-Button-medium-borderRadius: 8px;
  --prism-Button-medium-fontSize: var(--typography-fontSize-body-1);
  --prism-Button-medium-lineHeight: var(--typography-lineHeight-body-1);
  --prism-Button-medium-fontWeight: var(--typography-fontWeight-body-1);
  --prism-Button-medium-iconSize: var(--typography-fontSize-body-1);
  --prism-Button-medium-gap: 4px;
  --prism-Button-large-height: auto;
  --prism-Button-large-minHeight: 40px;
  --prism-Button-large-width: auto;
  --prism-Button-large-minWidth: 73px;
  --prism-Button-large-paddingBlock: 9px;
  --prism-Button-large-paddingInline: 16px;
  --prism-Button-large-borderRadius: 10px;
  --prism-Button-large-fontSize: var(--typography-fontSize-title-3);
  --prism-Button-large-lineHeight: var(--typography-lineHeight-title-3);
  --prism-Button-large-fontWeight: var(--typography-fontWeight-title-3);
  --prism-Button-large-iconSize: var(--typography-fontSize-title-3);
  --prism-Button-large-gap: 4px;
  --prism-Button-extraLarge-height: auto;
  --prism-Button-extraLarge-minHeight: 48px;
  --prism-Button-extraLarge-width: auto;
  --prism-Button-extraLarge-minWidth: 81px;
  --prism-Button-extraLarge-paddingBlock: 13px;
  --prism-Button-extraLarge-paddingInline: 20px;
  --prism-Button-extraLarge-borderRadius: 12px;
  --prism-Button-extraLarge-fontSize: var(--typography-fontSize-title-3);
  --prism-Button-extraLarge-lineHeight: var(--typography-lineHeight-title-3);
  --prism-Button-extraLarge-fontWeight: var(--typography-fontWeight-title-3);
  --prism-Button-extraLarge-iconSize: var(--typography-fontSize-title-3);
  --prism-Button-extraLarge-gap: 4px;
  --prism-Button-primary-color: var(--inverse-global-default);
  --prism-Button-primary-background: var(--fill-global-primary);
  --prism-Button-primary-borderColor: var(--fill-global-primary);
  --prism-Button-primary-fontWeight: 500;
  --prism-Button-primary-boxShadow: none;
  --prism-Button-primary-hover-color: var(--inverse-global-default);
  --prism-Button-primary-hover-background: var(--state-primary-hover);
  --prism-Button-primary-hover-borderColor: var(--state-primary-hover);
  --prism-Button-primary-hover-boxShadow: none;
  --prism-Button-primary-active-color: var(--inverse-global-default);
  --prism-Button-primary-active-background: var(--state-primary-press);
  --prism-Button-primary-active-borderColor: var(--state-primary-press);
  --prism-Button-primary-active-boxShadow: none;
  --prism-Button-secondary-color: var(--text-stronger-neutral);
  --prism-Button-secondary-background: var(--fill-default);
  --prism-Button-secondary-borderColor: var(--border-neutral);
  --prism-Button-secondary-hover-color: var(--text-stronger-neutral);
  --prism-Button-secondary-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-secondary-hover-borderColor: var(--border-neutral);
  --prism-Button-secondary-active-color: var(--text-stronger-neutral);
  --prism-Button-secondary-active-background: var(--state-subtle-neutral-press);
  --prism-Button-secondary-active-borderColor: var(--border-neutral);
  --prism-Button-tertiary-color: var(--text-primary);
  --prism-Button-tertiary-background: transparent;
  --prism-Button-tertiary-borderColor: transparent;
  --prism-Button-tertiary-hover-color: var(--state-primary-hover);
  --prism-Button-tertiary-hover-background: var(--state-subtle-primary-hover);
  --prism-Button-tertiary-hover-borderColor: transparent;
  --prism-Button-tertiary-active-color: var(--state-primary-press);
  --prism-Button-tertiary-active-background: var(--state-subtle-primary-press);
  --prism-Button-tertiary-active-borderColor: transparent;
  --prism-Button-tertiary-small-paddingInline: 8px;
  --prism-Button-tertiary-medium-paddingInline: 12px;
  --prism-Button-tertiary-large-paddingInline: 16px;
  --prism-Button-tertiary-extraLarge-paddingInline: 20px;
  --prism-Button-overlay-color: var(--inverse-global-default);
  --prism-Button-overlay-background: var(--fill-global-dark-transparent);
  --prism-Button-overlay-borderColor: transparent;
  --prism-Button-overlay-hover-color: var(--inverse-global-default);
  --prism-Button-overlay-hover-background: var(--state-global-dark-transparent-hover);
  --prism-Button-overlay-hover-borderColor: transparent;
  --prism-Button-overlay-active-color: var(--inverse-global-default);
  --prism-Button-overlay-active-background: var(--state-global-dark-transparent-press);
  --prism-Button-overlay-active-borderColor: transparent;
  --prism-Button-text-color: var(--text-primary);
  --prism-Button-text-background: transparent;
  --prism-Button-text-borderColor: transparent;
  --prism-Button-text-hover-color: var(--state-primary-hover);
  --prism-Button-text-hover-background: transparent;
  --prism-Button-text-hover-borderColor: transparent;
  --prism-Button-text-active-color: var(--state-primary-press);
  --prism-Button-text-active-background: transparent;
  --prism-Button-text-active-borderColor: transparent;
  --prism-Button-text-small-width: auto;
  --prism-Button-text-small-height: auto;
  --prism-Button-text-small-minWidth: auto;
  --prism-Button-text-small-minHeight: auto;
  --prism-Button-text-small-paddingInline: 0px;
  --prism-Button-text-small-paddingBlock: 0px;
  --prism-Button-text-small-borderRadius: 2px;
  --prism-Button-text-small-fontSize: var(--typography-fontSize-caption);
  --prism-Button-text-small-lineHeight: var(--typography-lineHeight-caption);
  --prism-Button-text-small-fontWeight: var(--typography-fontWeight-caption);
  --prism-Button-text-medium-width: auto;
  --prism-Button-text-medium-height: auto;
  --prism-Button-text-medium-minWidth: auto;
  --prism-Button-text-medium-minHeight: auto;
  --prism-Button-text-medium-paddingInline: 0px;
  --prism-Button-text-medium-paddingBlock: 0px;
  --prism-Button-text-medium-borderRadius: 4px;
  --prism-Button-text-medium-fontSize: var(--typography-fontSize-body-1);
  --prism-Button-text-medium-lineHeight: var(--typography-lineHeight-body-1);
  --prism-Button-text-medium-fontWeight: var(--typography-fontWeight-body-1);
  --prism-Button-text-large-width: auto;
  --prism-Button-text-large-height: auto;
  --prism-Button-text-large-minWidth: auto;
  --prism-Button-text-large-minHeight: auto;
  --prism-Button-text-large-paddingInline: 0px;
  --prism-Button-text-large-paddingBlock: 0px;
  --prism-Button-text-large-borderRadius: 6px;
  --prism-Button-text-large-fontSize: var(--typography-fontSize-title-3);
  --prism-Button-text-large-lineHeight: var(--typography-lineHeight-title-3);
  --prism-Button-text-large-fontWeight: var(--typography-fontWeight-title-3);
  --prism-Button-text-extraLarge-width: auto;
  --prism-Button-text-extraLarge-height: auto;
  --prism-Button-text-extraLarge-minWidth: auto;
  --prism-Button-text-extraLarge-minHeight: auto;
  --prism-Button-text-extraLarge-paddingInline: 0px;
  --prism-Button-text-extraLarge-paddingBlock: 0px;
  --prism-Button-text-extraLarge-borderRadius: 6px;
  --prism-Button-text-extraLarge-fontSize: var(--typography-fontSize-title-1-emphasis);
  --prism-Button-text-extraLarge-lineHeight: var(--typography-lineHeight-title-1-emphasis);
  --prism-Button-text-extraLarge-fontWeight: var(--typography-fontWeight-title-1-emphasis);
  --prism-Button-danger-primary-color: var(--inverse-global-default);
  --prism-Button-danger-primary-background: var(--fill-global-error);
  --prism-Button-danger-primary-borderColor: var(--fill-global-error);
  --prism-Button-danger-primary-hover-color: var(--inverse-global-default);
  --prism-Button-danger-primary-hover-background: var(--state-error-hover);
  --prism-Button-danger-primary-hover-borderColor: var(--state-error-hover);
  --prism-Button-danger-primary-active-color: var(--inverse-global-default);
  --prism-Button-danger-primary-active-background: var(--state-error-press);
  --prism-Button-danger-primary-active-borderColor: var(--state-error-press);
  --prism-Button-danger-secondary-color: var(--text-error);
  --prism-Button-danger-secondary-background: var(--fill-default);
  --prism-Button-danger-secondary-borderColor: var(--border-error);
  --prism-Button-danger-secondary-hover-color: var(--text-error);
  --prism-Button-danger-secondary-hover-background: var(--state-subtle-error-hover);
  --prism-Button-danger-secondary-hover-borderColor: var(--border-error);
  --prism-Button-danger-secondary-active-color: var(--text-error);
  --prism-Button-danger-secondary-active-background: var(--state-subtle-error-press);
  --prism-Button-danger-secondary-active-borderColor: var(--border-error);
  --prism-Button-danger-tertiary-color: var(--text-error);
  --prism-Button-danger-tertiary-background: transparent;
  --prism-Button-danger-tertiary-borderColor: transparent;
  --prism-Button-danger-tertiary-hover-color: var(--state-error-hover);
  --prism-Button-danger-tertiary-hover-background: var(--state-subtle-error-hover);
  --prism-Button-danger-tertiary-hover-borderColor: transparent;
  --prism-Button-danger-tertiary-active-color: var(--state-error-press);
  --prism-Button-danger-tertiary-active-background: var(--state-subtle-error-press);
  --prism-Button-danger-tertiary-active-borderColor: transparent;
  --prism-Button-danger-text-color: var(--text-error);
  --prism-Button-danger-text-background: transparent;
  --prism-Button-danger-text-borderColor: transparent;
  --prism-Button-danger-text-hover-color: var(--state-error-hover);
  --prism-Button-danger-text-hover-background: transparent;
  --prism-Button-danger-text-hover-borderColor: transparent;
  --prism-Button-danger-text-active-color: var(--state-error-press);
  --prism-Button-danger-text-active-background: transparent;
  --prism-Button-danger-text-active-borderColor: transparent;
  --prism-Button-disabled-primary-color: var(--state-disable);
  --prism-Button-disabled-primary-background: var(--state-subtle-disable);
  --prism-Button-disabled-primary-borderColor: var(--state-subtle-disable);
  --prism-Button-disabled-secondary-color: var(--state-disable);
  --prism-Button-disabled-secondary-background: var(--fill-default);
  --prism-Button-disabled-secondary-borderColor: var(--state-subtle-disable);
  --prism-Button-disabled-tertiary-color: var(--state-disable);
  --prism-Button-disabled-tertiary-background: transparent;
  --prism-Button-disabled-tertiary-borderColor: transparent;
  --prism-Button-disabled-text-color: var(--state-subtle-primary-disable);
  --prism-Button-disabled-text-background: transparent;
  --prism-Button-disabled-text-borderColor: transparent;
  --prism-Button-disabled-overlay-color: var(--state-disable);
  --prism-Button-disabled-overlay-background: var(--fill-global-dark-transparent);
  --prism-Button-disabled-overlay-borderColor: transparent;
  --prism-Button-disabled-danger-text-color: var(--state-subtle-error-disable);
  --prism-Button-variant-icon-small-height: 24px;
  --prism-Button-variant-icon-small-width: 24px;
  --prism-Button-variant-icon-small-minWidth: unset;
  --prism-Button-variant-icon-small-minHeight: unset;
  --prism-Button-variant-icon-small-paddingBlock: 0;
  --prism-Button-variant-icon-small-paddingInline: 0;
  --prism-Button-variant-icon-small-borderRadius: 6px;
  --prism-Button-variant-icon-small-iconSize: 14px;
  --prism-Button-variant-icon-small-lineHeight: 1;
  --prism-Button-variant-icon-medium-height: 32px;
  --prism-Button-variant-icon-medium-width: 32px;
  --prism-Button-variant-icon-medium-minWidth: unset;
  --prism-Button-variant-icon-medium-minHeight: unset;
  --prism-Button-variant-icon-medium-paddingBlock: 0;
  --prism-Button-variant-icon-medium-paddingInline: 0;
  --prism-Button-variant-icon-medium-borderRadius: 8px;
  --prism-Button-variant-icon-medium-iconSize: 16px;
  --prism-Button-variant-icon-medium-lineHeight: 1;
  --prism-Button-variant-icon-large-height: 40px;
  --prism-Button-variant-icon-large-width: 40px;
  --prism-Button-variant-icon-large-minWidth: unset;
  --prism-Button-variant-icon-large-minHeight: unset;
  --prism-Button-variant-icon-large-paddingBlock: 0;
  --prism-Button-variant-icon-large-paddingInline: 0;
  --prism-Button-variant-icon-large-borderRadius: 10px;
  --prism-Button-variant-icon-large-iconSize: 18px;
  --prism-Button-variant-icon-large-lineHeight: 1;
  --prism-Button-variant-icon-extraLarge-height: 48px;
  --prism-Button-variant-icon-extraLarge-width: 48px;
  --prism-Button-variant-icon-extraLarge-minWidth: unset;
  --prism-Button-variant-icon-extraLarge-minHeight: unset;
  --prism-Button-variant-icon-extraLarge-paddingBlock: 0;
  --prism-Button-variant-icon-extraLarge-paddingInline: 0;
  --prism-Button-variant-icon-extraLarge-borderRadius: 12px;
  --prism-Button-variant-icon-extraLarge-iconSize: 20px;
  --prism-Button-variant-icon-extraLarge-lineHeight: 1;
  --prism-Button-variant-icon-primary-color: var(--inverse-global-default);
  --prism-Button-variant-icon-primary-background: var(--fill-global-primary);
  --prism-Button-variant-icon-primary-borderColor: var(--fill-global-primary);
  --prism-Button-variant-icon-primary-hover-color: var(--inverse-global-default);
  --prism-Button-variant-icon-primary-hover-background: var(--state-primary-hover);
  --prism-Button-variant-icon-primary-hover-borderColor: var(--state-primary-hover);
  --prism-Button-variant-icon-primary-active-color: var(--inverse-global-default);
  --prism-Button-variant-icon-primary-active-background: var(--state-primary-press);
  --prism-Button-variant-icon-primary-active-borderColor: var(--state-primary-press);
  --prism-Button-variant-icon-secondary-color: var(--text-stronger-neutral);
  --prism-Button-variant-icon-secondary-background: var(--fill-default);
  --prism-Button-variant-icon-secondary-borderColor: var(--border-neutral);
  --prism-Button-variant-icon-secondary-backdropFilter: none;
  --prism-Button-variant-icon-secondary-hover-color: var(--text-stronger-neutral);
  --prism-Button-variant-icon-secondary-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-variant-icon-secondary-hover-borderColor: var(--border-neutral);
  --prism-Button-variant-icon-secondary-active-color: var(--text-stronger-neutral);
  --prism-Button-variant-icon-secondary-active-background: var(--state-subtle-neutral-press);
  --prism-Button-variant-icon-secondary-active-borderColor: var(--border-neutral);
  --prism-Button-variant-icon-tertiary-color: var(--text-stronger-neutral);
  --prism-Button-variant-icon-tertiary-background: transparent;
  --prism-Button-variant-icon-tertiary-borderColor: transparent;
  --prism-Button-variant-icon-tertiary-hover-color: var(--text-stronger-neutral);
  --prism-Button-variant-icon-tertiary-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-variant-icon-tertiary-hover-borderColor: transparent;
  --prism-Button-variant-icon-tertiary-active-color: var(--text-stronger-neutral);
  --prism-Button-variant-icon-tertiary-active-background: var(--state-subtle-neutral-press);
  --prism-Button-variant-icon-tertiary-active-borderColor: transparent;
  --prism-Button-variant-icon-overlay-color: var(--inverse-global-default);
  --prism-Button-variant-icon-overlay-background: var(--fill-global-dark-transparent);
  --prism-Button-variant-icon-overlay-borderColor: transparent;
  --prism-Button-variant-icon-overlay-hover-color: var(--inverse-global-default);
  --prism-Button-variant-icon-overlay-hover-background: var(--state-global-dark-transparent-hover);
  --prism-Button-variant-icon-overlay-hover-borderColor: transparent;
  --prism-Button-variant-icon-overlay-active-color: var(--inverse-global-default);
  --prism-Button-variant-icon-overlay-active-background: var(--state-global-dark-transparent-press);
  --prism-Button-variant-icon-overlay-active-borderColor: transparent;
  --prism-Button-variant-icon-danger-primary-color: var(--inverse-global-default);
  --prism-Button-variant-icon-danger-primary-background: var(--fill-global-error);
  --prism-Button-variant-icon-danger-primary-borderColor: var(--fill-global-error);
  --prism-Button-variant-icon-danger-primary-hover-color: var(--inverse-global-default);
  --prism-Button-variant-icon-danger-primary-hover-background: var(--state-error-hover);
  --prism-Button-variant-icon-danger-primary-hover-borderColor: var(--state-error-hover);
  --prism-Button-variant-icon-danger-primary-active-color: var(--inverse-global-default);
  --prism-Button-variant-icon-danger-primary-active-background: var(--state-error-press);
  --prism-Button-variant-icon-danger-primary-active-borderColor: var(--state-error-press);
  --prism-Button-variant-icon-danger-secondary-color: var(--text-error);
  --prism-Button-variant-icon-danger-secondary-background: var(--fill-default);
  --prism-Button-variant-icon-danger-secondary-borderColor: var(--border-error);
  --prism-Button-variant-icon-danger-secondary-backdropFilter: none;
  --prism-Button-variant-icon-danger-secondary-hover-color: var(--text-error);
  --prism-Button-variant-icon-danger-secondary-hover-background: var(--state-subtle-error-hover);
  --prism-Button-variant-icon-danger-secondary-hover-borderColor: var(--border-error);
  --prism-Button-variant-icon-danger-secondary-active-color: var(--text-error);
  --prism-Button-variant-icon-danger-secondary-active-background: var(--state-subtle-error-press);
  --prism-Button-variant-icon-danger-secondary-active-borderColor: var(--border-error);
  --prism-Button-variant-icon-danger-tertiary-color: var(--text-error);
  --prism-Button-variant-icon-danger-tertiary-background: transparent;
  --prism-Button-variant-icon-danger-tertiary-borderColor: transparent;
  --prism-Button-variant-icon-danger-tertiary-hover-color: var(--state-error-hover);
  --prism-Button-variant-icon-danger-tertiary-hover-background: var(--state-subtle-error-hover);
  --prism-Button-variant-icon-danger-tertiary-hover-borderColor: transparent;
  --prism-Button-variant-icon-danger-tertiary-active-color: var(--state-error-press);
  --prism-Button-variant-icon-danger-tertiary-active-background: var(--state-subtle-error-press);
  --prism-Button-variant-icon-danger-tertiary-active-borderColor: transparent;
  --prism-Button-variant-icon-disabled-primary-color: var(--state-disable);
  --prism-Button-variant-icon-disabled-primary-background: var(--state-subtle-disable);
  --prism-Button-variant-icon-disabled-primary-borderColor: var(--state-subtle-disable);
  --prism-Button-variant-icon-disabled-secondary-color: var(--state-disable);
  --prism-Button-variant-icon-disabled-secondary-background: var(--fill-default);
  --prism-Button-variant-icon-disabled-secondary-borderColor: var(--state-subtle-disable);
  --prism-Button-variant-icon-disabled-tertiary-color: var(--state-disable);
  --prism-Button-variant-icon-disabled-tertiary-background: transparent;
  --prism-Button-variant-icon-disabled-tertiary-borderColor: transparent;
  --prism-Button-variant-icon-disabled-overlay-color: var(--state-disable);
  --prism-Button-variant-icon-disabled-overlay-background: var(--fill-global-dark-transparent);
  --prism-Button-variant-icon-disabled-overlay-borderColor: transparent;
  --prism-Button-variant-home-height: 56px;
  --prism-Button-variant-home-width: 56px;
  --prism-Button-variant-home-minWidth: unset;
  --prism-Button-variant-home-minHeight: unset;
  --prism-Button-variant-home-paddingBlock: 0;
  --prism-Button-variant-home-paddingInline: 0;
  --prism-Button-variant-home-borderRadius: 16px;
  --prism-Button-variant-home-iconSize: 28px;
  --prism-Button-variant-home-lineHeight: 1;
  --prism-Button-variant-home-borderWidth: 1px;
  --prism-Button-variant-home-hover-offset: 0px;
  --prism-Button-variant-home-pressed-offset: 0px;
  --prism-Button-variant-home-primary-color: var(--inverse-global-default);
  --prism-Button-variant-home-primary-background: var(--fill-global-primary);
  --prism-Button-variant-home-primary-boxShadow: none;
  --prism-Button-variant-home-primary-gradientColor: var(--fill-global-primary);
  --prism-Button-variant-home-primary-borderColor: transparent;
  --prism-Button-variant-home-primary-hover-background: var(--state-primary-hover);
  --prism-Button-variant-home-primary-hover-boxShadow: none;
  --prism-Button-variant-home-primary-hover-gradientColor: var(--state-primary-hover);
  --prism-Button-variant-home-primary-active-background: var(--state-primary-press);
  --prism-Button-variant-home-primary-active-boxShadow: none;
  --prism-Button-variant-home-primary-active-gradientColor: var(--state-primary-press);
  --prism-Button-variant-home-highlight-color: var(--inverse-global-default);
  --prism-Button-variant-home-highlight-background: var(--fill-complementary);
  --prism-Button-variant-home-highlight-boxShadow: none;
  --prism-Button-variant-home-highlight-gradientColor: var(--fill-complementary);
  --prism-Button-variant-home-highlight-borderColor: transparent;
  --prism-Button-variant-home-highlight-hover-background: var(--state-complementary-hover);
  --prism-Button-variant-home-highlight-hover-boxShadow: none;
  --prism-Button-variant-home-highlight-hover-gradientColor: var(--state-complementary-hover);
  --prism-Button-variant-home-highlight-active-background: var(--state-complementary-press);
  --prism-Button-variant-home-highlight-active-boxShadow: none;
  --prism-Button-variant-home-highlight-active-gradientColor: var(--state-complementary-press);
  --prism-Button-variant-home-danger-color: var(--inverse-global-default);
  --prism-Button-variant-home-danger-background: var(--fill-global-error);
  --prism-Button-variant-home-danger-boxShadow: none;
  --prism-Button-variant-home-danger-gradientColor: var(--fill-global-error);
  --prism-Button-variant-home-danger-borderColor: transparent;
  --prism-Button-variant-home-danger-hover-background: var(--state-error-hover);
  --prism-Button-variant-home-danger-hover-boxShadow: none;
  --prism-Button-variant-home-danger-hover-gradientColor: var(--state-error-hover);
  --prism-Button-variant-home-danger-active-background: var(--state-error-press);
  --prism-Button-variant-home-danger-active-boxShadow: none;
  --prism-Button-variant-home-danger-active-gradientColor: var(--state-error-press);
  --prism-Button-variant-home-disabled-color: var(--state-disable);
  --prism-Button-variant-home-disabled-background: var(--state-subtle-disable);
  --prism-Button-variant-home-disabled-borderColor: var(--state-subtle-disable);
  --prism-Button-variant-hero-color: var(--text-stronger-neutral);
  --prism-Button-variant-hero-background: var(--fill-default);
  --prism-Button-variant-hero-borderColor: var(--border-subtle-neutral);
  --prism-Button-variant-hero-boxShadow: none;
  --prism-Button-variant-hero-gap: 8px;
  --prism-Button-variant-hero-hover-color: var(--text-stronger-neutral);
  --prism-Button-variant-hero-hover-background: var(--fill-default);
  --prism-Button-variant-hero-hover-borderColor: var(--border-subtle-neutral);
  --prism-Button-variant-hero-hover-boxShadow: var(--shadow-sm);
  --prism-Button-variant-hero-active-color: var(--text-stronger-neutral);
  --prism-Button-variant-hero-active-background: var(--state-subtle-neutral-press);
  --prism-Button-variant-hero-active-borderColor: var(--border-subtle-neutral);
  --prism-Button-variant-hero-active-boxShadow: none;
  --prism-Button-variant-hero-small-height: 40px;
  --prism-Button-variant-hero-small-paddingInline: 11px;
  --prism-Button-variant-hero-small-borderRadius: 10px;
  --prism-Button-variant-hero-small-fontSize: var(--typography-fontSize-body-1);
  --prism-Button-variant-hero-small-fontWeight: var(--typography-fontWeight-body-1);
  --prism-Button-variant-hero-small-lineHeight: var(--typography-lineHeight-body-1);
  --prism-Button-variant-hero-small-gap: 6px;
  --prism-Button-variant-hero-small-iconSize: 16px;
  --prism-Button-variant-hero-medium-height: 48px;
  --prism-Button-variant-hero-medium-paddingInline: 15px;
  --prism-Button-variant-hero-medium-borderRadius: 12px;
  --prism-Button-variant-hero-medium-fontSize: var(--typography-fontSize-body-1);
  --prism-Button-variant-hero-medium-fontWeight: var(--typography-fontWeight-body-1);
  --prism-Button-variant-hero-medium-lineHeight: var(--typography-lineHeight-body-1);
  --prism-Button-variant-hero-medium-gap: 8px;
  --prism-Button-variant-hero-medium-iconSize: 18px;
  --prism-Button-variant-hero-disabled-color: var(--state-disable);
  --prism-Button-variant-hero-disabled-background: var(--state-subtle-disable);
  --prism-Button-variant-hero-disabled-borderColor: var(--border-subtle-neutral);
  --prism-Button-variant-hero-disabled-boxShadow: none;
  --prism-Button-variant-hero-disabled-hover-color: var(--state-disable);
  --prism-Button-variant-hero-disabled-hover-background: var(--state-subtle-disable);
  --prism-Button-variant-hero-disabled-hover-borderColor: var(--border-subtle-neutral);
  --prism-Button-variant-hero-disabled-hover-boxShadow: none;
  --prism-Button-variant-hero-disabled-active-color: var(--state-disable);
  --prism-Button-variant-hero-disabled-active-background: var(--state-subtle-disable);
  --prism-Button-variant-hero-disabled-active-borderColor: var(--border-subtle-neutral);
  --prism-Button-variant-hero-disabled-active-boxShadow: none;
  --prism-Button-fab-size: 32px;
  --prism-Button-fab-color: var(--inverse-global-default);
  --prism-Button-fab-background: var(--fill-global-primary);
  --prism-Button-fab-gradientColor: var(--fill-global-primary);
  --prism-Button-fab-boxShadow: var(--shadow-sm);
  --prism-Button-fab-hover-background: var(--state-primary-hover);
  --prism-Button-fab-hover-gradientColor: var(--state-primary-hover);
  --prism-Button-fab-hover-boxShadow: var(--shadow-sm);
  --prism-Button-fab-hover-offset: 0px;
  --prism-Button-fab-active-background: var(--state-primary-press);
  --prism-Button-fab-active-gradientColor: var(--state-primary-press);
  --prism-Button-fab-active-boxShadow: var(--shadow-sm);
  --prism-Button-fab-active-offset: 0px;
  --prism-Button-fab-disabled-background: var(--state-subtle-disable);
  --prism-Button-fab-disabled-color: var(--state-disable);
  --prism-Button-fab-disabled-boxShadow: none;
  --prism-Button-fab-focus-outline: 2px solid var(--border-primary);
  --prism-Button-fab-focus-outlineOffset: 2px;
  --prism-Button-fab-icon-size: 18px;
  --prism-Button-anchorButton-height: 28px;
  --prism-Button-anchorButton-background: var(--fill-elevated-default);
  --prism-Button-anchorButton-boxShadow: var(--shadow-xs);
  --prism-Button-anchorButton-paddingInline: 7px;
  --prism-Button-anchorButton-separatingPadding: 5px;
  --prism-Button-anchorButton-borderColor: var(--border-subtle-neutral);
  --prism-Button-anchorButton-color: var(--text-strong-primary);
  --prism-Button-anchorButton-gap: 0px;
  --prism-Button-anchorButton-label-paddingInline: 2px;
  --prism-Button-anchorButton-icon-size: 12px;
  --prism-Button-anchorButton-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-anchorButton-hover-color: var(--text-strong-primary);
  --prism-Button-anchorButton-active-background: var(--state-subtle-neutral-press);
  --prism-Button-anchorButton-active-color: var(--text-strong-primary);
  --prism-Button-anchorButton-focus-outline: 2px solid var(--border-primary);
  --prism-Button-anchorButton-focus-outlineOffset: 2px;
  --prism-Button-anchorButton-alert-color: var(--text-error);
  --prism-Button-anchorButton-alert-hover-color: var(--text-error);
  --prism-Button-anchorButton-alert-active-color: var(--text-error);
  --prism-Button-anchorButton-neutral-color: var(--text-stronger-neutral);
  --prism-Button-anchorButton-neutral-hover-color: var(--text-stronger-neutral);
  --prism-Button-anchorButton-neutral-active-color: var(--text-stronger-neutral);
  --prism-Button-iconLoading-color: var(--fill-contrary-strong-transparent);
  --prism-Button-iconLoading-primary-color: var(--inverse-global-default);
  --prism-Button-iconLoading-overlay-color: var(--inverse-global-default);
}
```

### B.2 prism-Button — `prism-3` theme overrides (Zoom 2025 look; matches PWA overrides)

Source: `same sheet` [M]

```css
.prism-Button-root:where(.prism-3), .prism-Button-css-var:where(.prism-3) {
  --prism-Button-small-borderRadius: 12px;
  --prism-Button-small-iconSize: 12px;
  --prism-Button-small-paddingInline: 10px;
  --prism-Button-medium-borderRadius: 12px;
  --prism-Button-medium-iconSize: 14px;
  --prism-Button-medium-paddingInline: 14px;
  --prism-Button-large-borderRadius: 12px;
  --prism-Button-large-iconSize: 14px;
  --prism-Button-large-paddingInline: 16px;
  --prism-Button-large-fontSize: var(--typography-fontSize-body-1);
  --prism-Button-large-lineHeight: var(--typography-lineHeight-body-1);
  --prism-Button-secondary-color: var(--text-primary);
  --prism-Button-secondary-background: var(--fill-subtle-neutral);
  --prism-Button-secondary-borderColor: transparent;
  --prism-Button-secondary-hover-color: var(--state-primary-hover);
  --prism-Button-secondary-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-secondary-hover-borderColor: transparent;
  --prism-Button-secondary-active-color: var(--state-primary-press);
  --prism-Button-secondary-active-background: var(--state-subtle-neutral-press);
  --prism-Button-secondary-active-borderColor: transparent;
  --prism-Button-tertiary-background: transparent;
  --prism-Button-tertiary-borderColor: transparent;
  --prism-Button-tertiary-hover-color: var(--state-primary-hover);
  --prism-Button-tertiary-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-tertiary-hover-borderColor: transparent;
  --prism-Button-tertiary-active-color: var(--state-primary-press);
  --prism-Button-tertiary-active-background: var(--state-subtle-neutral-press);
  --prism-Button-tertiary-active-borderColor: transparent;
  --prism-Button-tertiary-small-paddingInline: 8px;
  --prism-Button-tertiary-medium-paddingInline: 8px;
  --prism-Button-tertiary-large-paddingInline: 12px;
  --prism-Button-tertiary-extraLarge-paddingInline: 16px;
  --prism-Button-danger-primary-color: var(--inverse-global-default);
  --prism-Button-danger-primary-background: var(--fill-global-error);
  --prism-Button-danger-primary-borderColor: var(--fill-global-error);
  --prism-Button-danger-primary-hover-color: var(--inverse-global-default);
  --prism-Button-danger-primary-hover-background: var(--state-error-hover);
  --prism-Button-danger-primary-hover-borderColor: var(--state-error-hover);
  --prism-Button-danger-primary-active-color: var(--inverse-global-default);
  --prism-Button-danger-primary-active-background: var(--state-error-press);
  --prism-Button-danger-primary-active-borderColor: var(--state-error-press);
  --prism-Button-danger-secondary-color: var(--text-error);
  --prism-Button-danger-secondary-background: var(--fill-subtle-neutral);
  --prism-Button-danger-secondary-borderColor: transparent;
  --prism-Button-danger-secondary-hover-color: var(--state-error-hover);
  --prism-Button-danger-secondary-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-danger-secondary-hover-borderColor: transparent;
  --prism-Button-danger-secondary-active-color: var(--state-error-press);
  --prism-Button-danger-secondary-active-background: var(--state-subtle-neutral-press);
  --prism-Button-danger-secondary-active-borderColor: transparent;
  --prism-Button-danger-tertiary-background: transparent;
  --prism-Button-danger-tertiary-borderColor: transparent;
  --prism-Button-danger-tertiary-hover-color: var(--state-error-hover);
  --prism-Button-danger-tertiary-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-danger-tertiary-hover-borderColor: transparent;
  --prism-Button-danger-tertiary-active-color: var(--state-error-press);
  --prism-Button-danger-tertiary-active-background: var(--state-subtle-neutral-press);
  --prism-Button-danger-tertiary-active-borderColor: transparent;
  --prism-Button-disabled-primary-borderColor: transparent;
  --prism-Button-disabled-secondary-background: var(--state-subtle-disable);
  --prism-Button-disabled-secondary-borderColor: transparent;
  --prism-Button-disabled-text-color: var(--state-disable);
  --prism-Button-disabled-danger-text-color: var(--state-disable);
  --prism-Button-variant-icon-small-borderRadius: 50%;
  --prism-Button-variant-icon-medium-borderRadius: 50%;
  --prism-Button-variant-icon-large-borderRadius: 50%;
  --prism-Button-variant-icon-extraLarge-borderRadius: 50%;
  --prism-Button-variant-icon-secondary-color: var(--icon-stronger-neutral);
  --prism-Button-variant-icon-secondary-background: var(--fill-contrary-subtler-transparent);
  --prism-Button-variant-icon-secondary-borderColor: transparent;
  --prism-Button-variant-icon-secondary-backdropFilter: blur(30px);
  --prism-Button-variant-icon-secondary-hover-color: var(--icon-stronger-neutral);
  --prism-Button-variant-icon-secondary-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-variant-icon-secondary-hover-borderColor: transparent;
  --prism-Button-variant-icon-secondary-active-color: var(--icon-stronger-neutral);
  --prism-Button-variant-icon-secondary-active-background: var(--state-subtle-neutral-press);
  --prism-Button-variant-icon-secondary-active-borderColor: transparent;
  --prism-Button-variant-icon-tertiary-color: var(--icon-strong-neutral);
  --prism-Button-variant-icon-tertiary-hover-color: var(--text-strong-neutral);
  --prism-Button-variant-icon-tertiary-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-variant-icon-tertiary-active-color: var(--text-strong-neutral);
  --prism-Button-variant-icon-tertiary-active-background: var(--state-subtle-neutral-press);
  --prism-Button-variant-icon-danger-secondary-background: var(--fill-contrary-subtler-transparent);
  --prism-Button-variant-icon-danger-secondary-borderColor: transparent;
  --prism-Button-variant-icon-danger-secondary-backdropFilter: blur(30px);
  --prism-Button-variant-icon-danger-secondary-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-variant-icon-danger-secondary-hover-borderColor: transparent;
  --prism-Button-variant-icon-danger-secondary-hover-color: var(--state-error-hover);
  --prism-Button-variant-icon-danger-secondary-active-background: var(--state-subtle-neutral-press);
  --prism-Button-variant-icon-danger-secondary-active-borderColor: transparent;
  --prism-Button-variant-icon-danger-secondary-active-color: var(--state-error-press);
  --prism-Button-variant-icon-danger-tertiary-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-variant-icon-danger-tertiary-active-background: var(--state-subtle-neutral-press);
  --prism-Button-variant-icon-disabled-primary-borderColor: transparent;
  --prism-Button-variant-icon-disabled-secondary-background: var(--state-subtle-disable);
  --prism-Button-variant-icon-disabled-secondary-borderColor: transparent;
  --prism-Button-variant-hero-background: var(--fill-subtler-neutral);
  --prism-Button-variant-hero-borderColor: transparent;
  --prism-Button-variant-hero-hover-background: var(--state-subtle-neutral-hover);
  --prism-Button-variant-hero-hover-borderColor: transparent;
  --prism-Button-variant-hero-hover-boxShadow: none;
  --prism-Button-variant-hero-active-background: var(--state-subtle-neutral-press);
  --prism-Button-variant-hero-active-borderColor: transparent;
  --prism-Button-variant-hero-small-borderRadius: 12px;
  --prism-Button-variant-hero-medium-borderRadius: 16px;
  --prism-Button-variant-hero-disabled-borderColor: transparent;
  --prism-Button-variant-hero-disabled-hover-borderColor: transparent;
  --prism-Button-variant-hero-disabled-active-borderColor: transparent;
  --prism-Button-variant-home-height: 60px;
  --prism-Button-variant-home-width: 60px;
  --prism-Button-variant-home-borderRadius: 20px;
  --prism-Button-variant-home-borderWidth: 0;
  --prism-Button-variant-home-hover-offset: -4px;
  --prism-Button-variant-home-primary-background: #0B5CFF;
  --prism-Button-variant-home-primary-boxShadow: 0 4px 8px rgba(44,104,255,.12);
  --prism-Button-variant-home-primary-gradientColor: #508AFF;
  --prism-Button-variant-home-primary-hover-background: #0B5CFF;
  --prism-Button-variant-home-primary-hover-boxShadow: 0 8px 8px rgba(44,104,255,.24);
  --prism-Button-variant-home-primary-hover-gradientColor: #508AFF;
  --prism-Button-variant-home-highlight-background: var(--fill-complementary);
  --prism-Button-variant-home-highlight-boxShadow: 0 4px 8px rgba(255,85,0,.12);
  --prism-Button-variant-home-highlight-gradientColor: #FFAA00;
  --prism-Button-variant-home-highlight-hover-background: var(--fill-complementary);
  --prism-Button-variant-home-highlight-hover-boxShadow: 0 8px 8px rgba(255,85,0,.24);
  --prism-Button-variant-home-highlight-hover-gradientColor: #FFAA00;
  --prism-Button-variant-home-danger-background: var(--fill-global-error);
  --prism-Button-variant-home-danger-boxShadow: 0 8px 8px rgba(218,22,58,.12);
  --prism-Button-variant-home-danger-gradientColor: #FF6682;
  --prism-Button-variant-home-danger-hover-background: var(--fill-global-error);
  --prism-Button-variant-home-danger-hover-boxShadow: 0 8px 8px rgba(218,22,58,.24);
  --prism-Button-variant-home-danger-hover-gradientColor: #FF6682;
  --prism-Button-variant-home-disabled-borderColor: transparent;
  --prism-Button-fab-background: #0B5CFF;
  --prism-Button-fab-gradientColor: #508AFF;
  --prism-Button-fab-boxShadow: 0 4px 8px rgba(44,104,255,.12);
  --prism-Button-fab-hover-background: #0B5CFF;
  --prism-Button-fab-hover-gradientColor: #508AFF;
  --prism-Button-fab-hover-boxShadow: 0 8px 8px rgba(44,104,255,.24);
  --prism-Button-fab-hover-offset: -4px;
  --prism-Button-fab-active-boxShadow: none;
  --prism-Button-anchorButton-gap: 2px;
  --prism-Button-anchorButton-hover-color: var(--state-primary-hover);
  --prism-Button-anchorButton-active-color: var(--state-primary-press);
  --prism-Button-anchorButton-alert-hover-color: var(--state-error-hover);
  --prism-Button-anchorButton-alert-active-color: var(--state-error-press);
}
```

### B.3 prism-Button — structural/state rules (trimmed: `a.` duplicates and loading:hover/active repeats removed)

Source: `same sheet` [M]

```css
.prism-Button-root{position: relative; display: inline-flex; align-items: center; justify-content: center; font-family: var(--prism-Button-fontFamily); cursor: pointer; border-width: 1px; border-style: solid; border-image: none; box-sizing: border-box; text-decoration: none; height: var(--prism-Button-medium-height); width: var(--prism-Button-medium-width); min-width: var(--prism-Button-medium-minWidth); min-height: var(--prism-Button-medium-minHeight); padding-left: var(--prism-Button-medium-paddingInline); padding-right: var(--prism-Button-medium-paddingInline); padding-top: var(--prism-Butt
.prism-Button-root:where(:hover){color: var(--prism-Button-primary-hover-color); background: var(--prism-Button-primary-hover-background); border-color: var(--prism-Button-primary-hover-borderColor); box-shadow: var(--prism-Button-primary-hover-boxShadow); text-decoration: none;}
.prism-Button-root:where(:active){color: var(--prism-Button-primary-active-color); background: var(--prism-Button-primary-active-background); border-color: var(--prism-Button-primary-active-borderColor); box-shadow: var(--prism-Button-primary-active-boxShadow); text-decoration: none;}
.prism-Button-root:where(.prism-Button-small){height: var(--prism-Button-small-height); width: var(--prism-Button-small-width); min-width: var(--prism-Button-small-minWidth); min-height: var(--prism-Button-small-minHeight); padding-left: var(--prism-Button-small-paddingInline); padding-right: var(--prism-Button-small-paddingInline); padding-top: var(--prism-Button-small-paddingBlock); padding-bottom: var(--prism-Button-small-paddingBlock); border-radius: var(--prism-Button-small-borderRadius); font-size: var(--prism-Button-small-fontSize); line-height: var(--prism-Button-small-lineHeight); fon
.prism-Button-root:where(.prism-Button-medium){height: var(--prism-Button-medium-height); width: var(--prism-Button-medium-width); min-width: var(--prism-Button-medium-minWidth); min-height: var(--prism-Button-medium-minHeight); padding-left: var(--prism-Button-medium-paddingInline); padding-right: var(--prism-Button-medium-paddingInline); padding-top: var(--prism-Button-medium-paddingBlock); padding-bottom: var(--prism-Button-medium-paddingBlock); border-radius: var(--prism-Button-medium-borderRadius); font-size: var(--prism-Button-medium-fontSize); line-height: var(--prism-Button-medium-line
.prism-Button-root:where(.prism-Button-large){height: var(--prism-Button-large-height); width: var(--prism-Button-large-width); min-width: var(--prism-Button-large-minWidth); min-height: var(--prism-Button-large-minHeight); padding-left: var(--prism-Button-large-paddingInline); padding-right: var(--prism-Button-large-paddingInline); padding-top: var(--prism-Button-large-paddingBlock); padding-bottom: var(--prism-Button-large-paddingBlock); border-radius: var(--prism-Button-large-borderRadius); font-size: var(--prism-Button-large-fontSize); line-height: var(--prism-Button-large-lineHeight); fon
.prism-Button-root:where(.prism-Button-extraLarge){height: var(--prism-Button-extraLarge-height); width: var(--prism-Button-extraLarge-width); min-width: var(--prism-Button-extraLarge-minWidth); min-height: var(--prism-Button-extraLarge-minHeight); padding-left: var(--prism-Button-extraLarge-paddingInline); padding-right: var(--prism-Button-extraLarge-paddingInline); padding-top: var(--prism-Button-extraLarge-paddingBlock); padding-bottom: var(--prism-Button-extraLarge-paddingBlock); border-radius: var(--prism-Button-extraLarge-borderRadius); font-size: var(--prism-Button-extraLarge-fontSize);
.prism-Button-root:where(.prism-Button-primary){color: var(--prism-Button-primary-color); background: var(--prism-Button-primary-background); border-color: var(--prism-Button-primary-borderColor); font-weight: var(--prism-Button-primary-fontWeight); box-shadow: var(--prism-Button-primary-boxShadow);}
.prism-Button-root:where(.prism-Button-primary):where(:hover){color: var(--prism-Button-primary-hover-color); background: var(--prism-Button-primary-hover-background); border-color: var(--prism-Button-primary-hover-borderColor); box-shadow: var(--prism-Button-primary-hover-boxShadow); text-decoration: none;}
.prism-Button-root:where(.prism-Button-primary):where(:active){color: var(--prism-Button-primary-active-color); background: var(--prism-Button-primary-active-background); border-color: var(--prism-Button-primary-active-borderColor); box-shadow: var(--prism-Button-primary-active-boxShadow); text-decoration: none;}
.prism-Button-root:where(.prism-Button-secondary){color: var(--prism-Button-secondary-color); background: var(--prism-Button-secondary-background); border-color: var(--prism-Button-secondary-borderColor);}
.prism-Button-root:where(.prism-Button-secondary):where(:hover){color: var(--prism-Button-secondary-hover-color); background: var(--prism-Button-secondary-hover-background); border-color: var(--prism-Button-secondary-hover-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-secondary):where(:active){color: var(--prism-Button-secondary-active-color); background: var(--prism-Button-secondary-active-background); border-color: var(--prism-Button-secondary-active-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-tertiary){color: var(--prism-Button-tertiary-color); background: var(--prism-Button-tertiary-background); border-color: var(--prism-Button-tertiary-borderColor);}
.prism-Button-root:where(.prism-Button-tertiary):where(:hover){color: var(--prism-Button-tertiary-hover-color); background: var(--prism-Button-tertiary-hover-background); border-color: var(--prism-Button-tertiary-hover-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-tertiary):where(:active){color: var(--prism-Button-tertiary-active-color); background: var(--prism-Button-tertiary-active-background); border-color: var(--prism-Button-tertiary-active-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-tertiary):where(.prism-Button-small){padding-left: var(--prism-Button-tertiary-small-paddingInline); padding-right: var(--prism-Button-tertiary-small-paddingInline);}
.prism-Button-root:where(.prism-Button-tertiary):where(.prism-Button-medium){padding-left: var(--prism-Button-tertiary-medium-paddingInline); padding-right: var(--prism-Button-tertiary-medium-paddingInline);}
.prism-Button-root:where(.prism-Button-tertiary):where(.prism-Button-large){padding-left: var(--prism-Button-tertiary-large-paddingInline); padding-right: var(--prism-Button-tertiary-large-paddingInline);}
.prism-Button-root:where(.prism-Button-tertiary):where(.prism-Button-extraLarge){padding-left: var(--prism-Button-tertiary-extraLarge-paddingInline); padding-right: var(--prism-Button-tertiary-extraLarge-paddingInline);}
.prism-Button-root:where(.prism-Button-overlay){color: var(--prism-Button-overlay-color); background: var(--prism-Button-overlay-background); border-color: var(--prism-Button-overlay-borderColor);}
.prism-Button-root:where(.prism-Button-overlay):where(:hover){color: var(--prism-Button-overlay-hover-color); background: var(--prism-Button-overlay-hover-background); border-color: var(--prism-Button-overlay-hover-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-overlay):where(:active){color: var(--prism-Button-overlay-active-color); background: var(--prism-Button-overlay-active-background); border-color: var(--prism-Button-overlay-active-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-text){color: var(--prism-Button-text-color); background: var(--prism-Button-text-background); border-color: var(--prism-Button-text-borderColor);}
.prism-Button-root:where(.prism-Button-text):where(:hover){color: var(--prism-Button-text-hover-color); background: var(--prism-Button-text-hover-background); border-color: var(--prism-Button-text-hover-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-text):where(:active){color: var(--prism-Button-text-active-color); background: var(--prism-Button-text-active-background); border-color: var(--prism-Button-text-active-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-text):where(.prism-Button-small){height: var(--prism-Button-text-small-height); width: var(--prism-Button-text-small-width); min-width: var(--prism-Button-text-small-minWidth); min-height: var(--prism-Button-text-small-minHeight); padding-left: var(--prism-Button-text-small-paddingInline); padding-right: var(--prism-Button-text-small-paddingInline); padding-top: var(--prism-Button-text-small-paddingBlock); padding-bottom: var(--prism-Button-text-small-paddingBlock); border-radius: var(--prism-Button-text-small-borderRadius); font-size: var(--prism-Button-
.prism-Button-root:where(.prism-Button-text):where(.prism-Button-medium){height: var(--prism-Button-text-medium-height); width: var(--prism-Button-text-medium-width); min-width: var(--prism-Button-text-medium-minWidth); min-height: var(--prism-Button-text-medium-minHeight); padding-left: var(--prism-Button-text-medium-paddingInline); padding-right: var(--prism-Button-text-medium-paddingInline); padding-top: var(--prism-Button-text-medium-paddingBlock); padding-bottom: var(--prism-Button-text-medium-paddingBlock); border-radius: var(--prism-Button-text-medium-borderRadius); font-size: var(--pri
.prism-Button-root:where(.prism-Button-text):where(.prism-Button-large){height: var(--prism-Button-text-large-height); width: var(--prism-Button-text-large-width); min-width: var(--prism-Button-text-large-minWidth); min-height: var(--prism-Button-text-large-minHeight); padding-left: var(--prism-Button-text-large-paddingInline); padding-right: var(--prism-Button-text-large-paddingInline); padding-top: var(--prism-Button-text-large-paddingBlock); padding-bottom: var(--prism-Button-text-large-paddingBlock); border-radius: var(--prism-Button-text-large-borderRadius); font-size: var(--prism-Button-
.prism-Button-root:where(.prism-Button-text):where(.prism-Button-extraLarge){height: var(--prism-Button-text-extraLarge-height); width: var(--prism-Button-text-extraLarge-width); min-width: var(--prism-Button-text-extraLarge-minWidth); min-height: var(--prism-Button-text-extraLarge-minHeight); padding-left: var(--prism-Button-text-extraLarge-paddingInline); padding-right: var(--prism-Button-text-extraLarge-paddingInline); padding-top: var(--prism-Button-text-extraLarge-paddingBlock); padding-bottom: var(--prism-Button-text-extraLarge-paddingBlock); border-radius: var(--prism-Button-text-extraL
.prism-Button-root:where(.prism-Button-danger):where(.prism-Button-text){color: var(--prism-Button-danger-text-color); background: var(--prism-Button-danger-text-background); border-color: var(--prism-Button-danger-text-borderColor);}
.prism-Button-root:where(.prism-Button-danger):where(.prism-Button-text):where(:hover){color: var(--prism-Button-danger-text-hover-color); background: var(--prism-Button-danger-text-hover-background); border-color: var(--prism-Button-danger-text-hover-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-danger):where(.prism-Button-text):where(:active){color: var(--prism-Button-danger-text-active-color); background: var(--prism-Button-danger-text-active-background); border-color: var(--prism-Button-danger-text-active-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-disabled){cursor: not-allowed;}
.prism-Button-root:where(.prism-Button-disabled):where(.prism-Button-text){color: var(--prism-Button-disabled-text-color); background: var(--prism-Button-disabled-text-background); border-color: var(--prism-Button-disabled-text-borderColor);}
.prism-Button-root:where(.prism-Button-disabled):where(.prism-Button-text):where(:hover){color: var(--prism-Button-disabled-text-color); background: var(--prism-Button-disabled-text-background); border-color: var(--prism-Button-disabled-text-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-disabled):where(.prism-Button-text):where(:active){color: var(--prism-Button-disabled-text-color); background: var(--prism-Button-disabled-text-background); border-color: var(--prism-Button-disabled-text-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-disabled):where(.prism-Button-danger):where(.prism-Button-text){color: var(--prism-Button-disabled-danger-text-color);}
.prism-Button-root:where(.prism-Button-disabled):where(.prism-Button-danger):where(.prism-Button-text):where(:hover){color: var(--prism-Button-disabled-danger-text-color); text-decoration: none;}
.prism-Button-root:where(.prism-Button-disabled):where(.prism-Button-danger):where(.prism-Button-text):where(:active){color: var(--prism-Button-disabled-danger-text-color); text-decoration: none;}
:where(html.prism-navigation-with-keyboard, body.prism-navigation-with-keyboard) .prism-Button-root:focus-visible{outline: 2px solid var(--prism-Button-focusOutlineColor); outline-offset: var(--prism-Button-focusOutlineOffset);}
.prism-Button-root:where(.prism-Button-fullWidth){display: flex; width: 100%;}
.prism-Button-root:where(.prism-Button-icon){height: var(--prism-Button-variant-icon-medium-height); width: var(--prism-Button-variant-icon-medium-width); min-width: var(--prism-Button-variant-icon-medium-minWidth); min-height: var(--prism-Button-variant-icon-medium-minHeight); padding-left: var(--prism-Button-variant-icon-medium-paddingInline); padding-right: var(--prism-Button-variant-icon-medium-paddingInline); padding-top: var(--prism-Button-variant-icon-medium-paddingBlock); padding-bottom: var(--prism-Button-variant-icon-medium-paddingBlock); border-radius: var(--prism-Button-variant-ico
.prism-Button-root:where(.prism-Button-icon):where(:hover){color: var(--prism-Button-variant-icon-primary-hover-color); background: var(--prism-Button-variant-icon-primary-hover-background); border-color: var(--prism-Button-variant-icon-primary-hover-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-icon):where(:active){color: var(--prism-Button-variant-icon-primary-active-color); background: var(--prism-Button-variant-icon-primary-active-background); border-color: var(--prism-Button-variant-icon-primary-active-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-small){height: var(--prism-Button-variant-icon-small-height); width: var(--prism-Button-variant-icon-small-width); min-width: var(--prism-Button-variant-icon-small-minWidth); min-height: var(--prism-Button-variant-icon-small-minHeight); padding-left: var(--prism-Button-variant-icon-small-paddingInline); padding-right: var(--prism-Button-variant-icon-small-paddingInline); padding-top: var(--prism-Button-variant-icon-small-paddingBlock); padding-bottom: var(--prism-Button-variant-icon-small-paddingBlock); border-radius: var(--prism
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-medium){height: var(--prism-Button-variant-icon-medium-height); width: var(--prism-Button-variant-icon-medium-width); min-width: var(--prism-Button-variant-icon-medium-minWidth); min-height: var(--prism-Button-variant-icon-medium-minHeight); padding-left: var(--prism-Button-variant-icon-medium-paddingInline); padding-right: var(--prism-Button-variant-icon-medium-paddingInline); padding-top: var(--prism-Button-variant-icon-medium-paddingBlock); padding-bottom: var(--prism-Button-variant-icon-medium-paddingBlock); border-radius: va
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-large){height: var(--prism-Button-variant-icon-large-height); width: var(--prism-Button-variant-icon-large-width); min-width: var(--prism-Button-variant-icon-large-minWidth); min-height: var(--prism-Button-variant-icon-large-minHeight); padding-left: var(--prism-Button-variant-icon-large-paddingInline); padding-right: var(--prism-Button-variant-icon-large-paddingInline); padding-top: var(--prism-Button-variant-icon-large-paddingBlock); padding-bottom: var(--prism-Button-variant-icon-large-paddingBlock); border-radius: var(--prism
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-extraLarge){height: var(--prism-Button-variant-icon-extraLarge-height); width: var(--prism-Button-variant-icon-extraLarge-width); min-width: var(--prism-Button-variant-icon-extraLarge-minWidth); min-height: var(--prism-Button-variant-icon-extraLarge-minHeight); padding-left: var(--prism-Button-variant-icon-extraLarge-paddingInline); padding-right: var(--prism-Button-variant-icon-extraLarge-paddingInline); padding-top: var(--prism-Button-variant-icon-extraLarge-paddingBlock); padding-bottom: var(--prism-Button-variant-icon-extraLa
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-primary){color: var(--prism-Button-variant-icon-primary-color); background: var(--prism-Button-variant-icon-primary-background); border-color: var(--prism-Button-variant-icon-primary-borderColor);}
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-primary):where(:hover){color: var(--prism-Button-variant-icon-primary-hover-color); background: var(--prism-Button-variant-icon-primary-hover-background); border-color: var(--prism-Button-variant-icon-primary-hover-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-primary):where(:active){color: var(--prism-Button-variant-icon-primary-active-color); background: var(--prism-Button-variant-icon-primary-active-background); border-color: var(--prism-Button-variant-icon-primary-active-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-secondary){color: var(--prism-Button-variant-icon-secondary-color); background: var(--prism-Button-variant-icon-secondary-background); border-color: var(--prism-Button-variant-icon-secondary-borderColor); backdrop-filter: var(--prism-Button-variant-icon-secondary-backdropFilter);}
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-secondary):where(:hover){color: var(--prism-Button-variant-icon-secondary-hover-color); background: var(--prism-Button-variant-icon-secondary-hover-background); border-color: var(--prism-Button-variant-icon-secondary-hover-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-secondary):where(:active){color: var(--prism-Button-variant-icon-secondary-active-color); background: var(--prism-Button-variant-icon-secondary-active-background); border-color: var(--prism-Button-variant-icon-secondary-active-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-tertiary){color: var(--prism-Button-variant-icon-tertiary-color); background: var(--prism-Button-variant-icon-tertiary-background); border-color: var(--prism-Button-variant-icon-tertiary-borderColor);}
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-tertiary):where(:hover){color: var(--prism-Button-variant-icon-tertiary-hover-color); background: var(--prism-Button-variant-icon-tertiary-hover-background); border-color: var(--prism-Button-variant-icon-tertiary-hover-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-tertiary):where(:active){color: var(--prism-Button-variant-icon-tertiary-active-color); background: var(--prism-Button-variant-icon-tertiary-active-background); border-color: var(--prism-Button-variant-icon-tertiary-active-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-overlay){color: var(--prism-Button-variant-icon-overlay-color); background: var(--prism-Button-variant-icon-overlay-background); border-color: var(--prism-Button-variant-icon-overlay-borderColor);}
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-overlay):where(:hover){color: var(--prism-Button-variant-icon-overlay-hover-color); background: var(--prism-Button-variant-icon-overlay-hover-background); border-color: var(--prism-Button-variant-icon-overlay-hover-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-icon):where(.prism-Button-overlay):where(:active){color: var(--prism-Button-variant-icon-overlay-active-color); background: var(--prism-Button-variant-icon-overlay-active-background); border-color: var(--prism-Button-variant-icon-overlay-active-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-home){height: var(--prism-Button-variant-home-height); width: var(--prism-Button-variant-home-width); min-width: var(--prism-Button-variant-home-minWidth); min-height: var(--prism-Button-variant-home-minHeight); padding-left: var(--prism-Button-variant-home-paddingInline); padding-right: var(--prism-Button-variant-home-paddingInline); padding-top: var(--prism-Button-variant-home-paddingBlock); padding-bottom: var(--prism-Button-variant-home-paddingBlock); border-radius: var(--prism-Button-variant-home-borderRadius); font-size: var(--prism-Button-variant-h
.prism-Button-root:where(.prism-Button-home):where(.prism-Button-primary){color: var(--prism-Button-variant-home-primary-color); background-color: var(--prism-Button-variant-home-primary-background); box-shadow: var(--prism-Button-variant-home-primary-boxShadow); border-color: var(--prism-Button-variant-home-primary-borderColor); --gradient-color: var(--prism-Button-variant-home-primary-gradientColor);}
.prism-Button-root:where(.prism-Button-home):where(.prism-Button-primary):where(:hover){text-decoration: none; background-color: var(--prism-Button-variant-home-primary-hover-background); box-shadow: var(--prism-Button-variant-home-primary-hover-boxShadow); --gradient-color: var(--prism-Button-variant-home-primary-hover-gradientColor);}
.prism-Button-root:where(.prism-Button-home):where(.prism-Button-primary):where(:active){background-color: var(--prism-Button-variant-home-primary-active-background); box-shadow: var(--prism-Button-variant-home-primary-active-boxShadow); --gradient-color: var(--prism-Button-variant-home-primary-active-gradientColor);}
.prism-Button-root:where(.prism-Button-home):where(.prism-Button-highlight){color: var(--prism-Button-variant-home-highlight-color); background-color: var(--prism-Button-variant-home-highlight-background); box-shadow: var(--prism-Button-variant-home-highlight-boxShadow); border-color: var(--prism-Button-variant-home-highlight-borderColor); --gradient-color: var(--prism-Button-variant-home-highlight-gradientColor);}
.prism-Button-root:where(.prism-Button-home):where(.prism-Button-highlight):where(:hover){text-decoration: none; background-color: var(--prism-Button-variant-home-highlight-hover-background); box-shadow: var(--prism-Button-variant-home-highlight-hover-boxShadow); --gradient-color: var(--prism-Button-variant-home-highlight-hover-gradientColor);}
.prism-Button-root:where(.prism-Button-home):where(.prism-Button-highlight):where(:active){background-color: var(--prism-Button-variant-home-highlight-active-background); box-shadow: var(--prism-Button-variant-home-highlight-active-boxShadow); --gradient-color: var(--prism-Button-variant-home-highlight-active-gradientColor);}
.prism-Button-root:where(.prism-Button-home):where(.prism-Button-danger){color: var(--prism-Button-variant-home-danger-color); background-color: var(--prism-Button-variant-home-danger-background); box-shadow: var(--prism-Button-variant-home-danger-boxShadow); border-color: var(--prism-Button-variant-home-danger-borderColor); --gradient-color: var(--prism-Button-variant-home-danger-gradientColor);}
.prism-Button-root:where(.prism-Button-home):where(.prism-Button-danger):where(:hover){text-decoration: none; background-color: var(--prism-Button-variant-home-danger-hover-background); box-shadow: var(--prism-Button-variant-home-danger-hover-boxShadow); --gradient-color: var(--prism-Button-variant-home-danger-hover-gradientColor);}
.prism-Button-root:where(.prism-Button-home):where(.prism-Button-danger):where(:active){background-color: var(--prism-Button-variant-home-danger-active-background); box-shadow: var(--prism-Button-variant-home-danger-active-boxShadow); --gradient-color: var(--prism-Button-variant-home-danger-active-gradientColor);}
.prism-Button-root:where(.prism-Button-home):where(:hover){transform: translateY(var(--prism-Button-variant-home-hover-offset));}
.prism-Button-root:where(.prism-Button-home):where(:active){transform: translateY(var(--prism-Button-variant-home-pressed-offset));}
.prism-Button-root:where(.prism-Button-home):where(.prism-Button-disabled){color: var(--prism-Button-variant-home-disabled-color); background-position-x: ; background-position-y: ; background-size: ; background-repeat: ; background-attachment: ; background-origin: ; background-clip: ; background-color: ; border-color: var(--prism-Button-variant-home-disabled-borderColor); box-shadow: none; background-image: none; transform: none;}
.prism-Button-root:where(.prism-Button-home):where(.prism-Button-disabled):where(:hover){color: var(--prism-Button-variant-home-disabled-color); background: var(--prism-Button-variant-home-disabled-background); border-color: var(--prism-Button-variant-home-disabled-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-home):where(.prism-Button-disabled):where(:active){color: var(--prism-Button-variant-home-disabled-color); background: var(--prism-Button-variant-home-disabled-background); border-color: var(--prism-Button-variant-home-disabled-borderColor); text-decoration: none;}
.prism-Button-root:where(.prism-Button-hero){height: var(--prism-Button-variant-hero-medium-height); padding-left: var(--prism-Button-variant-hero-medium-paddingInline); padding-right: var(--prism-Button-variant-hero-medium-paddingInline); border-radius: var(--prism-Button-variant-hero-medium-borderRadius); font-size: var(--prism-Button-variant-hero-medium-fontSize); line-height: var(--prism-Button-variant-hero-medium-lineHeight); gap: var(--prism-Button-variant-hero-medium-gap); color: var(--prism-Button-variant-hero-color); background: var(--prism-Button-variant-hero-background); border-colo
.prism-Button-root:where(.prism-Button-hero):where(:hover){color: var(--prism-Button-variant-hero-hover-color); background: var(--prism-Button-variant-hero-hover-background); border-color: var(--prism-Button-variant-hero-hover-borderColor); box-shadow: var(--prism-Button-variant-hero-hover-boxShadow); text-decoration: none;}
.prism-Button-root:where(.prism-Button-hero):where(:active){color: var(--prism-Button-variant-hero-active-color); background: var(--prism-Button-variant-hero-active-background); border-color: var(--prism-Button-variant-hero-active-borderColor); box-shadow: var(--prism-Button-variant-hero-active-boxShadow); text-decoration: none;}
.prism-Button-root:where(.prism-Button-hero):where(.prism-Button-small){height: var(--prism-Button-variant-hero-small-height); padding-left: var(--prism-Button-variant-hero-small-paddingInline); padding-right: var(--prism-Button-variant-hero-small-paddingInline); border-radius: var(--prism-Button-variant-hero-small-borderRadius); font-size: var(--prism-Button-variant-hero-small-fontSize); line-height: var(--prism-Button-variant-hero-small-lineHeight); font-weight: var(--prism-Button-variant-hero-small-fontWeight); gap: var(--prism-Button-variant-hero-small-gap);}
.prism-Button-root:where(.prism-Button-hero):where(.prism-Button-disabled){cursor: not-allowed; color: var(--prism-Button-variant-hero-disabled-color); background: var(--prism-Button-variant-hero-disabled-background); border-color: var(--prism-Button-variant-hero-disabled-borderColor); box-shadow: var(--prism-Button-variant-hero-disabled-boxShadow);}
.prism-Button-root:where(.prism-Button-hero):where(.prism-Button-disabled):where(:hover){color: var(--prism-Button-variant-hero-disabled-hover-color); background: var(--prism-Button-variant-hero-disabled-hover-background); border-color: var(--prism-Button-variant-hero-disabled-hover-borderColor); box-shadow: var(--prism-Button-variant-hero-disabled-hover-boxShadow); text-decoration: none;}
.prism-Button-root:where(.prism-Button-hero):where(.prism-Button-disabled):where(:active){color: var(--prism-Button-variant-hero-disabled-active-color); background: var(--prism-Button-variant-hero-disabled-active-background); border-color: var(--prism-Button-variant-hero-disabled-active-borderColor); box-shadow: var(--prism-Button-variant-hero-disabled-active-boxShadow); text-decoration: none;}
.prism-Button-root :where(.prism-IconWrapper-root){font-size: inherit;}
.prism-Button-label{display: inline-flex; font-size: inherit; font-weight: inherit; line-height: inherit;}
:where(.prism-Button-loading.prism-Button-loadingPositionCenter) > .prism-Button-label{visibility: hidden;}
.prism-Button-label .zmicon{display: inline-flex; align-items: center; justify-content: center;}
.prism-Button-affixIcon{display: inline-flex; font-weight: inherit; line-height: inherit;}
:where(.prism-Button-root.prism-Button-small) > .prism-Button-affixIcon{font-size: var(--prism-Button-small-iconSize);}
:where(.prism-Button-root.prism-Button-medium) > .prism-Button-affixIcon{font-size: var(--prism-Button-medium-iconSize);}
:where(.prism-Button-root.prism-Button-large) > .prism-Button-affixIcon{font-size: var(--prism-Button-large-iconSize);}
:where(.prism-Button-root.prism-Button-extraLarge) > .prism-Button-affixIcon{font-size: var(--prism-Button-extraLarge-iconSize);}
:where(.prism-Button-root.prism-Button-hero) > .prism-Button-affixIcon{font-size: var(--prism-Button-variant-hero-medium-iconSize);}
:where(.prism-Button-root.prism-Button-small.prism-Button-hero) > .prism-Button-affixIcon{font-size: var(--prism-Button-variant-hero-small-iconSize);}
:where(.prism-Button-loading.prism-Button-loadingPositionCenter) > .prism-Button-affixIcon{visibility: hidden;}
.prism-Button-affixIcon .zmicon{display: inline-flex; align-items: center; justify-content: center;}
.prism-Button-iconLoading{display: inline-flex; justify-content: center; align-items: center; color: var(--prism-Button-iconLoading-color);}
:where(.prism-Button-root.prism-Button-primary) > :where(.prism-Button-affixIcon) > .prism-Button-iconLoading{color: var(--prism-Button-iconLoading-primary-color);}
:where(.prism-Button-root.prism-Button-overlay) > :where(.prism-Button-affixIcon) > .prism-Button-iconLoading{color: var(--prism-Button-iconLoading-overlay-color);}
:where(.prism-Button-root.prism-Button-primary) > :where(.prism-Button-mask) > .prism-Button-iconLoading{color: var(--prism-Button-iconLoading-primary-color);}
:where(.prism-Button-root.prism-Button-overlay) > :where(.prism-Button-mask) > .prism-Button-iconLoading{color: var(--prism-Button-iconLoading-overlay-color);}
.prism-Button-mask{display: inline-flex; font-size: inherit; font-weight: inherit; line-height: inherit; position: absolute; inset: 0px; justify-content: center; align-items: center;}
.prism-Button-fab{width: var(--prism-Button-fab-size); height: var(--prism-Button-fab-size); color: var(--prism-Button-fab-color); background-position-x: ; background-position-y: ; background-size: ; background-repeat: ; background-attachment: ; background-origin: ; background-clip: ; background-color: ; background-image: radial-gradient(at 0% 0%, var(--prism-Button-fab-gradientColor) 0%, transparent 100%); box-shadow: var(--prism-Button-fab-boxShadow); display: flex; align-items: center; justify-content: center; border-radius: calc(infinity * 1px); border-width: medium; border-style: none; bo
.prism-Button-fab :where(span), .prism-Button-fab :where(i), .prism-Button-fab :where(svg){font-size: var(--prism-Button-fab-icon-size); width: var(--prism-Button-fab-icon-size); height: var(--prism-Button-fab-icon-size);}
.prism-Button-fab:where(:hover){background-position-x: ; background-position-y: ; background-size: ; background-repeat: ; background-attachment: ; background-origin: ; background-clip: ; background-color: ; background-image: radial-gradient(at 0% 0%, var(--prism-Button-fab-hover-gradientColor) 0%, transparent 100%); box-shadow: var(--prism-Button-fab-hover-boxShadow); transform: translateY(var(--prism-Button-fab-hover-offset));}
.prism-Button-fab:where(:active){background-position-x: ; background-position-y: ; background-size: ; background-repeat: ; background-attachment: ; background-origin: ; background-clip: ; background-color: ; background-image: radial-gradient(at 0% 0%, var(--prism-Button-fab-active-gradientColor) 0%, transparent 100%); box-shadow: var(--prism-Button-fab-active-boxShadow); transform: translateY(var(--prism-Button-fab-active-offset));}
.prism-Button-fab:where(.prism-Button-disabled){background-position-x: ; background-position-y: ; background-size: ; background-repeat: ; background-attachment: ; background-origin: ; background-clip: ; background-color: ; color: var(--prism-Button-fab-disabled-color); box-shadow: var(--prism-Button-fab-disabled-boxShadow); background-image: none; cursor: not-allowed; transform: none;}
:where(html.prism-navigation-with-keyboard, body.prism-navigation-with-keyboard) .prism-Button-fab:focus-visible{outline: var(--prism-Button-fab-focus-outline); outline-offset: var(--prism-Button-fab-focus-outlineOffset);}
.prism-Button-anchorButton{border-radius: calc(infinity * 1px); background: var(--prism-Button-anchorButton-background); box-shadow: var(--prism-Button-anchorButton-boxShadow); display: flex; backdrop-filter: blur(30px);}
.prism-Button-anchorButtonClickable{height: var(--prism-Button-anchorButton-height); padding-inline: var(--prism-Button-anchorButton-paddingInline); border: 1px solid var(--prism-Button-anchorButton-borderColor); display: flex; align-items: center; justify-content: center; color: var(--prism-Button-anchorButton-color); background: transparent; position: relative; gap: var(--prism-Button-anchorButton-gap); margin-inline-end: -1px; cursor: pointer;}
.prism-Button-anchorButtonClickable:where(:hover){background: var(--prism-Button-anchorButton-hover-background); color: var(--prism-Button-anchorButton-hover-color);}
.prism-Button-anchorButtonClickable:where(:active){background: var(--prism-Button-anchorButton-active-background); color: var(--prism-Button-anchorButton-active-color);}
:where(html.prism-navigation-with-keyboard, body.prism-navigation-with-keyboard) .prism-Button-anchorButtonClickable:focus-visible{outline: var(--prism-Button-anchorButton-focus-outline); outline-offset: var(--prism-Button-anchorButton-focus-outlineOffset); z-index: 1;}
.prism-Button-anchorButtonClickable:where(:first-child){border-start-start-radius: calc(infinity * 1px); border-end-start-radius: calc(infinity * 1px);}
.prism-Button-anchorButtonClickable:where(:last-child){border-start-end-radius: calc(infinity * 1px); border-end-end-radius: calc(infinity * 1px); margin: 0px;}
.prism-Button-anchorButtonClickable:where(:not(:first-child)){padding-inline-start: var(--prism-Button-anchorButton-separatingPadding);}
.prism-Button-anchorButtonClickable:where(:not(:last-child)){padding-inline-end: var(--prism-Button-anchorButton-separatingPadding);}
.prism-Button-anchorButtonClickable :where(span), .prism-Button-anchorButtonClickable :where(i), .prism-Button-anchorButtonClickable :where(svg){font-size: var(--prism-Button-anchorButton-icon-size); width: var(--prism-Button-anchorButton-icon-size); height: var(--prism-Button-anchorButton-icon-size);}
:where(.prism-Button-alert) > .prism-Button-anchorButtonClickable{color: var(--prism-Button-anchorButton-alert-color);}
:where(.prism-Button-alert) > .prism-Button-anchorButtonClickable:where(:hover){color: var(--prism-Button-anchorButton-alert-hover-color);}
:where(.prism-Button-alert) > .prism-Button-anchorButtonClickable:where(:active){color: var(--prism-Button-anchorButton-alert-active-color);}
:where(.prism-Button-neutral) > .prism-Button-anchorButtonClickable{color: var(--prism-Button-anchorButton-neutral-color);}
:where(.prism-Button-neutral) > .prism-Button-anchorButtonClickable:where(:hover){color: var(--prism-Button-anchorButton-neutral-hover-color);}
:where(.prism-Button-neutral) > .prism-Button-anchorButtonClickable:where(:active){color: var(--prism-Button-anchorButton-neutral-active-color);}
.prism-Button-anchorButtonLabel{display: flex; padding-inline: var(--prism-Button-anchorButton-label-paddingInline);}
```

### B.4 prism-Tooltip

Source: `inline <style data-prism="Tooltip">` [M]

```css
.prism-Tooltip-root, .prism-Tooltip-css-var{--prism-Tooltip-backgroundColor: var(--fill-default); --prism-Tooltip-backdropFilter: none; --prism-Tooltip-borderColor: var(--border-subtle-neutral); --prism-Tooltip-color: var(--text-stronger-neutral); --prism-Tooltip-paddingInline: 6px; --prism-Tooltip-paddingBlock: 3px; --prism-Tooltip-borderRadius: 4px; --prism-Tooltip-boxShadow: var(--shadow-sm); --prism-Tooltip-maxWidth: 360px; --prism-Tooltip-zIndex: var(--zIndex-Tooltip); --prism-Tooltip-fontFamily: var(--typography-fontFamily); --prism-Tooltip-fontSize: var(--typography-fontSize-body-2); --prism-Tooltip-fontWeight: var(--typography-fontWeight-body-2); --prism-Tooltip-lineHeight: var(--typography-lineHeight-body-2); --prism-Tooltip-withArrow-paddingInline: 12px; --prism-Tooltip-withArrow-paddingBlock: 12px; --prism-Tooltip-withArrow-borderRadius: 10px; --prism-Tooltip-withArrow-boxShadow: var(--shadow-md); --prism-Tooltip-withArrow-maxWidth: 360px; --prism-Tooltip-withArrow-fontFamily: var(--typography-fontFamily); --prism-Tooltip-withArrow-fontSize: var(--typography-fontSize-body-1); --prism-Tooltip-withArrow-fontWeight: var(--typography-fontWeight-body-1); --prism-Tooltip-withArrow-lineHeight: var(--typography-lineHeight-body-1); --prism-Tooltip-shortcut-color: var(--text-neutral); --prism-Tooltip-shortcut-marginInlineStart: 6px; --prism-Tooltip-shortcut-beforeText: ""; --prism-Tooltip-shortcut-afterText: "";}
.prism-Tooltip-root:where(.prism-3), .prism-Tooltip-css-var:where(.prism-3){--prism-Tooltip-backgroundColor: var(--state-contrary-strong-transparent-hover); --prism-Tooltip-backdropFilter: blur(15px); --prism-Tooltip-paddingBlock: 1px; --prism-Tooltip-paddingInline: 5px; --prism-Tooltip-borderColor: transparent; --prism-Tooltip-color: var(--inverse-default); --prism-Tooltip-shortcut-color: var(--inverse-default); --prism-Tooltip-shortcut-marginInlineStart: 2px; --prism-Tooltip-shortcut-beforeText: "("; --prism-Tooltip-shortcut-afterText: ")";}
.prism-Tooltip-popper{--prism-internal-Popper-backgroundColor: var(--prism-Tooltip-backgroundColor); --prism-internal-Popper-borderColor: var(--prism-Tooltip-borderColor); color: var(--prism-Tooltip-color); display: flex; flex-direction: column; align-items: stretch; z-index: var(--prism-Tooltip-zIndex); border-radius: var(--prism-Tooltip-borderRadius); box-shadow: var(--prism-Tooltip-boxShadow); backdrop-filter: var(--prism-Tooltip-backdropFilter);}
.prism-Tooltip-popper:where(.prism-Tooltip-withArrow){border-radius: var(--prism-Tooltip-withArrow-borderRadius); box-shadow: var(--prism-Tooltip-withArrow-boxShadow);}
.prism-Tooltip-popper > :where(.prism-Tooltip-body){flex: 0 1 auto; overflow: hidden; padding-inline: var(--prism-Tooltip-paddingInline); padding-block: var(--prism-Tooltip-paddingBlock); max-width: var(--prism-Tooltip-maxWidth); font-family: var(--prism-Tooltip-fontFamily); font-size: var(--prism-Tooltip-fontSize); font-weight: var(--prism-Tooltip-fontWeight); line-height: var(--prism-Tooltip-lineHeight);}
.prism-Tooltip-popper:where(.prism-Tooltip-withArrow) > :where(.prism-Tooltip-body){padding-inline: var(--prism-Tooltip-withArrow-paddingInline); padding-block: var(--prism-Tooltip-withArrow-paddingBlock); max-width: var(--prism-Tooltip-withArrow-maxWidth); font-family: var(--prism-Tooltip-withArrow-fontFamily); font-size: var(--prism-Tooltip-withArrow-fontSize); font-weight: var(--prism-Tooltip-withArrow-fontWeight); line-height: var(--prism-Tooltip-withArrow-lineHeight);}
.prism-Tooltip-popper:where(.prism-Tooltip-fixedWidth) > :where(.prism-Tooltip-body){max-width: none;}
.prism-Tooltip-popper:where(.prism-Tooltip-disableInteractive){pointer-events: none;}
.prism-Tooltip-shortcutKeyLabel{display: inline-block; color: var(--prism-Tooltip-shortcut-color); margin-inline-start: var(--prism-Tooltip-shortcut-marginInlineStart);}
.prism-Tooltip-shortcutKeyLabel:where(:first-child){margin-inline-start: 0px;}
.prism-Tooltip-shortcutKeyLabel::before{content: var(--prism-Tooltip-shortcut-beforeText);}
.prism-Tooltip-shortcutKeyLabel::after{content: var(--prism-Tooltip-shortcut-afterText);}
```

### B.4 prism-Popover

Source: `inline <style data-prism="Popover">` [M]

```css
.prism-Popover-root, .prism-Popover-css-var{--prism-Popover-backgroundColor: var(--fill-default); --prism-Popover-borderColor: var(--border-subtle-neutral); --prism-Popover-padding: 12px; --prism-Popover-borderRadius: 10px; --prism-Popover-boxShadow: var(--shadow-md); --prism-Popover-maxWidth: 360px; --prism-Popover-title-color: var(--text-stronger-neutral); --prism-Popover-title-marginBottom: 4px; --prism-Popover-content-color: var(--text-stronger-neutral); --prism-Popover-closeButton-inset: -6px; --prism-Popover-closeButton-marginInlineStart: 8px; --prism-Popover-footer-marginTop: 16px; --prism-Popover-footer-gap: 8px; --prism-Popover-variant-complex-padding: 12px; --prism-Popover-variant-complex-borderRadius: 10px; --prism-Popover-variant-complex-title-marginBottom: 4px; --prism-Popover-variant-complex-closeButton-inset: -6px; --prism-Popover-variant-complex-footer-marginTop: 16px; --prism-Popover-infoButton-small-size: 16px; --prism-Popover-infoButton-medium-size: 18px; --prism-Popover-infoButton-large-size: 20px;}
.prism-Popover-root:where(.prism-3), .prism-Popover-css-var:where(.prism-3){--prism-Popover-padding: 16px; --prism-Popover-borderRadius: 16px; --prism-Popover-maxWidth: 320px; --prism-Popover-closeButton-inset: 0; --prism-Popover-variant-complex-padding: 24px; --prism-Popover-variant-complex-borderRadius: 24px; --prism-Popover-variant-complex-title-marginBottom: 16px; --prism-Popover-variant-complex-closeButton-inset: 0; --prism-Popover-variant-complex-footer-marginTop: 24px;}
.prism-Popover-popper{--prism-internal-Popper-backgroundColor: var(--prism-Popover-backgroundColor); --prism-internal-Popper-borderColor: var(--prism-Popover-borderColor); border-radius: var(--prism-Popover-borderRadius); box-shadow: var(--prism-Popover-boxShadow); display: flex; flex-direction: column; align-items: stretch;}
.prism-Popover-popper:where(.prism-Popover-complex){border-radius: var(--prism-Popover-variant-complex-borderRadius);}
.prism-Popover-popper > :where(.prism-Popover-body){max-width: var(--prism-Popover-maxWidth); flex: 0 1 auto; padding: var(--prism-Popover-padding); overflow: hidden auto; display: grid; grid-template: "title title" "content close" 1fr "footer footer" / 1fr auto;}
.prism-Popover-popper:where(.prism-Popover-complex) > :where(.prism-Popover-body){padding: var(--prism-Popover-variant-complex-padding);}
.prism-Popover-popper:where(.prism-Popover-fixedWidth) > :where(.prism-Popover-body){max-width: none;}
.prism-Popover-popper:where(.prism-Popover-withTitle) > :where(.prism-Popover-body){grid-template: "title close" "content content" 1fr "footer footer" / 1fr auto;}
.prism-Popover-title{grid-area: title; align-self: center; color: var(--prism-Popover-title-color); margin-bottom: var(--prism-Popover-title-marginBottom);}
:where(.prism-Popover-complex) .prism-Popover-title{margin-bottom: var(--prism-Popover-variant-complex-title-marginBottom);}
.prism-Popover-closeButton{grid-area: close; align-self: start; flex: 0 0 auto; margin: var(--prism-Popover-closeButton-inset); margin-inline-start: var(--prism-Popover-closeButton-marginInlineStart);}
:where(.prism-Popover-complex) .prism-Popover-closeButton{margin: var(--prism-Popover-variant-complex-closeButton-inset);}
.prism-Popover-content{grid-area: content; align-self: center; color: var(--prism-Popover-content-color);}
:where(root.prism-Popover-withTitle) .prism-Popover-content{margin-top: var(--prism-Popover-title-marginBottom);}
.prism-Popover-footer{grid-area: footer; margin-top: var(--prism-Popover-footer-marginTop); display: flex; flex-direction: row; align-items: center; justify-content: flex-end; gap: var(--prism-Popover-footer-gap);}
:where(.prism-Popover-complex) .prism-Popover-footer{margin-top: var(--prism-Popover-variant-complex-footer-marginTop);}
.prism-Popover-infoButton:where(.prism-Popover-small){width: var(--prism-Popover-infoButton-small-size); height: var(--prism-Popover-infoButton-small-size);}
.prism-Popover-infoButton:where(.prism-Popover-medium){width: var(--prism-Popover-infoButton-medium-size); height: var(--prism-Popover-infoButton-medium-size);}
.prism-Popover-infoButton:where(.prism-Popover-large){width: var(--prism-Popover-infoButton-large-size); height: var(--prism-Popover-infoButton-large-size);}
```

### B.4 prism-Popper

Source: `inline <style data-prism="Popper">` [M]

```css
.prism-Popper-root, .prism-Popper-css-var{--prism-Popper-zIndex: var(--zIndex-Popover); --prism-Popper-backgroundColor: var(--fill-default); --prism-Popper-borderColor: var(--border-subtle-neutral); --prism-Popper-arrow-size: 8px; --prism-Popper-arrow-borderRadius: 4px;}
.prism-Popper-root:where(.prism-3), .prism-Popper-css-var:where(.prism-3){--prism-Popper-arrow-size: 10.5px; --prism-Popper-arrow-borderRadius: 3px;}
.prism-Popper-root{background-color: var(--prism-internal-Popper-backgroundColor, var(--prism-Popper-backgroundColor)); border: 1px solid var(--prism-internal-Popper-borderColor, var(--prism-Popper-borderColor)); z-index: var(--prism-Popper-zIndex); outline: none; width: max-content;}
.prism-Popper-arrow{position: absolute; width: calc(var(--prism-Popper-arrow-size) * 1.414); height: calc(var(--prism-Popper-arrow-size) * 1.414); background-color: var(--prism-internal-Popper-backgroundColor, var(--prism-Popper-backgroundColor)); border-top-style: ; border-top-width: ; border-right-color: ; border-right-style: ; border-right-width: ; border-bottom-color: ; border-bottom-style: ; border-bottom-width: ; border-left-style: ; border-left-width: ; border-image-source: ; border-image-slice: ; border-image-width: ; border-image-outset: ; border-image-repeat: ; border-top-color: transparent; border-left-color: transparent; border-radius: 50% 0 var(--prism-Popper-arrow-borderRadius) 0; z-index: 0;}
.prism-Popper-arrow:where(.prism-Popper-top){bottom: 0px; transform: translate(0px, 50%) rotate(45deg);}
.prism-Popper-arrow:where(.prism-Popper-right){left: 0px; transform: translate(-50%, 0px) rotate(135deg);}
.prism-Popper-arrow:where(.prism-Popper-bottom){top: 0px; transform: translate(0px, -50%) rotate(225deg);}
.prism-Popper-arrow:where(.prism-Popper-left){right: 0px; transform: translate(50%, 0px) rotate(-45deg);}
.prism-Popper-content{position: relative; z-index: 1;}
.prism-Popper-popperModal{z-index: var(--prism-Popper-zIndex);}
```

### B.4 prism-ToggleButton

Source: `inline <style data-prism="ToggleButton">` [M]

```css
.prism-ToggleButton-root, .prism-ToggleButton-css-var{--prism-ToggleButton-color: var(--text-stronger-neutral); --prism-ToggleButton-background: transparent; --prism-ToggleButton-borderColor: transparent; --prism-ToggleButton-hover-color: var(--text-stronger-neutral); --prism-ToggleButton-hover-background: var(--state-subtle-neutral-hover); --prism-ToggleButton-hover-borderColor: transparent; --prism-ToggleButton-press-color: var(--text-stronger-neutral); --prism-ToggleButton-press-background: var(--state-subtle-neutral-press); --prism-ToggleButton-press-borderColor: transparent; --prism-ToggleButton-selected-color: var(--component-toggleButton-toggle-button-label-selected); --prism-ToggleButton-selected-background: var(--component-toggleButton-toggle-button-background-selected-default); --prism-ToggleButton-selected-borderColor: transparent; --prism-ToggleButton-selected-hover-color: var(--component-toggleButton-toggle-button-label-selected); --prism-ToggleButton-selected-hover-background: var(--component-toggleButton-toggle-button-background-selected-hover); --prism-ToggleButton-selected-hover-borderColor: transparent; --prism-ToggleButton-selected-press-color: var(--component-toggleButton-toggle-button-label-selected); --prism-ToggleButton-selected-press-background: var(--component-toggleButton-toggle-button-background-selected-press); --prism-ToggleButton-selected-press-borderColor: transparent; --prism-ToggleButton-disabled-color: var(--state-disable); --prism-ToggleButton-disabled-background: transparent; --prism-ToggleButton-disabled-borderColor: transparent; --prism
.prism-ToggleButton-root:where(.prism-3), .prism-ToggleButton-css-var:where(.prism-3){--prism-ToggleButton-selected-color: var(--text-primary); --prism-ToggleButton-selected-background: var(--fill-subtler-primary); --prism-ToggleButton-selected-hover-color: var(--state-primary-hover); --prism-ToggleButton-selected-hover-background: var(--state-subtle-primary-hover); --prism-ToggleButton-selected-press-color: var(--state-primary-press); --prism-ToggleButton-selected-press-background: var(--state-subtle-primary-press);}
.prism-ToggleButton-root{color: var(--prism-ToggleButton-color); background: var(--prism-ToggleButton-background); border-color: var(--prism-ToggleButton-borderColor);}
.prism-ToggleButton-root:hover{color: var(--prism-ToggleButton-hover-color); background: var(--prism-ToggleButton-hover-background); border-color: var(--prism-ToggleButton-hover-borderColor);}
.prism-ToggleButton-root:active{color: var(--prism-ToggleButton-press-color); background: var(--prism-ToggleButton-press-background); border-color: var(--prism-ToggleButton-press-borderColor);}
.prism-ToggleButton-root:where(.prism-ToggleButton-selected){color: var(--prism-ToggleButton-selected-color); background: var(--prism-ToggleButton-selected-background); border-color: var(--prism-ToggleButton-selected-borderColor);}
.prism-ToggleButton-root:where(.prism-ToggleButton-selected):hover{color: var(--prism-ToggleButton-selected-hover-color); background: var(--prism-ToggleButton-selected-hover-background); border-color: var(--prism-ToggleButton-selected-hover-borderColor);}
.prism-ToggleButton-root:where(.prism-ToggleButton-selected):active{color: var(--prism-ToggleButton-selected-press-color); background: var(--prism-ToggleButton-selected-press-background); border-color: var(--prism-ToggleButton-selected-press-borderColor);}
.prism-ToggleButton-root:where(.prism-ToggleButton-disabled){color: var(--prism-ToggleButton-disabled-color); background: var(--prism-ToggleButton-disabled-background); border-color: var(--prism-ToggleButton-disabled-borderColor);}
.prism-ToggleButton-root:where(.prism-ToggleButton-disabled):hover{color: var(--prism-ToggleButton-disabled-color); background: var(--prism-ToggleButton-disabled-background); border-color: var(--prism-ToggleButton-disabled-borderColor);}
.prism-ToggleButton-root:where(.prism-ToggleButton-disabled):active{color: var(--prism-ToggleButton-disabled-color); background: var(--prism-ToggleButton-disabled-background); border-color: var(--prism-ToggleButton-disabled-borderColor);}
.prism-ToggleButton-root:where(.prism-ToggleButton-disabled):where(.prism-ToggleButton-selected){color: var(--prism-ToggleButton-disabled-selected-color); background: var(--prism-ToggleButton-disabled-selected-background); border-color: var(--prism-ToggleButton-disabled-selected-borderColor);}
.prism-ToggleButton-root:where(.prism-ToggleButton-disabled):where(.prism-ToggleButton-selected):hover{color: var(--prism-ToggleButton-disabled-selected-color); background: var(--prism-ToggleButton-disabled-selected-background); border-color: var(--prism-ToggleButton-disabled-selected-borderColor);}
.prism-ToggleButton-root:where(.prism-ToggleButton-disabled):where(.prism-ToggleButton-selected):active{color: var(--prism-ToggleButton-disabled-selected-color); background: var(--prism-ToggleButton-disabled-selected-background); border-color: var(--prism-ToggleButton-disabled-selected-borderColor);}
.prism-ToggleButton-root.prism-Button-loading:hover, .prism-ToggleButton-root.prism-Button-loading:active{color: var(--prism-ToggleButton-color); background: var(--prism-ToggleButton-background); border-color: var(--prism-ToggleButton-borderColor);}
.prism-ToggleButton-root.prism-Button-loading:where(.prism-ToggleButton-selected):hover, .prism-ToggleButton-root.prism-Button-loading:where(.prism-ToggleButton-selected):active{color: var(--prism-ToggleButton-selected-color); background: var(--prism-ToggleButton-selected-background); border-color: var(--prism-ToggleButton-selected-borderColor);}
```

### B.5 zoom-ui button (`.zoom-button`; identical rule-set ships as `.common-header-button` in main-chunk-other.css and `.monetization-widgets-button` in promo-carousel-widget.css)

Source: `https://zcal.zoom.us/static/css/chunk-zoom-ui.be6b3ccd.css` [M]

```css
.zoom-button--sm .zoom-loading.is-inlined-in-button{border-radius:6px}
.zoom-button{position:relative;display:inline-flex;vertical-align:middle;justify-content:center;align-items:center;box-sizing:border-box;border:none;outline-offset:2px;white-space:nowrap;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-button+.zoom-button{margin-left:8px}
.zoom-button.is-full+.zoom-button.is-full{margin-top:8px;margin-left:0}
.zoom-button--primary{font-weight:500;background-color:var(--zoom-color-fill-global-primary);color:var(--zoom-color-inverse-global-default)}
.zoom-button--primary:focus{color:var(--zoom-color-inverse-global-default);outline:none}
.zoom-button--primary:hover:not(.is-loading){background-color:var(--zoom-color-state-primary-hover);color:var(--zoom-color-inverse-global-default)}
.zoom-button--primary:active:not(.is-loading){background-color:var(--zoom-color-state-primary-press);color:var(--zoom-color-inverse-global-default)}
.zoom-button--primary-danger{font-weight:500;background-color:var(--zoom-color-fill-global-error);color:var(--zoom-color-inverse-global-default)}
.zoom-button--primary-danger:focus{color:var(--zoom-color-inverse-global-default);outline:none}
.zoom-button--primary-danger:hover:not(.is-loading){background-color:var(--zoom-color-state-error-hover);color:var(--zoom-color-inverse-global-default)}
.zoom-button--primary-danger:active:not(.is-loading){background-color:var(--zoom-color-state-error-press);color:var(--zoom-color-inverse-global-default)}
.zoom-button--secondary{background-color:var(--zoom-color-fill-subtle-neutral);color:var(--zoom-color-text-primary)}
.zoom-button--secondary.zoom-button__icon{background-color:var(--zoom-color-fill-contrary-subtler-transparent);color:var(--zoom-color-icon-stronger-neutral)}
.zoom-button--secondary.zoom-button__icon:focus{color:var(--zoom-color-icon-stronger-neutral);outline:none}
.zoom-button--secondary.zoom-button__icon:hover:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-hover);color:var(--zoom-color-icon-stronger-neutral)}
.zoom-button--secondary.zoom-button__icon:active:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-press);color:var(--zoom-color-icon-stronger-neutral)}
.zoom-button--secondary:focus{color:var(--zoom-color-text-primary);outline:none}
.zoom-button--secondary:hover:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-hover);color:var(--zoom-color-state-primary-hover)}
.zoom-button--secondary:active:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-press);color:var(--zoom-color-state-primary-press)}
.zoom-button--secondary-danger{background-color:var(--zoom-color-fill-subtle-neutral);color:var(--zoom-color-text-error)}
.zoom-button--secondary-danger.zoom-button__icon{background-color:var(--zoom-color-fill-contrary-subtler-transparent);color:var(--zoom-color-text-error)}
.zoom-button--secondary-danger.zoom-button__icon:focus{color:var(--zoom-color-text-error);outline:none}
.zoom-button--secondary-danger.zoom-button__icon:hover:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-hover);color:var(--zoom-color-state-error-hover)}
.zoom-button--secondary-danger.zoom-button__icon:active:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-press);color:var(--zoom-color-state-error-press)}
.zoom-button--secondary-danger:focus{color:var(--zoom-color-text-error);outline:none}
.zoom-button--secondary-danger:hover:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-hover);color:var(--zoom-color-state-error-hover)}
.zoom-button--secondary-danger:active:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-press);color:var(--zoom-color-state-error-press)}
.zoom-button--secondary-neutral{background-color:var(--zoom-color-fill-contrary-subtler-transparent);color:var(--zoom-color-text-stronger-neutral)}
.zoom-button--secondary-neutral:focus{color:var(--zoom-color-text-stronger-neutral);outline:none}
.zoom-button--secondary-neutral:hover:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-hover);color:var(--zoom-color-text-stronger-neutral)}
.zoom-button--secondary-neutral:active:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-press);color:var(--zoom-color-text-stronger-neutral)}
.zoom-button--tertiary{background-color:transparent;color:var(--zoom-color-text-primary)}
.zoom-button--tertiary:focus{color:var(--zoom-color-text-primary);outline:none}
.zoom-button--tertiary:hover:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-hover);color:var(--zoom-color-state-primary-hover)}
.zoom-button--tertiary:active:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-press);color:var(--zoom-color-state-primary-press)}
.zoom-button--tertiary-danger{background-color:transparent;color:var(--zoom-color-text-error)}
.zoom-button--tertiary-danger:focus{color:var(--zoom-color-text-error);outline:none}
.zoom-button--tertiary-danger:hover:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-hover);color:var(--zoom-color-state-error-hover)}
.zoom-button--tertiary-danger:active:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-press);color:var(--zoom-color-state-error-press)}
.zoom-button--overlay{font-weight:500;backdrop-filter:blur(15px);background-color:var(--zoom-color-fill-global-dark-transparent);color:var(--zoom-color-inverse-global-default)}
.zoom-button--overlay:focus{color:var(--zoom-color-inverse-global-default);outline:none}
.zoom-button--overlay:hover:not(.is-loading){background-color:var(--zoom-color-state-global-dark-transparent-hover);color:var(--zoom-color-inverse-global-default)}
.zoom-button--overlay:active:not(.is-loading){background-color:var(--zoom-color-state-global-dark-transparent-press);color:var(--zoom-color-inverse-global-default)}
.zoom-button--text{font-weight:400;background-color:transparent;color:var(--zoom-color-text-primary)}
.zoom-button--text:focus{color:var(--zoom-color-text-primary);outline:none}
.zoom-button--text:hover:not(.is-loading){color:var(--zoom-color-state-primary-hover)}
.zoom-button--text:active:not(.is-loading){color:var(--zoom-color-state-primary-press)}
.zoom-button--text.is-pure-text{height:auto;padding:0;border:none;border-radius:4px}
.zoom-button--text.is-pure-text-small{font-size:12px;line-height:16px}
.zoom-button--text-danger{background-color:transparent;color:var(--zoom-color-text-error)}
.zoom-button--text-danger:focus{color:var(--zoom-color-text-error);outline:none}
.zoom-button--text-danger:hover:not(.is-loading){color:var(--zoom-color-state-error-hover)}
.zoom-button--text-danger:active:not(.is-loading){color:var(--zoom-color-state-error-press)}
.zoom-button--text-danger.is-pure-text{height:auto;padding:0;border:none;border-color:transparent;border-radius:4px}
.zoom-button--text-danger.is-pure-text-small{border-radius:4px;font-size:12px;line-height:16px}
.zoom-button__inner-icon+.zoom-button__label{margin-left:4px}
.zoom-button__inner-icon+.zoom-button__label.is-visible-hidden{margin-right:0;margin-left:0;visibility:hidden}
.zoom-button__inner-icon.is-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}
.zoom-button--lg{height:40px;padding:6px 16px;border-radius:12px;font-size:14px}
.zoom-button--lg .zoom-button__inner-icon{font-size:14px}
.zoom-button--lg.zoom-button__icon .zoom-button__inner-icon{font-size:18px}
.zoom-button--lg.zoom-button--tertiary{padding:6px 12px}
.zoom-button--md{height:32px;padding:6px 14px;border-radius:12px;font-size:14px}
.zoom-button--md .zoom-button__inner-icon{font-size:14px}
.zoom-button--md.zoom-button__icon .zoom-button__inner-icon{font-size:16px}
.zoom-button--md.zoom-button--tertiary{padding:6px 8px}
.zoom-button--sm{height:24px;line-height:16px;padding:2px 10px;border-radius:999px;font-size:12px}
.zoom-button--sm .zoom-button__inner-icon{font-size:12px}
.zoom-button--sm.zoom-button__icon .zoom-button__inner-icon{font-size:14px}
.zoom-button--sm.zoom-button--tertiary{padding:2px 8px}
.zoom-button__icon{padding:0}
.zoom-button__icon.zoom-button--tertiary{background-color:transparent;color:var(--zoom-color-icon-strong-neutral)}
.zoom-button__icon.zoom-button--tertiary:focus{color:var(--zoom-color-icon-strong-neutral);outline:none}
.zoom-button__icon.zoom-button--tertiary:hover:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-hover);color:var(--zoom-color-icon-strong-neutral)}
.zoom-button__icon.zoom-button--tertiary:active:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-press);color:var(--zoom-color-icon-strong-neutral)}
.zoom-button__icon.zoom-button--lg{width:40px;height:40px;padding:0;border-radius:100%;font-size:18px}
.zoom-button__icon.zoom-button--md{width:32px;height:32px;padding:0;border-radius:100%;font-size:16px}
.zoom-button__icon.zoom-button--sm{width:24px;height:24px;padding:0;border-radius:100%;font-size:14px}
.zoom-button__icon.zoom-button.is-full{width:100%}
.zoom-button.is-primary-disabled{cursor:not-allowed;background-color:var(--zoom-color-state-subtle-disable);color:var(--zoom-color-state-disable)}
.zoom-button.is-primary-disabled:focus{color:var(--zoom-color-state-disable);outline:none}
.zoom-button.is-primary-disabled:active:not(.is-loading),.zoom-button.is-primary-disabled:hover:not(.is-loading),.zoom-button.is-secondary-disabled{background-color:var(--zoom-color-state-subtle-disable);color:var(--zoom-color-state-disable)}
.zoom-button.is-secondary-disabled{cursor:not-allowed}
.zoom-button.is-secondary-disabled:focus{color:var(--zoom-color-state-disable);outline:none}
.zoom-button.is-secondary-disabled:active:not(.is-loading),.zoom-button.is-secondary-disabled:hover:not(.is-loading){background-color:var(--zoom-color-state-subtle-disable);color:var(--zoom-color-state-disable)}
.zoom-button.is-tertiary-disabled{cursor:not-allowed;background-color:transparent;color:var(--zoom-color-state-disable)}
.zoom-button.is-tertiary-disabled:focus{color:var(--zoom-color-state-disable);outline:none}
.zoom-button.is-tertiary-disabled:active:not(.is-loading),.zoom-button.is-tertiary-disabled:hover:not(.is-loading),.zoom-button.is-text-disabled{background-color:transparent;color:var(--zoom-color-state-disable)}
.zoom-button.is-text-disabled{cursor:not-allowed}
.zoom-button.is-text-disabled:focus{outline:none}
.zoom-button.is-overlay-disabled,.zoom-button.is-text-disabled:active:not(.is-loading),.zoom-button.is-text-disabled:focus,.zoom-button.is-text-disabled:hover:not(.is-loading){color:var(--zoom-color-state-disable)}
.zoom-button.is-overlay-disabled{cursor:not-allowed;background-color:var(--zoom-color-fill-global-dark-transparent)}
.zoom-button.is-overlay-disabled:focus{color:var(--zoom-color-state-disable);outline:none}
.zoom-button.is-overlay-disabled:active:not(.is-loading),.zoom-button.is-overlay-disabled:hover:not(.is-loading){background-color:var(--zoom-color-fill-global-dark-transparent);color:var(--zoom-color-state-disable)}
.zoom-button.is-reverse{flex-direction:row-reverse}
.zoom-button.is-reverse .zoom-button__inner-icon+.zoom-button__label{margin-right:4px;margin-left:0}
.zoom-button.is-loading{cursor:not-allowed}
.zoom-button.is-full{width:100%}
.is-vue3-keyboard-event .zoom-button:focus{outline:2px solid var(--zoom-color-border-primary)}
```

### B.6 ui-Button (MUI-based, emotion; header Back/Forward/History + search trigger). Two instances shown: `.css-x2yhlk` (text buttons) and `.css-29iiyx` (icon buttons)

Source: `inline <style data-emotion="css"> (1355 rules) saved as scratchpad/ds/inline/doc19_emotion-ui-Button.css` [M]

```css
.css-29iiyx.ui-Button-root.ui-Button-iconButton{height: 32px; min-width: 32px; width: 32px; border-radius: 8px; padding: 0px; font-size: 16px; background: rgb(13, 107, 222); color: rgb(255, 255, 255); border-color: rgb(13, 107, 222);}
.css-29iiyx.ui-Button-root.ui-Button-iconButton svg{font-size: 16px;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton .ui-Button-startIcon, .css-29iiyx.ui-Button-root.ui-Button-iconButton .ui-Button-endIcon{display: none;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton:hover{background: rgb(12, 96, 200); color: rgb(255, 255, 255); border-color: rgb(12, 96, 200);}
.css-29iiyx.ui-Button-root.ui-Button-iconButton:active{background: rgb(8, 64, 133); color: rgb(255, 255, 255); border-color: rgb(8, 64, 133);}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-extraSmall{height: 20px; min-width: 20px; width: 20px; border-radius: 6px; padding: 0px; font-size: 12px;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-extraSmall svg{font-size: 12px;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-extraSmall .ui-Button-startIcon, .css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-extraSmall .ui-Button-endIcon{display: none;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-small{height: 24px; min-width: 24px; width: 24px; border-radius: 6px; padding: 0px; font-size: 14px;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-small svg{font-size: 14px;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-small .ui-Button-startIcon, .css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-small .ui-Button-endIcon{display: none;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-medium{height: 32px; min-width: 32px; width: 32px; border-radius: 8px; padding: 0px; font-size: 16px;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-medium svg{font-size: 16px;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-medium .ui-Button-startIcon, .css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-medium .ui-Button-endIcon{display: none;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-large{height: 40px; min-width: 40px; width: 40px; border-radius: 10px; padding: 0px; font-size: 18px;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-large svg{font-size: 18px;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-large .ui-Button-startIcon, .css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-large .ui-Button-endIcon{display: none;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-extraLarge{height: 48px; min-width: 48px; width: 48px; border-radius: 12px; padding: 0px; font-size: 20px;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-extraLarge svg{font-size: 20px;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-extraLarge .ui-Button-startIcon, .css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-extraLarge .ui-Button-endIcon{display: none;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-primary{background: rgb(13, 107, 222); color: rgb(255, 255, 255); border-color: rgb(13, 107, 222);}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-primary:hover{background: rgb(12, 96, 200); color: rgb(255, 255, 255); border-color: rgb(12, 96, 200);}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-primary:active{background: rgb(8, 64, 133); color: rgb(255, 255, 255); border-color: rgb(8, 64, 133);}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-secondary{background: rgb(255, 255, 255); color: rgb(42, 43, 45); border-color: rgb(147, 155, 164);}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-secondary:hover{background: rgb(237, 238, 239); color: rgb(42, 43, 45); border-color: rgb(147, 155, 164);}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-secondary:active{background: rgb(194, 198, 202); color: rgb(42, 43, 45); border-color: rgb(147, 155, 164);}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-tertiary{background: transparent; color: rgb(42, 43, 45); border-color: transparent;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-tertiary:hover{background: rgba(110, 118, 128, 0.12); color: rgb(42, 43, 45); border-color: transparent;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-tertiary:active{background: rgba(110, 118, 128, 0.42); color: rgb(42, 43, 45); border-color: transparent;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-overlay{background: rgba(0, 0, 0, 0.42); color: rgb(255, 255, 255); border-color: transparent;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-overlay:hover{background: rgba(0, 0, 0, 0.48); color: rgb(255, 255, 255); border-color: transparent;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-overlay:active{background: rgba(0, 0, 0, 0.8); color: rgb(255, 255, 255); border-color: transparent;}
.css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-disabled, .css-29iiyx.ui-Button-root.ui-Button-iconButton.ui-Button-loading.ui-Button-disabled{cursor: not-allowed; background: rgba(173, 177, 184, 0.25); color: rgb(173, 177, 184); border-color: rgba(173, 177, 184, 0.25);}
.css-x2yhlk{display: inline-flex; -webkit-box-align: center; align-items: center; -webkit-box-pack: center; justify-content: center; position: relative; box-sizing: border-box; -webkit-tap-highlight-color: transparent; outline: 0px; margin: 0px; cursor: pointer; user-select: none; vertical-align: middle; appearance: none; text-decoration: none; font-family:<ui stack>; font-weight: 500; font-size: 0.875rem; line-height: 1.75; letter-spacing: 0.02857em; text-transform: uppercase; min-width: 64px; border: 0px; border-
@media print { .css-x2yhlk{print-color-adjust: exact;} }
.css-x2yhlk:hover{text-decoration: none;}
@media (hover: hover) { .css-x2yhlk:hover{--variant-containedBg: #1565c0; --variant-textBg: rgba(25, 118, 210, 0.04); --variant-outlinedBorder: #1976d2; --variant-outlinedBg: rgba(25, 118, 210, 0.04);} }
.css-x2yhlk.ui-Button-root{font-family:<ui stack>; transition: none; text-transform: none; border-style: solid; border-width: 1px; white-space: nowrap; position: relative; height: 32px; min-width: 60px; padding: 6px 12px; border-radius: 8px; line-height: 20px; font-size: 14px; font-weight: 400; background: rgb(13, 107, 222); color: rgb(255, 255, 255); border-color: rgb(13, 107, 222);}
.css-x2yhlk.ui-Button-root:hover{background: rgb(12, 96, 200); color: rgb(255, 255, 255); border-color: rgb(12, 96, 200);}
.css-x2yhlk.ui-Button-root:active{background: rgb(8, 64, 133); color: rgb(255, 255, 255); border-color: rgb(8, 64, 133);}
.css-x2yhlk.ui-Button-root.ui-Button-focusVisible, .css-x2yhlk.ui-Button-root:focus-visible{outline: rgb(75, 150, 241) solid 2px; outline-offset: 2px;}
.css-x2yhlk.ui-Button-root .ui-Button-startIcon, .css-x2yhlk.ui-Button-root .ui-Button-endIcon{font-size: 14px;}
.css-x2yhlk.ui-Button-root .ui-Button-startIcon svg, .css-x2yhlk.ui-Button-root .ui-Button-endIcon svg{font-size: 16px;}
.css-x2yhlk.ui-Button-root .ui-Button-startIcon{margin-inline: 0px 4px;}
.css-x2yhlk.ui-Button-root .ui-Button-endIcon{margin-inline: 4px 0px;}
.css-x2yhlk.ui-Button-root.ui-Button-small{height: 24px; min-width: 47px; padding: 4px 8px; font-size: 12px; font-weight: 400; border-radius: 6px; line-height: 16px;}
.css-x2yhlk.ui-Button-root.ui-Button-small .ui-Button-startIcon, .css-x2yhlk.ui-Button-root.ui-Button-small .ui-Button-endIcon{font-size: 12px;}
.css-x2yhlk.ui-Button-root.ui-Button-small .ui-Button-startIcon svg, .css-x2yhlk.ui-Button-root.ui-Button-small .ui-Button-endIcon svg{font-size: 14px;}
.css-x2yhlk.ui-Button-root.ui-Button-small .ui-Button-loadingMask{border-radius: 6px;}
.css-x2yhlk.ui-Button-root.ui-Button-medium{height: 32px; min-width: 60px; padding: 6px 12px; font-size: 14px; font-weight: 400; border-radius: 8px; line-height: 20px;}
.css-x2yhlk.ui-Button-root.ui-Button-medium .ui-Button-startIcon, .css-x2yhlk.ui-Button-root.ui-Button-medium .ui-Button-endIcon{font-size: 14px;}
.css-x2yhlk.ui-Button-root.ui-Button-medium .ui-Button-startIcon svg, .css-x2yhlk.ui-Button-root.ui-Button-medium .ui-Button-endIcon svg{font-size: 16px;}
.css-x2yhlk.ui-Button-root.ui-Button-medium .ui-Button-loadingMask{border-radius: 8px;}
.css-x2yhlk.ui-Button-root.ui-Button-large{height: 40px; min-width: 73px; padding: 10px 16px; font-size: 16px; font-weight: 500; border-radius: 10px; line-height: 20px;}
.css-x2yhlk.ui-Button-root.ui-Button-large .ui-Button-startIcon, .css-x2yhlk.ui-Button-root.ui-Button-large .ui-Button-endIcon{font-size: 16px;}
.css-x2yhlk.ui-Button-root.ui-Button-large .ui-Button-startIcon svg, .css-x2yhlk.ui-Button-root.ui-Button-large .ui-Button-endIcon svg{font-size: 18px;}
.css-x2yhlk.ui-Button-root.ui-Button-large .ui-Button-loadingMask{border-radius: 10px;}
.css-x2yhlk.ui-Button-root.ui-Button-extraLarge{height: 48px; min-width: 81px; padding: 14px 20px; font-size: 18px; font-weight: 500; border-radius: 12px; line-height: 20px;}
.css-x2yhlk.ui-Button-root.ui-Button-extraLarge .ui-Button-startIcon, .css-x2yhlk.ui-Button-root.ui-Button-extraLarge .ui-Button-endIcon{font-size: 18px;}
.css-x2yhlk.ui-Button-root.ui-Button-extraLarge .ui-Button-startIcon svg, .css-x2yhlk.ui-Button-root.ui-Button-extraLarge .ui-Button-endIcon svg{font-size: 20px;}
.css-x2yhlk.ui-Button-root.ui-Button-extraLarge .ui-Button-loadingMask{border-radius: 12px;}
.css-x2yhlk.ui-Button-root.ui-Button-primary{background: rgb(13, 107, 222); color: rgb(255, 255, 255); border-color: rgb(13, 107, 222);}
.css-x2yhlk.ui-Button-root.ui-Button-primary:hover{background: rgb(12, 96, 200); color: rgb(255, 255, 255); border-color: rgb(12, 96, 200);}
.css-x2yhlk.ui-Button-root.ui-Button-primary:active{background: rgb(8, 64, 133); color: rgb(255, 255, 255); border-color: rgb(8, 64, 133);}
.css-x2yhlk.ui-Button-root.ui-Button-primary .ui-Button-loadingMask{inset: -1px;}
.css-x2yhlk.ui-Button-root.ui-Button-secondary{background: rgb(255, 255, 255); color: rgb(42, 43, 45); border-color: rgb(147, 155, 164);}
.css-x2yhlk.ui-Button-root.ui-Button-secondary:hover{background: rgb(237, 238, 239); color: rgb(42, 43, 45); border-color: rgb(147, 155, 164);}
.css-x2yhlk.ui-Button-root.ui-Button-secondary:active{background: rgb(194, 198, 202); color: rgb(42, 43, 45); border-color: rgb(147, 155, 164);}
.css-x2yhlk.ui-Button-root.ui-Button-secondary .ui-Button-loadingMask{inset: 0px;}
.css-x2yhlk.ui-Button-root.ui-Button-tertiary{background: transparent; color: rgb(13, 107, 222); border-color: transparent;}
.css-x2yhlk.ui-Button-root.ui-Button-tertiary:hover{background: rgba(14, 114, 237, 0.12); color: rgb(32, 87, 177); border-color: transparent;}
.css-x2yhlk.ui-Button-root.ui-Button-tertiary:active{background: rgba(14, 114, 237, 0.42); color: rgb(32, 87, 177); border-color: transparent;}
.css-x2yhlk.ui-Button-root.ui-Button-tertiary .ui-Button-loadingMask{inset: -1px;}
.css-x2yhlk.ui-Button-root.ui-Button-danger{background: rgb(218, 22, 57); color: rgb(255, 255, 255); border-color: rgb(218, 22, 57);}
.css-x2yhlk.ui-Button-root.ui-Button-danger:hover{background: rgb(196, 20, 52); color: rgb(255, 255, 255); border-color: rgb(196, 20, 52);}
.css-x2yhlk.ui-Button-root.ui-Button-danger:active{background: rgb(131, 13, 35); color: rgb(255, 255, 255); border-color: rgb(131, 13, 35);}
.css-x2yhlk.ui-Button-root.ui-Button-danger.ui-Button-primary{background: rgb(218, 22, 57); color: rgb(255, 255, 255); border-color: rgb(218, 22, 57);}
.css-x2yhlk.ui-Button-root.ui-Button-danger.ui-Button-primary:hover{background: rgb(196, 20, 52); color: rgb(255, 255, 255); border-color: rgb(196, 20, 52);}
.css-x2yhlk.ui-Button-root.ui-Button-danger.ui-Button-primary:active{background: rgb(131, 13, 35); color: rgb(255, 255, 255); border-color: rgb(131, 13, 35);}
.css-x2yhlk.ui-Button-root.ui-Button-danger.ui-Button-secondary{background: rgb(255, 255, 255); color: rgb(218, 22, 57); border-color: rgb(255, 102, 130);}
.css-x2yhlk.ui-Button-root.ui-Button-danger.ui-Button-secondary:hover{background: rgb(252, 227, 231); color: rgb(218, 22, 57); border-color: rgb(255, 102, 130);}
.css-x2yhlk.ui-Button-root.ui-Button-danger.ui-Button-secondary:active{background: rgb(245, 158, 174); color: rgb(218, 22, 57); border-color: rgb(255, 102, 130);}
.css-x2yhlk.ui-Button-root.ui-Button-danger.ui-Button-tertiary{background: transparent; color: rgb(218, 22, 57); border-color: transparent;}
.css-x2yhlk.ui-Button-root.ui-Button-danger.ui-Button-tertiary:hover{background: rgba(232, 23, 61, 0.12); color: rgb(218, 22, 57); border-color: transparent;}
.css-x2yhlk.ui-Button-root.ui-Button-danger.ui-Button-tertiary:active{background: rgba(232, 23, 61, 0.42); color: rgb(218, 22, 57); border-color: transparent;}
.css-x2yhlk.ui-Button-root.ui-Button-disabled, .css-x2yhlk.ui-Button-root.ui-Button-loading.ui-Button-disabled{cursor: not-allowed; pointer-events: auto; background: rgba(173, 177, 184, 0.25); color: rgb(173, 177, 184); border-color: rgba(173, 177, 184, 0.25);}
.css-x2yhlk.ui-Button-root .ui-Button-loadingMask{background: rgba(255, 255, 255, 0.48); position: absolute; inset: -1px; display: flex; -webkit-box-align: center; align-items: center; -webkit-box-pack: center; justify-content: center; border-radius: 8px;}
.css-x2yhlk.ui-Button-root .ui-Button-loadingMask .ui-Button-loadingIcon{color: rgba(0, 0, 0, 0.56);}
.css-x2yhlk.ui-Button-root .ui-Button-loadingMask .ui-Button-loadingIcon svg{font-size: 16px;}
.css-x2yhlk.ui-Button-root .zmicon{display: inline-block; vertical-align: -0.125em; line-height: 0;}
.css-x2yhlk.ui-Button-root .zmicon-acc-outline{outline: rgb(79, 154, 247) solid 2px;}
.css-x2yhlk.ui-Button-root .zmicon-acc-no-outline{outline: none;}
```

### B.7 z-button (PWA legacy; Meetings tab)

Source: `https://us05st1.zoom.us/web_client_pwa/7.2.0.3239/css/main.css` [M]

```css
.z-button{align-items:center;border:none;border-radius:6px;display:inline-flex;justify-content:center;padding:6px;white-space:nowrap}
.z-button:focus{outline:2px solid #4793f1;outline-offset:2px}
.z-button:disabled{outline:none}
.z-button-size-24{border-radius:6px;font-size:13px;height:24px;line-height:20px;padding:0 10px}
.z-button-size-24>*{margin-right:4px}
.z-button-size-24>:last-child{margin-right:0}
.z-button-size-32{border-radius:8px;font-size:14px;font-weight:700;height:32px;line-height:20px;padding:0 20px}
.z-button-size-32>*{margin-right:4px}
.z-button-size-32>:last-child{margin-right:0}
.z-button-size-40{border-radius:10px;font-weight:700;height:40px;line-height:24px;padding:0 24px}
.z-button-size-40>*{margin-right:8px}
.z-button-size-40>:last-child{margin-right:0}
.z-button-size-48{border-radius:12px;font-size:16px;font-weight:700;height:48px;line-height:24px;padding:12px 24px}
.z-button-size-48>*{margin-right:8px}
.z-button-size-48>:last-child{margin-right:0}
.z-button-type-normal{background:#0e72ed;color:#fff}
.z-button-type-normal:active,.z-button-type-normal:hover{background:linear-gradient(0deg,#00000017,#00000017),#0e72ed}
.z-button-type-normal.disabled,.z-button-type-normal.disabled:active,.z-button-type-normal.disabled:hover{background:#f2f2f7;color:#909096}
.z-button-type-primary{background:#fff;border:1px solid #0e72ed;color:#0e71eb}
.z-button-type-primary:active,.z-button-type-primary:hover{background:linear-gradient(0deg,#00000017,#00000017),#0e72ed;border:1px solid #0000;color:#fff}
.z-button-type-primary.disabled,.z-button-type-primary.disabled:active,.z-button-type-primary.disabled:hover{background:#f2f2f7;border:1px solid #0000;color:#909096}
.z-button-type-secondary{background:#f1f4f6;color:#131619}
.z-button-type-secondary:hover{background:#dfe3e8}
.z-button-type-secondary:active{background:#c1c6ce}
.z-button-type-secondary.disabled,.z-button-type-secondary.disabled:active,.z-button-type-secondary.disabled:hover{background:#f1f4f6;color:#6e7680}
.z-button-type-icon{background:none;color:#131619;padding:0}
.z-button-type-icon:hover{background:#dfe3e8}
.z-button-type-icon:active{background:#c1c6ce}
.z-button-type-icon.disabled,.z-button-type-icon.disabled:active,.z-button-type-icon.disabled:hover{background:#f1f4f6;color:#6e7680}
.z-button-type-destructive{background:#de2828;color:#fff}
.z-button-type-destructive:hover{background:linear-gradient(0deg,#00000017,#00000017),#de2828}
.z-button-type-destructive:active{background:linear-gradient(0deg,#0000002e,#0000002e),#de2828}
.z-button-type-destructive.disabled,.z-button-type-destructive.disabled:active,.z-button-type-destructive.disabled:hover{background:#f2f2f7;border:1px solid #0000;color:#909096}
.z-button-type-text{background:#fff;color:#0e72ed}
.z-button-type-text:hover{background:#e7f1fd;color:#0862d1}
.z-button-type-text:active{background:linear-gradient(0deg,#00000017,#00000017),#d7e6f8;color:#0862d1}
.z-button-type-text.disabled,.z-button-type-text.disabled:active,.z-button-type-text.disabled:hover{background:#f2f2f7;border:1px solid #0000;color:#909096}
.z-button-type-dark{background:#fff;border:1px solid #909096;color:#232333}
.z-button-type-dark:active,.z-button-type-dark:hover{background:linear-gradient(0deg,#00000017,#00000017),#fff}
.z-button-type-dark.disabled,.z-button-type-dark.disabled:active,.z-button-type-dark.disabled:hover{background:#f2f2f7;color:#909096}
.meetings__detail-btns{display:flex;flex:0 0 auto;flex-wrap:wrap;margin:32px 0}
.meetings__detail-btns>*{margin-bottom:10px;margin-right:16px}
.meetings__detail-btns .meetings__detail-btn__icon-l{font-size:12px}
.meetings__detail-btn-copy,.meetings__detail-btn-edit,.meetings__detail-btn-msg-channel{background-color:#fff;border:1px solid #dfe3e8;color:#131619}
.meetings__detail-btn-copy:hover,.meetings__detail-btn-edit:hover,.meetings__detail-btn-msg-channel:hover{background-color:#f7f9fa;color:#0e71eb}
.meetings__detail-btn-copy:focus,.meetings__detail-btn-edit:focus,.meetings__detail-btn-msg-channel:focus{background-color:#f1f4f6;color:#0e71eb}
.meetings__detail-btn-copy.disabled,.meetings__detail-btn-edit.disabled,.meetings__detail-btn-msg-channel.disabled{background-color:#fff;color:#6e7680}
.meetings__detail-btn-delete{background-color:#fff;border:1px solid #dfe3e8;color:#131619}
.meetings__detail-btn-delete:hover{background-color:#f7f9fa;color:#e02828}
.meetings__detail-btn-delete:focus{background-color:#f1f4f6;color:#e02828}
.meetings__detail-btn-delete.disabled{background-color:#fff;color:#6e7680}
```

### B.8 zmu-btn (meeting-UI legacy kit)

Source: `https://us05st1.zoom.us/web_client_pwa/7.2.0.3239/css/main-chunk-other.css` [M]

```css
.zmu-btn__outline--white{outline:2px solid #0000;outline-offset:2px;transition:all .2s ease-in}
.zmu-btn__outline--white:focus{outline:2px solid #fff;outline-offset:1px}
.zmu-btn__outline--blue{outline:2px solid #0000;outline-offset:2px;transition:all .2s ease-in}
.zmu-btn__outline--blue:focus{outline:2px solid #0e71eb;outline-offset:1px}
.zmu-btn{background-image:none;background:#fff;border:1px solid #bababa;border-radius:8px;box-sizing:border-box;color:#232333;cursor:pointer;font-size:14px;height:32px;line-height:1;outline:2px solid #0000;outline-offset:1px;padding:0 16px;position:relative;touch-action:manipulation;transition:all .2s ease-in;-webkit-user-select:none;user-select:none;white-space:nowrap}
.zmu-btn:hover{background-color:#ebebeb;border-color:#adadad}
.zmu-btn--ghost{background:#0000;border:none;color:#232333}
.zmu-btn--ghost:hover{background:#e7f1fd;border-color:#2681f2}
.zmu-btn--primary{background:#0e71eb;border:none;color:#fff}
.zmu-btn--primary:hover{background-color:#2681f2;border-color:#2681f2}
.zmu-btn--danger{background:#e02828;border:none;color:#fff}
.zmu-btn--danger:hover{background-color:red;border-color:red}
.zmu-btn--brown{background:#8b231b;border:none;color:#fff}
.zmu-btn--brown:hover{background-color:#8b231b;border-color:#8b1716}
.zmu-btn--sm{border-radius:4px;box-sizing:border-box;font-size:12px;padding:0 6px;width:60px}
.zmu-btn--lg{border-radius:4px;font-size:16px;height:44px;padding:0 16px;width:250px}
.zmu-btn--disabled{cursor:not-allowed;opacity:.6;pointer-events:none}
.zmu-btn--block{width:100%}
.zmu-btn .loading{animation:rotate 1.5s linear 0s infinite normal none;-webkit-animation:rotate 1.5s linear 0s infinite normal none;display:inline-block;height:26px;margin-left:10px;margin-top:-2px;vertical-align:middle;width:26px}
.zmu-btn--icon-only{border:none;border-radius:50%;height:16px;padding:0;width:16px}
.zmu-btn.zmu-btn-legacy{border-radius:4px;padding:6px 12px}
.zmu-btn.zmu-btn-legacy.zmu-btn-primary{border:0}
.zmu-btn__icon{display:inline-block;height:16px;vertical-align:middle;width:16px}
.zmu-btn__icon--left{margin-right:4px}
.zmu-btn__icon--right{margin-left:4px}
.zmu-btn__icon--only{margin:0}
.zmu-btn__icon--close{background:url(data:…);display:inline-block;height:16px;width:16px}
.zmu-btn__icon--move-to{background:url(data:…);display:inline-block;height:16px;width:16px}
.zmu-btn__icon--exchange{background:url(data:…);display:inline-block;height:16px;width:16px}
.zmu-btn__icon--exit{background:url(data:…);display:inline-block;height:14px;width:13px}
.zmu-btn__icon--dropdown-up{background:url(data:…);display:inline-block;height:16px;width:16px}
```

### B.9 PWA bespoke controls (home action buttons, header items, rail tabs, join modal, new-meeting panel, PWA checkbox, meeting history, PWA modal, focus model)

Source: `main.css + inline emotion `.css-13qub5o` (Admin Center) + inline `.pwa-modal__*`` [M]

```css
[data-whatintent=mouse] :focus{outline:none!important}
.DownloadNav_link__3v7dC{align-items:center;-webkit-appearance:none;appearance:none;background:var(--pwa-header-search-surface,#f1f4f6);border:0;border-radius:12px;box-sizing:border-box;color:var(--pwa-header-download-color,#0d6bde)!important;cursor:pointer;display:inline-flex;flex-shrink:0;font-family:inherit;font-size:14px;font-weight:400;height:32px;justify-content:center;letter-spacing:-.15px;line-height:18px;padding:6px 14px;text-decoration:none;white-space:nowrap}
.DownloadNav_link__3v7dC:focus-visible,.DownloadNav_link__3v7dC:hover{background:var(--pwa-header-item-hover,hsla(213,8%,47%,.122));color:var(--pwa-header-text-hover,#0c60c8)!important;text-decoration:none}
.DownloadNav_link__3v7dC:active{background:var(--pwa-header-item-press,hsla(213,8%,47%,.239));color:var(--pwa-header-text-press,#084085)!important;text-decoration:none}
.DownloadNav_link__3v7dC:focus-visible{outline:2px solid var(--pwa-header-download-color);outline-offset:2px}
.main.main--standard .main__action-join,.main.main--standard .main__action-mynote,.main.main--standard .main__action-return,.main.main--standard .main__action-schedule,.main.main--standard .main__action-start{width:56px}
.main.main--standard .main__action-join .main__action-btn,.main.main--standard .main__action-mynote .main__action-btn,.main.main--standard .main__action-return .main__action-btn,.main.main--standard .main__action-schedule .main__action-btn,.main.main--standard .main__action-start .main__action-btn{border-radius:20px;font-size:28px;height:56px;margin-bottom:12px;padding:14px;width:56px}
.main.main--standard .main__action-join .main__action-btn svg,.main.main--standard .main__action-mynote .main__action-btn svg,.main.main--standard .main__action-return .main__action-btn svg,.main.main--standard .main__action-schedule .main__action-btn svg,.main.main--standard .main__action-start .main__action-btn svg{height:28px;width:28px}
.main__actions .main__actions-row{display:flex;height:120px;justify-content:flex-start}
.main__actions .main__actions-row>:nth-child(2){margin-left:60px}
.main__actions .main__actions-row:not(:first-child){margin-top:48px}
.main__actions .main__action-join,.main__actions .main__action-mynote,.main__actions .main__action-return,.main__actions .main__action-schedule,.main__actions .main__action-start{align-items:center;color:#6e7680;display:flex;flex-direction:column;font-size:14px;justify-content:space-between;text-align:center;width:88px}
.main__actions .main__action-join .main__action-btn,.main__actions .main__action-mynote .main__action-btn,.main__actions .main__action-return .main__action-btn,.main__actions .main__action-schedule .main__action-btn,.main__actions .main__action-start .main__action-btn{align-items:center;border:none;border-radius:30px;cursor:pointer;display:inline-flex;font-size:44px;height:88px;justify-content:center;margin-bottom:16px;padding:22px;transform:translateY(0);transition:transform .15s ease,box-shadow .15s ease;width:88px}
.main__actions .main__action-join .main__action-btn:focus,.main__actions .main__action-join .main__action-btn:hover,.main__actions .main__action-mynote .main__action-btn:focus,.main__actions .main__action-mynote .main__action-btn:hover,.main__actions .main__action-return .main__action-btn:focus,.main__actions .main__action-return .main__action-btn:hover,.main__actions .main__action-schedule .main__action-btn:focus,.main__actions .main__action-schedule .main__action-btn:hover,.main__actions .main__action-start .main__action-btn:focus,.main__actions .main__action-start .main__action-btn:hover{box-shadow:0 4px 11px 0 #b3b3b3;transform:translateY(-4px);transition:transform .15s ease,box-shadow . …
.main__actions .main__action-join span,.main__actions .main__action-mynote span,.main__actions .main__action-return span,.main__actions .main__action-schedule span,.main__actions .main__action-start span{font-size:14px;font-style:normal;font-weight:400;line-height:16px;white-space:nowrap}
.main__actions .main__action-join.disabled span,.main__actions .main__action-mynote.disabled span,.main__actions .main__action-return.disabled span,.main__actions .main__action-schedule.disabled span,.main__actions .main__action-start.disabled span{color:#909096}
.main__actions .main__action-return .main__action-btn,.main__actions .main__action-start .main__action-btn{background-color:#ff742e;color:#fff}
.main__actions .main__action-return .main__action-btn:active,.main__actions .main__action-start .main__action-btn:active{background-color:#e56829}
.main__actions .main__action-return .main__action-btn:disabled,.main__actions .main__action-start .main__action-btn:disabled{background-color:#f9cbb7}
.main__actions .main__action-return .main__action-btn:disabled:disabled,.main__actions .main__action-start .main__action-btn:disabled:disabled{box-shadow:unset;cursor:auto;transform:unset;transition:unset}
.main__actions .main__action-global-search .main__action-btn,.main__actions .main__action-join .main__action-btn,.main__actions .main__action-mynote .main__action-btn,.main__actions .main__action-schedule .main__action-btn{background-color:#0e71eb;color:#fff}
.main__actions .main__action-global-search .main__action-btn:active,.main__actions .main__action-join .main__action-btn:active,.main__actions .main__action-mynote .main__action-btn:active,.main__actions .main__action-schedule .main__action-btn:active{background-color:#0c63ce}
.main__actions .main__action-global-search .main__action-btn:disabled,.main__actions .main__action-join .main__action-btn:disabled,.main__actions .main__action-mynote .main__action-btn:disabled,.main__actions .main__action-schedule .main__action-btn:disabled{background-color:#b1c7f6}
.main__actions .main__action-global-search .main__action-btn:disabled:disabled,.main__actions .main__action-join .main__action-btn:disabled:disabled,.main__actions .main__action-mynote .main__action-btn:disabled:disabled,.main__actions .main__action-schedule .main__action-btn:disabled:disabled{box-shadow:unset;cursor:auto;transform:unset;transition:unset}
@media screen and (max-width:280px) { .main .main-content .home-main-new-meeting-option-panel{left:-30px;width:180px} }
@media screen and (max-width:280px) { .main .main-content .home-main-new-meeting-option-panel .new-meeting-option-panel-block{white-space:normal} }
.main__action-schedule button[disabled]{position:relative}
.main__action-schedule button[disabled]:before{animation-duration:1s;animation-iteration-count:infinite;animation-name:rotate-infinite;animation-timing-function:linear;background:50%/100% 100% no-repeat url(data:…);content:"";height:50%;position:absolute;width:50%;z-index:1}
.home__actions .main__action-mynote,.main__actions .main__action-mynote{position:relative}
.home__actions .main__action-mynote.is-other-tab,.main__actions .main__action-mynote.is-other-tab{overflow:visible}
.home__actions .main__action-mynote .main__action-mynote__tip,.main__actions .main__action-mynote .main__action-mynote__tip{background:#fff;border:none;border-radius:8px;bottom:calc(100% + 8px);box-shadow:0 8px 20px #23233333;box-sizing:border-box;color:#232333;font-size:13px;font-weight:400;left:50%;line-height:1.4;max-width:260px;opacity:0;padding:10px 12px;pointer-events:none;position:absolute;text-align:left;transform:translateX(-50%);transition:opacity .12s ease,visibility .12s ease;visibility:hidden;white-space:normal;width:-webkit-max-content;width:max-content;z-index:5}
.home__actions .main__action-mynote .main__action-mynote__tip:after,.main__actions .main__action-mynote .main__action-mynote__tip:after{border:6px solid #0000;border-top-color:#fff;content:"";left:50%;position:absolute;top:100%;transform:translateX(-50%)}
.home__actions .main__action-mynote.is-other-tab:focus-within .main__action-mynote__tip,.home__actions .main__action-mynote.is-other-tab:hover .main__action-mynote__tip,.main__actions .main__action-mynote.is-other-tab:focus-within .main__action-mynote__tip,.main__actions .main__action-mynote.is-other-tab:hover .main__action-mynote__tip{opacity:1;visibility:visible}
.home__actions .main__action-mynote.disabled .main__action-mynote__tip,.main__actions .main__action-mynote.disabled .main__action-mynote__tip{color:#232333}
.home-main-new-meeting-option-panel{color:#232333;font-size:14px;padding:5px 0;text-align:left}
.home-main-new-meeting-option-panel .new-meeting-option-panel-block{align-items:center;border-bottom:1px solid #ededf3;cursor:pointer;display:flex;justify-content:space-between;padding:16px;white-space:nowrap}
.home-main-new-meeting-option-panel .new-meeting-option-panel-block:hover,.home-main-new-meeting-option-panel .new-meeting-option-panel-block[aria-expanded=true]{background:#0e71eb;color:#fff}
.home-main-new-meeting-option-panel .new-meeting-option-panel-block.meeting-option__disabled:hover{background:initial;color:initial}
.home-main-new-meeting-option-panel .new-meeting-option-panel-block:last-child,.home-main-new-meeting-option-panel .new-meeting-option-panel-block__no-border{border-bottom:none}
.home-main-new-meeting-option-panel .pmi-number{margin-right:25px;padding-left:8px}
.zm-pwa-checkbox{align-items:center;cursor:pointer;display:inline-flex;justify-content:flex-start;margin:0;position:relative;-webkit-user-select:none;user-select:none}
.zm-pwa-checkbox .checkbox__input{height:0;opacity:0;width:0}
.zm-pwa-checkbox .checkbox__mark{align-items:center;border:1px solid #babacc;border-radius:4px;color:#fff;display:inline-flex;font-size:10px;height:16px;justify-content:center;width:16px}
.zm-pwa-checkbox .checkbox__text{margin-left:8px}
.checkbox--focused .checkbox__mark{outline:2px solid #2d8cff;outline-offset:1px}
.checkbox--checked .checkbox__mark{background:#0e71eb;border:0}
.checkbox--disabled .checkbox__mark{background:#d0e3fb;border:1px solid #f1f4f6;outline:none}
.checkbox--disabled .checkbox__text{color:#6e7680}
.start-label__icon{background:none;border:none;border-radius:30%;color:#0404138f;cursor:pointer;display:inline-flex;margin-left:4px;padding:.125em}
.start-label__icon:focus,.start-label__icon:hover{background-color:#f2f2f7}
.home-hub-entries_entry__2q2TS{align-items:center;background:var(--zoom-color-fill-default,#fff);border:1px solid var(--zoom-color-border-subtle-neutral,#dfe3e8);border-radius:16px;box-sizing:border-box;color:inherit;cursor:pointer;display:flex;flex:1 1 160px;height:56px;min-width:0;padding:8px 16px;text-decoration:none}
.home-hub-entries_entry__2q2TS:hover{background:var(--zoom-color-fill-subtle-neutral,#f7f9fa)}
.home-hub-entries_entry__2q2TS:focus-visible{outline:2px solid var(--zoom-color-border-focus,#0e72ed);outline-offset:2px}
.home-header__tabs{gap:2px;justify-content:flex-start;width:100%}
.home-header__tab-slot{flex:0 0 auto;transition:transform .3s ease;width:72px}
.home-header__tab-slot.orderBarUp{transform:translateY(-100%)}
.home-header__tab-slot.orderBarDown{transform:translateY(100%)}
.home-header__tab-slot--dragging>*{pointer-events:none}
.home-header__tab-drag-preview{background-color:var(--zoom-color-bg-darker-neutral,#f1f4f6);left:-9999px;overflow:hidden;pointer-events:none;position:absolute;top:0}
.home-header__tab{-webkit-appearance:none;appearance:none;background:#0000;border:0;border-radius:8px;color:var(--zoom-color-text-strong-neutral,#555b62);cursor:pointer;display:inline-flex;height:auto;max-width:72px;min-height:56px;min-width:72px;padding:12px 0 8px;transition:transform .3s ease;width:72px}
.home-header__tab.isStartingDrag,.home-header__tab:hover{background:var(--zoom-color-state-subtle-neutral-hover,#6e76801f);color:var(--zoom-color-text-stronger-neutral,#222325)}
.home-header__tab.whiteText{color:#fff}
.home-header__tab.isNotDragging:hover{background-color:#0000}
.home-header__tab.isNotDragging:hover.selected{background-color:var(--zoom-color-fill-default,#fff)}
.home-header__tab:focus{outline-offset:-4px}
.home-header__tab.selected,.home-header__tab.selected:hover{background-color:var(--zoom-color-fill-default,#fff);color:var(--zoom-color-text-stronger-neutral,#222325)}
.home-header__tab.isDragging{opacity:0}
.home-header__tab.orderBarUp{transform:translateY(-100%)}
.home-header__tab.orderBarDown{transform:translateY(100%)}
.home-header__tab--more{margin-left:10px}
.home-header__tab .header-icon{color:inherit;display:inline-flex;font-size:18px;line-height:1;pointer-events:none;position:relative}
.home-header__tab .header-icon i,.home-header__tab .header-icon svg{color:inherit;display:block;height:1em;width:1em}
.home-header__tab .header-text{color:inherit;font-size:10px;font-weight:400;letter-spacing:.12px;line-height:14px;margin-top:4px;pointer-events:none;text-align:center;word-break:break-word}
.meeting-history{align-items:center;background:#fff;border:1px solid #babacc33;border-radius:8px;box-shadow:0 8px 24px #2323331a;display:flex;flex-direction:column;top:45px}
.meeting-history .meeting-history-list{margin:0;overflow:auto;padding:0;width:100%}
.meeting-history .meeting-history-item{align-items:center;display:flex;font-size:13px;height:32px;justify-content:space-between;line-height:24px;padding:0 12px;-webkit-user-select:none;user-select:none;width:100%}
.meeting-history .meeting-history-item span{flex:0 0 auto}
.meeting-history .meeting-history-item span:first-child{flex:1 1 auto;overflow:hidden;padding-right:24px;text-overflow:ellipsis;white-space:nowrap}
.meeting-history .meeting-history-item:focus,.meeting-history .meeting-history-item:hover{background-color:#0e72ed;color:#fff;outline-offset:0}
.meeting-history .meeting-history-item:focus .meeting-history-item__number,.meeting-history .meeting-history-item:focus .meeting-history-item__topic,.meeting-history .meeting-history-item:hover .meeting-history-item__number,.meeting-history .meeting-history-item:hover .meeting-history-item__topic{color:#fff}
.meeting-history .meeting-history-clear{color:#4793f1;cursor:pointer;flex:0 0 auto;font-weight:500;height:32px;width:100%}
.meeting-history-item__topic{color:#131619;font-size:14px;font-weight:500;line-height:20px}
.meeting-history-item__number{color:#6e7680;font-size:12px;font-weight:400;line-height:16px}
.meeting-history-list-virtualized::-webkit-scrollbar{width:8px}
.meeting-history-list-virtualized::-webkit-scrollbar-track{background:#0000000f;border-radius:3px;-webkit-box-shadow:inset 0 0 5px #00000014}
.meeting-history-list-virtualized::-webkit-scrollbar-thumb{background:#0000001f;border-radius:3px;-webkit-box-shadow:inset 0 0 10px #0003}
.join-meeting-modal__overlay.pwa-modal__overlay--on{background:#0003}
.join-meeting-modal{background:#fff;border:none;border-radius:32px;box-shadow:0 6px 12px #00000014,0 12px 24px #00000014;max-height:min(100vh - 40px,520px);overflow:visible;padding:32px;width:min(448px,100vw - 48px)}
.join-meeting-modal__content{width:100%}
.join-meeting-modal__title{color:#222325;font-size:20px;font-weight:700;letter-spacing:-.45px;line-height:24px;margin:0;text-align:left}
.join-meeting-modal__form{margin-top:24px}
.join-meeting-modal__meeting-id{position:relative;width:100%}
.join-meeting-modal__label{display:block;margin-bottom:4px}
.join-meeting-modal__input,.join-meeting-modal__label{color:#222325;font-size:14px;font-weight:400;letter-spacing:-.15px;line-height:18px}
.join-meeting-modal__input{background:#fff;border:1px solid #c1c6ce;border-radius:12px;height:40px;outline:none;padding:6px 40px 6px 16px;width:100%}
.join-meeting-modal__history-toggle{align-items:center;border-radius:999px;color:#555b62;cursor:pointer;display:flex;height:24px;justify-content:center;position:absolute;right:8px;top:30px;width:24px}
.join-meeting-modal__history-toggle svg{height:14px;width:14px}
.join-meeting-modal__history-toggle:focus,.join-meeting-modal__history-toggle:hover{background-color:#f1f4f6}
.join-meeting-modal__meeting-id .meeting-history{position:absolute;top:calc(100% + 4px);width:100%;z-index:10}
.join-meeting-modal__footer{display:flex;gap:16px;justify-content:flex-end;margin-top:32px}
.join-meeting-modal__button{border:none;border-radius:12px;box-shadow:none;font-size:14px;height:32px;letter-spacing:-.15px;line-height:18px;min-height:32px;min-width:unset;padding:6px 14px}
.join-meeting-modal__footer .join-meeting-modal__button:first-child{background:#f1f4f6;color:#0d6bde}
.join-meeting-modal__footer .join-meeting-modal__button:last-child:disabled{background:#adb1b840;color:#adb1b8}
.join .join-meetingId-container .meeting-history{position:absolute;width:100%;z-index:1}
.meeting-history-item__content{align-items:center;display:flex;flex-grow:1;justify-content:space-between;overflow:hidden}
.meeting-history-item__content.meeting-history-clear{padding:0}
.meeting-history-item__content.meeting-history-clear .meeting-history-item__topic{color:inherit}
:focus{outline:2px solid #2d8cff;outline-offset:1px}
.css-13qub5o{color: var(--pwa-header-nav-color, #555b62); font-size: 14px; font-weight: 400; letter-spacing: -0.15px; border-radius: 12px; box-sizing: border-box; min-height: 32px; height: 32px; padding: 6px 8px; line-height: 20px; border-width: medium; border-style: none; border-color: currentcolor; border-image: none; background-color: transparent;}
.css-13qub5o:hover, .css-13qub5o:focus-visible{background-color: var(--pwa-header-item-hover, #6e76801f); color: var(--pwa-header-text-hover, #0c60c8);}
.css-13qub5o:active, .css-13qub5o[aria-expanded="true"]{background-color: var(--pwa-header-item-press, #6e76803d); color: var(--pwa-header-text-press, #084085);}
.pwa-modal__overlay{position: fixed; inset: 0px; overflow: hidden;}
.pwa-modal__overlay--on{background: rgba(255, 255, 255, 0.75);}
.pwa-modal__overlay--off{background: rgba(0, 0, 0, 0); pointer-events: none;}
.pwa-modal__content{position: absolute; top: 0px; left: 0px; height: 100%; width: 100%; pointer-events: none; overflow: visible; background: rgba(0, 0, 0, 0);}
.pwa-modal__content--centered{display: flex; align-items: center; justify-content: center;}
.pwa-modal__content > *{pointer-events: visible;}
```

### B.10 zoom-ui input / textarea / select / option / listbox

Source: `chunk-zoom-ui.be6b3ccd.css` [M]

```css
.zoom-input{position:relative;display:inline-flex;align-items:center;width:100%;color:var(--zoom-color-text-stronger-neutral);font-size:14px}
.zoom-input input[type=password]::-ms-clear,.zoom-input input[type=password]::-ms-reveal{display:none}
.zoom-input--lg .zoom-input__inner{height:40px;padding:6px 15px}
.zoom-input--lg .zoom-input__inner.is-leaded{padding-right:11px;padding-left:31px}
.zoom-input--lg .zoom-input__inner.is-trailed{padding-right:35px}
.zoom-input--lg .zoom-input__append,.zoom-input--lg .zoom-input__prepend{padding:9px 15px;font-weight:400;font-style:normal;font-size:16px;line-height:20px}
.zoom-input--lg .zoom-input__trailing{top:11px;right:14px}
.zoom-input--lg .zoom-input__leading{top:13px;left:14px;font-size:14px}
.zoom-input--sm .zoom-input__inner{height:24px;padding:4px 7px;border-radius:8px;font-size:12px;line-height:16px}
.zoom-input--sm .zoom-input__inner.is-leaded{padding-right:5px;padding-left:23px}
.zoom-input--sm .zoom-input__inner.is-trailed{padding-right:25px}
.zoom-input--sm .zoom-input__prepend{border-radius:6px 0 0 6px}
.zoom-input--sm .zoom-input__append,.zoom-input--sm .zoom-input__prepend{padding:3px 7px;font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-input--sm .zoom-input__append{border-radius:0 8px 8px 0}
.zoom-input--sm .zoom-input__trailing{top:4px;right:6px}
.zoom-input--sm .zoom-input__leading{top:6px;left:8px;font-size:12px}
.zoom-input.is-counted{padding-bottom:20px}
.zoom-input__inner{display:inline-block;box-sizing:border-box;width:100%;height:32px;padding:6px 11px;border:1px solid var(--zoom-color-border-input);border-radius:12px;background-color:transparent;color:var(--zoom-color-text-stronger-neutral);-webkit-appearance:none;-moz-appearance:none;appearance:none;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-input__inner:focus-visible{outline:none}
.zoom-input__inner:focus:not(.is-disabled,.is-bare){border-color:var(--zoom-color-border-primary);box-shadow:inset 0 0 0 1px var(--zoom-color-border-primary)}
.zoom-input__inner:hover:not(:focus,.is-disabled,.is-readonly,.is-bare){background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-input__inner.is-disabled{border-color:var(--zoom-color-state-subtle-disable);color:var(--zoom-color-state-disable);cursor:not-allowed}
.zoom-input__inner.is-zindex-higher{z-index:1}
.zoom-input__inner.is-readonly{border-color:var(--zoom-color-border-input);background-color:var(--zoom-color-fill-subtler-neutral);color:var(--zoom-color-text-neutral);cursor:not-allowed}
.zoom-input__inner.is-errored{border-color:var(--zoom-color-border-error)}
.zoom-input__inner.is-errored:focus:not(.is-disabled){border-color:var(--zoom-color-border-error);box-shadow:inset 0 0 0 1px var(--zoom-color-border-error)}
.zoom-input__inner.is-leaded{padding-right:7px;padding-left:27px}
.zoom-input__inner.is-trailed{padding-right:31px}
.zoom-input__inner.is-prepended{border-top-left-radius:0;border-bottom-left-radius:0}
.zoom-input__inner.is-appended{border-top-right-radius:0;border-bottom-right-radius:0}
.zoom-input__inner.is-no-left-border{border-left:none}
.zoom-input__inner.is-no-right-border{border-right:none}
.zoom-input__inner.is-bare{border:none}
.zoom-input__trailing{top:7px;right:8px}
.zoom-input__leading,.zoom-input__trailing{position:absolute;z-index:2;display:flex;align-items:center}
.zoom-input__leading{top:9px;left:10px;color:var(--zoom-color-text-neutral);font-size:14px;cursor:pointer}
.zoom-input__leading.is-disabled{color:var(--zoom-color-state-disable);cursor:not-allowed}
.zoom-input__count{position:absolute;bottom:0;left:0;color:var(--zoom-color-text-neutral);font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-input__count.is-exceed{color:var(--zoom-color-text-error)}
.zoom-input__prepend{padding:6px 7px;border:1px solid var(--zoom-color-border-input);border-right:none;border-radius:12px 0 0 12px;background-color:var(--zoom-color-fill-subtler-neutral);color:var(--zoom-color-text-neutral);text-align:center;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-input__prepend.is-disabled{border:1px solid var(--zoom-color-border-input);color:var(--zoom-color-state-disable)}
.zoom-input__prepend-select{display:flex}
.zoom-input__prepend-select .zoom-select-input{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0}
.zoom-input__append{padding:6px 7px;border:1px solid var(--zoom-color-border-input);border-left:none;border-radius:0 12px 12px 0;background-color:var(--zoom-color-fill-subtler-neutral);color:var(--zoom-color-text-neutral);text-align:center;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-input__append.is-disabled{border:1px solid var(--zoom-color-border-input);color:var(--zoom-color-state-disable)}
.zoom-input__append-select{display:flex}
.zoom-input__append-select .zoom-select-input{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}
.zoom-select-input{position:relative;box-sizing:border-box;border:1px solid var(--zoom-color-border-input);border-radius:12px;cursor:pointer}
.zoom-select-input .zoom-select-input__clear{position:absolute;top:50%;right:9px;transform:translateY(-50%)}
.zoom-select-input .zoom-select-input__tags .zoom-tag{margin:4px 4px 0 0}
.zoom-select-input:hover:not(.is-disabled){background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-select-input__wrapper{position:relative;display:flex;align-items:center;overflow-x:hidden;overflow-y:auto;min-height:30px;padding-right:31px;padding-left:11px;font-size:14px;line-height:1}
.zoom-select-input__wrapper.is-multiple{padding:3px 31px 3px 11px}
.zoom-select-input__wrapper.is-has-lead-icon,.zoom-select-input__wrapper.is-multiple.is-has-lead-icon{padding-left:27px}
.zoom-select-input__span{display:inline-block;overflow:hidden;min-width:60px;max-width:100%;border:none;color:var(--zoom-color-text-stronger-neutral);outline:0;text-overflow:ellipsis;white-space:nowrap;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-select-input__span::-webkit-scrollbar{width:0;height:0}
.zoom-select-input__span:focus{outline:none}
.zoom-select-input__span.is-disabled{color:var(--zoom-color-state-disable)}
.zoom-select-input__span.is-displaying-tags{position:absolute;top:0;left:0;width:100%;height:100%}
.zoom-select-input__tags{display:flex;flex-wrap:wrap;margin-top:-4px;padding:2px 0}
.zoom-select-input__chevron{position:absolute;top:50%;right:9px}
.zoom-select-input.is-disabled{border-color:var(--zoom-color-state-subtle-disable);cursor:not-allowed}
.zoom-select-input.is-errored{border-color:var(--zoom-color-border-error)}
.zoom-select-input--sm{border-radius:8px}
.zoom-select-input--sm .zoom-select-input__wrapper{min-height:22px;padding-right:25px;padding-left:7px;font-size:12px;line-height:1}
.zoom-select-input--sm .zoom-select-input__wrapper.is-multiple{padding:1px 25px 1px 7px}
.zoom-select-input--sm .zoom-select-input__wrapper.is-has-lead-icon,.zoom-select-input--sm .zoom-select-input__wrapper.is-multiple.is-has-lead-icon{padding-left:23px}
.zoom-select-input--sm .zoom-select-input__wrapper .zoom-select-input__clear{right:5px}
.zoom-select-input--sm .zoom-select-input__span{font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-select-input--sm .zoom-select-input__chevron{right:5px}
.zoom-select-input--lg{border-radius:12px}
.zoom-select-input--lg .zoom-select-input__wrapper{min-height:38px;padding-right:35px;padding-left:15px;line-height:1}
.zoom-select-input--lg .zoom-select-input__wrapper.is-multiple{padding:3px 35px 3px 15px}
.zoom-select-input--lg .zoom-select-input__wrapper.is-has-lead-icon,.zoom-select-input--lg .zoom-select-input__wrapper.is-multiple.is-has-lead-icon{padding-left:31px}
.zoom-select-input--lg .zoom-select-input__wrapper .zoom-select-input__clear{right:13px}
.zoom-select-input--lg .zoom-select-input__span{font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-select-input--lg .zoom-select-input__chevron{right:13px}
.is-vue3-keyboard-event .zoom-select-input.is-focusing{border-color:var(--zoom-color-border-primary);box-shadow:inset 0 0 0 1px var(--zoom-color-border-primary);outline:none}
.is-vue3-keyboard-event .zoom-select-input.is-focusing.is-errored{border-color:var(--zoom-color-border-error);box-shadow:inset 0 0 0 1px var(--zoom-color-border-error)}
.zoom-select-option{display:flex;align-items:center;min-height:32px;padding:6px 8px;border-radius:8px;outline:none;outline-offset:2px;text-align:left;cursor:pointer}
.zoom-select-option:hover:not(.is-disabled){background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-select-option .is-clipped{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.zoom-select-option .is-clipped:after{content:"";display:block}
.zoom-select-option .zoom-checkbox{display:block}
.zoom-select-option .zoom-checkbox .zoom-checkbox__wrap{display:flex}
.zoom-select-option .zoom-checkbox .zoom-checkbox__wrap .zoom-checkbox__label,.zoom-select-option__checkbox-content{flex:1;min-width:0}
.zoom-select-option__checkbox-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.zoom-select-option__content{flex:1;color:var(--zoom-color-text-stronger-neutral);font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-select-option__desc{color:var(--zoom-color-text-neutral)}
.zoom-select-option__helper-icon{margin-left:8px}
.zoom-select-option.is-sibling-selected{padding-right:32px}
.zoom-select-option.is-disabled{cursor:not-allowed}
.zoom-select-option.is-disabled,.zoom-select-option.is-disabled .zoom-select-option__content,.zoom-select-option.is-disabled .zoom-select-option__desc{color:var(--zoom-color-state-disable)}
.zoom-select-option__checkmark{margin-left:8px;color:var(--zoom-color-text-stronger-neutral);font-size:16px}
.is-vue3-keyboard-event .zoom-select-option:focus{outline:2px solid var(--zoom-color-border-primary)}
.zoom-select-option-group{position:relative;margin:0;padding:0;list-style:none}
.zoom-select-option-group:not(:last-of-type){padding-bottom:16px}
.zoom-select-option-group:not(:last-of-type):after{content:"";position:absolute;right:8px;bottom:8px;left:8px;border-bottom:1px solid var(--zoom-color-border-subtle-neutral)}
.zoom-select-option-group__title{padding:8px;color:var(--zoom-color-text-neutral);font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-select-option-group__inner{margin:0;padding:0}
.zoom-textarea{position:relative;display:inline-block;width:100%;height:100%}
.zoom-textarea--sm .zoom-textarea__inner{height:48px;padding:8px;border-radius:8px;font-size:12px;line-height:16px}
.zoom-textarea--sm .zoom-textarea__inner.is-autoresize{padding-top:3px;padding-bottom:3px}
.zoom-textarea--lg .zoom-textarea__inner{height:72px;padding:12px 16px;border-radius:12px;font-size:14px;line-height:18px}
.zoom-textarea--lg .zoom-textarea__inner.is-autoresize{padding-top:10px;padding-bottom:10px}
.zoom-textarea__count{margin-top:4px;color:var(--zoom-color-text-neutral);font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-textarea__count.is-exceed{color:var(--zoom-color-text-error)}
.zoom-textarea__inner{display:block;box-sizing:border-box;width:100%;height:60px;padding:8px 12px;border:1px solid var(--zoom-color-border-input);border-radius:12px;background-color:transparent;color:var(--zoom-color-text-stronger-neutral);font-size:14px;line-height:18px;resize:vertical;-webkit-appearance:none;-moz-appearance:none;appearance:none;scrollbar-width:thin;scrollbar-color:#949494 transparent}
.zoom-textarea__inner:focus-visible{outline:none}
.zoom-textarea__inner:focus:not(.is-disabled,.is-bare){border-color:var(--zoom-color-border-primary);box-shadow:inset 0 0 0 1px var(--zoom-color-border-primary)}
.zoom-textarea__inner:hover:not(:focus,.is-disabled,.is-readonly,.is-bare){background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-textarea__inner.is-errored{border-color:var(--zoom-color-border-error)}
.zoom-textarea__inner.is-errored:focus:not(.is-disabled){border-color:var(--zoom-color-border-error);box-shadow:inset 0 0 0 1px var(--zoom-color-border-error)}
.zoom-textarea__inner.is-disabled{border-color:var(--zoom-color-state-subtle-disable);color:var(--zoom-color-state-disable);cursor:not-allowed}
.zoom-textarea__inner.is-readonly{border-color:var(--zoom-color-border-input);background-color:var(--zoom-color-fill-subtler-neutral);color:var(--zoom-color-text-neutral);cursor:not-allowed}
.zoom-textarea__inner.is-has-rows{height:auto}
.zoom-textarea__inner.is-bare{border:none}
.zoom-textarea__inner.is-autoresize{padding-top:6px;padding-bottom:6px}
.is-vue3-keyboard-event .zoom-textarea .zoom-textarea__inner.is-disabled:focus{border-color:var(--zoom-color-border-primary);box-shadow:inset 0 0 0 1px var(--zoom-color-border-primary)}
.is-vue3-keyboard-event .zoom-textarea .zoom-textarea__inner.is-errored{border-color:var(--zoom-color-border-error)}
.zoom-listbox-item{display:flex;align-items:center;min-height:32px;padding:6px 8px;border-radius:12px;background-color:var(--zoom-color-fill-default);color:var(--zoom-color-text-stronger-neutral);outline-offset:2px;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-listbox-item .zoom-listbox-item__danger{color:var(--zoom-color-text-error)}
.zoom-listbox-item .zoom-listbox-item__disabled{color:var(--zoom-color-state-disable)}
.zoom-listbox-item .zoom-listbox-item__icon{font-size:16px}
.zoom-listbox-item__left{display:flex;align-items:center;margin-right:8px;line-height:1}
.zoom-listbox-item__center{flex:1}
.zoom-listbox-item__right{display:flex;align-items:center;margin-left:8px;line-height:1}
.zoom-listbox-item__label{color:var(--zoom-color-text-stronger-neutral);font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-listbox-item__desc{color:var(--zoom-color-text-neutral);font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-listbox-item.is-hairline{position:relative}
.zoom-listbox-item.is-hairline:after{content:"";position:absolute;right:0;bottom:0;left:0;display:block;height:1px;background-color:var(--zoom-color-border-subtle-neutral)}
.zoom-listbox-item.is-option{cursor:pointer}
.zoom-listbox-item.is-option:hover:not(.is-disabled){background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-listbox-item.is-option:hover:not(.is-disabled).is-hairline{border-radius:0}
.zoom-listbox-item.is-option:active:not(.is-disabled){background-color:var(--zoom-color-state-subtle-neutral-press)}
.zoom-listbox-item.is-option:active:not(.is-disabled).is-hairline{border-radius:0}
.zoom-listbox-item.is-disabled{color:var(--zoom-color-state-disable);cursor:not-allowed}
.zoom-listbox-item.is-align-left{padding-left:32px}
.zoom-listbox-item.is-align-right{padding-right:32px}
.is-vue3-keyboard-event .zoom-listbox-item:focus{outline:2px solid var(--zoom-color-border-primary)}
```

### B.11 zoom-ui checkbox / radio / toggle / segmented / tabs

Source: `chunk-zoom-ui.be6b3ccd.css` [M]

```css
.zoom-radio{display:inline-block;margin-right:32px;line-height:1}
.zoom-radio:last-child{margin-right:0}
.zoom-radio .zoom-radio__suffix .zoom-button__inner-icon{color:var(--zoom-color-text-neutral)}
.zoom-radio__wrap{display:inline-flex;align-items:center;min-height:20px;cursor:pointer}
.zoom-radio__wrap:not(.is-disabled):hover .zoom-radio__inner{background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-radio__wrap:not(.is-disabled):active .zoom-radio__inner{background-color:var(--zoom-color-state-subtle-neutral-press)}
.zoom-radio__wrap.is-checked:not(.is-disabled):hover .zoom-radio__inner{border-color:var(--zoom-color-state-primary-hover);background-color:var(--zoom-color-state-primary-hover)}
.zoom-radio__wrap.is-checked:not(.is-disabled):active .zoom-radio__inner{border-color:var(--zoom-color-state-primary-press);background-color:var(--zoom-color-state-primary-press)}
.zoom-radio__wrap.is-checked .zoom-radio__inner{border-color:var(--zoom-color-fill-global-primary);background-color:var(--zoom-color-fill-global-primary)}
.zoom-radio__wrap.is-checked .zoom-radio__knob{transform:translate(-50%,-50%) scale(1)}
.zoom-radio__wrap.is-checked.is-disabled .zoom-radio__inner{border-color:var(--zoom-color-state-disable);background-color:var(--zoom-color-state-disable)}
.zoom-radio__wrap.is-disabled{cursor:not-allowed}
.zoom-radio__wrap.is-disabled .zoom-radio__inner{border-color:var(--zoom-color-state-disable);background-color:var(--zoom-color-state-subtle-disable);cursor:not-allowed}
.zoom-radio__wrap.is-disabled .zoom-radio__label{color:var(--zoom-color-state-disable)}
.zoom-radio__region{margin-top:8px;padding-left:24px}
.zoom-radio__description{margin-top:4px;padding-left:24px;color:var(--zoom-color-text-neutral);font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-radio__label{flex:1;color:var(--zoom-color-text-stronger-neutral);font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-radio__inner{position:relative;box-sizing:border-box;width:16px;height:16px;margin-right:8px;border:1px solid var(--zoom-color-border-neutral);border-radius:100%;outline-offset:2px;cursor:pointer}
.zoom-radio__inner:hover{background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-radio__inner:active{background-color:var(--zoom-color-state-subtle-neutral-press)}
.zoom-radio__knob{position:absolute;top:50%;left:50%;width:8px;height:8px;border-radius:100%;background-color:var(--zoom-color-inverse-global-default);transition:transform .15s ease-in;transform:translate(-50%,-50%) scale(0)}
.zoom-radio__suffix{display:inline-flex;align-items:center;margin-left:4px}
.zoom-radio__suffix .zoom-button__icon.zoom-button--sm{width:20px;height:20px;border-radius:4px}
.is-vue3-keyboard-event .zoom-radio .zoom-radio__inner:focus{outline:2px solid var(--zoom-color-border-primary)}
.zoom-radio-group{line-height:1}
.zoom-radio-group.is-vertical>.zoom-radio{display:block;margin-right:0;margin-bottom:8px}
.zoom-radio__title{margin-bottom:8px;color:var(--zoom-color-text-stronger-neutral);font-weight:600;font-style:normal;font-size:14px;line-height:18px}
.zoom-checkbox{display:inline-flex;min-height:20px;font-size:inherit;line-height:1}
.zoom-checkbox .zoom-checkbox__suffix .zoom-button__inner-icon{color:var(--zoom-color-text-neutral)}
.zoom-checkbox.is-has-region,.zoom-checkbox.is-indeterminate-container{flex-wrap:wrap}
.zoom-checkbox__mixed{position:absolute;width:16px;height:16px;margin:0;outline:none}
.zoom-checkbox__label{margin-left:8px;padding:1px 0}
.zoom-checkbox__wrap{position:relative;display:inline-flex;margin-bottom:0;outline:none;word-break:break-word;cursor:pointer;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-checkbox__wrap:hover .zoom-checkbox__inner:not(.is-disabled){border-color:var(--zoom-color-border-neutral);background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-checkbox__wrap:active .zoom-checkbox__inner:not(.is-disabled){border-color:var(--zoom-color-border-neutral);background-color:var(--zoom-color-state-subtle-neutral-press)}
.zoom-checkbox__wrap.is-indeterminate:not(.is-disabled):hover .zoom-checkbox__inner{border-color:var(--zoom-color-state-primary-hover);background-color:var(--zoom-color-state-primary-hover)}
.zoom-checkbox__wrap.is-indeterminate:not(.is-disabled):active .zoom-checkbox__inner{border-color:var(--zoom-color-state-primary-press);background-color:var(--zoom-color-state-primary-press)}
.zoom-checkbox__wrap.is-indeterminate .zoom-checkbox__inner{border-color:var(--zoom-color-fill-global-primary);background-color:var(--zoom-color-fill-global-primary)}
.zoom-checkbox__wrap.is-indeterminate .zoom-checkbox__inner:before{content:"";position:absolute;top:6px;left:2px;width:10px;height:2px;border:1px solid var(--zoom-color-inverse-neutral);border-radius:2px;background-color:var(--zoom-color-inverse-neutral)}
.zoom-checkbox__wrap.is-indeterminate .zoom-checkbox__inner .zoom-checkbox__knob{opacity:0}
.zoom-checkbox__wrap.is-indeterminate .zoom-checkbox__inner.is-disabled{border-color:var(--zoom-color-state-subtle-primary-disable);background-color:var(--zoom-color-state-subtle-primary-disable)}
.zoom-checkbox__wrap.is-checked:not(.is-disabled):hover .zoom-checkbox__inner{border-color:var(--zoom-color-state-primary-hover);background-color:var(--zoom-color-state-primary-hover)}
.zoom-checkbox__wrap.is-checked:not(.is-disabled):active .zoom-checkbox__inner{border-color:var(--zoom-color-state-primary-press);background-color:var(--zoom-color-state-primary-press)}
.zoom-checkbox__wrap.is-checked .zoom-checkbox__inner{border-color:var(--zoom-color-fill-global-primary);background-color:var(--zoom-color-fill-global-primary)}
.zoom-checkbox__wrap.is-checked .zoom-checkbox__knob{opacity:1}
.zoom-checkbox__wrap.is-checked.is-disabled .zoom-checkbox__inner{border-color:var(--zoom-color-state-subtle-primary-disable);background-color:var(--zoom-color-state-subtle-primary-disable)}
.zoom-checkbox__wrap.is-disabled{color:var(--zoom-color-state-disable);cursor:not-allowed}
.zoom-checkbox__wrap.is-disabled .zoom-checkbox__inner{border-color:var(--zoom-color-state-disable);background-color:var(--zoom-color-state-subtle-disable);cursor:not-allowed}
.zoom-checkbox__inner{position:relative;top:2px;display:inline-block;flex:0 0 16px;width:16px;height:16px;border:1px solid var(--zoom-color-border-neutral);border-radius:4px;cursor:pointer;transition:border-color .2s cubic-bezier(.71,-.46,.29,1.46),background-color .2s cubic-bezier(.71,-.46,.29,1.46)}
.zoom-checkbox__knob{position:absolute;top:-1px;left:1px;width:100%;height:100%;opacity:0;transform:rotate(45deg)}
.zoom-checkbox__knob:before{top:3px;left:7px;width:2px;height:9px}
.zoom-checkbox__knob:after,.zoom-checkbox__knob:before{content:"";position:absolute;box-sizing:border-box;border:1px solid var(--zoom-color-inverse-neutral);border-radius:2px;background-color:var(--zoom-color-inverse-neutral)}
.zoom-checkbox__knob:after{top:10px;left:4px;width:5px;height:2px}
.zoom-checkbox__original{position:absolute;z-index:-1;width:16px;height:16px;margin:0;outline:none;opacity:0}
.zoom-checkbox__region{width:100%;margin-top:8px;padding-left:22px}
.zoom-checkbox__description{width:100%;margin-top:4px;padding-left:22px;color:var(--zoom-color-text-neutral);font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-checkbox__suffix{display:inline-flex;align-items:center;margin-left:4px}
.zoom-checkbox__suffix .zoom-button__icon.zoom-button--sm{width:20px;height:20px;border-radius:4px}
.is-vue3-keyboard-event .zoom-checkbox .zoom-checkbox__mixed:focus~.zoom-checkbox__inner,.is-vue3-keyboard-event .zoom-checkbox .zoom-checkbox__original:focus+.zoom-checkbox__inner{outline:2px solid var(--zoom-color-border-primary);outline-offset:2px}
.zoom-checkbox-group.is-vertical.zoom-checkbox-group--menu .zoom-checkbox{padding:6px 8px}
.zoom-checkbox-group.is-vertical.zoom-checkbox-group--menu .zoom-checkbox+.zoom-checkbox{margin-top:0}
.zoom-checkbox-group .zoom-checkbox{margin-right:24px}
.zoom-checkbox__title{margin-bottom:8px;color:var(--zoom-color-text-stronger-neutral);font-weight:600;font-style:normal;font-size:14px;line-height:18px}
.zoom-checkbox-group.is-vertical .zoom-checkbox{display:flex;width:100%;margin-right:0}
.zoom-checkbox-group.is-vertical .zoom-checkbox+.zoom-checkbox{margin-top:8px}
.zoom-toggle{position:relative;display:inline-block}
.zoom-toggle--md{width:36px;min-width:36px;height:20px}
.zoom-toggle--md .zoom-toggle__core:after{width:12px;height:12px}
.zoom-toggle--md.is-checked .zoom-toggle__core:after{bottom:1px;width:16px;height:16px;transform:translateX(14px)}
.zoom-toggle--sm{width:28px;min-width:28px;height:16px}
.zoom-toggle--sm .zoom-toggle__core{border-radius:8px}
.zoom-toggle--sm .zoom-toggle__core:after{bottom:2.5px;width:9px;height:9px}
.zoom-toggle--sm .zoom-spinners,.zoom-toggle--sm .zoom-toggle__spinners.zoom-icon{width:12px;height:12px}
.zoom-toggle--sm.is-checked.zoom-toggle .zoom-toggle__core:after{bottom:1px;width:12px;height:12px;transform:translateX(10px)}
.zoom-toggle__original{position:absolute;width:100%;height:100%;margin:0;outline:none;opacity:0}
.zoom-toggle__core{position:absolute;top:0;right:0;bottom:0;left:0;border:1px solid var(--zoom-color-border-strong-neutral);border-radius:999px;background-color:var(--zoom-color-fill-default);cursor:pointer;transition-duration:.3s;transition-property:transform}
.zoom-toggle__core:after{content:"";position:absolute;bottom:3px;left:3px;border-radius:100%;background-color:var(--zoom-color-icon-strong-neutral);transition:.3s}
.zoom-toggle__core:hover:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-toggle__core:active:not(.is-loading){background-color:var(--zoom-color-state-subtle-neutral-press)}
.zoom-toggle__spinners.zoom-icon{position:absolute;top:50%;left:1px;z-index:1;transform:translateY(-50%)}
.zoom-toggle.is-disabled .zoom-toggle__core{border-color:var(--zoom-color-border-subtle-neutral);background-color:transparent;cursor:auto}
.zoom-toggle.is-disabled .zoom-toggle__core:after{background-color:var(--zoom-color-state-subtle-disable)}
.zoom-toggle.is-loading .zoom-toggle__core{cursor:auto}
.zoom-toggle.is-loading .zoom-toggle__core:after{opacity:0}
.zoom-toggle.is-loading.is-checked .zoom-toggle__core:after{opacity:1}
.zoom-toggle.is-checked .zoom-toggle__core{border-color:var(--zoom-color-fill-global-primary);background-color:var(--zoom-color-fill-global-primary)}
.zoom-toggle.is-checked .zoom-toggle__core:hover:not(.is-loading,.is-disabled){border-color:var(--zoom-color-state-primary-hover);background-color:var(--zoom-color-state-primary-hover)}
.zoom-toggle.is-checked .zoom-toggle__core:active:not(.is-loading,.is-disabled){border-color:var(--zoom-color-state-primary-press);background-color:var(--zoom-color-state-primary-press)}
.zoom-toggle.is-checked .zoom-toggle__core:after{background-color:var(--zoom-color-inverse-global-default)}
.zoom-toggle.is-checked .zoom-toggle__spinners{right:2px;left:auto}
.zoom-toggle.is-checked.is-disabled .zoom-toggle__core{border-color:var(--zoom-color-state-subtle-primary-disable);background-color:var(--zoom-color-state-subtle-primary-disable)}
.zoom-toggle.is-checked.is-disabled .zoom-toggle__core:after{background-color:var(--zoom-color-fill-global-strong-light-transparent)}
.zoom-toggle.is-checked.is-loading .zoom-toggle__core{cursor:auto}
.is-vue3-keyboard-event .zoom-toggle .zoom-toggle__original:focus+.zoom-toggle__core{outline:2px solid var(--zoom-color-border-primary);outline-offset:2px}
.zoom-segment-list-thumb{position:absolute;top:0;left:0;z-index:1;display:none;border-radius:999px;background-color:var(--zoom-color-fill-elevated-strong);box-shadow:0 4px 8px 0 var(--zoom-color-underlay-dropShadow),0 2px 4px 0 var(--zoom-color-underlay-dropShadow);backdrop-filter:blur(15px)}
.zoom-segmented-control__header{display:flex;justify-content:center}
.zoom-segment-list{position:relative;display:inline-block;padding:2px;border-radius:999px;background-color:var(--zoom-color-fill-contrary-subtler-transparent);backdrop-filter:blur(15px)}
.zoom-segment-list__main{display:flex;align-items:stretch}
.zoom-segment-list.is-block{display:flex;width:100%}
.zoom-segment-list.is-block .zoom-segment-list__main{width:100%}
.zoom-segment-list.is-block .zoom-segment-item{flex:1}
.zoom-segment-item{position:relative;z-index:2;display:flex;gap:4px;justify-content:center;align-items:center;min-height:28px;padding:0 8px;color:var(--zoom-color-text-stronger-neutral);cursor:pointer;transition:color .1s ease-in-out;font-weight:400;font-style:normal;font-size:14px;line-height:18px;border-radius:999px}
.zoom-segment-item+.zoom-segment-item{margin-left:2px}
.zoom-segment-item:focus-visible{z-index:3;outline:2px solid var(--zoom-color-border-primary);outline-offset:2px}
.zoom-segment-item:not(.is-active,.is-disabled,.is-animating):hover{background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-segment-item:not(.is-active,.is-disabled,.is-animating):active{background-color:var(--zoom-color-state-subtle-neutral-press)}
.zoom-segment-item.is-active{background-color:var(--zoom-color-fill-elevated-strong);box-shadow:0 4px 8px 0 var(--zoom-color-underlay-dropShadow),0 2px 4px 0 var(--zoom-color-underlay-dropShadow);backdrop-filter:blur(15px)}
.zoom-segment-item.is-disabled{cursor:not-allowed}
.zoom-segment-item.is-disabled,.zoom-segment-item.is-disabled.is-active{color:var(--zoom-color-state-disable)}
.zoom-segment-item__icon{font-size:14px}
.zoom-segment-item__icon svg{transform:translateZ(0)}
.zoom-tabs__nav-wrap{position:relative}
.zoom-tabs__nav-wrap:after{content:"";position:absolute;bottom:0;left:0;z-index:0;width:100%;height:1px;background-color:var(--zoom-color-border-subtle-neutral)}
.zoom-tabs__nav-wrap.is-secondary:after{height:0}
.zoom-tabs__nav-wrap.is-secondary .zoom-tabs__active-bar{display:none}
.zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item{margin:0;margin-right:8px;padding:3px 6px;border-radius:999px;background-color:var(--zoom-color-fill-contrary-subtler-transparent);font-weight:400}
.zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item:last-child{margin-right:0}
.zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item:hover{background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item:hover .zoom-tabs__tab-label{background-color:transparent}
.zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item:active{background-color:var(--zoom-color-state-subtle-neutral-press)}
.zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item:active .zoom-tabs__tab-label{background-color:transparent}
.zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item .zoom-tabs__tab-label{color:var(--zoom-color-text-stronger-neutral)}
.zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item.is-active{background:var(--zoom-color-toggle-button-background-selected)}
.zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item.is-active .zoom-tabs__tab-label{color:var(--zoom-color-text-primary)}
.zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item.is-disabled{background-color:var(--zoom-color-fill-subtler-neutral);cursor:not-allowed}
.zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item.is-disabled .zoom-tabs__tab-label{color:var(--zoom-color-state-disable)}
.zoom-tabs__nav-scroll{overflow:hidden}
.zoom-tabs__nav{position:relative;z-index:1;display:flex;justify-content:center;align-items:center;float:left;white-space:nowrap;transition:all .3s ease-in-out}
.zoom-tabs__nav.is-large{font-weight:600;font-size:16px}
.zoom-tabs__nav.is-large .zoom-tabs__item{padding:4px 0;line-height:20px}
.zoom-tabs__nav.is-large .zoom-tabs__item .zoom-tabs__tab-label{padding:6px 2px;border-radius:6px}
.zoom-tabs__scrollable-btn{position:absolute;top:0;z-index:10;width:32px;height:32px;pointer-events:none}
.zoom-tabs__scrollable-btn.is-large{width:32px;height:40px}
.zoom-tabs__scrollable-btn.is-large .zoom-tabs__transparent-wrapper{display:flex;width:32px;height:40px}
.zoom-tabs__scrollable-btn.is-large .zoom-tabs__linear-gradient-left{width:16px;height:40px;background:linear-gradient(90deg,var(--zoom-color-inverse-default) 0,hsla(0,0%,100%,0) 100%)}
.zoom-tabs__scrollable-btn.is-large .zoom-tabs__linear-gradient-right{width:16px;height:40px;background:linear-gradient(90deg,hsla(0,0%,100%,0) 0,var(--zoom-color-inverse-default) 100%)}
.zoom-tabs__scrollable-btn.is-large .zoom-tabs__unified{width:16px;height:40px}
.zoom-tabs__scrollable-btn.is-large .zoom-tabs__arrow{top:8px}
.zoom-tabs__scrollable-left{left:0}
.zoom-tabs__scrollable-right{right:0}
.zoom-tabs__arrow-wrapper{position:relative}
.zoom-tabs__transparent-wrapper{display:flex;width:32px;height:32px}
.zoom-tabs__linear-gradient-left{width:16px;height:32px;background:linear-gradient(90deg,var(--zoom-color-inverse-default) 0,hsla(0,0%,100%,0) 100%)}
.zoom-tabs__linear-gradient-right{width:16px;height:32px;background:linear-gradient(90deg,hsla(0,0%,100%,0) 0,var(--zoom-color-inverse-default) 100%)}
.zoom-tabs__unified{width:16px;height:32px;background:var(--zoom-color-inverse-default)}
.zoom-tabs__arrow{position:absolute;top:4px;pointer-events:auto}
.zoom-tabs__arrow-left{left:0}
.zoom-tabs__arrow-right{right:0}
.zoom-tabs__item{margin-right:16px;padding:4px 0;border-radius:6px;background-color:transparent;color:var(--zoom-color-text-neutral);font-weight:500;font-size:14px;line-height:18px;cursor:pointer}
.zoom-tabs__item:last-child{margin-right:0}
.zoom-tabs__item:hover .zoom-tabs__tab-label{background-color:var(--zoom-color-state-subtle-neutral-hover);color:var(--zoom-color-state-neutral-hover)}
.zoom-tabs__item:active .zoom-tabs__tab-label{background-color:var(--zoom-color-state-subtle-neutral-press);color:var(--zoom-color-state-neutral-press)}
.zoom-tabs__item:focus-visible{outline:0}
.zoom-tabs__tab-label{display:flex;gap:4px;align-items:center;padding:3px 2px;border-radius:6px}
.zoom-tabs__item.is-active{color:var(--zoom-color-text-stronger-neutral)}
.zoom-tabs__item.is-active:active .zoom-tabs__tab-label,.zoom-tabs__item.is-active:hover .zoom-tabs__tab-label{background-color:transparent;color:var(--zoom-color-text-stronger-neutral)}
.zoom-tabs__item.is-disabled{color:var(--zoom-color-state-disable);cursor:not-allowed}
.zoom-tabs__item.is-disabled .zoom-tabs__tab-label{background-color:transparent;color:var(--zoom-color-state-disable)}
.zoom-tabs__active-bar{position:absolute;bottom:0;left:0;z-index:1;height:1px;background-color:var(--zoom-color-fill-primary);transition:all .3s ease-in-out}
.is-vue3-keyboard-event .zoom-tabs .zoom-tabs__item:focus .zoom-tabs__tab-label,.is-vue3-keyboard-event .zoom-tabs .zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item:focus{outline:2px solid var(--zoom-color-border-primary);outline-offset:-2px}
.is-vue3-keyboard-event .zoom-tabs .zoom-tabs__nav-wrap.is-secondary .zoom-tabs__item:focus .zoom-tabs__tab-label{outline:none}
```

### B.12 zoom-ui floating / tooltip / popover / dropdown / dialog / overlay / message-box / toast

Source: `chunk-zoom-ui.be6b3ccd.css` [M]

```css
.zoom-overlay{position:fixed;top:0;right:0;bottom:0;left:0;overflow:auto;height:100%;background-color:var(--zoom-color-underlay-dark)}
.zoom-overlay.is-transparent{background-color:transparent}
.zoom-dialog{position:relative;box-sizing:border-box;margin:auto;border-radius:32px;background-color:var(--zoom-color-fill-default);box-shadow:0 12px 24px 0 var(--zoom-color-underlay-dropShadow),0 6px 12px 0 var(--zoom-color-underlay-dropShadow)}
.zoom-dialog.is-sm{width:448px}
.zoom-dialog.is-md{width:684px}
.zoom-dialog.is-lg{width:920px}
.zoom-dialog.is-fullscreen{overflow:auto;width:100%;height:100%;margin-top:0;margin-bottom:0;border-radius:0}
.zoom-dialog__header{padding:32px 32px 24px}
.zoom-dialog__header.is-elevated{box-shadow:0 1px 0 0 var(--zoom-color-underlay-dropShadow)}
.zoom-dialog__header.is-draggable{cursor:move;-webkit-user-select:none;-moz-user-select:none;user-select:none}
.zoom-dialog__close.zoom-button{position:absolute;top:28px;right:32px}
.zoom-dialog__title{padding-right:40px;overflow-wrap:break-word;font-weight:700;font-style:normal;font-size:20px;line-height:24px}
.zoom-dialog__body,.zoom-dialog__title{color:var(--zoom-color-text-stronger-neutral)}
.zoom-dialog__body{padding:0 32px}
.zoom-dialog__body.is-lost-footer{margin:0 0 32px}
.zoom-dialog__body.is-allowed-resize{padding:0}
.zoom-dialog__body-wrapper{padding:0 32px 2px}
.zoom-dialog__footer{box-sizing:border-box;padding:32px;text-align:right}
.zoom-dialog__footer.is-elevated{box-shadow:0 -1px 0 0 var(--zoom-color-underlay-dropShadow)}
.zoom-overlay-dialog{position:fixed;top:0;right:0;bottom:0;left:0;display:flex;overflow:auto}
.zoom-fade-in-linear-enter-active,.zoom-fade-in-linear-leave-active{transition:opacity .3s linear}
.zoom-fade-in-linear-enter-from,.zoom-fade-in-linear-leave-to{opacity:0}
.fade-in-linear-enter-active{animation:modal-fade-in .3s}
.fade-in-linear-enter-active .zoom-overlay-dialog{animation:fade-in-linear-in .3s}
.fade-in-linear-leave-active{animation:modal-fade-out .3s}
.fade-in-linear-leave-active .zoom-overlay-dialog{animation:fade-in-linear-out .3s}
@keyframes fade-in-linear-in{0%{opacity:0;transform:translate3d(0,-20px,0)}to{opacity:1;transform:translateZ(0)}}
@keyframes fade-in-linear-out{0%{opacity:1;transform:translateZ(0)}to{opacity:0;transform:translate3d(0,-20px,0)}}
.zoom-floating{position:absolute;z-index:2000;min-width:10px;border:1px solid var(--zoom-color-border-subtle-neutral);border-radius:12px;background-color:var(--zoom-color-fill-default);color:var(--zoom-color-text-stronger-neutral);box-shadow:0 12px 24px 0 var(--zoom-color-underlay-dropShadow),0 6px 12px 0 var(--zoom-color-underlay-dropShadow);font-size:14px}
.zoom-floating[data-side=right] .zoom-floating__arrow:after{left:-1px;border-top:0;border-right:0;border-bottom-left-radius:3px}
.zoom-floating[data-side=left] .zoom-floating__arrow:after{border-bottom:0;border-left:0;border-top-right-radius:3px}
.zoom-floating[data-side=top] .zoom-floating__arrow:after{border-top:0;border-left:0;border-bottom-right-radius:3px}
.zoom-floating[data-side=bottom] .zoom-floating__arrow:after{top:-1px;border-right:0;border-bottom:0;border-top-left-radius:3px}
.zoom-floating__arrow{position:absolute;width:14px;height:14px;pointer-events:none}
.zoom-floating__arrow:after{content:"";position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;border:1px solid var(--zoom-color-border-subtle-neutral);background-color:var(--zoom-color-fill-default);transform:rotate(45deg)}
.zoom-floating.is-transparent{background:transparent;box-shadow:unset}
.zoom-floating.is-tooltip{border:none;border-radius:4px;background-color:var(--zoom-color-state-contrary-strong-transparent-hover);color:var(--zoom-color-inverse-default);box-shadow:0 4px 8px 0 var(--zoom-color-underlay-dropShadow),0 2px 4px 0 var(--zoom-color-underlay-dropShadow);backdrop-filter:blur(15px)}
.zoom-tooltip{max-width:320px;padding:2px 6px;overflow-wrap:break-word;font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-tooltip:focus{outline:none}
.zoom-tooltip-enter-active,.zoom-tooltip-leave-active{transition:opacity .2s cubic-bezier(.4,0,.2,1),transform .2s cubic-bezier(.4,0,.2,1);transform:scale(1)}
.zoom-tooltip-enter-from,.zoom-tooltip-leave-to{opacity:0;transform:scale(0)}
.zoom-info-popover{max-width:320px;padding:16px;border-radius:16px;overflow-wrap:break-word;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-info-popover:focus{outline:none}
.zoom-info-popover__title{margin-bottom:4px;overflow-wrap:break-word;font-weight:600;font-style:normal;font-size:14px;line-height:18px}
.zoom-info-popover-enter-active,.zoom-info-popover-leave-active{transition:opacity .2s cubic-bezier(.4,0,.2,1),transform .2s cubic-bezier(.4,0,.2,1);transform:scale(1)}
.zoom-info-popover-enter-from,.zoom-info-popover-leave-to{opacity:0;transform:scale(0)}
.zoom-floating.is-popover-container{border-radius:16px}
.zoom-floating.is-popover-container.is-complex{border-radius:24px}
.zoom-popover{position:relative;max-width:360px;padding:16px}
.zoom-popover--complex{padding:24px}
.zoom-popover--complex .zoom-popover--closable{top:24px;right:24px}
.zoom-popover--complex .zoom-popover__actionable{margin-top:24px}
.zoom-popover--closable{position:absolute;top:16px;right:16px}
.zoom-popover__content{line-height:18px}
.zoom-popover__body.is-padding-for-close{padding-right:26px}
.zoom-popover__body.is-complex.is-padding-for-close{padding-right:32px}
.zoom-popover__title{margin-bottom:4px;font-weight:600;font-style:normal;font-size:14px;line-height:18px}
.zoom-popover__title.is-padding-for-close{padding-right:26px}
.zoom-popover__title.is-complex{margin-bottom:16px;font-weight:700;font-style:normal;font-size:20px;line-height:24px}
.zoom-popover__title.is-complex.is-padding-for-close{padding-right:32px}
.zoom-popover__actionable{margin-top:16px;text-align:right}
.zoom-toast{position:fixed;box-sizing:border-box;width:400px;padding:16px;border:1px solid var(--zoom-color-border-subtle-neutral);border-radius:16px;background-color:var(--zoom-color-fill-default);color:var(--zoom-color-text-stronger-neutral);box-shadow:0 12px 24px 0 var(--zoom-color-underlay-dropShadow),0 6px 12px 0 var(--zoom-color-underlay-dropShadow)}
.zoom-toast--closable{align-self:flex-start}
.zoom-toast--right{right:16px;transition:opacity .3s,transform .3s}
.zoom-toast--left{left:16px;transition:opacity .3s,transform .3s}
.zoom-toast--center{left:50%;transition:opacity .3s,transform .3s,top .3s;transform:translateX(-50%)}
.zoom-toast__main{display:flex;align-items:center;margin:0}
.zoom-toast__icon{align-self:flex-start}
.zoom-toast__body{flex:1;margin:0 12px}
.zoom-toast__title{margin-bottom:4px;font-weight:600;font-style:normal;font-size:14px;line-height:18px}
.zoom-toast__content{word-break:break-word;font-weight:400;font-style:normal;font-size:14px;line-height:20px}
.zoom-toast__actionable{margin-top:12px;text-align:right}
.zoom-toast-top-center-enter-from,.zoom-toast-top-center-leave-to{opacity:0;transform:translate(-50%,-100%)}
.zoom-toast-bottom-right-enter-from.zoom-toast--right,.zoom-toast-top-right-enter-from.zoom-toast--right{right:0;transform:translateX(100%)}
.zoom-toast-bottom-left-enter-from.zoom-toast--left,.zoom-toast-top-left-enter-from.zoom-toast--left{left:0;transform:translateX(-100%)}
.zoom-toast-bottom-left-leave-to,.zoom-toast-bottom-right-leave-to,.zoom-toast-top-left-leave-to,.zoom-toast-top-right-leave-to{opacity:0}
.zoom-toast-bottom-right-leave-to.zoom-toast--right,.zoom-toast-top-right-leave-to.zoom-toast--right{right:0;transform:translateX(100%)}
.zoom-toast-bottom-left-leave-to.zoom-toast--left,.zoom-toast-top-left-leave-to.zoom-toast--left{left:0;transform:translateX(-100%)}
.zoom-dropdown-menu{padding:12px}
.zoom-dropdown-menu:focus-visible{outline:none}
.zoom-dropdown-menu.is-horizontal{display:flex;align-items:center}
.zoom-dropdown-menu.is-horizontal .zoom-dropdown-item{padding:0}
.zoom-dropdown-menu.is-horizontal .zoom-dropdown-item:hover{background-color:transparent}
.zoom-dropdown-item{position:relative;display:flex;align-items:center;min-height:28px;padding:6px 8px;border-radius:8px;color:var(--zoom-color-text-stronger-neutral);outline-offset:2px;white-space:nowrap;cursor:pointer;font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-dropdown-item:focus{outline:none}
.zoom-dropdown-item:hover{background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-dropdown-item:active{background-color:var(--zoom-color-state-subtle-neutral-press)}
.zoom-dropdown-item__icon{margin-right:8px}
.zoom-dropdown-item.is-disabled{color:var(--zoom-color-state-disable);cursor:not-allowed}
.zoom-dropdown-item.is-disabled:active,.zoom-dropdown-item.is-disabled:hover{background-color:transparent}
.zoom-dropdown-item.is-disabled.is-danger{color:var(--zoom-color-state-subtle-error-disable)}
.zoom-dropdown-item.is-danger{color:var(--zoom-color-text-error)}
.zoom-dropdown-item-group{padding:8px;border-radius:8px;color:var(--zoom-color-text-neutral);outline-offset:2px;font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-dropdown-item-group:focus{outline:none}
.zoom-dropdown-item-group:not(:first-of-type){position:relative;margin-top:8px;padding-top:16px}
.zoom-dropdown-item-group:not(:first-of-type):after{content:"";position:absolute;top:0;right:8px;left:8px;height:1px;background-color:var(--zoom-color-border-subtle-neutral)}
.zoom-dropdown-item-group.is-empty{padding-top:0;padding-bottom:8px}
.zoom-dropdown-item-group.is-empty:first-of-type{padding-bottom:0}
.zoom-message-box{position:relative;box-sizing:border-box;width:448px;margin:auto;padding:32px;border-radius:32px;background-color:var(--zoom-color-fill-default);box-shadow:0 12px 24px 0 var(--zoom-color-underlay-dropShadow),0 6px 12px 0 var(--zoom-color-underlay-dropShadow);font-size:16px}
.zoom-message-box__header{padding-bottom:24px}
.zoom-message-box__title{font-weight:600;font-weight:700;font-size:20px;line-height:24px}
.zoom-message-box__content,.zoom-message-box__title{color:var(--zoom-color-text-stronger-neutral);font-style:normal}
.zoom-message-box__content{position:relative;word-wrap:break-word;font-weight:400;font-size:14px;line-height:18px}
.zoom-message-box__footer{display:flex;gap:8px;align-items:center;padding-top:32px}
.zoom-message-box__btns{flex:1;text-align:right}
.zoom-message-box__btns button:nth-child(2){margin-left:8px}
.zoom-overlay-message-box{position:fixed;top:0;right:0;bottom:0;left:0;display:flex;overflow:auto}
```

### B.13 zoom-ui banner / badge / tag / avatar / skeleton / scrollbar / spinners / loading / link / divider

Source: `chunk-zoom-ui.be6b3ccd.css` [M]

```css
.zoom-spinners{position:relative;display:inline-block}
.zoom-spinners.is-lg{width:48px;height:48px}
.zoom-spinners.is-lg .zoom-spinners__spinner{width:6px;border-radius:6px}
.zoom-spinners.is-lg .zoom-spinners__circle{width:48px;height:48px}
.zoom-spinners.is-md{width:32px;height:32px}
.zoom-spinners.is-md .zoom-spinners__spinner{width:4px;border-radius:4px}
.zoom-spinners.is-md .zoom-spinners__circle{width:32px;height:32px}
.zoom-spinners.is-smx{width:24px;height:24px}
.zoom-spinners.is-smx .zoom-spinners__spinner{width:3px;border-radius:3px}
.zoom-spinners.is-smx .zoom-spinners__circle{width:24px;height:24px}
.zoom-spinners.is-sm{width:16px;height:16px}
.zoom-spinners.is-sm .zoom-spinners__spinner{width:2px;border-radius:2px}
.zoom-spinners.is-sm .zoom-spinners__circle{width:16px;height:16px}
.zoom-spinners__spinner{position:absolute;top:38%;left:46%;width:4px;height:25%;border-radius:4px;background-color:var(--zoom-color-fill-contrary-strong-transparent);animation:spinner-fade .8s linear infinite}
.zoom-spinners__spinner:first-child{animation-delay:-.3s}
.zoom-spinners__spinner:nth-child(2){animation-delay:-.2s}
.zoom-spinners__spinner:nth-child(3){animation-delay:-.1s}
.zoom-spinners__spinner:nth-child(4){animation-delay:0s}
.zoom-spinners__spinner:nth-child(5){animation-delay:-.7s}
.zoom-spinners__spinner:nth-child(6){animation-delay:-.6s}
.zoom-spinners__spinner:nth-child(7){animation-delay:-.5s}
.zoom-spinners__spinner:nth-child(8){animation-delay:-.4s}
.zoom-spinners__spinner.is-light{background-color:hsla(0,0%,100%,.48)}
.zoom-spinners__spinner.is-dark{background-color:rgba(0,0,0,.56)}
.zoom-spinners__spinner:first-child{transform:rotate(-135deg) translateY(-120%)}
.zoom-spinners__spinner:nth-child(2){transform:rotate(-90deg) translateY(-120%)}
.zoom-spinners__spinner:nth-child(3){transform:rotate(-45deg) translateY(-120%)}
.zoom-spinners__spinner:nth-child(4){transform:rotate(0deg) translateY(-120%)}
.zoom-spinners__spinner:nth-child(5){transform:rotate(45deg) translateY(-120%)}
.zoom-spinners__spinner:nth-child(6){transform:rotate(90deg) translateY(-120%)}
.zoom-spinners__spinner:nth-child(7){transform:rotate(135deg) translateY(-120%)}
.zoom-spinners__spinner:nth-child(8){transform:rotate(180deg) translateY(-120%)}
.zoom-spinners__circle{color:#0d6bde;animation:loading-circle 1s linear infinite}
.zoom-loading-parent--relative{position:relative!important}
.zoom-loading-parent--hidden{overflow:hidden!important}
.zoom-loading{position:absolute;top:0;right:0;bottom:0;left:0;z-index:100;margin:0;background-color:var(--zoom-color-underlay-default);transition:opacity .3s}
.zoom-loading.is-fullscreen{position:fixed;z-index:9999}
.zoom-loading.is-inlined-in-button{top:-1px;left:-1px;width:calc(100% + 2px);height:calc(100% + 2px);border-radius:8px}
.zoom-loading.is-no-background{background-color:transparent}
.zoom-loading__text{margin-top:8px;color:var(--zoom-color-text-stronger-neutral);font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-loading__text.is-lg{font-weight:400;font-style:normal;font-size:14px;line-height:18px}
.zoom-loading__main{position:absolute;top:50%;left:0;display:inline-flex;flex-direction:column;align-items:center;width:100%;text-align:center;transform:translateY(-50%)}
.zoom-loading__wrapper{display:flex;flex-direction:column;justify-content:center;align-items:center}
.zoom-loading__wrapper.is-active{padding:16px;border-radius:16px;background-color:var(--zoom-color-fill-elevated-default);backdrop-filter:blur(15px)}
.zoom-loading-fade-enter-from,.zoom-loading-fade-leave-to{opacity:0}
.zoom-scrollbar{position:relative;overflow:hidden;height:100%}
.zoom-scrollbar.is-hovering>.zoom-scrollbar__track,.zoom-scrollbar:active:not(.is-scrolling-show)>.zoom-scrollbar__track,.zoom-scrollbar:focus:not(.is-scrolling-show)>.zoom-scrollbar__track,.zoom-scrollbar:hover:not(.is-scrolling-show)>.zoom-scrollbar__track{opacity:1;transition:opacity .3s ease-out}
.zoom-scrollbar.is-scrolling-show>.zoom-scrollbar__track:not(.is-scrolling) .zoom-scrollbar__thumb{cursor:auto}
.zoom-scrollbar__wrap{overflow:auto;height:100%;outline-offset:-2px}
.zoom-scrollbar__wrap--hidden{scrollbar-width:none}
.zoom-scrollbar__wrap--hidden::-webkit-scrollbar{display:none}
.zoom-scrollbar__thumb{position:relative;display:block;width:0;height:0;border-radius:inherit;cursor:pointer;transition:background-color .3s}
.zoom-scrollbar__thumb,.zoom-scrollbar__thumb:hover{background-color:var(--zoom-color-fill-contrary-transparent)}
.zoom-scrollbar__thumb:after{content:"";position:absolute;top:0;left:50%;width:calc(100% + 12px);height:100%;transform:translateX(-50%)}
.zoom-scrollbar__thumb.is-dragging{background-color:var(--zoom-color-fill-contrary-strong-transparent)}
.zoom-scrollbar__thumb.is-horizontal:after{content:"";position:absolute;top:50%;left:0;width:100%;height:calc(100% + 12px);transform:translateY(-50%)}
.zoom-scrollbar__track{position:absolute;right:0;bottom:0;z-index:10;border-radius:6px;opacity:0;transition:opacity .3s ease-out}
.zoom-scrollbar__track.is-always,.zoom-scrollbar__track.is-scrolling{opacity:1}
.zoom-scrollbar__track.is-zero{pointer-events:none}
.zoom-scrollbar__track.is-vertical{top:2px;width:6px}
.zoom-scrollbar__track.is-vertical .zoom-scrollbar__thumb{width:6px}
.zoom-scrollbar__track.is-horizontal{left:2px;height:6px}
.zoom-scrollbar__track.is-horizontal .zoom-scrollbar__thumb{height:6px}
.zoom-avatar{display:inline-block;box-sizing:border-box;width:24px;height:24px;color:var(--zoom-color-inverse-global-default);font-weight:600;font-size:10px;line-height:24px;text-align:center}
.zoom-avatar .zoom-icon{background-color:var(--zoom-color-fill-subtle-neutral);color:var(--zoom-color-text-neutral)}
.zoom-avatar.is-interactive{outline-offset:2px}
.zoom-avatar__inner{display:inline-block;overflow:hidden;width:100%;height:100%;border-radius:999px}
.zoom-avatar__inner img{display:block;height:100%}
.zoom-avatar__inner.is-interactive{position:relative;cursor:pointer}
.zoom-avatar__inner.is-interactive:hover:after{content:"";position:absolute;top:0;left:0;z-index:1;width:100%;height:100%;background-color:var(--zoom-color-state-hover)}
.zoom-avatar__inner.is-interactive:active:after{content:"";position:absolute;top:0;left:0;z-index:1;width:100%;height:100%;background-color:var(--zoom-color-state-press)}
.zoom-avatar__inner.is-interactive.is-disabled{cursor:not-allowed}
.zoom-avatar__inner.is-interactive.is-disabled:after{content:"";position:absolute;top:0;left:0;width:100%;height:100%;background-color:var(--zoom-color-state-inactive)}
.zoom-avatar__inner.is-interactive.is-disabled:active:after,.zoom-avatar__inner.is-interactive.is-disabled:hover:after{background-color:var(--zoom-color-state-inactive)}
.zoom-avatar.is-status{position:relative}
.zoom-avatar--green.is-status .zoom-avatar__inner,.zoom-avatar--green:not(.is-status){background-color:var(--zoom-color-fill-global-success)}
.zoom-avatar--purple.is-status .zoom-avatar__inner,.zoom-avatar--purple:not(.is-status){background-color:var(--zoom-color-fill-global-supplementary1)}
.zoom-avatar--teal.is-status .zoom-avatar__inner,.zoom-avatar--teal:not(.is-status){background-color:var(--zoom-color-fill-global-supplementary2)}
.zoom-avatar--steel.is-status .zoom-avatar__inner,.zoom-avatar--steel:not(.is-status){background-color:var(--zoom-color-fill-global-supplementary3)}
.zoom-avatar--gray.is-status .zoom-avatar__inner,.zoom-avatar--gray:not(.is-status){background-color:var(--zoom-color-fill-global-neutral)}
.zoom-avatar--orange.is-status .zoom-avatar__inner,.zoom-avatar--orange:not(.is-status){background-color:var(--zoom-color-fill-global-complementary)}
.zoom-avatar--yellow.is-status .zoom-avatar__inner,.zoom-avatar--yellow:not(.is-status){background-color:var(--zoom-color-fill-global-warning)}
.zoom-avatar--red.is-status .zoom-avatar__inner,.zoom-avatar--red:not(.is-status){background-color:var(--zoom-color-fill-global-error)}
.zoom-avatar--lg{width:40px;height:40px;border-radius:999px;font-size:16px;line-height:40px}
.zoom-avatar--lg.zoom-icon{width:40px;height:40px;font-size:20px}
.zoom-avatar--lg.is-maximum{width:56px}
.zoom-avatar--lg .zoom-avatar__inner{border-radius:999px}
.zoom-avatar--md{width:32px;height:32px;border-radius:999px;font-size:14px;line-height:32px}
.zoom-avatar--md.zoom-icon{width:32px;height:32px;font-size:18px}
.zoom-avatar--md.is-maximum{width:48px}
.zoom-avatar--md .zoom-avatar__inner{border-radius:999px}
.zoom-avatar--sm{width:24px;height:24px;border-radius:999px;font-size:10px;line-height:24px}
.zoom-avatar--sm.zoom-icon{width:24px;height:24px;font-size:14px}
.zoom-avatar--sm.is-maximum{width:40px}
.zoom-avatar--sm .zoom-avatar__inner{border-radius:999px}
.zoom-avatar--xs{width:20px;height:20px;border-radius:999px;font-size:8px;line-height:20px}
.zoom-avatar--xs.zoom-icon{width:20px;height:20px;font-size:12px}
.zoom-avatar--xs.is-maximum{width:32px}
.zoom-avatar--xs .zoom-avatar__inner{border-radius:999px}
.zoom-avatar__status-icon{position:absolute}
.zoom-avatar__status-icon.is-meeting svg{width:100%;height:100%}
.zoom-link{display:inline-flex;align-items:center;padding:0;border-radius:4px;color:var(--zoom-color-text-primary);outline-offset:2px;text-decoration:none}
.zoom-link .zoom-link__arrow{margin-left:4px;color:var(--zoom-color-text-primary);font-size:14px}
.zoom-link:hover{text-decoration:underline}
.zoom-link:hover,.zoom-link:hover .zoom-link__arrow{color:var(--zoom-color-state-primary-hover)}
.zoom-link:active{text-decoration:underline}
.zoom-link:active,.zoom-link:active .zoom-link__arrow{color:var(--zoom-color-state-primary-press)}
.zoom-link--sm{font-weight:400;font-style:normal;font-size:12px;line-height:16px}
.zoom-link--sm .zoom-link__arrow{font-size:12px}
.zoom-link--md{font-size:14px;line-height:18px}
.zoom-link--lg,.zoom-link--md{font-weight:400;font-style:normal}
.zoom-link--lg{font-size:16px;line-height:20px}
.zoom-link--lg .zoom-link__arrow{font-size:16px}
.zoom-link.is-disabled{cursor:not-allowed}
.zoom-link.is-disabled,.zoom-link.is-disabled .zoom-link__arrow{color:var(--zoom-color-state-disable)}
.zoom-link__wrapper{line-height:1}
.zoom-link__wrapper .zoom-link{display:flex;align-items:center}
.zoom-divider{background-color:var(--zoom-color-border-subtle-neutral)}
.zoom-divider.is-horizontal{width:100%;height:1px}
.zoom-divider--balanced.is-horizontal{width:calc(100% - 32px);margin-right:16px;margin-left:16px}
.zoom-divider--indent.is-horizontal{width:calc(100% - 32px);margin-right:0;margin-left:32px}
.zoom-divider--indent-balanced.is-horizontal{width:calc(100% - 48px);margin-right:16px;margin-left:32px}
.zoom-divider.is-vertical{display:inline-block;width:1px;height:100%}
.zoom-tag{display:inline-flex;align-items:center;box-sizing:border-box;min-height:20px;padding:2px 6px;border-radius:5px;background-color:var(--zoom-color-fill-subtler-neutral);outline-offset:2px}
.zoom-tag+.zoom-tag{margin-left:6px}
.zoom-tag.is-closable{padding-right:2px}
.zoom-tag.is-avatar{padding-left:2px}
.zoom-tag--sm{min-height:16px;padding-top:0;padding-right:4px;padding-bottom:0;padding-left:4px;border-radius:4px}
.zoom-tag--lg{min-height:24px;border-radius:6px}
.zoom-tag--lg.is-closable{padding-right:4px}
.zoom-tag--lg .zoom-tag__avatar.zoom-avatar{width:20px!important;height:20px!important;line-height:20px!important}
.zoom-tag--info{color:var(--zoom-color-text-stronger-neutral)}
.zoom-tag--danger{border:1px solid var(--zoom-color-border-error);color:var(--zoom-color-text-error)}
.zoom-tag.is-disabled{background-color:var(--zoom-color-state-subtle-disable);color:var(--zoom-color-state-disable)}
.zoom-tag.is-disabled .zoom-tag__close{cursor:not-allowed}
.zoom-tag__close{outline-offset:2px}
.zoom-tag__close.zoom-icon{margin-left:4px;border-radius:0;border-radius:4px;outline:none;font-size:16px;cursor:pointer}
.zoom-tag__close.zoom-icon:hover:not(.is-disabled){background-color:var(--zoom-color-state-subtle-neutral-hover)}
.zoom-tag__close.zoom-icon:active:not(.is-disabled){background-color:var(--zoom-color-state-subtle-neutral-press)}
.zoom-tag__label{flex:1 1 auto;max-width:144px;font-weight:400;font-style:normal;font-size:12px;line-height:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.zoom-tag__avatar{margin-right:4px}
.zoom-tag__avatar.zoom-avatar{width:16px!important;height:16px!important;line-height:16px!important}
.zoom-badge{display:inline-flex;align-items:center;text-align:center;font-weight:600;font-style:normal;font-size:8px;line-height:12px}
.zoom-badge.zoom-badge--cutout{box-sizing:content-box;border:1.5px solid var(--zoom-color-bg-default)}
.zoom-badge.is-uppercase{text-transform:uppercase}
.zoom-badge__wrapper{position:relative;display:inline-block;line-height:1}
.zoom-badge--top-right{position:absolute;top:0;right:0;transform:translate(50%,-50%);transform-origin:100%}
.zoom-badge__notifier{width:8px;height:8px;border-radius:100%;background-color:var(--zoom-color-component-badge-background-alert)}
.zoom-badge__notifier.zoom-badge--top-right{transform:translate(30%,-30%)}
.zoom-badge__notifier.zoom-badge__xs{width:6px;height:6px}
.zoom-badge__notifier.zoom-badge__md{width:12px;height:12px}
.zoom-badge__notifier.zoom-badge__lg{width:16px;height:16px}
.zoom-badge__notifier.zoom-badge__xl{width:18px;height:18px}
.zoom-badge__notifier.is-blue{background-color:var(--zoom-color-component-badge-background-default)}
.zoom-badge__notifier.is-inverse{background-color:#fff}
.zoom-badge__counter{padding:2px 4px;border-radius:9999px;background-color:var(--zoom-color-component-badge-background-alert);color:var(--zoom-color-component-badge-text-alert);font-weight:600}
.zoom-badge__counter.zoom-badge__sm{padding:1px 3px}
.zoom-badge__counter.is-blue{background-color:var(--zoom-color-component-badge-background-default);color:var(--zoom-color-component-badge-text-default)}
.zoom-badge__counter.is-grey{background-color:var(--zoom-color-fill-subtle-neutral);color:var(--zoom-color-text-neutral)}
.zoom-badge__counter.is-inverse{background-color:#fff;color:#0d6bde}
.zoom-badge__counter.is-round-counter{justify-content:center;width:16px;height:16px;padding:0;line-height:16px}
.zoom-badge__counter.is-round-counter.zoom-badge__sm{width:14px;height:14px;line-height:14px}
.zoom-badge__custom{gap:4px;max-height:16px;padding:0 4px;border:1px solid transparent;border-radius:999px;font-weight:600;font-weight:500;font-style:normal;font-size:10px;line-height:16px}
.zoom-badge__custom.zoom-badge__sm{padding:1px 4px;font-weight:600;font-style:normal;font-size:8px;line-height:12px}
.zoom-badge__custom.is-blue{border-color:var(--zoom-color-border-subtle-informative);background-color:var(--zoom-color-fill-subtler-informative);color:var(--zoom-color-text-strong-informative)}
.zoom-badge__custom.is-gray{border-color:var(--zoom-color-border-subtle-neutral);background-color:var(--zoom-color-fill-subtler-neutral);color:var(--zoom-color-text-strong-neutral)}
.zoom-badge__custom.is-green{border-color:var(--zoom-color-border-subtle-success);background-color:var(--zoom-color-fill-subtler-success);color:var(--zoom-color-text-strong-success)}
.zoom-badge__custom.is-orange{border-color:var(--zoom-color-border-subtle-complementary);background-color:var(--zoom-color-fill-subtler-complementary);color:var(--zoom-color-text-strong-complementary)}
.zoom-badge__custom.is-yellow{border-color:var(--zoom-color-border-subtle-warning);background-color:var(--zoom-color-fill-subtler-warning);color:var(--zoom-color-text-strong-warning)}
.zoom-badge__custom.is-red{border-color:var(--zoom-color-border-subtle-error);background-color:var(--zoom-color-fill-subtler-error);color:var(--zoom-color-text-strong-error)}
.zoom-badge__custom.is-purple{border-color:var(--zoom-color-border-subtle-supplementary1);background-color:var(--zoom-color-fill-subtler-supplementary1);color:var(--zoom-color-text-strong-supplementary1)}
.zoom-badge__custom.is-cyan{border-color:var(--zoom-color-border-subtle-supplementary2);background-color:var(--zoom-color-fill-subtler-supplementary2);color:var(--zoom-color-text-strong-supplementary2)}
.zoom-badge__custom.is-inverse{border-color:#fff;background-color:transparent;color:#f7f9fa}
.zoom-skeleton__item{width:100%;height:20px;border-radius:4px;background-color:var(--zoom-color-fill-contrary-subtler-transparent)}
.zoom-skeleton__item.is-has-space{margin-top:8px}
.zoom-skeleton__circle{width:60px;height:60px;border-radius:100%}
.zoom-skeleton__button{width:60px;height:32px;border-radius:8px}
.zoom-skeleton__text.is-last{width:66%}
.zoom-skeleton__image{display:flex;justify-content:center;align-items:center;width:unset}
.zoom-skeleton__image svg{width:22%;height:22%;fill:var(--zoom-color-skeleton-image)}
.zoom-skeleton{width:100%}
.zoom-skeleton.is-animated .zoom-skeleton__item{animation:skeleton-pulse 1.5s ease-in-out infinite}
.zoom-status-icon{font-size:20px}
.zoom-status-icon--success{color:var(--zoom-color-icon-success)}
.zoom-status-icon--danger{color:var(--zoom-color-icon-error)}
.zoom-status-icon--warning{color:var(--zoom-color-fill-warning)}
.zoom-status-icon--info{color:var(--zoom-color-icon-primary)}
.zoom-banner{position:relative;box-sizing:border-box;padding:16px;border:1px solid var(--zoom-color-border-subtle-primary);border-radius:12px;background-color:var(--zoom-color-fill-subtler-primary);color:var(--zoom-color-text-stronger-neutral);opacity:1;transition:opacity .3s}
.zoom-banner .zoom-button.zoom-banner--closable{position:absolute;top:13px;right:13px}
.zoom-banner.is-closable{padding-right:47px}
.zoom-banner.is-bleed{border:none;border-bottom:1px solid var(--zoom-color-border-subtle-primary);border-radius:0}
.zoom-banner.is-bleed.zoom-banner--success{border-bottom-color:var(--zoom-color-border-subtle-success)}
.zoom-banner.is-bleed.zoom-banner--info{border-bottom-color:var(--zoom-color-border-subtle-primary)}
.zoom-banner.is-bleed.zoom-banner--warning{border-bottom-color:var(--zoom-color-border-subtle-warning)}
.zoom-banner.is-bleed.zoom-banner--danger{border-bottom-color:var(--zoom-color-border-subtle-error)}
.zoom-banner.is-bleed .zoom-button.zoom-banner--closable{top:14px;right:14px}
.zoom-banner__main{display:flex;align-items:center;margin:0}
.zoom-banner--success{border:1px solid var(--zoom-color-border-subtle-success);background-color:var(--zoom-color-fill-subtler-success);background-image:linear-gradient(var(--zoom-color-component-banner-transparent-layer-success))}
.zoom-banner--info{border:1px solid var(--zoom-color-border-subtle-primary);background-color:var(--zoom-color-fill-subtler-primary);background-image:linear-gradient(var(--zoom-color-component-banner-transparent-layer-info))}
.zoom-banner--warning{border:1px solid var(--zoom-color-border-subtle-warning);background-color:var(--zoom-color-fill-subtler-warning);background-image:linear-gradient(var(--zoom-color-component-banner-transparent-layer-warning))}
.zoom-banner--danger{border:1px solid var(--zoom-color-border-subtle-error);background-color:var(--zoom-color-fill-subtler-error);background-image:linear-gradient(var(--zoom-color-component-banner-transparent-layer-error))}
.zoom-banner__icon{align-self:self-start}
.zoom-banner__body{flex:1;margin-right:8px;margin-left:12px}
.zoom-banner__title{font-weight:600}
.zoom-banner__content,.zoom-banner__title{font-style:normal;font-size:14px;line-height:18px}
.zoom-banner__content{font-weight:400}
.zoom-banner__content.is-gapped{margin-top:4px}
.zoom-banner__actionable{align-self:self-start;line-height:1;text-align:right}
.zoom-banner__actionable.is-closable{margin-right:8px}
.zoom-banner__actionable-bottom{margin-top:8px;line-height:1}
.zoom-banner-fade-enter-from,.zoom-banner-fade-leave-active{opacity:0}
```

### B.14 common-header (Workplace header) overrides that differ from zoom-ui

Source: `main-chunk-other.css` [M]

```css
.common-header-floating.is-tooltip{-webkit-backdrop-filter:blur(15px);backdrop-filter:blur(15px);background-color:var(--zoom-color-state-contrary-strong-transparent-hover);border:none;border-radius:4px;box-shadow:0 4px 8px 0 var(--zoom-color-underlay-dropShadow),0 2px 4px 0 var(--zoom-color-underlay-dropShadow);color:var(--zoom-color-inverse-default)}
.common-header-profile__item{border-radius:8px;outline-offset:2px;position:relative}
.common-header-profile__item:focus-visible{outline:none}
.common-header-profile__item.is-separator:not(:first-of-type) .common-header-profile__item-content{border-top:1px solid var(--zoom-color-border-subtle-neutral);margin-top:8px;padding-top:16px}
.common-header-profile__item.is-separator.is-empty:first-of-type .common-header-profile__item-content{border-top:none;margin-top:0;padding-top:8px}
.common-header-profile__item.is-separator.is-empty .common-header-profile__item-content{margin:8px 8px 0;padding:16px 0 0}
.common-header-profile__item.is-separator.is-empty .common-header-profile__item-label{color:var(--zoom-color-text-neutral);font-size:12px;font-weight:400;line-height:16px;padding-bottom:8px}
.common-header-profile__item.is-separator.is-empty .common-header-profile__item-label:empty{padding:0}
.common-header-profile__item.is-separator.is-separator-empty .common-header-profile__item-content{height:0;padding:8px 0 0}
.common-header-profile__item.is-separator .common-header-profile__item-content{border-radius:unset;cursor:default;padding:8px}
.common-header-profile__item.is-separator .common-header-profile__item-content:active,.common-header-profile__item.is-separator .common-header-profile__item-content:hover{background-color:initial}
.common-header-profile__item.is-danger>.common-header-profile__item-content{color:var(--zoom-color-text-error)}
.common-header-profile__item.is-active>.common-header-profile__item-content{background-color:var(--zoom-color-state-subtle-neutral-hover)}
.common-header-profile__item.is-disabled .common-header-profile__item-content{color:var(--zoom-color-state-disable);cursor:not-allowed}
.common-header-profile__item.is-disabled .common-header-profile__item-content:active,.common-header-profile__item.is-disabled .common-header-profile__item-content:hover{background-color:initial}
.common-header-profile__item.is-disabled.is-danger .common-header-profile__item-content{color:var(--zoom-color-state-subtle-error-disable)}
.common-header-profile__item-content{align-items:center;border-radius:8px;color:var(--zoom-color-text-stronger-neutral);cursor:pointer;display:flex;font-size:14px;font-weight:400;line-height:18px;padding:7px 8px;white-space:nowrap}
.common-header-profile__item-content:focus{outline:none}
.common-header-profile__item-content:hover{background-color:var(--zoom-color-state-subtle-neutral-hover)}
.common-header-profile__item-content:active{background-color:var(--zoom-color-state-subtle-neutral-press)}
.common-header-profile__item-icon{font-size:16px;margin-right:8px}
.common-header-profile__item-icon .svg-icon-wrapper{display:contents}
.common-header-profile__item-label{flex:1 1}
.common-header-profile__item-badge{color:var(--zoom-color-text-neutral,#686f79);font-size:14px;margin-left:auto}
.common-header-profile__item-badge+.common-header-profile__submenu-icon{margin-left:8px}
.common-header-profile__item-status{color:var(--zoom-text-text-neutral,#686f79);margin-right:4px}
.common-header-profile__item-status--error{color:var(--zoom-color-text-error,#da1639)}
.common-header-profile__item-status--warning{color:var(--zoom-color-text-warning,#b36200)}
.common-header-profile__item-label+.common-header-profile__item-status{margin-left:auto}
.common-header-profile__item-label+.common-header-profile__item-status+.common-header-profile__submenu-icon{margin-left:0}
.common-header-profile__item-content:hover:has(.common-header-profile__loading-indicator){background-color:initial;cursor:default}
.common-header-profile__item-content:hover:has(.common-header-profile__upgrade-banner){background-color:initial;cursor:default}
.common-header-profile__item-content:hover .common-header-profile__target-icon{opacity:1}
.common-header-profile__item-content:has(#common-header-profile-item-download){margin-top:8px;padding:0}
.common-header-avatar,.common-header-avatar .common-header-avatar__inner{border-radius:10px}
.common-header-profile__avatar{border-radius:10px;display:flex}
.common-header-profile__avatar .common-header-avatar__inner{border-radius:10px}
.common-header-banner{background-color:var(--zoom-color-fill-subtler-primary);border:1px solid var(--zoom-color-border-subtle-primary);border-radius:12px;box-sizing:border-box;color:var(--zoom-color-text-stronger-neutral);opacity:1;padding:16px;position:relative;transition:opacity .3s}
.common-header-banner .common-header-button.common-header-banner--closable{position:absolute;right:13px;top:13px}
.common-header-banner.is-closable{padding-right:47px}
.common-header-banner.is-bleed{border:none;border-bottom:1px solid var(--zoom-color-border-subtle-primary);border-radius:0}
.common-header-banner.is-bleed.common-header-banner--success{border-bottom-color:var(--zoom-color-border-subtle-success)}
.common-header-banner.is-bleed.common-header-banner--info{border-bottom-color:var(--zoom-color-border-subtle-primary)}
.common-header-banner.is-bleed.common-header-banner--warning{border-bottom-color:var(--zoom-color-border-subtle-warning)}
.common-header-banner.is-bleed.common-header-banner--danger{border-bottom-color:var(--zoom-color-border-subtle-error)}
.common-header-banner.is-bleed .common-header-button.common-header-banner--closable{right:14px;top:14px}
.common-header-banner--success{background-color:var(--zoom-color-fill-subtler-success);background-image:linear-gradient(var(--zoom-color-component-banner-transparent-layer-success));border:1px solid var(--zoom-color-border-subtle-success)}
.common-header-banner--info{background-color:var(--zoom-color-fill-subtler-primary);background-image:linear-gradient(var(--zoom-color-component-banner-transparent-layer-info));border:1px solid var(--zoom-color-border-subtle-primary)}
.common-header-banner--warning{background-color:var(--zoom-color-fill-subtler-warning);background-image:linear-gradient(var(--zoom-color-component-banner-transparent-layer-warning));border:1px solid var(--zoom-color-border-subtle-warning)}
.common-header-banner--danger{background-color:var(--zoom-color-fill-subtler-error);background-image:linear-gradient(var(--zoom-color-component-banner-transparent-layer-error));border:1px solid var(--zoom-color-border-subtle-error)}
.common-header-banner-fade-enter-from,.common-header-banner-fade-leave-active{opacity:0}
```

### B.15 Toast (react-toastify + Zoom PWA overrides)

Source: `inline <style> (react-toastify overrides)` [M]

```css
.Toastify__toast-body{padding: 2px;}
.Toastify__toast{border: 1px solid rgb(193, 198, 206); box-sizing: border-box; box-shadow: rgba(19, 22, 25, 0.2) 0px 24px 48px, rgba(19, 22, 25, 0.1) 0px 12px 24px; backdrop-filter: blur(10px); border-radius: 10px; min-height: 40px; animation-duration: 10ms !important;}
.Toastify__toast.popup-action__bottom .Toastify__close-button{align-self: flex-start;}
.Toastify__toast.zm-toast--display-none{display: none;}
.zm__toast-container{display: flex;}
.zm__toast-icon{padding: 0px 15px 0px 6px; display: flex; align-items: center; font-size: 24px;}
.zm__toast-title{font-weight: bold; color: rgb(19, 22, 25); margin-bottom: 4px;}
.zm__toast-content{display: flex; font-size: 14px; line-height: 20px; flex-direction: column; justify-content: center; flex-grow: 1;}
.zm__toast-desc{color: rgb(19, 22, 25); margin-bottom: 4px;}
.zm__toast-desc--no-bottom{margin-bottom: 0px;}
.zm-toast--visibility-hidden{position: absolute; opacity: 0; width: 0px; visibility: hidden; height: 0px;}
.zm-toast--visibility-hidden .Toastify__progress-bar{animation-play-state: paused !important;}
.zm__toast-main-container .hideMe{position: absolute; opacity: 0; visibility: hidden; width: 0px; height: 0px;}
.zm__toast-main-container .hideMe .Toastify__progress-bar{animation-play-state: paused !important;}
.zm__toast-icon-type{display: flex;}
.zm__toast-icon-type.icon-type__success{color: rgb(38, 133, 67);}
.zm__toast-icon-type.icon-type__info{color: rgb(14, 114, 237);}
.zm__toast-icon-type.icon-type__warn{color: rgb(179, 98, 0);}
.zm__toast-icon-type.icon-type__failure{color: rgb(232, 23, 61);}
.Toastify__close-button{margin-right: 8px; align-self: center; color: rgb(19, 22, 25); opacity: 1;}
.Toastify__close-button > svg{height: 14px; width: 14px;}
.Toastify__close-button > svg:hover{opacity: 0.8;}
.back-meetings{cursor: pointer; color: rgb(9, 86, 181); font-size: 14px; line-height: 20px;}
.back-meetings:hover{color: rgba(9, 86, 181, 0.8);}
.popup-actions__buttons{display: flex; justify-content: space-between; align-items: center; min-width: 128px; margin-right: 20px;}
.popup-actions__buttons > button{flex-grow: 1;}
.popup-actions__buttons > button:last-of-type{margin-left: 8px;}
.popup-action__bottom .Toastify__close-button > svg{position: absolute; top: 11px; right: 21px;}
.popup-action__bottom .popup-actions__buttons{margin-right: 0px;}
.Toastify__toast-container{top: 50px;}
```

### B.16 emotion ui-Banner / ui-Dialog / ui-Popover / ui-Checkbox (nx-chat & MUI-based header widgets)

Source: `inline emotion sheet` [M]

```css
.css-jpz6at.ui-Popover-root-vl43kc5mtv{z-index: 1300;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv.ui-Popover-root-vl43kc5mtv-no-interaction{pointer-events: none;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv .ui-Popover-paper{width: 250px; max-width: 400px; padding: 12px; background: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.08) 0px 24px 48px 0px, rgba(0, 0, 0, 0.08) 0px 12px 24px 0px; border-style: solid; border-width: 1px; border-color: rgb(223, 227, 232); border-radius: 8px; position: relative; font-size: 16px;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv .ui-Popover-arrow{overflow: hidden; position: absolute; width: 1em; height: 0.71em; box-sizing: border-box; color: rgb(255, 255, 255);}
.css-jpz6at.ui-Popover-root-vl43kc5mtv .ui-Popover-arrow::before{content: ""; margin: auto; display: block; width: 100%; height: 100%; box-sizing: border-box; background-color: currentcolor; border-style: solid; border-width: 1px; border-color: rgb(223, 227, 232); transform: rotate(45deg);}
.css-jpz6at.ui-Popover-root-vl43kc5mtv[data-popper-placement*="bottom"] > .ui-Popover-paper > .ui-Popover-arrow{top: 0px; left: 0px; margin-top: -0.71em;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv[data-popper-placement*="bottom"] > .ui-Popover-paper > .ui-Popover-arrow::before{transform-origin: 0px 100%; border-top-left-radius: 3px;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv[data-popper-placement*="top"] > .ui-Popover-paper > .ui-Popover-arrow{bottom: 0px; left: 0px; margin-bottom: -0.71em;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv[data-popper-placement*="top"] > .ui-Popover-paper > .ui-Popover-arrow::before{transform-origin: 100% 0px; border-bottom-right-radius: 3px;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv[data-popper-placement*="right"] > .ui-Popover-paper > .ui-Popover-arrow{left: 0px; margin-inline-start: -0.71em; height: 1em; width: 0.71em;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv[data-popper-placement*="right"] > .ui-Popover-paper > .ui-Popover-arrow::before{transform-origin: 100% 100%; border-bottom-left-radius: 3px;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv[data-popper-placement*="left"] > .ui-Popover-paper > .ui-Popover-arrow{right: 0px; margin-inline-end: -0.71em; height: 1em; width: 0.71em;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv[data-popper-placement*="left"] > .ui-Popover-paper > .ui-Popover-arrow::before{transform-origin: 0px 0px; border-top-right-radius: 3px;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv .ui-Popover-title{display: flex; color: rgb(42, 43, 45); font-weight: 600; line-height: 20px; font-family:<ui stack>; font-size: 16px; margin-bottom: 4px;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv .ui-Popover-closeIcon{position: absolute; right: -6px; top: -6px;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv .ui-Popover-content{color: rgb(42, 43, 45); line-height: 20px; font-family:<ui stack>; font-weight: 400; font-size: 14px;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv .ui-Popover-footer{margin-top: 16px; display: flex; -webkit-box-pack: end; justify-content: flex-end; font-family:<ui stack>;}
.css-jpz6at.ui-Popover-root-vl43kc5mtv .ui-Popover-footer .ui-Popover-okButton{margin-inline-start: 8px;}
.css-1b6gc6n{position: absolute !important;}
.css-1b6gc6n.ui-Dialog-root-jdd2l0z5xeb{z-index: 1300;}
.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c > .ui-Dialog-paper-root{--dialog-margin: 32px; font-family:<ui stack>; box-sizing: border-box; width: 560px; max-width: none; margin: var(--dialog-margin); max-height: calc(100vh - var(--dialog-margin) * 2); border-radius: 12px; background: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.08) 0px 12px 24px 0px, rgba(0, 0, 0, 0.08) 0px 6px 12px 0px;}
.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-title-root{padding: 24px 24px 16px; color: rgb(42, 43, 45); min-height: 24px; line-height: 24px; font-size: 20px; font-weight: 600; position: relative; z-index: 1; background: rgb(255, 255, 255); box-shadow: rgb(223, 227, 232) 0px -1px inset;}
.ui-Dialog-scroll-at-top.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-title-root{background: transparent; box-shadow: none;}
.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-title-with-button{padding-right: 52px;}
.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-content-root{padding: 0px; flex: 1 1 0%; color: rgb(42, 43, 45); min-height: 20px; line-height: 20px; font-size: 14px; font-weight: 400; margin-bottom: -4px; overflow: hidden;}
.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-content-root.ui-Dialog-disabled-contentScrollView{overflow: auto;}
.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-content-root .ui-Dialog-content{padding: 24px 24px 4px;}
.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-content-root:last-child{margin-bottom: 0px;}
.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-content-root:last-child .ui-Dialog-content{padding-bottom: 24px;}
.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-title-root ~ .ui-Dialog-content-root{margin-top: -4px;}
.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-title-root ~ .ui-Dialog-content-root .ui-Dialog-content{padding-top: 4px;}
.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-footer-root{padding: 24px; z-index: 1; background: rgb(255, 255, 255); box-shadow: rgb(223, 227, 232) 0px 1px inset;}
.ui-Dialog-scroll-at-bottom.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-footer-root{background: transparent; box-shadow: none;}
.css-1b6gc6n .ui-Dialog-container-gvyx32y8h1c .ui-Dialog-closeIcon{position: absolute; right: 24px; top: 24px; z-index: 2;}
.css-1b6gc6n .ui-Dialog-backdrop-q33i4x22aii{background: rgba(0, 0, 0, 0.2);}
.css-ytingd.ui-Banner-root-agj5x1p2vfb{font-family:<ui stack>; display: flex; box-sizing: border-box; min-height: 52px; padding: 16px; background: rgb(255, 255, 255); line-height: 1; font-size: 18px; position: relative; border-width: medium; border-style: none; border-color: currentcolor; border-image: none; border-radius: 0px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-inline{border-radius: 8px; padding: 8px; min-height: 36px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-inline .ui-Banner-content{line-height: 18px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-inline .ui-Banner-close-wrapper{position: absolute; right: 6px; top: 6px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-bordered{border: 1px solid;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-info{background: rgb(242, 248, 255); border-color: rgb(75, 150, 241);}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-success{background: rgb(242, 255, 246); border-color: rgb(72, 173, 103);}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-warn, .css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-warning{background: rgb(255, 249, 242); border-color: rgb(194, 128, 48);}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-error{background: rgb(255, 242, 245); border-color: rgb(255, 102, 130);}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-no-icon .ui-Banner-icon-wrapper{display: none;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-icon-wrapper{padding-top: 0px; padding-bottom: 0px; width: 20px; opacity: 1; margin-inline-end: 8px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-icon{display: inline-flex; font-size: 20px; width: 20px; height: 20px; box-sizing: border-box; place-content: center; -webkit-box-pack: center;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-icon svg{display: inline-flex;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-icon.ui-Banner-icon-info{color: rgb(59, 144, 247);}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-icon.ui-Banner-icon-success{color: rgb(9, 166, 57);}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-icon.ui-Banner-icon-warn{font-size: 20px; color: rgb(255, 215, 0);}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-icon.ui-Banner-icon-error{color: rgb(255, 38, 56);}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-message{font-size: 14px; color: rgb(42, 43, 45); line-height: 20px; width: 100%; min-height: 20px; margin: 0px; font-weight: 400; text-align: left; box-sizing: border-box; overflow: visible; padding: 0px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-title{font-family:<ui stack>; font-size: 16px; color: rgb(42, 43, 45); font-weight: 600; margin-top: 0px; margin-bottom: 2px; line-height: 20px; box-sizing: border-box; padding-right: 0px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-content{font-size: 14px; color: rgb(42, 43, 45); line-height: 20px; width: 100%; margin: 0px; font-weight: 400; text-align: left; box-sizing: border-box; padding-right: 0px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-action-btn-group{margin-top: 8px; text-align: right;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-action-btn-group .ui-Banner-action-btn{margin-inline-start: 8px; min-width: 68px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-action-btn-group .ui-Banner-action-btn:first-of-type{margin-inline-start: 0px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-close-wrapper{position: absolute; right: 12px; top: 14px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-close-btn{margin: 0px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb .ui-Banner-close-btn.ui-Button-iconButton.ui-Button-small svg{font-size: 12px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-middle .ui-Banner-icon-wrapper{display: flex; -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-middle .ui-Banner-message{display: flex; flex-direction: row;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-middle .ui-Banner-context{flex: 1 1 0%; display: flex; flex-direction: column; -webkit-box-pack: center; justify-content: center;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-middle .ui-Banner-title{padding-right: 0px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-middle .ui-Banner-content{padding-right: 0px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-middle .ui-Banner-close-wrapper{position: unset; right: unset; top: unset; display: flex; -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center; margin-inline-start: 4px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-middle .ui-Banner-action-btn-group{margin: 0px; display: flex; -webkit-box-align: center; align-items: center; padding-left: 20px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-middle .ui-Banner-action-btn{margin: 0px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-middle .ui-Banner-cancel-btn{display: none;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-closable .ui-Banner-title{padding-right: 20px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-closable .ui-Banner-content{padding-right: 20px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-closable.ui-Banner-middle .ui-Banner-title{padding-right: 0px;}
.css-ytingd.ui-Banner-root-agj5x1p2vfb.ui-Banner-closable.ui-Banner-middle .ui-Banner-content{padding-right: 0px;}
.css-1om8e3e.ui-Checkbox-root-kl4feg2p7jh{display: inline-flex; flex-direction: column;}
.css-1om8e3e.ui-Checkbox-root-kl4feg2p7jh .ui-Checkbox-title{display: inline-flex; -webkit-box-align: center; align-items: center; cursor: pointer; font-family:<ui stack>;}
.css-1om8e3e.ui-Checkbox-root-kl4feg2p7jh .ui-Checkbox-title:focus{outline: none;}
.css-1om8e3e.ui-Checkbox-root-kl4feg2p7jh .ui-Checkbox-base{padding: 2px; align-self: flex-start;}
.css-1om8e3e.ui-Checkbox-root-kl4feg2p7jh .ui-Checkbox-label{margin-inline-start: 6px; color: rgb(42, 43, 45); font-size: 14px; font-weight: 400; line-height: 20px;}
.css-1om8e3e.ui-Checkbox-root-kl4feg2p7jh .ui-Checkbox-description{margin-inline-start: 26px; margin-top: 4px; color: rgb(104, 111, 121); font-size: 14px; font-weight: 400; line-height: 20px;}
.css-1om8e3e.ui-Checkbox-root-kl4feg2p7jh .ui-Checkbox-description:empty{display: none;}
```

### B.17 zmu (meeting UI kit) switch / tabs / text-input / checkbox / notification

Source: `main-chunk-other.css` [M]

```css
.zmu-checkbox{display:inline-block;position:relative}
.zmu-checkbox:focus{outline:2px solid #fff}
.zmu-checkbox__alternative-a11y-text{height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;clip:rect(0,0,0,0);border:0}
.zmu-checkbox--offset1{margin-right:30px}
.zmu-checkbox__input{display:inline-block;height:0;margin:0;opacity:0;width:0}
.zmu-checkbox__input:focus+.zmu-checkbox__label{outline:2px solid #0e71eb;outline-offset:1px}
.zmu-checkbox__icon{background:url(data:…)}
.zmu-checkbox__icon,.zmu-checkbox__icon--checked{display:inline-block;height:16px;vertical-align:middle;width:16px}
.zmu-checkbox__icon--checked{background:url(data:…)'%3E%3Cpath fill='%230E71EB' fill-rule='evenodd' d='M0 6.4c0-2.24 0-3.36.436-4.216A4 4 0 0 1 2.184.436C3.04 0 4.16 0 6.4 0h3.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C16 3.04 16 4.16 16 6.4v3.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C12.96 16 11.84 16 9.6 16H6.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C0 12.96 0 11.84 0 9.6z' clip-rule='evenodd'/%3E%3C/g%3E%3Cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.333' d='m12 5-5.5 6L4 8.273'/%3E%3Cdefs%3E%3Cfilter id='a' width='16' height='17' x='0' y='0' color-interpolation-filters='sRGB' filterUnits='userSpaceOnUse'%3E%3CfeFlood flood-opacit …
.zmu-checkbox__icon--disabled{background:url(data:…)' opacity='.5'%3E%3Cpath fill='%23747487' fill-rule='evenodd' d='M0 6.4c0-2.24 0-3.36.436-4.216A4 4 0 0 1 2.184.436C3.04 0 4.16 0 6.4 0h3.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C16 3.04 16 4.16 16 6.4v3.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C12.96 16 11.84 16 9.6 16H6.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C0 12.96 0 11.84 0 9.6z' clip-rule='evenodd'/%3E%3C/g%3E%3Cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.333' d='m12 5-5.5 6L4 8.273'/%3E%3Cdefs%3E%3Cfilter id='a' width='16' height='17' x='0' y='0' color-interpolation-filters='sRGB' filterUnits='userSpaceOnUse'%3E%3CfeFloo …
.zmu-checkbox__label{display:inline-block;font-size:14px;overflow-x:hidden;position:relative;text-overflow:ellipsis;-webkit-user-select:none;user-select:none;white-space:nowrap}
.zmu-checkbox__a11y-border{bottom:0;display:none;left:0;outline:2px solid #0000;outline-offset:2px;position:absolute;right:0;top:0;transition:all .2s ease-in}
.zmu-checkbox__label-text{margin-left:8px;vertical-align:middle}
.zmu-text-input{border:none;font-size:14px;font-style:normal;font-weight:400;height:24px;line-height:24px;padding:0;vertical-align:top;width:100%}
.zmu-text-input::selection{background:#e7f1fd}
.zmu-text-input__prefix{display:flex;margin-right:8px}
.zmu-text-input__suffix{display:flex;margin-left:8px}
.zmu-text-input__wrapper{border:1px solid #bababa;border-radius:10px;box-sizing:border-box;display:flex;height:40px;line-height:40px;padding:7px 12px}
.zmu-text-input__wrapper--focused{border:1px solid #0e71eb}
.zmu-text-input__clear{background-color:initial;border:0;cursor:pointer;padding:0;text-shadow:none}
.zmu-text-input__clear-icon{background:url(data:…);display:block;height:16px;pointer-events:none;width:16px}
.zmu-notification--color-success{background:#e4f7eb;color:#1c7e41}
.zmu-notification--color-info{background:#000000b3;color:#f5f5f5}
.zmu-notification--color-error{background:#ffe8e8;color:#b22424}
.zmu-notification--color-warning{background:#fcf6ed;color:#775111}
.zmu-notification--color-primary{background:#0e71eb;color:#fff}
.zmu-notification--small{font-size:14px;line-height:18px;padding:8px 12px}
.zmu-notification--middle{font-size:16px;line-height:22px;padding:8px 12px}
.zmu-notification--large{font-size:16px;line-height:22px;padding:12px}
.zmu-notification--bold{font-weight:700}
.zmu-radio-button{cursor:pointer;flex:1 1;font-size:16px;padding-left:24px;padding-right:8px;position:relative}
.zmu-radio-button:after,.zmu-radio-button:before{content:"";left:7px;position:absolute;top:50%;transform:translate(-20%,-50%)}
.zmu-radio-button:before{background-image:linear-gradient(180deg,#edeced,#fff 60%);border:1px solid #a8a8a8;border-radius:100%;height:14px;width:14px}
.zmu-radio-button-checked:before{background:#5f9bfa;background-image:linear-gradient(180deg,#5f9bfa,#397fe9);border-color:#196be5}
.zmu-radio-button-checked:after{border:3px solid #fff;border-radius:100%;display:block;transform:translate(25%,-50%)}
.zmu-radio-button-disabled{color:#999;cursor:not-allowed}
.zmu-radio-button-disabled:before{background-image:none;border:1px solid #ccc}
.zmu-radio-button-disabled.zmu-radio-button-checked:before{background:none}
.zmu-radio-button-disabled.zmu-radio-button-checked:after{border-color:#aaa}
.zmu-switch__input{height:0;margin:0;opacity:0;position:absolute;width:0}
.zmu-switch__core{background:#747487;border:1px solid #0000;border-radius:12px;box-sizing:border-box;cursor:pointer;display:inline-block;height:24px;margin:0;outline:none;position:relative;text-shadow:0 0 #000;transition:border-color .3s,background-color .3s;vertical-align:middle;width:40px}
.zmu-switch__core:after{background-color:#fff;border-radius:100%;content:"";height:20px;left:1px;position:absolute;top:1px;transition:all .3s;width:20px}
.zmu-switch__core--focused{box-shadow:0 0 0 2px #fff,0 0 0 4px #0e71eb}
.zmu-switch__core--checked{background-color:#0e71eb;border-color:#0e71eb}
.zmu-switch__core--checked:after{left:17px}
.zmu-switch__core--disabled{cursor:not-allowed;opacity:.6}
.zmu-tabs--bar-left{display:flex}
.zmu-tabs--bar-left .zmu-tabs__tabpanel{flex-grow:1}
.zmu-tabs--bar-right{display:flex;flex-direction:row-reverse}
.zmu-tabs--bar-right .zmu-tabs__tabpanel{flex-grow:1}
.zmu-tabs__tab-container{align-items:center;display:flex}
.zmu-tabs__tab-container--left,.zmu-tabs__tab-container--left .zmu-tabs__tabs-list,.zmu-tabs__tab-container--right,.zmu-tabs__tab-container--right .zmu-tabs__tabs-list{flex-direction:column}
.zmu-tabs__tabs-list{display:flex;flex-grow:1}
.zmu-tabs__tab-bar{margin-right:20px}
.zmu-tabs__tab-bar--active{color:#2d8cff}
.zmu-tabs__tab-bar--disabled{color:#00000040;cursor:not-allowed}
.zmu-tabs__tab-bar:focus{outline:1px solid #2d8cff;outline-offset:1px}
.zmu-tabs__tabpanel{display:none}
.zmu-tabs__tabpanel--active{display:block}
.zmu-tabs__tabpanel:focus{outline:0}
```

### B.18 Keyframes

Source: `main.css, main-chunk-other.css, chunk-zoom-ui.css, emotion sheet` [M]

```css
@keyframes fadeout{0%{opacity:1}to{opacity:0}}
@keyframes loadingCircle{to{transform:rotate(1turn)}}
@keyframes spinner-fade{0%{opacity:.9}12.5%{opacity:.8}25%{opacity:.7}37.5%{opacity:.6}50%{opacity:.5}62.5%{opacity:.4}75%{opacity:.3}87.5%{opacity:.2}to{opacity:.9}}
@keyframes loading-circle{to{transform:rotate(1turn)}}
@keyframes fade-in-linear-in{0%{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translate(0)}}
@keyframes fade-in-linear-out{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translateY(-20px)}}
@keyframes modal-fade-in{0%{opacity:0}to{opacity:1}}
@keyframes modal-fade-out{0%{opacity:1}to{opacity:0}}
@keyframes skeleton-pulse{0%{opacity:1;transform:scale(1)}50%{opacity:.33;transform:scale(.99)}to{opacity:1;transform:scale(1)}}
@keyframes zmicon-loading-rotating{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}
@keyframes dialog_rotate-infinite__5zlG6{0%{transform:rotate(0)}to{transform:rotate(1turn)}}
@keyframes JoinAutoCallMeeting_rotate-infinite__1oDpe{0%{transform:rotate(0)}to{transform:rotate(1turn)}}
@keyframes header-logo_rotate-infinite__38ikx{0%{transform:rotate(0)}to{transform:rotate(1turn)}}
@keyframes rotate-infinite{0%{transform:rotate(0)}to{transform:rotate(1turn)}}
@keyframes AppLoading_rotate-infinite__CUJvQ{0%{transform:rotate(0)}to{transform:rotate(1turn)}}
@keyframes AppLoading_progress-bar-animation__a7BL7{0%{transform:translateX(-90%)}to{transform:translateX(310px)}}
@keyframes rotate{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}
@keyframes antSpinRotate{ 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
```
