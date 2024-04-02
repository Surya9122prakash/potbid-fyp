import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { geocodeByLatLng } from 'react-places-autocomplete';
import { IoLocationSharp } from "react-icons/io5";

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            mapCenter: {
                lat: 49.2827291,
                lng: -123.1207375
            }
        }
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = (address) => {
        geocodeByAddress(address)
            .then(results => {
                this.props.setCords({ coordinates: [ results[0].geometry.location.lat(),   results[0].geometry.location.lng()], address: results[0].formatted_address })
                console.log('Geocode results:', results[0].geometry.location.lat());
                console.log('Geocode results:', results[0].geometry.location.lng()); // Add this line
                // Add this line
                return getLatLng(results[0]);
            })
            .then(latLng => {
                console.log('Success', latLng);
                console.log('Address', address);
                this.setState({ address });
                this.setState({ mapCenter: latLng });
                this.props.setLocation(address); // Ensure setLocation is called correctly
            })
            .catch(error => console.error('Error', error));
    };


    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    };

    onMapClicked = (mapProps, map, clickEvent) => {
        const { latLng } = clickEvent;
        const lat = latLng.lat();
        const lng = latLng.lng();

        console.log('Clicked coordinates:', lat, lng);

        geocodeByLatLng({ lat, lng })
            .then(results => {
                console.log('Geocoding results:', results);
                if (results && results.length > 0) {
                    const address = results[0].formatted_address;
                    console.log('Address:', address);
                    this.setState({
                        address: address,
                        mapCenter: { lat: lat, lng: lng }
                    });
                    this.props.setLocation(address);
                }
            })
            .catch(error => console.error('Error', error));
    };


    render() {
        return (
            <div id="googleMap" className='relative z-1'>
                <div className='flex'>
                    <div className="pl-2 pt-4"><IoLocationSharp size={40} color='white' /></div>
                    &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                    <div className="pl-1.5 w-screen">
                        <PlacesAutocomplete
                            value={this.state.address}
                            onChange={this.handleChange}
                            onSelect={this.handleSelect}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <input
                                        {...getInputProps({
                                            placeholder: 'Search Places ...',
                                            className: 'location-search-input w-full h-[6vh] mt-2 p-2 rounded-lg bg-white focus:text-black text-black',
                                        })}
                                    />
                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>
                    </div>
                </div>
                <div className='px-16'>
                    <Map
                        style={{ width: '43vw', height: '50vh' }}
                        className=""
                        google={this.props.google}
                        initialCenter={{
                            lat: this.state.mapCenter.lat,
                            lng: this.state.mapCenter.lng
                        }}
                        center={{
                            lat: this.state.mapCenter.lat,
                            lng: this.state.mapCenter.lng
                        }}
                    // onClick={this.onMapClicked}
                    >
                        <Marker
                            onClick={this.onMarkerClick}
                            position={{
                                lat: this.state.mapCenter.lat,
                                lng: this.state.mapCenter.lng
                            }}
                        />
                    </Map>
                </div>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: ('your_key')
})(MapContainer);
