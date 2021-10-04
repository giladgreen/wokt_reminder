
import request from 'request';

import URL_PREFIX from './url';
async function getSearchResults(restaurantName, location) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `${URL_PREFIX}/search`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        restaurantName,
        location,
      }),
    };

    request(options, (error, response, body) => {
      if (error || response.statusCode >= 400) {
        if (error) {
          console.error('request cb error.failed to getSearchResults', error);
          return reject('failed to get getSearchResults');
        }
        const bodyObj = JSON.parse(body);
        console.error('failed to getSearchResults', bodyObj);
        return reject(bodyObj.title);
      }
      const { results } = JSON.parse(body);
      return resolve(results);
    });
  });
}

export default getSearchResults;
