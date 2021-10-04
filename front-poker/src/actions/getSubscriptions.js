
import request from 'request';
import URL_PREFIX from './url';

async function getSubscriptions(provider, token) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: `${URL_PREFIX}/subscriptions`,
      headers: {
        provider,
        'x-auth-token': token,
        'Content-Type': 'application/json',
      }
    };

    request(options, (error, response, body) => {
      if (error || response.statusCode >= 400) {
        if (error) {
          console.error('request cb error.failed to get getSubscriptions', error);
          return reject('failed to get getSubscriptions');
        }
        const bodyObj = typeof body === object ? body : JSON.parse(body);
        console.error('failed to getSubscriptions data', bodyObj);
        return reject(bodyObj.title);
      }
      const parsedBody = JSON.parse(body);
      return resolve(parsedBody);
    });
  });
}

export default getSubscriptions;
