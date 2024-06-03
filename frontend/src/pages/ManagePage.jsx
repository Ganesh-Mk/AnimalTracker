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
import { Tabs, Tab, TabPanel, TabPanels, TabList } from '@chakra-ui/react'
import 'leaflet/dist/leaflet.css'
import '../styles/ManagePage.css'
import cat from '../images/cat.png'
import dog from '../images/dog.png'
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

const ManagePage = () => {
  const [markers, setMarkers] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [shape, setShape] = useState('circle')
  const [mainBorder, setMainBorder] = useState(750)
  const [nearestBorder, setNearestBorder] = useState(600)
  const [outsideMainBorder, setOutsideMainBorder] = useState([])
  const [nearMainBorder, setNearMainBorder] = useState([])
  const [distances, setDistances] = useState([])
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

  useEffect(() => {
    setOwnerLocation([ownerLocation[0], ownerLocation[1]])
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
  }, [markers, centerPosition, mainBorder, nearestBorder, ownerLocation, shape])

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

    axios
      .post('http://localhost:3001/addAnimal', {
        email: localStorage.getItem('email'),
        mainBorder,
        newAnimalLat,
        shape,
        newAnimalLng,
        nearestBorder,
        newAnimalName,
      })
      .then((res) => {
        console.log(res.data)
        localStorage.setItem('allAnimals', JSON.stringify(res.data.allAnimals))
        localStorage.setItem('border', JSON.stringify(res.data.border))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleBorder = () => {
    axios
      .post('http://localhost:3001/setBorderPosition', {
        email: localStorage.getItem('email'),
        shape,
        mainBorder,
        nearestBorder,
        centerPosition,
      })
      .then((res) => {
        toast.success('Successfully set border position!')
        localStorage.setItem('border', JSON.stringify(res.data.border))
      })
      .catch((err) => {
        toast.error('Failed to set border position!')
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
        console.error('Error parsing JSON: ', e)
        border = null
      }
    } else {
      border = null
    }
    if (border) {
      setMainBorder(border.mainBorder)
      setNearestBorder(border.nearestBorder)
      setShape(border.shape)
      setCenterPosition(border.centerPosition)
      setOwnerName(localStorage.getItem('name'))
      console.log('new: ', localStorage.getItem('ownerLocation').split(','))
      let ownerLoc = localStorage.getItem('ownerLocation').split(',')
      if (ownerLoc.length === 2) {
        setOwnerLocation(localStorage.getItem('ownerLocation').split(','))
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

    if (activeTab === 0) {
      setNewAnimalLat(lat)
      setNewAnimalLng(lng)
    } else if (activeTab === 1) {
      setCenterPosition([lat, lng])
    } else if (activeTab === 2) {
      setOwnerLocation([lat, lng])
    }
  }

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    })
    return null
  }

  const handleOwner = () => {
    axios
      .post('http://localhost:3001/setOwner', {
        email: localStorage.getItem('email'),
        ownerLocation,
        ownerName,
      })
      .then((res) => {
        toast.success('Successfully set owner location!')
        console.log(res.data)
        localStorage.setItem('name', res.data.userName)
        localStorage.setItem('ownerLocation', res.data.userLocation)
        setOwnerLocation(res.data.userLocation)
      })
      .catch((err) => {
        toast.error('Failed to set owner location!')
        console.log(err)
      })
  }

  return (
    <div className="container">
      <ToastContainer />

      <MapContainer
        center={[centerPosition[0], centerPosition[1]]}
        zoom={15}
        style={{ height: '100%', width: '57%' }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com">Esri</a> contributors'
        />
        <MapClickHandler />
        {ownerLocation && (
          <Marker
            position={ownerLocation}
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
      <Tabs
        variant="soft-rounded"
        colorScheme="green"
        onChange={(index) => setActiveTab(index)}
      >
        <TabList style={{ marginLeft: '2vw' }}>
          <Tab>Animals</Tab>
          <Tab>Borders</Tab>
          <Tab>Owner</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="info">
              <div className="add-animal">
                <h4 className="text-xl font-bold tracking-tighter text-center text-cyan-600 sm:text-2xl md:text-3xl  mb-[2vw]">
                  Add New Animal Details
                </h4>

                <label>
                  Name:
                  <input
                    type="text"
                    value={newAnimalName}
                    placeholder="Unique nickname of animal"
                    onChange={(e) => setNewAnimalName(e.target.value)}
                  />
                </label>
                <h2 align="center" style={{ marginTop: '2vw' }}>
                  Click on map to set animal location
                </h2>
                <div
                  style={{ display: 'flex', margin: '0 0 2vw 0', gap: '1vw' }}
                >
                  <input
                    type="text"
                    value={newAnimalLat}
                    readOnly
                    style={{ backgroundColor: 'rgb(234 234 234)' }}
                    placeholder="Latitude location"
                    onChange={(e) => setNewAnimalLat(e.target.value)}
                  />
                  <input
                    type="text"
                    value={newAnimalLng}
                    readOnly
                    style={{ backgroundColor: 'rgb(234 234 234)' }}
                    placeholder="Longitude location"
                    onChange={(e) => setNewAnimalLng(e.target.value)}
                  />
                </div>

                <label>Select Animal Icon:</label>
                <div className="animal-icons">
                  <img
                    src={cat}
                    alt="Cat"
                    className={selectedImage === cat ? 'active' : ''}
                    onClick={() => setSelectedImage(cat)}
                  />
                  <img
                    src={dog}
                    alt="Dog"
                    className={selectedImage === dog ? 'active' : ''}
                    onClick={() => setSelectedImage(dog)}
                  />
                  <img
                    src={elephant}
                    alt="Elephant"
                    className={selectedImage === elephant ? 'active' : ''}
                    onClick={() => setSelectedImage(elephant)}
                  />
                </div>
                <button
                  className="infoBtn"
                  style={{ marginTop: '2vw' }}
                  onClick={handleAddAnimal}
                >
                  Add Animal
                </button>
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="info">
              <div className="controls">
                <label>
                  <h4 className="text-xl font-bold tracking-tighter text-center text-cyan-600 sm:text-2xl md:text-3xl  mb-[2vw]">
                    Manage Border
                  </h4>

                  <div className="shape-buttons">
                    <button
                      className={
                        shape === 'circle' ? 'active infoBtn' : 'infoBtn'
                      }
                      onClick={() => setShape('circle')}
                    >
                      Circle
                    </button>
                    <button
                      className={
                        shape === 'rectangle' ? 'active infoBtn' : 'infoBtn'
                      }
                      onClick={() => setShape('rectangle')}
                    >
                      Square
                    </button>
                  </div>
                </label>
                <label>
                  Main Border Size (meters): {mainBorder}
                  <input
                    type="range"
                    min="10"
                    max="10000"
                    value={mainBorder}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value, 10)
                      setMainBorder(newValue)

                      if (newValue < nearestBorder) {
                        setNearestBorder(newValue - 1)
                      }
                    }}
                    style={{ marginLeft: '10px' }}
                  />
                </label>
                <label>
                  Nearest Border Size (meters): {nearestBorder}
                  <input
                    type="range"
                    min="10"
                    max="10000"
                    value={nearestBorder}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value, 10)
                      if (newValue < mainBorder) {
                        setNearestBorder(newValue)
                      } else {
                        setNearestBorder(mainBorder - 1)
                      }
                    }}
                    style={{ marginLeft: '10px' }}
                  />
                </label>
                <h2 align="center" style={{ marginTop: '2vw' }}>
                  {' '}
                  Click on map to set border center position
                </h2>
                <div
                  style={{ display: 'flex', margin: '0 0 2vw 0', gap: '1vw' }}
                >
                  <input
                    type="text"
                    value={centerPosition[0]}
                    placeholder="Right click on map to set latitude"
                    readOnly
                    style={{ backgroundColor: 'rgb(234 234 234)' }}
                  />

                  <input
                    type="text"
                    value={centerPosition[1]}
                    placeholder="Right click on map to set longitude"
                    readOnly
                    style={{ backgroundColor: 'rgb(234 234 234)' }}
                  />
                </div>

                <button
                  className="infoBtn"
                  style={{ marginTop: '2vw' }}
                  onClick={handleBorder}
                >
                  Set Border
                </button>
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="info">
              <div className="add-animal">
                <h4 className="text-xl font-bold tracking-tighter text-center text-cyan-600 sm:text-2xl md:text-3xl  mb-[2vw]">
                  Owner Details
                </h4>
                <div className="ownerImageDiv">
                  <img src={owner} alt="Owner" className="ownerImg" />
                </div>
                <div className="ownerDetailsDiv">
                  <div className="ownerLeft">
                    <p>Name: </p>
                  </div>
                  <div className="ownerRight">
                    <label className="centerInputLabel">
                      <input
                        type="text"
                        value={ownerName}
                        placeholder="Enter Name"
                        onChange={(e) => setOwnerName(e.target.value)}
                      />
                    </label>
                  </div>
                </div>

                <h2 align="center" style={{ marginTop: '2vw' }}>
                  Click on map to set owner location
                </h2>
                <div
                  style={{ display: 'flex', margin: '0 0 2vw 0', gap: '1vw' }}
                >
                  <input
                    type="text"
                    value={ownerLocation[0]}
                    readOnly
                    style={{ backgroundColor: 'rgb(234 234 234)' }}
                    placeholder="Latitude location"
                    onChange={(e) => setNewAnimalLat(e.target.value)}
                  />
                  <input
                    type="text"
                    value={ownerLocation[1]}
                    readOnly
                    style={{ backgroundColor: 'rgb(234 234 234)' }}
                    placeholder="Longitude location"
                    onChange={(e) => setNewAnimalLng(e.target.value)}
                  />
                </div>

                <div className="ownerUploadImage">
                  <label>Select Owner Image:</label>
                  <input type="file" name="image" id="" />
                </div>

                <button
                  className="infoBtn"
                  style={{ marginTop: '2vw' }}
                  onClick={handleOwner}
                >
                  Update
                </button>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
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
