import { SKIP, visit } from 'unist-util-visit'
import { isElement } from 'hast-util-is-element'
import type { Root, Element } from 'hast'

interface IOptions { }

enum AlertTypesEnum {
    'WARNING',
    'IMPORTANT',
    'NOTE',
}

type AlertTypesType = keyof typeof AlertTypesEnum;

const rehypeAlerts = (options: IOptions) => {

    console.log('options: ', options)
    //console.log('tree: ', tree)

    return (tree: Root) => {
        visit(tree, 'element', findAlerts)
    }

}

const findAlerts = (node: Element) => {

    //console.log('node: ', node)

    if (isElement(node) && node.tagName === 'blockquote') {
        alert(node)
    }



}

const alert = (blockquote: Element) => {

    //console.log('blockquote: ', blockquote)

    //console.log('blockquote.children: ', blockquote.children)

    //if (blockquote.children) {

    const type = getAlertType(blockquote)

    console.log('type: ', type)

    //}

    return [SKIP]

}

const getAlertType = (node: Element): AlertTypesType | null => {

    if (!node.children) {
        return null
    }

    //console.log('node: ', node)

    const alertParagraph = node.children.find((child) => {
        return (isElement(child) && child.tagName === 'p')
    })

    console.log('alertParagraph: ', alertParagraph)

    if (!isElement(alertParagraph) || alertParagraph.children[0].type !== 'text') {
        return null
    }

    const paragraphValue = alertParagraph.children[0].value.replace('[!', '').replace(']', '')

    let alertType = null

    switch (paragraphValue) {
        case 'WARNING':
        case 'IMPORTANT':
        case 'NOTE':
            alertType = paragraphValue
            break
        default:
            break
    }

    return alertType
}

/*
function getNotecardType(node, locale) {
    if (!node.children) {
      return null;
    }
    const [child] = node.children;
    if (!child || !child.children) {
      return null;
    }
    const [grandChild] = child.children;
    if (grandChild.type != "strong" || !grandChild.children) {
      return null;
    }
  
    // E.g. in en-US magicKeyword === Note:
    const magicKeyword = grandChild.children[0].value;
    const l10nCardMap = getL10nCardMap(locale);
    let type;
    if (l10nCardMap.has(magicKeyword)) {
      const msgId = l10nCardMap.get(magicKeyword);
      type = msgId.split("_")[1];
    }
    return type == "warning" || type == "note" || type == "callout" ? type : null;
  }

blockquote(h, node) {
    const type = getNotecardType(node, locale);
    if (type) {
      const isCallout = type == "callout";
      if (isCallout) {
        if (node.children[0].children.length <= 1) {
          node.children.splice(0, 1);
        } else {
          node.children[0].children.splice(0, 1);
        }
      }
      return h(
        node,
        "div",
        { className: isCallout ? [type] : ["notecard", type] },
        wrap(all(h, node), true)
      );
    }
    return h(node, "blockquote", wrap(all(h, node), true));
  },*/


export { rehypeAlerts }