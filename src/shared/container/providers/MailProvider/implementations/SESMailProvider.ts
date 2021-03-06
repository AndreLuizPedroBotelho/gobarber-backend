import { injectable, inject } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import mailConfig from '../../../../../config/mail';

import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvier: IMailTemplateProvider
  ) {
    try {
      if (process.env.MAIL_DRIVER === 'ses') {
        this.client = nodemailer.createTransport({
          SES: new aws.SES({
            apiVersion: '2010-12-01',
            region: process.env.AWS_DEFAULT_REGION,
          }),
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async sendEmail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    if (this.client) {
      await this.client.sendMail({
        from: {
          name: from?.name || name,
          address: from?.email || email,
        },
        to: {
          name: to.name,
          address: to.email,
        },
        subject,
        html: await this.mailTemplateProvier.parse(templateData),
      });
    }
  }
}
