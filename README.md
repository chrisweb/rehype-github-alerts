[![npm version](https://img.shields.io/npm/v/rehype-github-alerts.svg?style=flat)](https://www.npmjs.com/package/rehype-github-alerts)
[![GitHub license](https://img.shields.io/github/license/chrisweb/rehype-github-alerts?style=flat)](https://github.com/chrisweb/rehype-github-alerts/blob/master/LICENSE)

# rehype-github-alerts

## Beta (4.0.0) available: CSS in dist and external Octicons

> [!IMPORTANT]  
> rehype-github-alerts v4.0.0 beta 1 is now (08.10.2024) available: the [css_and_external_octicons_experiment](https://github.com/chrisweb/rehype-github-alerts/tree/css_and_external_octicons_experiment) branch has an updated [README with a "beta notes" chapter](https://github.com/chrisweb/rehype-github-alerts/tree/css_and_external_octicons_experiment?tab=readme-ov-file#beta-notes), I recommend you start there if you are interested in trying out the new beta
>  
> feedback is welcome 🙂

## Introduction

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

## BETA Notes

The first beta "v4.0.0 beta 0" includes two major changes:

* the first one is that the octicons now get loaded from an external source. After debating this for some time I think that this solution is better for all devs that use the package in their project. The icons are not the twbs icons anymore but the [GitHub Prime Octicons](https://primer.style/foundations/icons/). The dependency in the package.json is marked as optional, as well as the octicons types. The icons package should get installed if you plan on using them and the types if your project is written in Typescript. By using an external source the project itself has also become much smaller (I know it often gets used on the backend, but still)
* the second big change is that I added the css as physical file to the distribution; this CSS can get imported if the project supports it, Next.js for example does, and I did a [prototype](https://github.com/chrisweb/test_rehype-github-alerts_styling), in which I import the css file from rehype-github-alerts into the Next.js [Layout.tsx](https://github.com/chrisweb/test_rehype-github-alerts_styling/blob/main/app/layout.tsx) file (you can have a look at the [source code on GitHub](https://github.com/chrisweb/test_rehype-github-alerts_styling)). Another solution some developers use, is the [webpack CSS loader](https://www.npmjs.com/package/css-loader).

To install the latest beta and also the octicons, use the following command:

```shell
npm i rehype-github-alerts@beta @primer/octicons@latest --save-exact
```

> [!IMPORTANT]  
> If you want to use v4 beta 0, and you also want to have the new octicons then you need to make sure that you do NOT omit optional dependencies (as the icons are not bundled in this package anymore, but an optional dependency)
>  
> You can either install the octicons manually: `npm i @primer/octicons --save-exact`
>  
> Or you could you use the npm include flag to always install optional dependencies: `npm i --include=optional`

To only update the plugin use:

```shell
npm i rehype-github-alerts@beta --save-exact
```

If you only update the plugin an want to keep using the twbs icons which v3 was using, then you need to update your build (in the plugin options) like this:

```js
alerts: [
    {
        keyword: 'NOTE',
        // bootstrap icon: info-circle
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>',
        title: 'Note',
    },
    {
        keyword: 'IMPORTANT',
        // bootstrap icon: exclamation-square
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/></svg>',
        title: 'Important',
    },
    {
        keyword: 'WARNING',
        // bootstrap icon: exclamation-triangle
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/><path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/></svg>',
        title: 'Warning',
    },
    {
        keyword: 'TIP',
        // bootstrap icon: lightbulb
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/></svg>',
        title: 'Tip',
    },
    {
        keyword: 'CAUTION',
        // bootstrap icon: exclamation-octagon
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/></svg>',
        title: 'Caution',
    },
],
```

## installation

```shell
npm i rehype-github-alerts --save-exact
```

## Demo

You can now see a live demo of this plugin on my blog, especially in my web_development [chris.lu/web_development](https://chris.lu/web_development) section

I also published a Next.js [Next.js static MDX blog](https://chris.lu/web_development/tutorials/next-js-static-mdx-blog) tutorial on my blog, the [GitHub-like alerts using the rehype-github-alerts plugin](https://chris.lu/web_development/tutorials/next-js-static-mdx-blog/github-like-alerts-plugin) page is about how to use **rehype-github-alerts** with **next/js**

## examples

### rehype example

check out the [readme of the rehype example](./examples/simple-rehype-example/README.md) for more details about this example, all the source code is located in `examples/simple-rehype-example/`

### how GitHub renders alerts

I created [an issue on github](https://github.com/chrisweb/rehype-github-alerts/issues/1) to check how github is rendering alerts (will add more examples over time, based on feedback)

## styling

add the following styles to your css to mimic GitHub's styling of alerts:

```css
:root {
    --github-alert-default-color: rgb(208, 215, 222);
    --github-alert-note-color: rgb(9, 105, 218);
    --github-alert-tip-color: rgb(26, 127, 55);
    --github-alert-important-color: rgb(130, 80, 223);
    --github-alert-warning-color: rgb(191, 135, 0);
    --github-alert-caution-color: rgb(207, 34, 46);
}

@media (prefers-color-scheme: dark) {
    :root {
        --github-alert-default-color: rgb(48, 54, 61);
        --github-alert-note-color: rgb(31, 111, 235);
        --github-alert-tip-color: rgb(35, 134, 54);
        --github-alert-important-color: rgb(137, 87, 229);
        --github-alert-warning-color: rgb(158, 106, 3);
        --github-alert-caution-color: rgb(248, 81, 73);
    }
}

.markdown-alert {
    padding: 0.5rem 1rem;
    margin-bottom: 16px;
    border-left: 0.25em solid var(--github-alert-default-color);
}

.markdown-alert>:first-child {
    margin-top: 0;
}

.markdown-alert>:last-child {
    margin-bottom: 0;
}

.markdown-alert-note {
    border-left-color: var(--github-alert-note-color);
}

.markdown-alert-tip {
    border-left-color: var(--github-alert-tip-color);
}

.markdown-alert-important {
    border-left-color: var(--github-alert-important-color);
}

.markdown-alert-warning {
    border-left-color: var(--github-alert-warning-color);
}

.markdown-alert-caution {
    border-left-color: var(--github-alert-caution-color);
}

.markdown-alert-title {
    display: flex;
    margin-bottom: 4px;
    align-items: center;
}

.markdown-alert-title>svg {
    margin-right: 8px;
}

.markdown-alert-note .markdown-alert-title {
    color: var(--github-alert-note-color);
}

.markdown-alert-tip .markdown-alert-title {
    color: var(--github-alert-tip-color);
}

.markdown-alert-important .markdown-alert-title {
    color: var(--github-alert-important-color);
}

.markdown-alert-warning .markdown-alert-title {
    color: var(--github-alert-warning-color);
}

.markdown-alert-caution .markdown-alert-title {
    color: var(--github-alert-caution-color);
}
```

> [!NOTE]  
> The above stylesheet is to get you started, it is not an exact 1 to 1 copy of what GitHub uses to style their alerts. Their stylesheet changes over time, so it is hard to keep track of the exact styling they use, but you should be able to adjust the styles yourself quickly by looking at [GitHubs CSS](https://github.com/orgs/community/discussions/16925)

### GitHub font family

If you also want to mimic GitHubs font choice, then you should set **font-family** (for the title and content of your alerts) to this:

```css
:root {
    --frontFamily-github: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    --frontWeight-github: 500;
}

.markdown-alert {
    font-family: var(--frontFamily-github);
}

.markdown-alert-title {
    font-weight: var(--frontWeight-github, 500);
}
```

We create two new CSS variables and then use the **frontFamily-github** variable to set the font family of all the **markdown-alert** elements, and then in the title class we use **frontWeight-github** to make the text a bit bolder

### GitHub octicons

This library uses the [twbs icons](https://icons.getbootstrap.com/), which means that the icons in the alert titles are similar but NOT exactly the same ones that twitter uses

GitHub has [open-sourced](https://en.wiktionary.org/wiki/open-sourced#English) their [Primer](https://primer.style/) design system which includes icons that GitHub called [octicons](https://primer.style/foundations/icons) 😉

Here are the 5 icons you will need (they offer two versions a 16px and a 24px):

* **Note** uses the [info](https://primer.style/foundations/icons/info-16) icon ([16px](https://primer.style/foundations/icons/info-16) / [24px](https://primer.style/foundations/icons/info-24))
* **Tip** uses the [light-bulb](https://primer.style/foundations/icons/light-bulb-16) icon ([16px](https://primer.style/foundations/icons/light-bulb-16) / [24px](https://primer.style/foundations/icons/light-bulb-24))
* **Important** uses the [report](https://primer.style/foundations/icons/report-16) icon ([16px](https://primer.style/foundations/icons/report-16) / [24px](https://primer.style/foundations/icons/report-24))
* **Warning** uses the [alert](https://primer.style/foundations/icons/alert-16) icon ([16px](https://primer.style/foundations/icons/alert-16) / [24px](https://primer.style/foundations/icons/alert-24))
* **Caution** uses the [stop](https://primer.style/foundations/icons/stop-16) icon ([16px](https://primer.style/foundations/icons/stop-16) / [24px](https://primer.style/foundations/icons/stop-24))

If you search for [@primer/octicons](https://www.npmjs.com/search?q=%40primer%2Focticons) on npm you will find that primer offers different packages making it easy to include the icons into your project like [@primer/octicons-react](@primer/octicons-react), there are also community packages like the [svelte-octicons](https://www.npmjs.com/package/svelte-octicons), and they also have a lot of info and examples in their [guides section](https://primer.style/guides/introduction)

#### Rehype GitHub Alerts with octicons

First we install the octicon package:

```shell
npm i @primer/octicons --save-exact
```

If you use typescript, also install the types:

```shell
npm i @types/primer__octicons --save-exact --save-dev
```

Next we import the icons in our configuration file, we create an options object for rehype-github-alerts, we use the 5 octicons for each alert and finally use those options in the code that sets up the rehype plugins for your project:

```ts
import { rehypeGithubAlerts, IOptions as rehypeGithubAlertsOptionsType } from 'rehype-github-alerts'
import octicons from '@primer/octicons'

// this rehype-github-alerts configuration replaces
// the default icons with octicons
const rehypeGithubAlertsOptions: rehypeGithubAlertsOptionsType = {
    alerts: [
        {
            keyword: 'NOTE',
            icon: octicons.info.toSVG(),
            title: 'Note',
        },
        {
            keyword: 'TIP',
            icon: octicons['light-bulb'].toSVG(),
            title: 'Tip',
        },
        {
            keyword: 'IMPORTANT',
            icon: octicons.report.toSVG(),
            title: 'Important',
        },
        {
            keyword: 'WARNING',
            icon: octicons.alert.toSVG(),
            title: 'Warning',
        },
        {
            keyword: 'CAUTION',
            icon: octicons.stop.toSVG(),
            title: 'Caution',
        },
    ]
}

// we add rehype-github-alerts as well as the options
// to the rehype plugins configuration
rehypePlugins: [[rehypeGithubAlerts, rehypeGithubAlertsOptions]],
```

The output of `.toSVG()` will be an SVG like this:

```html
<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-info" aria-hidden="true"></svg>
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

then use the following markdown code (important: there are two spaces after `[!NOTE]  ` to create a hard line break, see the ["about soft line breaks" chapter](#about-soft-line-breaks-support) for a more detailed explanation):

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

> [!IMPORTANT]  
> GitHub turns soft line breaks into hard line breaks by default, this plugin does NOT  

**option 1:** If you are using rehype-github-alerts, then **you need to add two spaces at the end of each line** if you want to have a line break (same as you would do for markdown outside of an alert), which is the [markdown syntax for a hard linebreak](https://daringfireball.net/projects/markdown/syntax#p), like so:

```md
> [!NOTE]  
> you MUST add 2 spaces (to all 3 lines of this example, including the first one) to create line breaks  
> if you don't want to manually add two spaces after each line, then you need to install the [remark-breaks](https://github.com/remarkjs/remark-breaks) plugin  
```

**option 2:** If you do NOT want to have to add two spaces manually after each line, then I recommend you install the plugin called [remark-breaks](https://github.com/remarkjs/remark-breaks), **remark-breaks** will mimic the behavior you experience on GitHub, by automatically turning a soft line break (when you hit `Enter` at the end of a line) into hard line breaks  

As noted in the readme of the [remark-breaks](https://github.com/remarkjs/remark-breaks) package README, the purpose of the **remark-breaks** is to:

> remark-breaks turns enters into `<br>`s
> GitHub does this in a few places (comments, issues, PRs, and releases)

## paragraphs separation

If you don't want a new line (1 `<br>` element) but also some space between two paragraphs (2 `<br>` elements), no matter if you have **remark-breaks** installed or not, then you need to add an empty line (same as you would do outside of a blockquote), like so:

```md
> [!TIP]  
> first paragraph  
>
> second paragraph  
```

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

The Next.js configuration example above assumes that you have installed the packages [@next/mdx](https://www.npmjs.com/package/@next/mdx), [@mdx-js/loader](https://www.npmjs.com/package/@mdx-js/loader), [remark-breaks](https://www.npmjs.com/package/remark-breaks), [remark-gfm](https://www.npmjs.com/package/remark-gfm) and [rehype-github-alerts](https://www.npmjs.com/package/rehype-github-alerts)

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

## TODOs

- write more tests to reach a test coverage of 100%

## bugs

if you find a bug, please open an issue in the [rehype-github-alerts issues page on github](https://github.com/chrisweb/rehype-github-alerts/issues), try to describe the bug you encountered as best as you can and if possible add some examples of the markdown / mdx content or code that you used when you found the bug, I or a contributor will try to look into it asap

## feedback

If you have an idea to improve this project please use the ["NEW Feature Request"](https://github.com/chrisweb/rehype-github-alerts/issues/new/choose) issue template or if you have any feedback about this package you may want to post it in the [rehype discussion about this plugin](https://github.com/orgs/rehypejs/discussions/157)

## contributing

PRs are welcome 😉

To get started, please check out the [CONTRIBUTING.md](CONTRIBUTING.md) guide of this project

### alternatives

an alternative to this package if you want to have github like alerts but do it with a remark plugin instead of a rehype plugin is [remark-github-beta-blockquote-admonitions](https://www.npmjs.com/package/remark-github-beta-blockquote-admonitions)

### optional packages

if you use this package, there are other packages you might want to install too, for example:

- [remark-gfm](https://github.com/remarkjs/remark-gfm), adds support for [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/) (autolink literals, footnotes, strikethrough, tables, task lists)
- [remark-breaks](https://github.com/remarkjs/remark-breaks), turns soft line endings (enters) into hard breaks (`<br>`s). GitHub does this in a few places (comments, issues, PRs, and releases)

## icons

the 5 icons used in this package are from ["Bootstrap Icons" repository](https://github.com/twbs/icons) and licensed under [MIT](https://github.com/twbs/icons/blob/main/LICENSE)

## note to self

Have downgraded eslint for now, ESLint [issue #19134](https://github.com/eslint/eslint/issues/19134) explains the problem and there is a [PR #10339](https://github.com/typescript-eslint/typescript-eslint/pull/10339) getting merged anytime soon