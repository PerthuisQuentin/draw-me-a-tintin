const Fs = require('fs');
const Path = require('path');
const Yaml = require('js-yaml');

import Log from './logger';

interface i18nOptions {
    directory?: string,
    locales?: string[],
    defaultLocale?: string
}

export default class I18n {
    private static directory: any;
    private static locales: any;
    private static defaultLocale: any;
    private static localesDatas: any = {};

    private static checkFiles() {
        if(!Fs.existsSync(this.directory)) {
            Fs.mkdirSync(this.directory);
        }

        for(let locale of this.locales) {
            let file = Path.join(this.directory, locale + '.yml');

            if(!Fs.existsSync(file)) {
                Fs.writeFileSync(file, "# " + locale);
            }
        }
    }

    private static loadLocales() {
        for(let locale of this.locales) {
            let file = Path.join(this.directory, locale + '.yml');

            try {
                this.localesDatas[locale] = Yaml.safeLoad(Fs.readFileSync(file, 'utf8'));
            } catch (err) {
                Log.error(`Can't load locale file ${file}`, err);
                process.exit(1);
            }
        }

        console.log(this.localesDatas);
        
    }

    public static configure(options: i18nOptions) {
        if(options.directory)
            this.directory = options.directory;

        if(options.locales)
            this.locales = options.locales;

        if(options.defaultLocale)
            this.defaultLocale = options.defaultLocale;

        this.checkFiles();
        this.loadLocales();
    }

    private locale: string;

    constructor(locale: string) {
        this.locale = locale;
    }
}