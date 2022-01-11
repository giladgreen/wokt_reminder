const axios = require('axios');
const logger = require('../helpers/logger');
const { logs } = require('../models');

async function getSearchResults(restaurantName, location) {
    try {
        const searchPath = `https://restaurant-api.wolt.com/v1/pages/search?q=${encodeURIComponent(restaurantName)}&lat=${location.lat}&lon=${location.lon}`;
        const options = {
            headers: {'app-language': 'he'}
        };
        const { data: { sections } } = await axios.get(searchPath, options);
        if (!sections || !sections[0] || !sections[0].items){
            return [];
        }
        return sections[0].items.map((restaurant)=>{
            return {
                ...restaurant,
                isOpen: restaurant.venue.online && restaurant.venue.delivers
            }
        });
    } catch (e) {
        logger.error(`getSearchResults ERROR! restaurantName: ${restaurantName}, lat=${location.lat}, lon=${location.lon}`);
        logger.error(`error message: ${e.message}`);
        logger.error(`error stack: ${e.stack}`);

        logs.create({
            text: `error on getSearchResults. restaurantName: ${restaurantName}, lat=${location.lat}, lon=${location.lon}, error message: ${e.message}, error stack: ${e.stack}`,
            level: 'ERROR'
        });

        return [];
    }
}



async function getSpecificRestaurant(restaurantName,restaurantId, location) {
    const results = await getSearchResults(restaurantName, location);
    const restaurant = results.find(i => i.track_id === restaurantId);
    return restaurant;
}

async function search(req, res, next) {
  try {
      const { restaurantName, location } = req.body;
      if (!restaurantName || !location) {
          res.status(400).send({ message: 'missing attribute', restaurantName, location});
      }
      logger.info(`SEARCH restaurantName: ${restaurantName},   lat=${location.lat}, lon=${location.lon}`);
      const results = await getSearchResults(restaurantName, location)
      return res.status(200).send({ results });
  } catch(e) {
      next(e);
  }
}

module.exports = {
    getSpecificRestaurant,
    search,
}
