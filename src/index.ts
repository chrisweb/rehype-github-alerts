import { SKIP, visit } from 'unist-util-visit'
import { isElement } from 'hast-util-is-element'
import type { Root, Element, ElementContent, Parent, Text } from 'hast'
import { fromHtml } from 'hast-util-from-html'
import octicons from '@primer/octicons'

export interface IAlert {
    keyword: string
    icon: string | Element
    title: string
}

export type DefaultBuildType = (alertOptions: IAlert, originalChildren: ElementContent[]) => ElementContent | null

export interface IOptions {
    alerts: IAlert[]
    supportLegacy?: boolean
    build?: DefaultBuildType
}

let internalOptions: IOptions

export const rehypeGithubAlerts = (options: IOptions) => {

    const defaultOptions: IOptions = {
        // icons license: https://github.com/microsoft/vscode-codicons/blob/main/LICENSE
        alerts: [
            {
                keyword: 'NOTE',
                icon: octicons.info.toSVG(),
                title: 'Note',
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
                keyword: 'TIP',
                icon: octicons['light-bulb'].toSVG(),
                title: 'Tip',
            },
            {
                keyword: 'CAUTION',
                icon: octicons.stop.toSVG(),
                title: 'Caution',
            },
        ],
        supportLegacy: false,
    }

    internalOptions = Object.assign({}, defaultOptions, options)

    return (tree: Root) => {
        visit(tree, 'element', (node, index, parent) => {
            create(node, index, parent)
        })
    }

}

const create = (node: Element, index: number | undefined, parent: Parent | undefined) => {

    // check if main element is a blockquote
    if (node.tagName !== 'blockquote') {
        return [SKIP]
    }

    // make sure the blockquote is not empty
    if (node.children.length < 1) {
        return [SKIP]
    }

    // find the first paragraph inside of the blockquote
    const firstParagraph = node.children.find((child) => {
        return (
            child.type === 'element' &&
            child.tagName === 'p'
        )
    })

    // typescript type guard
    // make sure the first paragraph is a valid element
    if (!isElement(firstParagraph)) {
        return [SKIP]
    }

    // try to find the alert type
    const headerData = extractHeaderData(firstParagraph)

    // typescript type guard
    if (headerData === null) {
        return [SKIP]
    }

    // if the first line contains more than the type
    // drop out of rendering as alert, this is what
    // GitHub does (as of now in Mar. 2024)
    if (headerData.rest.trim() !== '') {
        if (!headerData.rest.startsWith('\n') && !headerData.rest.startsWith('\r')) {
            return [SKIP]
        }
    }

    // try to find options matching the alert keyword
    const alertOptions = getAlertOptions(headerData.alertType)

    if (alertOptions === null) {
        return [SKIP]
    }

    // make sure we have parent element
    // or we won't be able to replace the blockquote
    // with the new alert element
    if (!parent || parent.type !== 'root' || typeof index !== 'number') {
        return [SKIP]
    }

    // use a build to convert the blockquote into an alert
    const build = internalOptions.build ?? defaultBuild

    const alertBodyChildren: ElementContent[] = []

    // for alerts the blockquote first element is always
    // a paragraph but it can have more children than just
    // the alert type text node
    const remainingFirstParagraphChildren = firstParagraph.children.slice(1, firstParagraph.children.length)

    const newFirstParagraphChildren: ElementContent[] = []

    // remove the first line break from rest if there is one
    const rest = headerData.rest.replace(/^(\r\n|\r|\n)/, '')

    if (remainingFirstParagraphChildren.length > 0) {
        // if the alert type has a hard line break we remove it
        // to not start the alert with a blank line
        // meaning we start the slice at 2 to not take
        // the br element and new line text nodes
        if (
            remainingFirstParagraphChildren[0].type === 'element' &&
            remainingFirstParagraphChildren[0].tagName === 'br'
        ) {
            const remainingChildrenWithoutLineBreak = remainingFirstParagraphChildren.slice(2, firstParagraph.children.length)
            newFirstParagraphChildren.push(...remainingChildrenWithoutLineBreak)
        } else {
            // if the first line of the blockquote has no hard line break
            // after the alert type but some text, then both the type
            // and the text will be in a single text node
            // headerData rest contains the remaining text without the alert type
            if (rest !== '') {
                const restAsTextNode: Text = {
                    type: 'text',
                    value: rest
                }
                remainingFirstParagraphChildren.unshift(restAsTextNode)
            }
            // if no hard line break (br) take all the remaining
            // and add them to new paragraph to mimic the initial structure
            newFirstParagraphChildren.push(...remainingFirstParagraphChildren)
        }
    } else {
        if (rest !== '') {
            const restAsTextNode: Text = {
                type: 'text',
                value: rest
            }
            newFirstParagraphChildren.push(restAsTextNode)
        }
    }

    if (newFirstParagraphChildren.length > 0) {
        const paragraphElement: Element = {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: newFirstParagraphChildren
        }
        alertBodyChildren.push(paragraphElement)
    }

    // outside of the first paragraph there may also be children
    // we add them too back into the alert body
    if (node.children.length > 2) {
        alertBodyChildren.push(...node.children.slice(2, node.children.length))
    }

    const alertElement = build(alertOptions, alertBodyChildren)

    // replace the original blockquote with the
    // new alert element and its children
    if (alertElement !== null) {
        parent.children[index] = alertElement
    }

    return [SKIP]

}

