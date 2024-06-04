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
} from 'react-leaflet'
import { useSelector } from 'react-redux'
import owner from '../images/owner.png'
import L from 'leaflet'

function getLineColor(index) {
  const colors = ['red', 'green', 'blue', 'purple', 'orange']
  return colors[index % colors.length]
}

const getRectangleBounds = (center, size) => {
  const halfSize = size / 2 / 111320
  return [
    [center[0] - halfSize, center[1] - halfSize],
    [center[0] + halfSize, center[1] + halfSize],
  ]
}

const getCircleOptions = (borderType) => ({
  color: borderType === 'main' ? 'orange' : 'green',
  fillColor: borderType === 'main' ? 'lightblue' : 'lightgreen',
  fillOpacity: 0.09,
})

const getRectangleOptions = (borderType) => ({
  color: borderType === 'main' ? 'orange' : 'green',
  fillColor: borderType === 'main' ? 'lightblue' : 'lightgreen',
  fillOpacity: 0.1,
})

function Map({ handleMapClick }) {
  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick ? handleMapClick : () => {},
    })
    return null
  }
  const mapObj = useSelector((state) => state.map)
  const [centerPosition, setCenterPosition] = useState([
    15.892826703895803,
    74.53231051009787,
  ])
  const [ownerLocation, setOwnerLocation] = useState(null)
  const [markers, setMarkers] = useState([])
  const [borders, setBorders] = useState([])

  useEffect(() => {
    setCenterPosition(mapObj.centerPosition)
    setOwnerLocation(mapObj.ownerLocation)
    setMarkers(mapObj.markers)

    const storedBorders = JSON.parse(localStorage.getItem('AllBorders')) || []
    setBorders(storedBorders)
  }, [mapObj])

  return (
    <>
      <MapContainer
        center={centerPosition}
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

        {borders.map((border, index) =>
          border.shape === 'circle' ? (
            <React.Fragment key={`circle-${index}`}>
              <Circle
                center={border.centerPosition}
                radius={border.mainBorder}
                pathOptions={getCircleOptions('main')}
              />
              <Circle
                center={border.centerPosition}
                radius={border.nearestBorder}
                pathOptions={getCircleOptions('nearest')}
              />
            </React.Fragment>
          ) : (
            <React.Fragment key={`rectangle-${index}`}>
              <Rectangle
                bounds={getRectangleBounds(
                  border.centerPosition,
                  border.mainBorder,
                )}
                pathOptions={getRectangleOptions('main')}
              />
              <Rectangle
                bounds={getRectangleBounds(
                  border.centerPosition,
                  border.nearestBorder,
                )}
                pathOptions={getRectangleOptions('nearest')}
              />
            </React.Fragment>
          ),
        )}
      </MapContainer>
    </>
  )
}

export default Map
