import * as Fs from 'fs';
import * as Path from 'path';
import * as Nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';

import config from './config';
import Log from './logger';
import { Promise } from 'ts-promise';

const templatesPath: string = "views/mails";
const sender: string = config.mailer.from;


interface ITemplates {
    [template: string]: string;
}

export var templates: ITemplates = {
    SIGNUP: "signup"
};

var templatesHbs: any = {};


interface IContext {}

export interface ISignupContext extends IContext {
    name: string,
    url: string
} 


if(!process.env[config.mailer.user]) {
    Log.error('Can\'t find user environnement variable for mailer');
    process.exit(1);
}
if(!process.env[config.mailer.pass]) {
    Log.error('Can\'t find password environnement variable for mailer');
    process.exit(1);
}

var transporter: Nodemailer.Transporter = Nodemailer.createTransport({
    service: config.mailer.service,
    auth: {
        user: process.env[config.mailer.user],
        pass: process.env[config.mailer.pass]
    }
});

for(let name in templates) {
    Fs.readFile(Path.join(templatesPath, templates[name] + '.hbs'), 'utf8', (err, data) => {
        if(err) 
            return Log.error('Error while loading email teamplate : ' + err);

        templatesHbs[templates[name]] = Handlebars.compile(data);
    });
}

export function send(receiver: string, subject: string, html: string) {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: sender,
            to: receiver,
            subject: subject,
            html: html
        }, function(err, info) {
            if(err) {
                reject(err);
            }
            else {
                resolve(info);
            }
        });
    });
}

// Send a email using a loaded template
export function sendTemplate(receiver: string, subject: string, template: string, context: any) {
    return new Promise((resolve, reject) => {
        
        if(!templatesHbs[template]) return reject(new Error('Unknown template : ' + template));

        let html = templatesHbs[template](context);

        send(receiver, subject, html)
        .then(resolve)
        .catch(reject);
    });
};