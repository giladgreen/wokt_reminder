const moment = require('moment');
const logger = require('../logger');
const googleTokenStrategy = require('../helpers/google-auth');
const facebookTokenStrategy = require('../helpers/facebook-auth');
const { sendHtmlMail } = require('../email');
const { users, Sequelize: { Op }, } = require('../models');

const EMAIL_USER = process.env.EMAIL_USER;

const LEGAL_PROVIDERS = ['facebook', 'google'];
module.exports = async function userContextMiddleware(request, response, next) {
    try {
        if (request.method === 'OPTIONS') {
            return next();
        }

        const { headers } = request;
        const { provider } = headers;
        const accessToken = headers['x-auth-token'];
        if (!provider || !accessToken) {
            throw 'missing token headers';
        }
        if (!LEGAL_PROVIDERS.includes(provider)) {
            throw `unknown provider: ${provider}`;
        }
        let existingUser;
        try {
            existingUser = await users.findOne({
                where: {
                    token: accessToken,
                    tokenExpiration: {
                        [Op.gte]: new Date(),
                    },
                },
            });
        } catch (e) {
            logger.info('[UserContext:fitting] ERROR ');
            logger.info(e.message);
            logger.info(e);
            throw e;
        }

        if (existingUser) {
            const userContext = existingUser.toJSON();
            request.userContext = userContext;

            await users.update({
                    tokenExpiration: moment().add(1, 'days').toDate(),
                },
                {
                    where: {
                        id: existingUser.id,
                    },
                });
            response.setHeader('x-user-context', encodeURI(JSON.stringify(userContext)));
            return next();
        }


        const profile = await (provider === 'google'
            ? googleTokenStrategy.authenticate(accessToken)
            : facebookTokenStrategy.authenticate(accessToken));
        logger.info(`[UserContext:fitting] user request by: ${profile.firstName} ${profile.familyName}. (${profile.email})`);

        // create/update user in db
        let user = await users.findOne({
            where: {
                email: profile.email,
            },
        });

        if (!user) {
            logger.info(`[UserContext:fitting] creating new user: ${profile.firstName} ${profile.familyName}. (${profile.email})`);

            user = await users.create({ ...profile, tokenExpiration: moment().add(1, 'days').toDate(), token: accessToken });
            sendHtmlMail(`new user: ${user.firstName} ${user.familyName}, has logged in`, `new user: ${user.firstName} ${user.familyName}, has logged in`, EMAIL_USER);
        } else {
            logger.info(`[UserContext:fitting] user already in db: ${profile.firstName} ${profile.familyName}. (${profile.email})`);
            if (shouldSendMail(user)) {
                sendHtmlMail(`${user.firstName} ${user.familyName} has logged in`,`${user.firstName} ${user.familyName} has logged in`, EMAIL_USER);
            }
            const [, results] = await users.update({ ...profile, tokenExpiration: moment().add(3, 'hours').toDate(), token: accessToken }, { where: { id: user.id }, returning: true });
            user = results[0];
        }

        request.userContext = user.toJSON();

        try {
            response.setHeader('x-user-context', encodeURI(JSON.stringify(request.userContext)));
        } catch (e) {
            response.setHeader('x-user-context', encodeURI(JSON.stringify({ email: request.userContext.email, token: request.userContext.token })));
        }

        return next();
    } catch (error) {
        logger.error(`[UserContext:fitting] error: ${JSON.stringify(error)} `);
        return next(new Error('failed to login'));
    }
}
