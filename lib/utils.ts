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
    return "";
}