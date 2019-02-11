(function() {
    'use strict';

    const config = require('./config.json');
    const winston = require('winston');

    let date = new Date().toISOString();
    const logFormat = winston.format.printf(function(info) {
        return `${date}-${info.level}: ${JSON.stringify(info.message, null, 4)}\n`;
    });
    const logger = new winston.createLogger({
        'transports': [
            new winston.transports.Console({
                'format': winston.format.combine(winston.format.colorize(), logFormat)
            })
        ]
    });

    const port = config.port || 1337;

    const Botkit = require('botkit');

    const controller = Botkit.slackbot({
        'clientId': config.clientId,
        'clientSecret': config.clientSecret,
        'clientSigningSecret': config.clientSigningSecret,
        'debug': false,
        'json_file_store': 'data',
        'stats_optout': true,
    });

    const bot = controller.spawn({
        'token': config.botToken,
    });

    bot.api.team.info({}, (err, res) => {
        if (err) {
            logger.log('error', err);
        } else {
            controller.storage.teams.save({
                'id': res.team.id,
                'bot': {
                    'user_id': 1,
                    'name': 'App'
                }
            }, (error) => {
                if (error) {
                    logger.log('error', error);
                }
            });
        }
    });

    controller.setupWebserver(port, (err, webserver) => {
        if (err) {
            logger.log('error', err);
        } else {
            controller.createWebhookEndpoints(webserver);
        }
    });

    require('./LinkSharedHandler.js')(controller, config, logger);
}());
