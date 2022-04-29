import React, { useEffect, useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData, getWeatherData } from './api/travelAdvisorAPI';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

const App = () => {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setfilteredPlaces] = useState([])
    const [childClicked, setChildClinked] = useState(null);

    const [coords, setCoords] = useState({});
    const [bounds, setBounds] = useState({});
    const [weatherData, setWeatherData] = useState([]);
    const [autocomplete, setAutocomplete] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoords({ lat: latitude, lng: longitude });
        });
    }, []);

    useEffect(() => {
        const filteredPlaces = places.filter((place) => place.rating > rating)
            setfilteredPlaces(filteredPlaces);
    }, [rating]);


    useEffect(() => {
        if(bounds.sw && bounds.ne){
        setIsLoading(true);

        getWeatherData(coords.lat, coords.lng)
            .then((data) => setWeatherData(data));

        getPlacesData(type, bounds.sw, bounds.ne)
            .then((data) => {
                console.log(data?.filter((place) => place.name && place.num_reviews > 0 ));
                setfilteredPlaces([])
                setIsLoading(false);
            })
        }
    }, [bounds, type]);

    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
      const lat = autocomplete.getPlace().geometry.location.lat();
      const lng = autocomplete.getPlace().geometry.location.lng();
  
      setCoords({ lat, lng });
    };  

    return (
        <>
            <CssBaseline />
            <Header setCoords={setCoords} />
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List 
                    places = { places } 
                    childClicked={childClicked}
                    isLoading={isLoading}
                    type={type}
                    setType={setType}
                    rating={rating}
                    setRating={setRating}
                    />
                    
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map 
                        setCoords={setCoords}
                        setBounds={setBounds}
                        coords={coords}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        setChildClinked={setChildClinked}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default App;