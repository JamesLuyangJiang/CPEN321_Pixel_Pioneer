const express = require('express')
const axios = require('axios')
const router = express.Router()

router.get('/', async (req, res) => {
    const client_ip = "184.68.183.186"
    try {
        const response = await axios.get(`https://ipinfo.io/${client_ip}/json`);
        const geolocationData = response.data;
        const lat = geolocationData.loc.split(',')[0]
        const lon = geolocationData.loc.split(',')[1]
        try {
            const list_of_cities_response = await axios.get(`https://geogratis.gc.ca/services/geoname/en/geonames.json?lat=${lat}&lon=${lon}&radius=100`)
            const actual_data_items = list_of_cities_response.data.items
            var customized_response_list = []
            for (let i = 0; i < actual_data_items.length; i++) {
                const currentObject = actual_data_items[i];
                var customized_response = {
                    name: currentObject.name,
                    latitude: currentObject.latitude,
                    longitude: currentObject.longitude,
                }
                customized_response_list.push(customized_response)
                console.log(`Object Name: ${currentObject.name}, Object Lat: ${currentObject.latitude}, Object Lon: ${currentObject.longitude}`);
            }
            res.json(customized_response_list);
        } catch (error) {
            res.status(500).json({ error: 'Unable to retrieve geolocation data' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve geolocation data' });
    }
})

router.post('/', (req, res) => {
    res.send("This post request should return a list of recommended places based on the filters provided by the users.")
})

module.exports = router;