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
        supportLegacy: false,
        // octicons docs: https://github.com/primer/octicons/tree/main/lib/octicons_node
        alerts: [
            {
                keyword: 'NOTE',
                icon: `<svg class="octicon octicon-info mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">${octicons['info'].heights[16]?.path}</svg>`,
                title: 'Note',
            },
            {
                keyword: 'IMPORTANT',
                icon: `<svg class="octicon octicon-report mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">${octicons['report'].heights[16]?.path}</svg>`,
                title: 'Important',
            },
            {
                keyword: 'WARNING',
                icon: `<svg class="octicon octicon-alert mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">${octicons['alert'].heights[16]?.path}</svg>`,
                title: 'Warning',
            },
            {
                keyword: 'TIP',
                icon: `<svg class="octicon octicon-light-bulb mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">${octicons['light-bulb'].heights[16]?.path}</svg>`,
                title: 'Tip',
            },
            {
                keyword: 'CAUTION',
                icon: `<svg class="octicon octicon-stop mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">${octicons['stop'].heights[16]?.path}</svg>`,
                title: 'Caution',
            },
        ],
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
    // GitHub does (as of Mar. 2024)
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

    // make sure we have parent element and an index
    // or we won't be able to replace the blockquote
    // with the new alert element
    if (!parent || typeof index !== 'number') {
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

    // if the rest is empty and the first paragraph has no children
    // this is a special github case (as of Mar. 2024)
    // where the alert is only the type (no alert body)
    // in this case github keeps the original blockquote
    if (rest === '' && remainingFirstParagraphChildren.length === 0 && node.children.length < 4) {
        return [SKIP]
    }

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
