export interface TargetFile {
    path: string;
    lang: string;
}

export interface I18nMorphConfig {
    sourceFile: string;
    targetFiles: TargetFile[];
    mistralApi: string;
}

declare const config: I18nMorphConfig
export default config