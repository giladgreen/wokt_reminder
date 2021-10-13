import request from 'request';

async function getLocationData(lat, lon) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyDETKwQl9ihdbQaNYYngJ7tpM2f2pQlxLI&language=he&region=IL`,
    };

    request(options, (error, response, body) => {
      const result = JSON.parse(body).results;
     // console.log('result',result)
      const address = result[0].formatted_address;
      return resolve(address);
    });
  });
}

export default getLocationData;
