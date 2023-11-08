[![npm version](https://img.shields.io/npm/v/rehype-github-alerts.svg?style=flat)](https://www.npmjs.com/package/rehype-github-alerts)
[![GitHub license](https://img.shields.io/github/license/chrisweb/rehype-github-alerts?style=flat)](https://github.com/chrisweb/rehype-github-alerts/blob/master/LICENSE)

# rehype-github-alerts

rehype plugin to create alerts (admonitions/callouts), mimicking the way alerts get rendered on github.com, currently three types of alerts are supported:

> [!NOTE]  
> I'm a note :wave:

> [!IMPORTANT]  
> I'm important

> [!WARNING]  
> I'm a warning

this is a zero configuration package as all [options](#options) have defaults, but you can use them if you wish to modify default behavior, like for example by default 3 alerts are defined with a default icon and color, use `options.alerts` to replace them with your own setup

## installation

```shell
npm i rehype-github-alerts --save-exact
```

### optional packages

if you use this package, there are other packages you might want to install too, for examle:

- [remark-gfm](https://github.com/remarkjs/remark-gfm), adds support for [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/) (autolink literals, footnotes, strikethrough, tables, tasklists)
- [remark-breaks](https://github.com/remarkjs/remark-breaks), turns soft line endings (enters) into hard breaks (`<br>`s). GitHub does this in a few places (comments, issues, PRs, and releases)

## examples

I created [an issue on github](https://github.com/chrisweb/rehype-github-alerts/issues/1) to check how github is rendering alerts

### remark example

check out the [readme of the remark example](./examples/simple-remark-example/README.md) for more details about this example, all the source code is located in `examples/simple-remark-example/`

## options

`options` (optional)

all options have default values which for most use cases should be enough, meaning there is zero configuration to do, unless you want to customize something

- `alerts` (`IAlert[]`) 
- `supportLegacy` (`boolean`, default: true)
- `build` (`DefaultBuildType`)

## ICONS

the 3 icons used in this package are from [Codicons repository](https://github.com/microsoft/vscode-codicons) and licensed under [Creative Commons Attribution 4.0 International](https://github.com/microsoft/vscode-codicons/blob/main/LICENSE)

## TODOs

- write tests

## BUGS

if you find a bug, please open an issue in the [rehype-github-alerts issues page on github](https://github.com/chrisweb/rehype-github-alerts/issues), try to describe the bug you encountered as best as you can and if possible add some examples of the markdown / mdx content or code that you used when you found the bug, I or a contributor will try to look into it asap

## contributing

PRs are welcome 😉

To get started, please check out the [CONTRIBUTING.md](CONTRIBUTING.md) guide of this project
