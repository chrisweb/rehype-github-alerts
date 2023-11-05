import type { Root, Element, ElementContent } from 'hast';
export interface IAlert {
    keyword: string;
    icon: string | Element;
    color: string;
    title: string;
}
export type DefaultBuildType = (alertOptions: IAlert, originalChildren: ElementContent[]) => ElementContent | null;
export interface IOptions {
    alerts: IAlert[];
    supportLegacy?: boolean;
    build?: DefaultBuildType;
}
export declare const rehypeGithubAlerts: (options: IOptions) => (tree: Root) => void;
/** this is what we want to build (by default):
<div class="markdown-alert markdown-alert-ALERT_KEYWORD" style="color: rgb(9, 105, 218);">
    <p>
        <span class="markdown-alert-header">
            <svg class="markdown-alert-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></svg>
            ALTERT_TITLE
        </span><br>
        ORIGINAL_CHILDREN
    </p>
</div>
 */
export declare const defaultBuild: DefaultBuildType;
