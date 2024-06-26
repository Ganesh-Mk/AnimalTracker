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
import { useSelector, useDispatch } from 'react-redux'
import {
  setCenterPositionSlice,
  setOwnerLocationSlice,
  setMarkersSlice,
  setShapeSlice,
  // setOwnerSlice,
  setNearestBorderSlice,
  setMainBorderSlice,
} from '../store/mapSlice'
import L from 'leaflet'
import { Tabs, Tab, TabPanel, TabPanels, TabList } from '@chakra-ui/react'
import 'leaflet/dist/leaflet.css'
import '../styles/ManagePage.css'
import cat from '../images/cat.png'
import dog from '../images/dog.png'
import lion from '../images/lion.png'
import elephant from '../images/elephant.webp'
import owner from '../images/owner.png'
import '../styles/CustomMarker.css'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
import Map from '../Components/Map'
import { useNavigate } from 'react-router-dom'

const ManagePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [markers, setMarkers] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [shape, setShape] = useState('circle')
  const [mainBorder, setMainBorder] = useState(750)
  const [nearestBorder, setNearestBorder] = useState(600)
  const [outsideMainBorder, setOutsideMainBorder] = useState([])
  const [nearMainBorder, setNearMainBorder] = useState([])
  const [distances, setDistances] = useState([])
  const [numberOfAnimals, setNumberOfAnimals] = useState(0)
  const [ownerName, setOwnerName] = useState(localStorage.getItem('name'))
  const [ownerLocation, setOwnerLocation] = useState([
    15.893782329637874,
    74.5314625373903,
  ])
  const [ownerEmail, setOwnerEmail] = useState(localStorage.getItem('email'))
  const [ownerPassword, setOwnerPassword] = useState(
    localStorage.getItem('password'),
  )
  const [centerPosition, setCenterPosition] = useState([
    15.892826703895803,
    74.53231051009787,
  ])

  const [newAnimalName, setNewAnimalName] = useState('')
  const [newAnimalLat, setNewAnimalLat] = useState('')
  const [newAnimalLng, setNewAnimalLng] = useState('')
  const [selectedImage, setSelectedImage] = useState(cat)

  const [audioPlayCount, setAudioPlayCount] = useState(0)
  const [audioPlayCount2, setAudioPlayCount2] = useState(0)
  const [toastShown, setToastShown] = useState(false)

  const alertAudioForDanger = new Audio('/audio/nearmainbordersound.wav')
  const alertAudioForCompleteDanger = new Audio('/audio/completedanger.wav')

  useEffect(() => {
    setOwnerLocation([ownerLocation[0], ownerLocation[1]])
    dispatch(setOwnerLocationSlice([ownerLocation[0], ownerLocation[1]]))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const newMarkers = markers.map((animal) => {
        const lastPosition = animal.positions[animal.positions.length - 1]
        const newLat = lastPosition[0] + getRandomOffset()
        const newLng = lastPosition[1] + getRandomOffset()
        return {
          ...animal,
          positions: [...animal.positions, [newLat, newLng]],
        }
      })
      setMarkers(newMarkers)
      dispatch(setMarkersSlice(newMarkers))
    }, 5000)

    return () => clearInterval(interval)
  }, [markers])

  useEffect(() => {
    const checkAnimalsBorders = async () => {
      const newOutsideMainBorder = []
      const newNearMainBorder = []
      const newDistances = markers.map((animal) => {
        const lastPosition = animal.positions[animal.positions.length - 1]
        const distanceToCenter = calculateDistance(centerPosition, lastPosition)
        const distanceToOwner = ownerLocation
          ? calculateDistance(ownerLocation, lastPosition)
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

        if (isOutsideMainBorder) {
          newOutsideMainBorder.push({
            name: animal.name,
            position: lastPosition,
            time: currentTime,
            date: currentDate,
            icon: animal.icon,
            outside: isOutsideMainBorder,
            near: !isOutsideMainBorder && isNearMainBorder,
          })
        }

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

      // Call backend route to send SMS
      try {
        const response = await axios.post('http://localhost:3001/send-sms', {
          to: '6361435996',
          body: 'Your animal is in danger',
        })
        console.log('SMS sent successfully')
      } catch (error) {
        console.error('Error sending SMS:', error)
      }
    }

    checkAnimalsBorders()
  }, [markers, centerPosition, mainBorder, nearestBorder, ownerLocation, shape])

  useEffect(() => {
    if (!toastShown && nearMainBorder.length > 0) {
      const animalNames = nearMainBorder.map((animal) => animal.name).join(', ')
      toast.info(`${animalNames} is near the main border!`, {
        autoClose: 3000,
      })
      setToastShown(true)
    }

    if (!toastShown && outsideMainBorder.length > 0) {
      const animalNames = outsideMainBorder
        .map((animal) => animal.name)
        .join(', ')
      toast.error(`${animalNames} is outside the main border!`, {
        autoClose: 3000,
      })
      setToastShown(true)
    }
    console.log(outsideMainBorder, 'hi')
  }, [nearMainBorder, outsideMainBorder, toastShown])

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

  const handleAnimalClick = (animal) => {
    const { name, position, time, date, outside } = animal
    const animalDistances = distances.find((dist) => dist.name === name)

    const distanceMeters = animalDistances
      ? animalDistances.distanceMeters
      : null
    const distanceKm = animalDistances ? animalDistances.distanceKm : null

    dispatch(setAnimalName(name))
    dispatch(setAnimalLat(animal.positions[0][0]))
    dispatch(setAnimalLong(animal.positions[0][1]))
    dispatch(setAnimalMeter(distanceMeters))
    dispatch(setAnimalKm(distanceKm))
    dispatch(setAnimalDate(date))
    dispatch(setAnimalTime(time))
    dispatch(setAnimalOutside(outside))

    navigate('/animaldetail')
  }

  const handleAddAnimal = () => {
    if (newAnimalName && newAnimalLat && newAnimalLng) {
      const count = numberOfAnimals ? parseInt(numberOfAnimals, 10) : 1
      const updatedMarkers = [...markers]

      for (let i = 0; i < count; i++) {
        const latOffset = (Math.random() - 0.5) * 0.001
        const lngOffset = (Math.random() - 0.5) * 0.001

        const newAnimal = {
          name: `${newAnimalName} ${i + 1}`,
          positions: [
            [
              parseFloat(newAnimalLat) + latOffset,
              parseFloat(newAnimalLng) + lngOffset,
            ],
          ],
          icon: selectedImage,
        }

        updatedMarkers.push(newAnimal)

        axios
          .post('http://localhost:3001/addAnimal', {
            email: localStorage.getItem('email'),
            mainBorder,
            newAnimalLat: parseFloat(newAnimalLat) + latOffset,
            shape,
            newAnimalLng: parseFloat(newAnimalLng) + lngOffset,
            nearestBorder,
            newAnimalName: `${newAnimalName} ${i + 1}`,
          })
          .then((res) => {
            localStorage.setItem(
              'allAnimals',
              JSON.stringify(res.data.allAnimals),
            )
            localStorage.setItem('border', JSON.stringify(res.data.border))
          })
          .catch((err) => {
            console.log(err)
          })
      }

      setMarkers(updatedMarkers)
      dispatch(setMarkersSlice(updatedMarkers))
      setNewAnimalName('')
      setNewAnimalLat('')
      setNewAnimalLng('')
    }
  }

  const handleBorder = () => {
    let existingBorders = JSON.parse(localStorage.getItem('AllBorders')) || []

    const newBorder = {
      shape: shape,
      mainBorder: mainBorder,
      nearestBorder: nearestBorder,
      centerPosition: centerPosition,
    }

    existingBorders.push(newBorder)

    localStorage.setItem('AllBorders', JSON.stringify(existingBorders))

    let AllBordersLocal = localStorage.getItem('AllBorders')
    console.log(JSON.parse(AllBordersLocal))

    axios
      .post('http://localhost:3001/setBorderPosition', {
        email: localStorage.getItem('email'),
        borders: existingBorders, // Send the entire array of borders
      })
      .then((res) => {
        // toast.success('Successfully set border position!')
        localStorage.setItem('border', JSON.stringify(res.data.border))
      })
      .catch((err) => {
        // toast.error('Failed to set border position!')
        console.log(err)
      })
  }

  // Reload
  useEffect(() => {
    let border = localStorage.getItem('border')

    if (border) {
      try {
        border = JSON.parse(border)
      } catch (e) {
        border = null
      }
    } else {
      border = null
    }
    if (border) {
      // setMainBorder(border.mainBorder)
      // setNearestBorder(border.nearestBorder)
      // dispatch(setMainBorderSlice(border.mainBorder))
      // dispatch(setNearestBorderSlice(border.nearestBorder))
      // setShape(border.shape)
      // dispatch(setShapeSlice(border.shape))
      // setCenterPosition(border.centerPosition)
      // dispatch(setCenterPositionSlice(border.centerPosition))
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

  useEffect(() => {
    let allAnimals = localStorage.getItem('allAnimals')

    if (allAnimals) {
      try {
        allAnimals = JSON.parse(allAnimals)
        // Ensure positions are arrays of numbers
        allAnimals = allAnimals.map((animal) => ({
          ...animal,
          positions: animal.positions.map((pos) => pos.map(Number)),
        }))
      } catch (e) {
        console.error('Error parsing JSON: ', e)
        allAnimals = []
      }
    }

    if (allAnimals) {
      setMarkers(allAnimals)
      dispatch(setMarkersSlice(allAnimals))
    }
  }, [])

  useEffect(() => {
    if (nearMainBorder.length > 0 && audioPlayCount < 1) {
      alertAudioForDanger.play()
      setAudioPlayCount((prevCount) => prevCount + 1)
    }
    setTimeout(() => {
      if (outsideMainBorder.length > 0 && audioPlayCount2 < 1) {
        alertAudioForCompleteDanger.play()
        setAudioPlayCount2((prevCount) => prevCount + 1)
      }
    }, 4000)
    console.log('Hii')
  }, [nearMainBorder])

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

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng

    if (activeTab === 0) {
      setNewAnimalLat(lat)
      setNewAnimalLng(lng)
    } else if (activeTab === 1) {
      setCenterPosition([lat, lng])
      dispatch(setCenterPositionSlice([lat, lng]))
    } else if (activeTab === 2) {
      setOwnerLocation([lat, lng])
      dispatch(setOwnerLocationSlice([lat, lng]))
    }
  }

  const handleOwner = () => {
    axios
      .post('http://localhost:3001/setOwner', {
        email: localStorage.getItem('email'),
        ownerLocation,
        ownerName,
      })
      .then((res) => {
        // toast.success('Successfully set owner location!')
        console.log(res.data)
        localStorage.setItem('name', res.data.userName)
        localStorage.setItem('ownerLocation', res.data.userLocation)
        setOwnerLocation(res.data.userLocation)
        dispatch(setOwnerLocationSlice(res.data.userLocation))
      })
      .catch((err) => {
        // toast.error('Failed to set owner location!')
        console.log(err)
      })
  }

  return (
    <div className="container">
      <ToastContainer />

      <Map handleMapClick={handleMapClick} />
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
          {markers.map((animal, index) => {
            const isNearMainBorder = nearMainBorder.some(
              (nearAnimal) => nearAnimal.name === animal.name,
            )
            const isOutsideMainBorder = outsideMainBorder.some(
              (outsideAnimal) => outsideAnimal.name === animal.name,
            )

            let backgroundColor = 'white'
            if (isOutsideMainBorder) {
              backgroundColor = 'red' // light red
            } else if (isNearMainBorder) {
              backgroundColor = 'lightseagreen'
            }

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '1vw',
                  margin: '1vw 0',
                  borderRadius: '1vw',
                  padding: '1vw',
                  border: '1px solid grey',
                  background: backgroundColor,
                }}
                className={`animal-info ${animal.outside}` ? 'outside' : ''}
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
                    {distances[index]?.distanceMeters || 'Calculating...'}{' '}
                    meters
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  function getRandomOffset() {
    return (Math.random() - 0.5) * 0.001
  }
}

export default ManagePage
