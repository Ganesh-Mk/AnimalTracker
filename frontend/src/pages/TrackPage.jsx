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
import Map from '../Components/Map'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import {
  setCenterPositionSlice,
  setOwnerLocationSlice,
  setMarkersSlice,
  setShapeSlice,
  // setOwnerSlice,
  setNearestBorderSlice,
  setMainBorderSlice,
} from '../store/mapSlice'
import 'leaflet/dist/leaflet.css'
import '../styles/ManagePage.css'
import cat from '../images/cat.png'
import dog from '../images/dog.png'
import elephant from '../images/elephant.webp'
import owner from '../images/owner.png'
import '../styles/CustomMarker.css'
import axios from 'axios'
import {
  setAnimalName,
  setAnimalLat,
  setAnimalLong,
  setAnimalMeter,
  setAnimalKm,
  setAnimalDate,
  setAnimalTime,
  setAnimalRest,
  setAnimalWalk,
  setAnimalOutside,
} from '../store/animalSlice'
import { useDispatch } from 'react-redux'

const ManagePage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [ownerLocation, setOwnerLocation] = useState([
    15.893782329637874,
    74.5314625373903,
  ])
  const [centerPosition, setCenterPosition] = useState([16.1622, 74.8298])
  const [ownerPosition, setOwnerPosition] = useState(null)
  const [markers, setMarkers] = useState([])
  const [ownerName, setOwnerName] = useState(localStorage.getItem('name'))

  const [shape, setShape] = useState('circle')
  const [mainBorder, setMainBorder] = useState(300)
  const [nearestBorder, setNearestBorder] = useState(250)
  const [outsideMainBorder, setOutsideMainBorder] = useState([])
  const [nearMainBorder, setNearMainBorder] = useState([])
  const [distances, setDistances] = useState([])

  const [newAnimalName, setNewAnimalName] = useState('')
  const [newAnimalLat, setNewAnimalLat] = useState('')
  const [newAnimalLng, setNewAnimalLng] = useState('')
  const [selectedImage, setSelectedImage] = useState(cat)

  useEffect(() => {
    setOwnerPosition([16.1612, 74.8298])
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
    }, 5000)

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

  const handleAnimalClick = (animal) => {
    const { name, position, time, date, outside } = animal
    const animalDistances = distances.find((dist) => dist.name === name)

    const distanceMeters = animalDistances
      ? animalDistances.distanceMeters
      : null
    const distanceKm = animalDistances ? animalDistances.distanceKm : null

    console.log('animal,: ', animal)
    dispatch(setAnimalName(name))
    dispatch(setAnimalLat(animal.positions[0][0]))
    dispatch(setAnimalLong(animal.positions[0][1]))
    dispatch(setAnimalMeter(distanceMeters))
    dispatch(setAnimalKm(distanceKm))
    dispatch(setAnimalDate(date))
    dispatch(setAnimalTime(time))
    dispatch(setAnimalOutside(outside))

    console.log(animal, distanceMeters, distanceKm, outside)
    navigate('/animaldetail')
  }
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

  // Reload
  useEffect(() => {
    let border = localStorage.getItem('border')

    if (border) {
      try {
        border = JSON.parse(border)
      } catch (e) {
        console.error('Error parsing JSON: ', e)
        border = null
      }
    } else {
      border = null
    }
    if (border) {
      setMainBorder(border.mainBorder)
      setNearestBorder(border.nearestBorder)
      dispatch(setMainBorderSlice(border.mainBorder))
      dispatch(setNearestBorderSlice(border.nearestBorder))
      setShape(border.shape)
      dispatch(setShapeSlice(border.shape))
      setCenterPosition(border.centerPosition)
      dispatch(setCenterPositionSlice(border.centerPosition))
      setOwnerName(localStorage.getItem('name'))
      let ownerLoc = localStorage.getItem('ownerLocation').split(',')
      if (ownerLoc.length === 2) {
        setOwnerLocation(localStorage.getItem('ownerLocation').split(','))
        dispatch(
          setOwnerLocationSlice(
            localStorage.getItem('ownerLocation').split(','),
          ),
        )
      }
    }

    let allAnimals = localStorage.getItem('allAnimals')

    if (allAnimals) {
      try {
        allAnimals = JSON.parse(allAnimals)
      } catch (e) {
        console.error('Error parsing JSON: ', e)
        allAnimals = null
      }
    } else {
      allAnimals = null
    }
    if (allAnimals) {
      setMarkers(allAnimals)
      dispatch(setMarkersSlice(allAnimals))
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

  return (
    <div className="container">
      <Map />
      <div className="info-container">
        <div className="outside-circle-container">
          <h4 className="text-xl font-bold tracking-tighter text-center text-cyan-600 sm:text-2xl md:text-3xl  mb-[2vw]">
            All Animals
          </h4>
          <input
            style={{ marginBottom: '2vw' }}
            type="text"
            placeholder="Search animal"
          />
          {markers.map((animal, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '1vw',
                margin: '1vw 0',
                borderRadius: '1vw',
                padding: '1vw',
                border: '1px solid grey',
              }}
              className={`animal-info ${animal.outside ? 'outside' : ''}`}
              onClick={() => handleAnimalClick(animal)}
            >
              <img
                style={{ width: '5vw', height: '5vw' }}
                src={animal.icon}
                alt={animal.name}
                className="animal-icon"
              />
              <div className="animal-details">
                <p>
                  <strong>Name: {animal.name}</strong>
                </p>
                <p>
                  Distance:{' '}
                  {distances[index]?.distanceMeters || 'Calculating...'} meters
                </p>
              </div>
            </div>
          ))}
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
}

export default ManagePage
