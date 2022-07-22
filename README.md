# Inliner

Process HTML output by VSCode Markdown plugin, inline CSS styles
so the styles will be preserved when copy-pasting HTML
into Wechat Platform / Zhihu / yuque web editor.

## Usage

```
Usage: inliner [options] <filename>

Inline CSS for VSCode output HTML

Arguments:
  filename         HTML file name

Options:
  -V, --version    output the version number
  -u, --url <url>  base URL for href resolution
  -h, --help       display help for command
```

```
./dist/inliner.exe ./dist/codeql-uboot-bug-hunting.html -u "https://blog.rabit.pw/2022/{slug}"
```

## Build

```
npm i pkg
./node_modules/.bin/pkg --compress Brotli .
```

exe could be found at `dist/inliner.exe`
