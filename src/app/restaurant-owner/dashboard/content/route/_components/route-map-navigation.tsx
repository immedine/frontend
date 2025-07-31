import React, { useState, useEffect } from "react";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const center = { lat: 51.972466, lng: 5.613491 };

const MapWithDirections = (props) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API, 
    libraries: ["places"],
  });

  console.log("props ", props)

  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (isLoaded && props?.storyPoints?.length > 1) {
      const directionsService = new google.maps.DirectionsService();
      const origin = {lat: props?.storyPoints[0].coordinates[1], lng: props?.storyPoints[0].coordinates[0]};
      const destination = {lat: props?.storyPoints[props?.storyPoints.length - 1].coordinates[1], lng: props?.storyPoints[props?.storyPoints.length - 1].coordinates[0]};
      let waypoints = [];
      if (props.storyPoints.length > 2) {
        waypoints = props.storyPoints.map((each, ind) => {
          if (ind !== 0 && ind !== props.storyPoints.length - 1) {
            return { location: {
              lat: each.coordinates[1],
              lng: each.coordinates[0]
            }, stopover: true }
          }
        }).filter(each => each);
      }
      
      let routeObj = {
          origin, // Howrah Railway Station
          destination, // Kolkata Airport
          optimizeWaypoints: true, // Optimize waypoint order
          travelMode: google.maps.TravelMode.WALKING,
        };
        if (waypoints.length) {
          routeObj.waypoints = waypoints;
        }
      console.log("in here ", routeObj)

      directionsService.route(
        routeObj,
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  }, [isLoaded, props.storyPoints]);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      {isLoaded && (
        <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={center} zoom={12}>
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      )}
    </div>
  );
};

export default MapWithDirections;
