import React, { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMapEvents,
  Rectangle,
  Polygon,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../styles/TrackPage.css'
import cat from '../images/cat.png'
import dog from '../images/dog.png'
import elephant from '../images/elephant.webp'
import owner from '../images/owner.png'
import '../styles/CustomMarker.css'
import axios from 'axios'

const TrackPage = () => {
  const [centerPosition, setCenterPosition] = useState([16.1622, 74.8298])
  const [ownerPosition, setOwnerPosition] = useState(null)
  const [markers, setMarkers] = useState([
    { name: 'Dog', positions: [[16.1622, 74.8298]], icon: dog },
    { name: 'Cat', positions: [[16.1605, 74.8323]], icon: cat },
    { name: 'Elephant', positions: [[16.1585, 74.8278]], icon: elephant },
  ])
  const [shape, setShape] = useState('circle')
  const [mainBorder, setMainBorder] = useState(300)
  const [nearestBorder, setNearestBorder] = useState(250)
  const [outsideMainBorder, setOutsideMainBorder] = useState([])
  const [nearMainBorder, setNearMainBorder] = useState([])
  const [distances, setDistances] = useState({})

  const [newAnimalName, setNewAnimalName] = useState('')
  const [newAnimalLat, setNewAnimalLat] = useState('')
  const [newAnimalLng, setNewAnimalLng] = useState('')

  useEffect(() => {
    setOwnerPosition([16.1652, 74.8298])
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const newMarkers = markers.map((animal) => ({
        ...animal,
        positions: [
          ...animal.positions,
          [
            animal.positions[animal.positions.length - 1][0] +
              getRandomOffset(),
            animal.positions[animal.positions.length - 1][1] +
              getRandomOffset(),
          ],
        ],
      }))
      setMarkers(newMarkers)
    }, 100000)

    return () => clearInterval(interval)
  }, [markers])

  useEffect(() => {
    const checkAnimalsBorders = () => {
      const newOutsideMainBorder = []
      const newNearMainBorder = []
      const newDistances = markers.map((animal) => {
        const lastPosition = animal.positions[animal.positions.length - 1]
        const distanceToCenter = calculateDistance(centerPosition, lastPosition)
        const distanceToOwner = ownerPosition
          ? calculateDistance(ownerPosition, lastPosition)
          : null
        const currentTime = new Date().toLocaleTimeString()
        const currentDate = new Date().toLocaleDateString()

        const isOutsideMainBorder = checkIfOutsideBorder(
          lastPosition,
          shape,
          centerPosition,
          mainBorder,
        )
        const isNearMainBorder = checkIfOutsideBorder(
          lastPosition,
          shape,
          centerPosition,
          nearestBorder,
        )

        newOutsideMainBorder.push({
          name: animal.name,
          position: lastPosition,
          time: currentTime,
          date: currentDate,
          icon: animal.icon,
          outside: isOutsideMainBorder,
          near: !isOutsideMainBorder && isNearMainBorder,
        })

        if (isNearMainBorder && !isOutsideMainBorder) {
          newNearMainBorder.push({
            name: animal.name,
            position: lastPosition,
            time: currentTime,
            date: currentDate,
            icon: animal.icon,
          })
        }

        return {
          name: animal.name,
          distanceMeters: distanceToOwner ? distanceToOwner.toFixed(2) : null,
          distanceKm: distanceToOwner
            ? (distanceToOwner / 1000).toFixed(2)
            : null,
        }
      })

      setOutsideMainBorder(newOutsideMainBorder)
      setNearMainBorder(newNearMainBorder)
      setDistances(newDistances)
    }

    checkAnimalsBorders()
  }, [markers, centerPosition, mainBorder, nearestBorder, ownerPosition, shape])

  const calculateDistance = (position1, position2) => {
    const [lat1, lng1] = position1
    const [lat2, lng2] = position2
    const R = 6371e3
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

  useEffect(() => {
    let border = JSON.parse(localStorage.getItem('border'))
    if (border) {
      setMainBorder(border.mainBorder)
      setNearestBorder(border.nearestBorder)
      setShape(border.shape)
    }

    let allAnimals = JSON.parse(localStorage.getItem('allAnimals'))
    if (allAnimals) {
      setMarkers(allAnimals)
    }
  }, [])

  const getCircleOptions = (borderType) => ({
    color: borderType === 'main' ? 'blue' : 'green',
    fillColor: borderType === 'main' ? 'lightblue' : 'lightgreen',
    fillOpacity: 0.2,
  })

  const getRectangleBounds = (center, size) => {
    const halfSize = size / 2 / 111320
    return [
      [center[0] - halfSize, center[1] - halfSize],
      [center[0] + halfSize, center[1] + halfSize],
    ]
  }

  const checkIfOutsideBorder = (position, shape, center, size) => {
    const distance = calculateDistance(center, position)
    if (shape === 'circle') {
      return distance > size
    } else if (shape === 'rectangle') {
      const [southWest, northEast] = getRectangleBounds(center, size)
      return (
        position[0] < southWest[0] ||
        position[0] > northEast[0] ||
        position[1] < southWest[1] ||
        position[1] > northEast[1]
      )
    }
    return false
  }

  const getPolygonOptions = (borderType) => ({
    color: borderType === 'main' ? 'blue' : 'green',
    fillColor: borderType === 'main' ? 'lightblue' : 'lightgreen',
    fillOpacity: 0.2,
  })

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng
    setNewAnimalLat(lat)
    setNewAnimalLng(lng)
  }

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    })
    return null
  }

  useEffect(() => {
    console.log('distance: ', distances)
  }, [])

  return (
    <div className="container">
      <MapContainer
        center={centerPosition}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com">Esri</a> contributors'
        />
        <MapClickHandler />
        {ownerPosition && (
          <Marker
            position={ownerPosition}
            icon={L.icon({ iconUrl: owner, iconSize: [32, 32] })}
          >
            <Popup>Owner's Location</Popup>
          </Marker>
        )}
        {markers.map((animal, index) => (
          <Polyline
            key={index}
            positions={animal.positions}
            pathOptions={{ color: getLineColor(index) }}
          >
            {animal.positions.map((position, markerIndex) => (
              <Marker
                key={markerIndex}
                position={position}
                icon={
                  markerIndex === animal.positions.length - 1
                    ? L.icon({
                        iconUrl: animal.icon,
                        iconSize: [32, 32],
                        iconAnchor: [16, 16],
                      })
                    : L.divIcon({
                        className: 'custom-marker',
                      })
                }
              />
            ))}
          </Polyline>
        ))}

        {shape === 'circle' && (
          <>
            <Circle
              center={centerPosition}
              radius={mainBorder}
              pathOptions={getCircleOptions('main')}
            />
            <Circle
              center={centerPosition}
              radius={nearestBorder}
              pathOptions={getCircleOptions('nearest')}
            />
          </>
        )}
        {shape === 'rectangle' && (
          <>
            <Rectangle
              bounds={getRectangleBounds(centerPosition, mainBorder)}
              pathOptions={getPolygonOptions('main')}
            />
            <Rectangle
              bounds={getRectangleBounds(centerPosition, nearestBorder)}
              pathOptions={getPolygonOptions('nearest')}
            />
          </>
        )}
      </MapContainer>
      <div className="info">
        <h4 className="text-xl font-bold tracking-tighter text-center text-cyan-600 sm:text-2xl md:text-3xl  mb-[2vw]">
          All Animals
        </h4>
        {markers.map((animal, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '10px 0',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <img
              src={animal.icon}
              alt={animal.name}
              style={{ width: '50px', height: '50px', marginRight: '15px' }}
            />
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>Name: {animal.name}</h3>
              <p>
                Distance: {distances[index]?.distanceMeters || 'Calculating...'}{' '}
                meters
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  function getRandomOffset() {
    return (Math.random() - 0.5) * 0.001
  }

  function getLineColor(index) {
    const colors = ['red', 'green', 'blue', 'purple', 'orange']
    return colors[index % colors.length]
  }
}

export default TrackPage
