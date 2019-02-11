'use strict';

module.exports = function (controller, config, logger) {
    config = config || require('./config.json');

    if (typeof logger === 'undefined') {
        const winston = require('winston');

        let date = new Date().toISOString();

        const logFormat = winston.format.printf(function(info) {
            return `${date}-${info.level}: ${JSON.stringify(info.message, null, 4)}\n`;
        });

        logger = new winston.createLogger({
            'transports': [
                new winston.transports.Console({
                    'format': winston.format.combine(winston.format.colorize(), logFormat)
                })
            ]
        });
    }

    controller.on('link_shared', (bot, message) => {
        bot.replyAcknowledge();

        logger.log({
            'level': 'info',
            'message': message
        });

        const unfurls = {};

        unfurls[message.event.links[0].url] = {
            'text': 'testing 1',
        };

        if (message.event.links.length > 1) {
            unfurls[message.event.links[1].url] = {
                'title': 'testing 2',
                'title_link': 'https://example.com',
                'text': 'testing 2',
                'fields': [
                    {
                        'title': 'Testing 2',
                        'value': 10,
                        'short': true
                    }
                ],
                'actions': [
                    {
                        'name': 'Testing',
                        'text': 'Testing 2',
                        'type': 'button',
                        'value': 'testing'
                    }
                ]
            };
        }

        bot.api.chat.unfurl({
            'token': config.oAuthToken,
            'channel': message.event.channel,
            'ts': message.event.message_ts,
            'unfurls': JSON.stringify(unfurls),
        });
    });
};