export const defaultBuild: DefaultBuildType = (alertOptions, originalChildren) => {

    let alertIconElement: Element | undefined

    if (isElement(alertOptions.icon)) {
        // if an element got passed to the options for the icon
        // use that element
        alertIconElement = alertOptions.icon
    } else {
        // if a string got passed to the options for the icon
        // first convert it to an element
        const alertIcon = fromHtml(
            alertOptions.icon,
            { fragment: true }
        ).children[0]

        if (isElement(alertIcon)) {
            alertIconElement = alertIcon
        }
    }

    if (typeof alertIconElement === 'undefined') {
        return null
    }

    const titleElementContent: ElementContent = {
        type: 'text',
        value: alertOptions.title
    }

    const alert: ElementContent = {
        type: 'element',
        tagName: 'div',
        properties: {
            className: [
                'markdown-alert',
                `markdown-alert-${alertOptions.keyword.toLowerCase()}`,
            ],
        },
        children: [
            {
                type: 'element',
                tagName: 'p',
                properties: {
                    className: [
                        'markdown-alert-title'
                    ]
                },
                children: [
                    alertIconElement,
                    titleElementContent
                ],
            },
            ...originalChildren
        ],
    }

    return alert

}

const extractHeaderData = (paragraph: Element): { alertType: string, rest: string } | null => {

    const header = paragraph.children[0]
    let alertType: string | undefined
    let rest = ''

    if (internalOptions.supportLegacy) {

        if (header.type === 'element' && header.tagName === 'strong') {

            if (header.children[0].type === 'text') {
                alertType = header.children[0].value
            }

        }

    }

    if (header.type === 'text') {

        const match = (/\[!(.*?)\]/).exec(header.value)

        if (!match?.input) {
            return null
        }

        if (match.input.length > match[0].length) {
            // if in markdown there are no two spaces at the end
            // then in html there will be no line break
            // this means in the first line there will be more
            // content than just the alert type
            rest = match.input.replace(match[0], '')
        }

        alertType = match[1]

    }

    if (typeof alertType === 'undefined') {
        return null
    }

    return { alertType, rest }

}

const getAlertOptions = (alertType: string): IAlert | null => {

    const alertOptions = internalOptions.alerts.find((alert) => {
        return alertType.toUpperCase() === alert.keyword.toUpperCase()
    })

    return alertOptions ? alertOptions : null

}
