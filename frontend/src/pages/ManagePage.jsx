import React, { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
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

const ManagePage = () => {
  const [centerPosition, setCenterPosition] = useState([16.1622, 74.8298])
  const [ownerPosition, setOwnerPosition] = useState(null)
  const [markers, setMarkers] = useState([
    { name: 'Dog', positions: [[16.1622, 74.8298]], icon: dog },
    { name: 'Cat', positions: [[16.1605, 74.8323]], icon: cat },
    { name: 'Elephant', positions: [[16.1585, 74.8278]], icon: elephant },
  ])
  const [shape, setShape] = useState('circle')
  const [mainBorder, setMainBorder] = useState(1000)
  const [nearestBorder, setNearestBorder] = useState(1500)
  const [outsideMainBorder, setOutsideMainBorder] = useState([])
  const [nearMainBorder, setNearMainBorder] = useState([])
  const [distances, setDistances] = useState([])

  const [newAnimalName, setNewAnimalName] = useState('')
  const [newAnimalLat, setNewAnimalLat] = useState('')
  const [newAnimalLng, setNewAnimalLng] = useState('')
  const [selectedImage, setSelectedImage] = useState(cat)

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

  const handleAddAnimal = () => {
    if (newAnimalName && newAnimalLat && newAnimalLng) {
      const newAnimal = {
        name: newAnimalName,
        positions: [[parseFloat(newAnimalLat), parseFloat(newAnimalLng)]],
        icon: selectedImage,
      }
      setMarkers([...markers, newAnimal])
      setNewAnimalName('')
      setNewAnimalLat('')
      setNewAnimalLng('')
    }
  }

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

  const getTriangleBounds = (center, size) => {
    const halfSize = size / 2 / 111320
    return [
      [center[0] - halfSize, center[1]],
      [center[0], center[1] + halfSize],
      [center[0] + halfSize, center[1]],
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
    } else if (shape === 'triangle') {
      const bounds = getTriangleBounds(center, size)
      const [a, b, c] = bounds
      const crossProduct1 =
        (position[0] - a[0]) * (b[1] - a[1]) -
        (position[1] - a[1]) * (b[0] - a[0])
      const crossProduct2 =
        (position[0] - b[0]) * (c[1] - b[1]) -
        (position[1] - b[1]) * (c[0] - b[0])
      const crossProduct3 =
        (position[0] - c[0]) * (a[1] - c[1]) -
        (position[1] - c[1]) * (a[0] - c[0])
      return !(crossProduct1 > 0 && crossProduct2 > 0 && crossProduct3 > 0)
    }
    return false
  }

  const getPolygonOptions = (borderType) => ({
    color: borderType === 'main' ? 'blue' : 'green',
    fillColor: borderType === 'main' ? 'lightblue' : 'lightgreen',
    fillOpacity: 0.2,
  })

  return (
    <div className="container">
      <MapContainer
        center={centerPosition}
        zoom={16}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {ownerPosition && (
          <Marker
            position={ownerPosition}
            icon={L.icon({ iconUrl: owner, iconSize: [32, 32] })}
          >
            <Popup>Owner's Location</Popup>
          </Marker>
        )}
        {markers.map((animal, index) => (
          <Polyline key={index} positions={animal.positions}>
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
        <div className="controls">
          <label>
            Select Shape:
            <select value={shape} onChange={(e) => setShape(e.target.value)}>
              <option value="circle">Circle</option>
              <option value="rectangle">Rectangle</option>
              <option value="triangle">Triangle</option>
            </select>
          </label>
          <label>
            Main Border Size (meters): {mainBorder}
            <input
              type="range"
              min="100"
              max="5000"
              value={mainBorder}
              onChange={(e) => setMainBorder(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
          <label>
            Nearest Border Size (meters): {nearestBorder}
            <input
              type="range"
              min="100"
              max="5000"
              value={nearestBorder}
              onChange={(e) => setNearestBorder(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ margin: '3vw 0' }}>
          <h4>Add New Animal</h4>
          <label>
            Name:
            <input
              type="text"
              value={newAnimalName}
              onChange={(e) => setNewAnimalName(e.target.value)}
            />
          </label>
          <label>
            Latitude:
            <input
              type="text"
              value={newAnimalLat}
              onChange={(e) => setNewAnimalLat(e.target.value)}
            />
          </label>
          <label>
            Longitude:
            <input
              type="text"
              value={newAnimalLng}
              onChange={(e) => setNewAnimalLng(e.target.value)}
            />
          </label>
          <label>
            Select Animal Icon:
            <select
              value={selectedImage}
              onChange={(e) => setSelectedImage(e.target.value)}
            >
              <option value={cat}>Cat</option>
              <option value={dog}>Dog</option>
              <option value={elephant}>Elephant</option>
            </select>
          </label>
          <button onClick={handleAddAnimal}>Add Animal</button>
        </div>
        <div style={{ margin: '3vw 0' }}>
          <h4>Animals Near Main Border</h4>
          <ul>
            {nearMainBorder.map((animal, index) => (
              <li key={index}>
                {animal.name} -{' '}
                {animal.near ? 'Near Main Border' : 'Inside Main Border'} at{' '}
                {animal.time} on {animal.date}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ margin: '3vw 0' }}>
          <h4>Animals Outside Main Border</h4>
          <ul>
            {outsideMainBorder.map((animal, index) => (
              <li key={index}>
                {animal.name} -{' '}
                {animal.outside ? 'Outside Main Border' : 'Inside Main Border'}{' '}
                at {animal.time} on {animal.date}
              </li>
            ))}
          </ul>
        </div>
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

  function getMarkerIcon(animal, markerIndex) {
    return L.icon({
      iconUrl: animal.icon,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className:
        markerIndex === animal.positions.length - 1
          ? 'marker-last'
          : 'marker-previous',
    })
  }
}

export default ManagePage
