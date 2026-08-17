# Changelog

All notable changes to `bettertouchtool` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/) and the project uses [SemVer](https://semver.org/).

## [1.0.0-alpha.1] – 2026-08-17

Initial release – a complete rewrite and successor of the unmaintained [`btt`](https://github.com/Worie/btt) package.

### Added
- `Btt` client with automatic transport selection: in-process (`callBTT` inside BetterTouchTool),
  unix socket (`/tmp/com.hegenberg.BetterTouchTool.sock`), webserver (GET, or POST JSON body for large
  payloads – POST, `X-BTT-Shared-Secret` header and `get_info` require BetterTouchTool 6.735+).
- Typed methods for every BTT scripting command (triggers, variables, clipboard, floating menus, widgets,
  presets, notifications, system info) plus `call()` escape hatch and `info()`.
- `TriggerHandle` / `WidgetHandle`, `btt.vars`, `chain()` (executes a sequence as one combined action).
- Action builders (`actions.*`, ~45) and trigger builders (`triggers.*`) with human-readable shortcut
  parsing (`"cmd+shift+s"`, `"⌘⇧S"`).
- Generated catalogs from BetterTouchTool's own reference docs: `ActionType` (all predefined action ids)
  in the core bundle, full parameter documentation and trigger types under `bettertouchtool/catalog`.
- `btt` CLI (trigger-named, get/set-var, hud, shortcut, triggers list/get/delete, actions search/show, raw call).
- Browser / WebView entry point (`bettertouchtool/browser`).
