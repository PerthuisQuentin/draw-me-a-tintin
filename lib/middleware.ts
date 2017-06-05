export function addLocals(request: any, response: any, next: any) {
    if(request.locals === undefined)
        request.locals = {};

    next();
}

export function checkLogin(request: any, response: any, next: any) {
    request.locals.isAuthenticated = request.isAuthenticated();
    next();
}