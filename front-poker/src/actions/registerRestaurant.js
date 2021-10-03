
import request from 'request';
import URL_PREFIX from './url';

async function registerRestaurant(restaurantName, restaurantId, location, provider, token) {
  const body = JSON.stringify({
    restaurantName,
    restaurantId,
    location
  });

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `${URL_PREFIX}/registrations`,
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
          console.error('request cb error.failed to get registrations', error);
          return reject('failed to get registrations');
        }
        const bodyObj = typeof body === object ? body : JSON.parse(body);
        console.error('failed to registerRestaurant data', bodyObj);
        return reject(bodyObj.title);
      }
      return resolve(JSON.parse(body).registrations);
    });
  });
}

export default registerRestaurant;
