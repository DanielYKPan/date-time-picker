export declare class TranslateService {
    private translations;
    private currentLang;
    readonly CurrentLang: string;
    private defaultLang;
    private fallback;
    constructor(translations: any);
    use(lang: string): void;
    instant(key: string): string;
    setDefaultLang(lang: string): void;
    enableFallback(enable: boolean): void;
    private translate(key);
}
