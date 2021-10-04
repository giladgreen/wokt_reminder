
import request from 'request';
import URL_PREFIX from './url';

async function unsubscribeRestaurant(restaurantName, restaurantId, location, provider, token) {
  const body = JSON.stringify({
    restaurantName,
    restaurantId,
    location,
  });

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `${URL_PREFIX}/unsubscribe`,
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
          console.error('request cb error.failed to get unsubscribeRestaurant', error);
          return reject('failed to get unsubscribeRestaurant');
        }
        const bodyObj = typeof body === object ? body : JSON.parse(body);
        console.error('failed to unsubscribeRestaurant data', bodyObj);
        return reject(bodyObj.title);
      }
      const parsedBody = JSON.parse(body);
      console.log('unsubscribeRestaurant, parsedBody',parsedBody)
      localStorage.setItem('email', parsedBody.userContext.email);
      return resolve(parsedBody.subscriptions);
    });
  });
}

export default unsubscribeRestaurant;
