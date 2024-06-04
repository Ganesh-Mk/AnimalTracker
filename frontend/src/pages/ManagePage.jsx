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
// import { ToastContainer, toast } from 'react-toastify'
// // import 'react-toastify/dist/ReactToastify.css'
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

const ManagePage = () => {
  const dispatch = useDispatch()
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

        console.log(selectedImage)

        updatedMarkers.push(newAnimal)

        axios
          .post('http://localhost:3001/addAnimal', {
            email: localStorage.getItem('email'),
            mainBorder,
            icon: selectedImage,
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
  const [animalImage, setAnimalImage] = useState(null)
  const [animalImageEdit, setAnimalImageEdit] = useState(null)
  const [editAnimalImage, setEditAnimalImage] = useState(owner)

  const handleImage = (e) => {
    const file = e.target.files[0]
    setAnimalImage(file)
    setAnimalImageEdit(file.name)

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        const img = new Image()
        img.src = reader.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxSize = 800 // Adjust this size as needed
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height
              height = maxSize
            }
          }
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          const dataUrl = canvas.toDataURL('image/jpeg', 0.7) // Adjust compression level if needed
          setEditAnimalImage(dataUrl)
          setSelectedImage(dataUrl !== owner ? dataUrl : owner)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    axios
      .get('http://localhost:3001/fetchAnimalImage', {
        params: {
          userEmail: localStorage.getItem('email'),
        },
      })
      .then((response) => {
        setAnimalImage(response.data.userImage)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
      })
  }, [])
  return (
    <div className="container">
      {/* <ToastContainer /> */}

      <Map handleMapClick={handleMapClick} />
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
                <h4 className="text-xl font-bold tracking-tighter text-center text-cyan-600 sm:text-2xl md:text-3xl mb-[2vw]">
                  Add New Animal Details
                </h4>

                <label>
                  Name:
                  <input
                    type="text"
                    value={newAnimalName || ''}
                    placeholder="Unique nickname of animal"
                    onChange={(e) => setNewAnimalName(e.target.value)}
                  />
                </label>
                <label>
                  Number of animals:
                  <input
                    type="number"
                    value={numberOfAnimals || ''}
                    placeholder="Enter number of same animals"
                    onChange={(e) => setNumberOfAnimals(e.target.value)}
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
                    value={newAnimalLat || ''}
                    readOnly
                    style={{ backgroundColor: 'rgb(234 234 234)' }}
                    placeholder="Latitude location"
                  />
                  <input
                    type="text"
                    value={newAnimalLng || ''}
                    readOnly
                    style={{ backgroundColor: 'rgb(234 234 234)' }}
                    placeholder="Longitude location"
                  />
                </div>

                <label>Select Animal Icon:</label>
                <div className="animal-icons">
                  <label htmlFor="imageInput" className="custom-file-upload">
                    Choose Image
                  </label>
                  <input
                    id="imageInput"
                    type="file"
                    onChange={handleImage}
                    className="file-input"
                  />
                  {editAnimalImage && (
                    <img
                      style={{
                        borderRadius: '100vw',
                      }}
                      src={editAnimalImage}
                      alt="animal"
                    />
                  )}
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
                  <img
                    src={lion}
                    style={{ background: 'yellowgreen', borderRadius: '100vw' }}
                    alt="lion"
                    className={selectedImage === lion ? 'active' : ''}
                    onClick={() => setSelectedImage(lion)}
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
                      onClick={() => {
                        setShape('circle')
                        dispatch(setShapeSlice('circle'))
                      }}
                    >
                      Circle
                    </button>
                    <button
                      className={
                        shape === 'rectangle' ? 'active infoBtn' : 'infoBtn'
                      }
                      onClick={() => {
                        setShape('rectangle')
                        dispatch(setShapeSlice('rectangle'))
                      }}
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
                    value={mainBorder || 0}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value, 10)
                      setMainBorder(newValue)
                      dispatch(setMainBorderSlice(newValue))

                      if (newValue < nearestBorder) {
                        setNearestBorder(newValue - 1)
                        dispatch(setNearestBorderSlice(newValue - 1))
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
                    value={nearestBorder || 0}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value, 10)
                      if (newValue < mainBorder) {
                        setNearestBorder(newValue)
                        dispatch(setNearestBorderSlice(newValue))
                      } else {
                        setNearestBorder(mainBorder - 1)
                        dispatch(setNearestBorderSlice(mainBorder - 1))
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
                    value={centerPosition[0] || ''}
                    placeholder="Right click on map to set latitude"
                    readOnly
                    style={{ backgroundColor: 'rgb(234 234 234)' }}
                  />

                  <input
                    type="text"
                    value={centerPosition[1] || ''}
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
                        value={ownerName || ''}
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
                    value={ownerLocation[0] || ''}
                    readOnly
                    style={{ backgroundColor: 'rgb(234 234 234)' }}
                    placeholder="Latitude location"
                  />
                  <input
                    type="text"
                    value={ownerLocation[1] || ''}
                    readOnly
                    style={{ backgroundColor: 'rgb(234 234 234)' }}
                    placeholder="Longitude location"
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
}

export default ManagePage
