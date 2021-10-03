const moment = require('moment');
const logger = require('../helpers/logger');
const { getSpecificRestaurant } = require('./search');
const { sendHtmlMail } = require('../helpers/email');
const { subscriptions, Sequelize: { Op }, } = require('../models');
const INTERVAL = 30000;
const PRON_INTERVAL = 1000 * 60 * 10;
const AMOUNT = 15;
const UNITS = 'hours';

async function isOpenForDelivery(restaurantName, restaurantId, location) {
   const restaurant = await getSpecificRestaurant(restaurantName, restaurantId, location)
   if (!restaurant) {
       return false;
   }
   return restaurant.isOpen;
}

async function checkUserSubscription(subscription) {
    logger.info(`checkUserSubscription: ${JSON.stringify(registration)}`);

    const {restaurantName, restaurantId, lat,lon, email, id} = registration;
    const isOpen = await isOpenForDelivery(restaurantName, restaurantId, { lat, lon });
    if (isOpen) {
        sendHtmlMail(`Restaurant ${restaurantName} is now open for deliveries`, `<div><div><b>Restaurant ${restaurantName} is now open for deliveries</b><br/></div><div>you have been automatically unregister for this Restaurant.</div></div>`, email)
        await registrations.destroy({where: { id }});
    }
}


async function getUserRegistrations(email) {
    const userRegistrations = await registrations.findAll({
        where: {
            email
        },
    })
    return userRegistrations;
}

async function subscribe(req, res) {
    const { userContext } = req;
    console.log('subscribe, userContext', userContext);
    const { restaurantName, restaurantId, location, emailAddress } = req.body;
    try {
      if (!restaurantName || !location || !location.lat || !location.lon || !emailAddress || !restaurantId) {
          res.status(400).send({ message: 'missing attribute', restaurantName, location, emailAddress, restaurantId });
      }

      logger.info(`REGISTER restaurantName: ${restaurantName},restaurantId:${restaurantId} emailAddress=${emailAddress},  lat=${location.lat}, lon=${location.lon}`);
      const restaurant = await getSpecificRestaurant(restaurantName, restaurantId, location)
      if (!restaurant) {
          res.status(400).send({ message: 'can not find this restaurant', restaurantName, location, emailAddress, restaurantId });
      }

      if (restaurant.isOpen) {
          res.status(400).send({ message: 'restaurant already open'});
          return;
      }
      const { image: { url:restaurantImage}, venue: { address: restaurantAddress } } = restaurant;
      const existing = await registrations.findOne({ where:{
              restaurantId,
              email: emailAddress
          }})
      if (!existing) {
          await registrations.create({
              restaurantId,
              email: emailAddress,
              lat:location.lat,
              lon:location.lon,
              restaurantName,
              restaurantImage,
              restaurantAddress,
          })
      }

      const userRegistrations = await getUserRegistrations(emailAddress);

      return res.status(200).send({ registrations: userRegistrations });
  } catch(e) {
      logger.info('REGISTER ERROR');
      logger.info(`restaurantName: ${restaurantName},restaurantId:${restaurantId} emailAddress=${emailAddress},  lat=${location.lat}, lon=${location.lon}`);
      logger.error(`error stack: ${e.stack}`);
      logger.error(`error message: ${e.message}`);
      return res.status(500).send({ message: 'something went wrong' });
  }
}

async function getSubscriptions(req, res, next) {
    try {
        const { email } = req.body;
        if (!email ) {
            res.status(400).send({ message: 'missing attribute', email });
        }
        const userRegistrations = await getUserRegistrations(email);
        return res.status(200).send({ registrations: userRegistrations });
    } catch(e) {
        next(e);
    }
}
async function unsubscribe(req, res, next) {
  try {
      const { restaurantName, restaurantId, location, emailAddress } = req.body;
      if (!restaurantName || !location || !emailAddress || !restaurantId) {
          res.status(400).send({ message: 'missing attribute', restaurantName, location, emailAddress, restaurantId });
      }

      logger.info(`UNREGISTER restaurantName: ${restaurantName},restaurantId:${restaurantId} emailAddress=${emailAddress},  lat=${location.lat}, lon=${location.lon}`);

      await registrations.destroy({
          where:{
              restaurantId,
              email: emailAddress,
          }
      })
      const userRegistrations = await getUserRegistrations(emailAddress);
      return res.status(200).send({ registrations: userRegistrations });

  } catch(e) {
      next(e);
  }
}

setInterval(async()=>{
    const allSubscriptions = await subscriptions.findAll();
    allSubscriptions.forEach(checkUserSubscription);
},INTERVAL);


//run every PRON_INTERVAL time nd delete from registrations table anything older then X hours
setInterval(async()=>{
    logger.info(`pronning..`);

    const lastDate = moment().subtract(AMOUNT, UNITS).toDate();
    await registrations.destroy({where:{
            createdAt: {
                [Op.lte]: lastDate,
            },
        }})
},PRON_INTERVAL);


module.exports = {subscribe,unsubscribe, getSubscriptions }
