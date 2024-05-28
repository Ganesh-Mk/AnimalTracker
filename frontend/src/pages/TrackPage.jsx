import React, { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
} from 'react-leaflet'
import { setAnimalName, setAnimalLat, setAnimalLong, setAnimalMeter, setAnimalKm, setAnimalDate, setAnimalTime, setAnimalOutside } from '../store/animalSlice';
import 'leaflet/dist/leaflet.css'
import '../styles/TrackPage.css'
import cat from '../images/cat.png'
import dog from '../images/dog.png'
import elephant from '../images/elephant.webp'
import owner from '../images/owner.png' // Add an image for the owner
import '../styles/CustomMarker.css' // Import CSS file for custom marker styles
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const TractPage = () => {
  const [centerPosition, setCenterPosition] = useState([16.1622, 74.8298]) // Initial center position [latitude, longitude]
  const [ownerPosition, setOwnerPosition] = useState(null) // Initial owner position
  const [markers, setMarkers] = useState([
    // Initial markers for dog
    [[16.1622, 74.8298]],
    // Initial markers for cat
    [[16.1605, 74.8323]],
    // Initial markers for elephant
    [[16.1585, 74.8278]],
  ])
  const [circleRadius, setCircleRadius] = useState(1000) // Initial circle radius in meters
  const [outsideCircle, setOutsideCircle] = useState([]) // Track animals outside the circle
  const [distances, setDistances] = useState([]) // Track distances between owner and animals
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // // Request user's location
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     const { latitude, longitude } = position.coords
    //     setOwnerPosition([latitude, longitude])
    //   },
    //   (error) => {
    //     console.error('Error getting user location:', error)
    //   },
    // )

    setOwnerPosition([16.1652, 74.8298])
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      // Update markers for each animal
      const newMarkers = markers.map((animalMarkers) => [
        ...animalMarkers,
        [
          animalMarkers[animalMarkers.length - 1][0] + getRandomOffset(),
          animalMarkers[animalMarkers.length - 1][1] + getRandomOffset(),
        ],
      ])
      setMarkers(newMarkers)
    }, 5000)

    return () => clearInterval(interval)
  }, [markers])

  useEffect(() => {
    // Check if any animal is outside the circle and calculate distances
    const checkAnimalsOutsideCircle = () => {
      const newOutsideCircle = []
      const newDistances = markers.map((animalMarkers, animalIndex) => {
        const lastPosition = animalMarkers[animalMarkers.length - 1]
        const distance = calculateDistance(centerPosition, lastPosition)
        const distanceToOwner = ownerPosition
          ? calculateDistance(ownerPosition, lastPosition)
          : null
        const currentTime = new Date().toLocaleTimeString()
        const currentDate = new Date().toLocaleDateString()
        newOutsideCircle.push({
          name: getAnimalName(animalIndex),
          position: lastPosition,
          time: currentTime,
          date: currentDate,
          icon: getAnimalIcon(animalIndex),
          outside: distance > circleRadius,
        })
        return {
          name: getAnimalName(animalIndex),
          distanceMeters: distanceToOwner ? distanceToOwner.toFixed(2) : null,
          distanceKm: distanceToOwner
            ? (distanceToOwner / 1000).toFixed(2)
            : null,
        }
      })
      setOutsideCircle(newOutsideCircle)
      setDistances(newDistances)
    }

    checkAnimalsOutsideCircle()
  }, [markers, centerPosition, circleRadius, ownerPosition])

  const calculateDistance = (position1, position2) => {
    const [lat1, lng1] = position1
    const [lat2, lng2] = position2
    const R = 6371e3 // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  const circleOptions = {
    color: 'blue', // Color of the circle outline
    fillColor: 'lightblue', // Color of the circle fill
    fillOpacity: 0.5, // Opacity of the circle fill
  }

  const handleAnimalClick = (animal) => {
    const { name, position, time, date, outside} = animal;
    const animalDistances = distances.find((dist) => dist.name === name);
  
    const distanceMeters = animalDistances ? animalDistances.distanceMeters : null;
    const distanceKm = animalDistances ? animalDistances.distanceKm : null;

    dispatch(setAnimalName(name));
    dispatch(setAnimalLat(position[0]));
    dispatch(setAnimalLong(position[1]));
    dispatch(setAnimalMeter(distanceMeters));
    dispatch(setAnimalKm(distanceKm));
    dispatch(setAnimalDate(date));
    dispatch(setAnimalTime(time));
    dispatch(setAnimalOutside(outside))

    console.log(animal, distanceMeters, distanceKm, outside);
    navigate('/animaldetail')
  };

  return (
    <div className="container">
      <div className="map-container">
        <MapContainer
          center={centerPosition}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Map through markers array for each animal */}
          {markers.map((animalMarkers, animalIndex) => (
            <React.Fragment key={animalIndex}>
              {/* Lines connecting consecutive markers for each animal */}
              <Polyline
                positions={animalMarkers}
                color={getLineColor(animalIndex)}
              />
              {/* Markers for each animal */}
              {animalMarkers.map((position, markerIndex) => (
                <Marker
                  key={markerIndex}
                  position={position}
                  icon={getMarkerIcon(markers, animalIndex, markerIndex)}
                >
                  {/* Popup content */}
                  <Popup>
                    Animal: {getAnimalName(animalIndex)} <br /> Position:{' '}
                    {position[0]}, {position[1]}
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          ))}
          {/* Big circle around all markers */}
          <Circle
            center={centerPosition}
            radius={circleRadius}
            pathOptions={circleOptions}
          />
          {/* Owner marker */}
          {ownerPosition && (
            <Marker
              position={ownerPosition}
              icon={L.icon({
                iconUrl: owner,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              })}
            >
              <Popup>Owner</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      <div className="info-container">
      
        
        <div className="outside-circle-container">
        <h4 className="text-xl font-bold tracking-tighter text-center text-cyan-600 sm:text-2xl md:text-3xl  mb-[2vw]">
          All Animals
        </h4>
          <input style={{marginBottom:"2vw"}} type="text" placeholder='Search animal'/>
          {outsideCircle.map((animal, index) => (
            <div
              key={index}
              className={`animal-info ${animal.outside ? 'outside' : ''}`}
              onClick={() => handleAnimalClick(animal)}
            >
              <img
                src={animal.icon}
                alt={animal.name}
                className="animal-icon"
              />
              <div className="animal-details">
                <p>
                  <strong>Name : {animal.name}</strong>
                </p>
                <p>
                Distance: {distances[index]?.distanceMeters || 'Calculating...'}{' '}
                meters
              </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Function to get animal name based on index
const getAnimalName = (index) => {
  switch (index) {
    case 0:
      return 'Dog'
    case 1:
      return 'Cat'
    case 2:
      return 'Elephant'
    default:
      return 'Animal'
  }
}

// Function to get animal icon based on index
const getAnimalIcon = (index) => {
  switch (index) {
    case 0:
      return dog
    case 1:
      return cat
    case 2:
      return elephant
    default:
      return null
  }
}

// Function to get marker icon for each animal
const getMarkerIcon = (markers, animalIndex, markerIndex) => {
  // Check if it's the current marker or previous markers
  if (markerIndex === markers[animalIndex].length - 1) {
    switch (animalIndex) {
      case 0:
        return L.icon({
          iconUrl: dog,
          iconSize: [32, 32], // Adjust size as needed
          iconAnchor: [16, 16], // Center the icon
        })
      case 1:
        return L.icon({
          iconUrl: cat,
          iconSize: [32, 32], // Adjust size as needed
          iconAnchor: [16, 16], // Center the icon
        })
      case 2:
        return L.icon({
          iconUrl: elephant,
          iconSize: [32, 32], // Adjust size as needed
          iconAnchor: [16, 16], // Center the icon
        })
      default:
        return null
    }
  } else {
    // Return custom CSS marker for previous markers
    return L.divIcon({ className: 'custom-marker' })
  }
}

// Function to get line color for each animal
const getLineColor = (index) => {
  switch (index) {
    case 0:
      return 'red' // Red color for dog
    case 1:
      return 'blue' // Blue color for cat
    case 2:
      return 'green' // Green color for elephant
    default:
      return 'black' // Default color for other animals
  }
}

// Function to generate random offset for movement
const getRandomOffset = () => (Math.random() - 0.5) * 0.001

export default TractPage
