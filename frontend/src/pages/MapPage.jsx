import React, { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import cat from '../images/cat.png'
import dog from '../images/dog.png'
import elephant from '../images/elephant.webp'
import owner from '../images/owner.png' // Add an image for the owner
import '../styles/CustomMarker.css' // Import CSS file for custom marker styles

const MapPage = () => {
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

  useEffect(() => {
    // Request user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setOwnerPosition([latitude, longitude])
      },
      (error) => {
        console.error('Error getting user location:', error)
      },
    )
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
        <div style={{ margin: '3vw 0' }}>
          <label>
            Circle Radius (meters): {circleRadius}
            <input
              type="range"
              min="100"
              max="5000"
              value={circleRadius}
              onChange={(e) => setCircleRadius(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div className="distances-container">
          <div className="owner-info">
            <img src={owner} alt="Owner" className="owner-icon" />
            <div className="distances-details">
              {ownerPosition &&
                distances.map((distance, index) => (
                  <p key={index}>
                    {distance.name}: {distance.distanceMeters} meters (
                    {distance.distanceKm} km)
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="outside-circle-container">
          {outsideCircle.map((animal, index) => (
            <div
              key={index}
              className={`animal-info ${animal.outside ? 'outside' : ''}`}
            >
              <img
                src={animal.icon}
                alt={animal.name}
                className="animal-icon"
              />
              <div className="animal-details">
                <p>
                  <strong>{animal.name}</strong>
                </p>
                <p>
                  Position: {animal.position[0]}, {animal.position[1]}
                </p>
                <p>Time: {animal.time}</p>
                <p>Date: {animal.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          height: 100vh;
        }
        .map-container {
          flex: 70%;
          height: 100%;
        }
        .info-container {
          flex: 30%;
          padding: 10px;
          overflow-y: auto;
        }
        .distances-container {
          margin-bottom: 20px;
          text-align: center;
        }
        .owner-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }
        .owner-icon {
          width: 50px;
          height: 50px;
          margin-bottom: 10px;
        }
        .distances-details {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .distances-details p {
          margin: 0;
        }
        .outside-circle-container {
          margin-top: 20px;
        }
        .animal-info {
          display: flex;
          align-items: center;
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .animal-info.outside {
          background-color: red;
        }
        .animal-icon {
          width: 50px;
          height: 50px;
          margin-right: 10px;
        }
        .animal-details {
          display: flex;
          flex-direction: column;
        }
        .animal-details p {
          margin: 0;
        }
      `}</style>
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

export default MapPage
