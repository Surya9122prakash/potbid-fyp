const axios = require("axios");

const API_KEY = "AIzaSyAqq_dnduaIaSbwiorZ5ku6EsVfFNmvRTc"

async function getCoordsForAddress(location){
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${API_KEY}`)
    const data=response.data;

    if(!data || data.status === "ZERO_RESULTS"){
        console.log("Could not find location for the specified address")
    }

    const coords = data.results[0].geometry.location;
    return coords;
}

module.exports = getCoordsForAddress;