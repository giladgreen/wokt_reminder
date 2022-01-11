import request from 'request';
import URL_PREFIX from "../helpers/url";

async function getLocationData(lat, lon) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: `${URL_PREFIX}/location-address?lat=${lat}&lon=${lon}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    request(options, (error, response, body) => {
      if (error || response.statusCode >= 400) {
        if (error) {
          console.error('request cb error.failed to getLocationData', error);
          return reject('failed to get getLocationData');
        }
        const bodyObj = JSON.parse(body);
        console.error('failed to getLocationData', bodyObj);
        return reject(bodyObj.title);
      }
      console.log('body type', typeof body)
      console.log('body ',  body)
      const { address } = JSON.parse(body);
      return resolve(address);
    });
  });
}

export default getLocationData;
