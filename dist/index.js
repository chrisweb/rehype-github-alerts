import { SKIP, visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";
import { fromHtml } from "hast-util-from-html";
let internalOptions;
const rehypeGithubAlerts = (options) => {
  const defaultOptions = {
    // icons license: https://github.com/microsoft/vscode-codicons/blob/main/LICENSE
    alerts: [
      {
        keyword: "NOTE",
        icon: '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.568 1.031A6.8 6.8 0 0 1 12.76 3.05a7.06 7.06 0 0 1 .46 9.39 6.85 6.85 0 0 1-8.58 1.74 7 7 0 0 1-3.12-3.5 7.12 7.12 0 0 1-.23-4.71 7 7 0 0 1 2.77-3.79 6.8 6.8 0 0 1 4.508-1.149zM9.04 13.88a5.89 5.89 0 0 0 3.41-2.07 6.07 6.07 0 0 0-.4-8.06 5.82 5.82 0 0 0-7.43-.74 6.06 6.06 0 0 0 .5 10.29 5.81 5.81 0 0 0 3.92.58zM7.375 6h1.25V5h-1.25v1zm1.25 1v4h-1.25V7h1.25z"/></svg>',
        color: "rgb(9, 105, 218)",
        title: "Note"
      },
      {
        keyword: "IMPORTANT",
        icon: '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 1h13l.5.5v10l-.5.5H7.707l-2.853 2.854L4 14.5V12H1.5l-.5-.5v-10l.5-.5zm6 10H14V2H2v9h2.5l.5.5v1.793l2.146-2.147L7.5 11zm0-8h1v5h-1V3zm0 7h1V9h-1v1z"/></svg>',
        color: "rgb(130, 80, 223)",
        title: "Important"
      },
      {
        keyword: "WARNING",
        icon: '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.56 1h.88l6.54 12.26-.44.74H1.44L1 13.26 7.56 1zM8 2.28L2.28 13H13.7L8 2.28zM8.625 12v-1h-1.25v1h1.25zm-1.25-2V6h1.25v4h-1.25z"/></svg>',
        color: "rgb(154, 103, 0)",
        title: "Warning"
      }
    ],
    supportLegacy: true
  };
  internalOptions = Object.assign({}, defaultOptions, options);
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      create(node, index, parent);
    });
  };
};
const create = (node, index, parent) => {
  if (node.tagName !== "blockquote") {
    return [SKIP];
  }
  if (!node.children) {
    return null;
  }
  const blockquoteParagraph = node.children.find((child) => {
    return isElement(child) && child.tagName === "p";
  });
  if (!isElement(blockquoteParagraph)) {
    return null;
  }
  const headerData = extractHeaderData(blockquoteParagraph);
  if (headerData === null) {
    return [SKIP];
  }
  const alertOptions = getAlertOptions(headerData.alertType);
  if (alertOptions === null) {
    return [SKIP];
  }
  if (typeof parent !== "undefined" && typeof index !== "undefined") {
    const build = internalOptions.build || defaultBuild;
    const originalChildren = blockquoteParagraph.children.slice(2, blockquoteParagraph.children.length);
    if (headerData.rest.length > 0) {
      originalChildren.unshift({ type: "text", value: headerData.rest });
    }
    const alertElement = build(alertOptions, originalChildren);
    if (alertElement !== null) {
      parent.children[index] = alertElement;
    }
  }
  return [SKIP];
};
const defaultBuild = (alertOptions, originalChildren) => {
  let alertIconElement;
  if (isElement(alertOptions.icon)) {
    alertIconElement = alertOptions.icon;
  } else {
    const alertIcon = fromHtml(
      alertOptions.icon,
      { fragment: true }
    ).children[0];
    if (isElement(alertIcon)) {
      alertIconElement = alertIcon;
    }
  }
  if (typeof alertIconElement === "undefined") {
    return null;
  }
  const titleElementContent = {
    type: "text",
    value: alertOptions.title
  };
  const alert = {
    type: "element",
    tagName: "div",
    properties: {
      className: [
        "markdown-alert",
        `markdown-alert-${alertOptions.keyword.toLowerCase()}`
      ],
      style: "color: " + alertOptions.color + ";"
    },
    children: [{
      type: "element",
      tagName: "p",
      properties: {},
      children: [
        {
          type: "element",
          tagName: "span",
          properties: {
            className: [
              "markdown-alert-header"
            ]
          },
          children: [
            alertIconElement,
            titleElementContent
          ]
        },
        {
          type: "element",
          tagName: "br",
          properties: {},
          children: []
        },
        ...originalChildren
      ]
    }]
  };
  return alert;
};
const extractHeaderData = (paragraph) => {
  const header = paragraph.children[0];
  let alertType;
  let rest = "";
  if (internalOptions.supportLegacy) {
    if (header.type === "element" && header.tagName === "strong") {
      if (header.children[0].type === "text") {
        alertType = header.children[0].value;
      }
    }
  }
  if (header.type === "text") {
    const match = header.value.match(/\[!(.*?)\]/);
    if (match === null || typeof match.input === "undefined") {
      return null;
    }
    if (match.input.length > match[0].length) {
      rest = match.input.replace(match[0], "");
    }
    alertType = match[1];
  }
  if (typeof alertType === "undefined") {
    return null;
  }
  return { alertType, rest };
};
const getAlertOptions = (alertType) => {
  const alertOptions = internalOptions.alerts.find((alert) => {
    return alertType === alert.keyword;
  });
  return alertOptions ? alertOptions : null;
};
export {
  defaultBuild,
  rehypeGithubAlerts
};
