import { SKIP, visit } from 'unist-util-visit'
import { isElement } from 'hast-util-is-element'
import type { Root, Element, ElementContent, Parent, Text } from 'hast'
import { fromHtml } from 'hast-util-from-html'

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
    if (!node.children) {
        return null
    }

    // find the first paragraph inside of the blockquote
    const firstParagraph = node.children.find((child) => {
        return (isElement(child) && child.tagName === 'p')
    })

    // check if we found an the blockquote paragraph
    if (!isElement(firstParagraph)) {
        return null
    }

    // try to find the alert type
    const headerData = extractHeaderData(firstParagraph)

    if (headerData === null) {
        return [SKIP]
    }

    // if the first line contains more than the type
    // drop out of rendering as alert, this is what
    // GitHub does (as of now)
    if (headerData.rest.trim() !== '') {
        if (!headerData.rest.startsWith('\n') && !headerData.rest.startsWith('\r')) {
            return null
        }
    }

    // try to find options matching the alert keyword
    const alertOptions = getAlertOptions(headerData.alertType)

    if (alertOptions === null) {
        return [SKIP]
    }

    if (typeof parent !== 'undefined' && typeof index !== 'undefined') {

        // use a build to convert the blockquote into an alert
        const build = internalOptions.build || defaultBuild

        const alertBodyChildren: ElementContent[] = []

        // for alerts the blockquote first element is always
        // a pragraph but it can have move children then just
        // the alert type text node
        const remainingFirstParagraphChildren = firstParagraph.children.slice(1, firstParagraph.children.length)

        const newFirstParagraphChildren: ElementContent[] = []

        if (remainingFirstParagraphChildren.length > 0) {
            // if the alert type has a hardline break we remove it
            // to not start the alert with a blank line
            // meaning we start the slice at 2 to not take
            // the br element and new line text nodes
            if (remainingFirstParagraphChildren[0].type === 'element' &&
                remainingFirstParagraphChildren[0].tagName === 'br') {
                const remainingChildrenWithoutLineBreak = remainingFirstParagraphChildren.slice(2, firstParagraph.children.length)
                newFirstParagraphChildren.push(...remainingChildrenWithoutLineBreak)
            } else {
                // if the first line of the blockquote has no hard line break
                // after the alert type but some text, then both the type
                // and the text will be in a single text node
                // headerData rest contains the remaining text without the alert type
                if (headerData.rest.trim() !== '') {
                    const restAsTextNode: Text = {
                        type: 'text',
                        value: headerData.rest
                    }
                    remainingFirstParagraphChildren.unshift(restAsTextNode)
                }
                // if no hard line break (br) take all the remaining
                // and add them to new paragraph to mimick the initial structure
                newFirstParagraphChildren.push(...remainingFirstParagraphChildren)
            }
        } else {
            if (headerData.rest.trim() !== '') {
                const restAsTextNode: Text = {
                    type: 'text',
                    value: headerData.rest
                }
                newFirstParagraphChildren.push(restAsTextNode)
            }
        }

        if (newFirstParagraphChildren.length > 0) {
            const lineBreak: Text = {
                type: 'text',
                value: '\n'
            }
            alertBodyChildren.push(lineBreak)
            const paragrahElement: Element = {
                type: 'element',
                tagName: 'p',
                properties: {},
                children: newFirstParagraphChildren
            }
            alertBodyChildren.push(paragrahElement)
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
    let rest: string = ''

    if (internalOptions.supportLegacy) {

        if (header.type === 'element' && header.tagName === 'strong') {

            if (header.children[0].type === 'text') {
                alertType = header.children[0].value
            }

        }

    }

    if (header.type === 'text') {

        const match = header.value.match(/\[!(.*?)\]/)

        if (match === null || typeof match.input === 'undefined') {
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
