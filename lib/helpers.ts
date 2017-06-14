const I18n = require("i18n");
export function __() {
    return I18n.__.apply(this, arguments);
}

export function __n() {
    return I18n.__n.apply(this, arguments);
}