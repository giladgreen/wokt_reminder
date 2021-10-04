
import request from 'request';
import URL_PREFIX from './url';

async function subscribeRestaurant(restaurantName, restaurantId, location, provider, token) {
  const body = JSON.stringify({
    restaurantName,
    restaurantId,
    location
  });

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `${URL_PREFIX}/subscriptions`,
      headers: {
        provider,
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
      body,
    };

    request(options, (error, response, body) => {
      if (error || response.statusCode >= 400) {
        if (error) {
          console.error('request cb error.failed to get subscribeRestaurant', error);
          return reject('failed to get subscribeRestaurant');
        }
        const bodyObj = typeof body === object ? body : JSON.parse(body);
        console.error('failed to subscribeRestaurant data', bodyObj);
        return reject(bodyObj.title);
      }
      const parsedBody = JSON.parse(body);
      console.log('subscribeRestaurant, parsedBody',parsedBody)
      localStorage.setItem('email', parsedBody.userContext.email);
      return resolve(parsedBody.subscriptions);
    });
  });
}

export default subscribeRestaurant;
