[![npm version](https://img.shields.io/npm/v/rehype-github-alerts.svg?style=flat)](https://www.npmjs.com/package/rehype-github-alerts)
[![GitHub license](https://img.shields.io/github/license/chrisweb/rehype-github-alerts?style=flat)](https://github.com/chrisweb/rehype-github-alerts/blob/master/LICENSE)

# rehype-github-alerts

rehype plugin to create alerts (admonitions/callouts), mimicking the way alerts get rendered on github.com (based on this [GitHub community "Alerts" discussion](https://github.com/orgs/community/discussions/16925)), currently 5 types of alerts are supported:

> [!NOTE]  
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]  
> Crucial information necessary for users to succeed.

> [!WARNING]  
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

the markdown syntax for the 5 examples above is as follows:

```md
> [!NOTE]  
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]  
> Crucial information necessary for users to succeed.

> [!WARNING]  
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.
```

this is a zero configuration package as all [options](#options) have defaults, but you can use them if you wish to modify default behavior, like for example by default 3 alerts are defined (with a default icon), use `options.alerts` to replace them with your own setup, there is also a default build that will create an output that mimics what GitHub does, but you can change the build to create whatever HTML suits your needs best, check out the ["options" chapter](#options) to learn more about customization

## installation

```shell
npm i rehype-github-alerts --save-exact
```

### optional packages

if you use this package, there are other packages you might want to install too, for example:

- [remark-gfm](https://github.com/remarkjs/remark-gfm), adds support for [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/) (autolink literals, footnotes, strikethrough, tables, tasklists)
- [remark-breaks](https://github.com/remarkjs/remark-breaks), turns soft line endings (enters) into hard breaks (`<br>`s). GitHub does this in a few places (comments, issues, PRs, and releases)

## examples

### rehype example

check out the [readme of the rehype example](./examples/simple-rehype-example/README.md) for more details about this example, all the source code is located in `examples/simple-rehype-example/`

### how GitHub renders alerts

I created [an issue on github](https://github.com/chrisweb/rehype-github-alerts/issues/1) to check how github is rendering alerts, or look at [another test page](https://github.com/dipree/markdown-highlight-test) for github alerts by the author of the github implementation himself

## styling

add the following styles to your css to mimic GitHub's styling of alerts:

```css
:root {
    --github-alert-default-color: rgb(175, 184, 193);
    --github-alert-note-color: rgb(9, 105, 218);
    --github-alert-important-color: rgb(130, 80, 223);
    --github-alert-warning-color: rgb(154, 103, 0);
}

.markdown-alert {
    padding: 0 1em;
    margin-bottom: 16px;
    border-left: 0.25em solid var(--github-alert-default-color);
}

.markdown-alert-note {
    border-left-color: var(--github-alert-note-color);
}

.markdown-alert-important {
    border-left-color: var(--github-alert-important-color);
}

.markdown-alert-warning {
    border-left-color: var(--github-alert-warning-color);
}

.markdown-alert-header {
    display: inline-flex;
    margin-bottom: 4px;
    align-items: center;
}

.markdown-alert-header>svg {
    margin-right: 8px;
}
```

## options

`options` (optional)

all options have default values which for most use cases should be enough, meaning there is zero configuration to do, unless you want to customize something

- `alerts` (`IAlert[]`)
- `supportLegacy` (`boolean`, default: true)
- `build` (`DefaultBuildType`)

### build option

the build option can be used to customize how alerts get rendered, this can be useful if you want to modify what css classes the elements have

the build option accepts a function that has two parameters:

alertOptions: this is an object of type **IAlert**, meaning it contains the options of the alert that got matched, like the keyword, icon and title
originalChildren: an array of type **DefaultBuildType**, containing the original children (body content of the alert)

for example in your configuration file create a rehype-github-alerts **build** option like this:

```mjs
/**
 * @typedef {import('rehype-github-alerts').IOptions} IOptions
 * @typedef {import('rehype-github-alerts').DefaultBuildType} DefaultBuildType
 */

/** @type { DefaultBuildType } */
const myGithubAlertBuild = (alertOptions, originalChildren) => {
    const alert = {
        type: 'element',
        tagName: 'div',
        properties: {
            className: [
                `markdown-alert-${alertOptions.keyword.toLowerCase()}`,
            ],
        },
        children: [
            ...originalChildren
        ],
    }

    return alert
}

/** @type { IOptions } */
const rehypeGithubAlertsOptions = {
    build: myGithubAlertBuild,
}
```

then use the following markdown code:

```md
> [!NOTE]
> I'm a note (created using a custom build)
```

will yield the following HTML output:

```html
<div class="markdown-alert-note">
    I'm a note (created using a custom build)
</div>
```

## about "soft line breaks" support

as noted in the readme of the [remark-breaks](https://github.com/remarkjs/remark-breaks) package:

> remark-breaks turns enters into `<br>`s
> GitHub does this in a few places (comments, issues, PRs, and releases)

this is why the **rehype-github-alerts** plugin doesn't turn soft line breaks into hard line breaks out of the box

so if you want to mimick GitHub's way of handling soft line breaks, then I recommend you install the [remark-breaks plugin](https://github.com/remarkjs/remark-breaks) alongside rehype-github-alerts

## tests

I used the [test-runner that built in node.js](https://nodejs.org/api/test.html) to add some test for common cases

All tests are located in the `/test` directory

To use the tests you need to create a **personal GitHub access token**, visit your github ["New fine-grained personal access token"](https://github.com/settings/personal-access-tokens/new) page to create a new token, you need to set the **Gists** permission under **Account permissions** to read/write, then click on "Generate token" to create your new token. If you new to GitHub tokens, then you may want to check out the [GitHub documentation "Creating a fine-grained personal access token"](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token), this token will be used by one of the dependencies of the test suite to create gists based on input markdown and generate HTML files containing the output GitHub has produced, for more about this package check out it's the "create-gfm-fixtures" GitHub repository

When you have your token, make a copy of the `.env.example` and rename it to `.env`, then insert your token and save it

To run the tests use the following command:

```shell
npm run test
```

> [!NOTE]  
> this will build the plugin and then run the test coverage command

## types

If you use typescript and intend to edit the options, for example to create custom alerts, then you may want to use the types provided by this library:

```ts
import { rehypeGithubAlerts, IOptions } from 'rehype-github-alerts'

const myOptions: IOptions = {
    alerts: [
        {
            keyword: 'MY_ALERT',
            icon: '<svg width="16" height="16" viewBox="0 0 16 16"/></svg>',
            title: 'My Alert',
        },
    ],
}
```

If your configuration file is written in javascript, then you can use the types likes this:

on top of your file add this jsdoc **typedef** at the beginning of the file:

```js
/**
 * @typedef {import('rehype-github-alerts').IOptions} IOptions
 */
```

and then in your code use the rehype-github-alerts type by placing a jsdoc @type tag over the options, like so:

```js
/** @type { IOptions } */
const rehypeGithubAlertsOptions = {
    supportLegacy: false,
}
```

<details>
    <summary>here is a full example of a next.js next.config.mjs configuration file</summary>

```mjs
/**
 * @typedef {import('rehype-github-alerts').IOptions} IOptions
 */

import WithMDX from '@next/mdx'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { rehypeGithubAlerts }  from 'rehype-github-alerts'

const nextConfig = (/*phase*/) => {

    // https://github.com/remarkjs/remark-gfm
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    const remarkGfmOptions = {
        singleTilde: false,
    }

    // https://github.com/chrisweb/rehype-github-alerts
    /** @type { IOptions } */
    const rehypeGithubAlertsOptions = {
        supportLegacy: false,
    }

    const withMDX = WithMDX({
        extension: /\.mdx?$/,
        options: {
            remarkPlugins: [remarkBreaks, [remarkGfm, remarkGfmOptions]],
            rehypePlugins: [[rehypeGithubAlerts, rehypeGithubAlertsOptions]],
        },
    })

    /** @type {import('next').NextConfig} */
    const nextConfig = {
        experimental: {
            // experimental use rust compiler for MDX
            // as of now (07.10.2023) there is no support for rehype plugins
            // this is why it is currently disabled
            mdxRs: false,
        },
        // configure pageExtensions to include md and mdx
        pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    }

    return withMDX(nextConfig)

}

export default nextConfig
```

</details>

## legacy syntax

as of 14 November 2023 GitHub has removed support for legacy syntax, the legacy syntax is supported by this plugin but as of now turned off by default

legacy markdown (mdx) syntax:

```md
> **!Note**  
> I'm a note :wave:

> **!Important**  
> I'm important

> **!Warning**  
> I'm a warning
```

you can turn **ON** legacy support via the options like so:

```js
const myRehypeGithubAlertsOptions = {
    supportLegacy: true,
}
```

## icons

the 5 icons used in this package are from ["Bootstrap Icons" repository](https://github.com/twbs/icons) and licensed under [MIT](https://github.com/twbs/icons/blob/main/LICENSE)

## TODOs

- write more tests to reach a test coverage of 100%

## bugs

if you find a bug, please open an issue in the [rehype-github-alerts issues page on github](https://github.com/chrisweb/rehype-github-alerts/issues), try to describe the bug you encountered as best as you can and if possible add some examples of the markdown / mdx content or code that you used when you found the bug, I or a contributor will try to look into it asap

## feedback

If you have an idea to improve this project please use the ["NEW Feature Request"](https://github.com/chrisweb/rehype-github-alerts/issues/new/choose) issue template or if you have any feedback about this package you may want to post it in the [rehype discussion about this plugin](https://github.com/orgs/rehypejs/discussions/157)

## contributing

PRs are welcome 😉

To get started, please check out the [CONTRIBUTING.md](CONTRIBUTING.md) guide of this project
