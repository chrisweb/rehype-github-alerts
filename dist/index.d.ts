import type { Root, Element } from 'hast';
export interface IAlert {
    keyword: string;
    icon: string | Element;
    color: string;
}
export type DefaultBuildType = (alertOptions: IAlert) => Element;
export interface IOptions {
    alerts: IAlert[];
    supportLegacy?: boolean;
    build?: DefaultBuildType;
}
export declare const rehypeGithubAlerts: (options: IOptions) => (tree: Root) => void;
export declare const defaultBuild: DefaultBuildType;
