export function capitalize(word: string) : string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function mergeInCamelCase(...words: string[]) : string {
    
    if(!words.length) 
        return "";
    if(words.length === 1) 
        return words[0];

    var result: string = words[0];

    for(var i = 1; i < words.length; i++) {
        result += capitalize(words[i]);
    }

    return result;
}

export function joiErrorStringify(err: any): any {

    if(!err.isJoi)
        return null;

    var result: any = {};

    for(var detail of err.details) {

        var name = detail.context.key;
        var type = detail.type.split('.')[1];
        var value;

        var error = mergeInCamelCase(name, type);

        switch(type) { 
            case "min":
            case "max": { 
                value = detail.context.limit;
                break; 
            }
        } 
        
        if(value) {
            result[error] = value;
        } else {
            result[error] = name
        }
    }

    return result;
}