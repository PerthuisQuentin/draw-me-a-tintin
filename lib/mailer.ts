import * as Fs from 'fs';
import * as Path from 'path';
import * as Nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import { Promise } from 'ts-promise';

import config from './config';
import Log from './logger';
import * as I18n from './i18n';

const templatesPath: string = "views/mails";
const sender: string = config.mailer.from;

const Templates: any = {
    Activation: {
        name: "activation",
        subject: "account-validation"
    }
};

export interface IActivationContext {
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

for(let i in Templates) {
    Fs.readFile(Path.join(templatesPath, Templates[i].name + '.hbs'), 'utf8', (err, data) => {
        if(err) 
            return Log.error('Error while loading email teamplate : ' + err);

        Templates[i].html = Handlebars.compile(data);
    });
}

export function send(receiver: string, subject: string, html: string): Promise<Nodemailer.SentMessageInfo> {
    return new Promise<Nodemailer.SentMessageInfo>((resolve, reject) => {
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

function sendTemplate(receiver: string, language: string, template: any, context: any): Promise<Nodemailer.SentMessageInfo> {
    return send(
            receiver, 
            I18n.get(language, template.subject), 
            template.html(context)
    );
}

export function sendActivationMail(receiver: string, language: string, context: IActivationContext): Promise<Nodemailer.SentMessageInfo> {
    return sendTemplate(receiver, language, Templates.Activation, context);
}