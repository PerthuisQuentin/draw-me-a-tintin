import Server from './lib/server';

var server = new Server();

server.start();



import { websitePathJoin } from './lib/utils';

console.log(websitePathJoin("test"));
console.log(websitePathJoin("test", "machin"));
console.log(websitePathJoin("test", "truc", "256"));
