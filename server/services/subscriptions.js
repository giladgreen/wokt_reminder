const moment = require('moment');
const logger = require('../helpers/logger');
const { getSpecificRestaurant } = require('./search');
const { sendHtmlMail } = require('../helpers/email');
const { subscriptions, users, logs, Sequelize: { Op }, } = require('../models');
const INTERVAL = 30000;//30 sec
const PRUNE_INTERVAL = 1000 * 60 * 10;//10 minutes
const AMOUNT = 30;
const UNITS = 'hours';

async function isOpenForDelivery(restaurantName, restaurantId, location) {
   const restaurant = await getSpecificRestaurant(restaurantName, restaurantId, location)
   if (!restaurant) {
       return false;
   }
   return restaurant.isOpen;
}
const ADMIN_MAIL = process.env.ADMIN_MAIL ? process.env.ADMIN_MAIL : require('../../local').ADMIN_MAIL;

async function checkUserSubscription(subscription) {
    logger.info(`checkUserSubscription: ${JSON.stringify(subscription)}`);

    const {restaurantName, restaurantId, lat,lon, email, id, restaurantImage, restaurantAddress} = subscription;
    const isOpen = await isOpenForDelivery(restaurantName, restaurantId, { lat, lon });
    if (isOpen) {
        sendHtmlMail(`Restaurant ${restaurantName} is now open for deliveries`, `<div><div><b>Restaurant ${restaurantName} is now open for deliveries</b><br/></div><div>you have automatically unsubscribe for this Restaurant.</div></div>`, email)
        if (email !== ADMIN_MAIL){
            const userInfo = (await users.findOne({where:{ email}})) || {};

            sendHtmlMail(`Restaurant open.. `,
                `
            <div>
                <div>Subscriber info: </div>
                <div> <b>${email}</b> </div>
                <div> <b>${userInfo.firstName} ${userInfo.familyName}</b> </div>
                <div> <img src="${userInfo.imageUrl}"/> </div>
               
                <br/>
                <div>Restaurant info: </div>
                <div>${restaurantName} </div>
                 <div> <img src="${restaurantImage}"/> </div>
                <div>${restaurantAddress} </div>
            </div>`, ADMIN_MAIL);

        }
        await subscriptions.destroy({where: { id }});
    }
}


async function getUserSubscriptions(email) {
    let userSubscriptions;
    if (email === ADMIN_MAIL) {
        userSubscriptions = (await subscriptions.findAll()).map(item => item.toJSON());
        const allUsers = (await users.findAll()).map(item => item.toJSON());
        userSubscriptions = userSubscriptions.map((userSubscription) =>{
            const newUserSubscription = { ... userSubscription}
            newUserSubscription.subscriber = allUsers.find(user => user.email === userSubscription.email);
            newUserSubscription.isAdmin = userSubscription.email === ADMIN_MAIL;
            return newUserSubscription;
        });
    } else{
        userSubscriptions = (await subscriptions.findAll({
            where: {
                email
            },
        })).map(item => item.toJSON());
    }
    return userSubscriptions;
}

async function subscribe(req, res) {
    const { userContext } = req;
    const { email } = userContext;
    const { restaurantName, restaurantId, location, } = req.body;
    try {
      if (!restaurantName || !location || !location.lat || !location.lon || !email || !restaurantId) {
          res.status(400).send({ message: 'missing attribute', restaurantName, location, email, restaurantId });
      }

      logger.info(`subscribe restaurantName: ${restaurantName},restaurantId:${restaurantId} email=${email},  lat=${location.lat}, lon=${location.lon}`);
      const restaurant = await getSpecificRestaurant(restaurantName, restaurantId, location)
      if (!restaurant) {
          res.status(400).send({ message: 'can not find this restaurant', restaurantName, location, email, restaurantId });
      }

      if (restaurant.isOpen) {
          res.status(400).send({ message: 'restaurant already open'});
          return;
      }
      const { image: { url:restaurantImage}, venue: { address: restaurantAddress } } = restaurant;
      const existing = await subscriptions.findOne({ where:{
              restaurantId,
              email
          }})
      if (!existing) {
          await subscriptions.create({
              restaurantId,
              email,
              lat:location.lat,
              lon:location.lon,
              restaurantName,
              restaurantImage,
              restaurantAddress,
          })
      }

      const userSubscriptions = await getUserSubscriptions(email);

      return res.status(200).send({ subscriptions: userSubscriptions, userContext });
  } catch(e) {
      logger.info('subscribe ERROR');
      logger.info(`restaurantName: ${restaurantName},restaurantId:${restaurantId} email=${email},  lat=${location.lat}, lon=${location.lon}`);
      logger.error(`error stack: ${e.stack}`);
      logger.error(`error message: ${e.message}`);

      logs.create({
        text: `error on subscribe. restaurantName: ${restaurantName},restaurantId:${restaurantId} email=${email},  lat=${location.lat}, lon=${location.lon}, error message: ${e.message}, error stack: ${e.stack}`,
        level: 'ERROR'
      });

      return res.status(500).send({ message: 'something went wrong' });
  }
}

async function getSubscriptions(req, res, next) {
    try {
        const { userContext } = req;
        console.log('getSubscriptions, userContext', userContext);
        const { email } = userContext;
        const userSubscriptions = await getUserSubscriptions(email);
        return res.status(200).send({ subscriptions: userSubscriptions, userContext });
    } catch(e) {
        next(e);
    }
}
async function unsubscribe(req, res, next) {
  try {
      const { userContext } = req;
      console.log('unsubscribe, userContext', userContext);
      const { email } = userContext;
      const { restaurantName, restaurantId, location } = req.body;
      if (!restaurantName || !location || !email || !restaurantId) {
          res.status(400).send({ message: 'missing attribute', restaurantName, location, email, restaurantId });
      }

      logger.info(`unsubscribe restaurantName: ${restaurantName},restaurantId:${restaurantId} email=${email},  lat=${location.lat}, lon=${location.lon}`);

      await subscriptions.destroy({
          where:{
              restaurantId,
              email,
          }
      })
      const userSubscriptions = await getUserSubscriptions(email);
      return res.status(200).send({ subscriptions: userSubscriptions, userContext });

  } catch(e) {
      next(e);
  }
}

setInterval(async()=>{
    const allSubscriptions = await subscriptions.findAll();
    const text = `checking on status for ${allSubscriptions.length} Subscriptions`;
    logger.info(text);
    allSubscriptions.forEach(checkUserSubscription);
    logs.create({
        text,
        level: 'DEBUG'
    });
},INTERVAL);


//run every PRUNE_INTERVAL time nd delete from subscriptions table anything older then X hours
setInterval(async()=>{
    logger.info(`pruning..`);
    await logs.create({
        text: 'performing pruning',
        level: 'DEBUG'
    });
    const lastDate = moment().subtract(AMOUNT, UNITS).toDate();
    await subscriptions.destroy({where:{
            createdAt: {
                [Op.lte]: lastDate,
            },
        }})
},PRUNE_INTERVAL);


module.exports = {subscribe,unsubscribe, getSubscriptions }
