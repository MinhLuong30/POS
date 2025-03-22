import { View, Text } from 'react-native'
import { useEffect, useState } from 'react'
import * as Location from 'expo-location'

const useLocation = () => {
    const [errorMsg, setErrorMsg] = useState("");
    const [longitube, setLongitube] = useState("");
    const [latitude, setLatitude] = useState("");
    const [location, setLocation] = useState(null);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let { coords } = await Location.getCurrentPositionAsync({});
        
        if (coords) {
            const { latitude, longitude } = coords;
            setLatitude(latitude);
            setLongitube(longitude);
            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });
           
            setLocation(response);
        }
    }

    useEffect(() => {
        getLocation();
    }
    , []);

    return {location, errorMsg};
}

export default useLocation