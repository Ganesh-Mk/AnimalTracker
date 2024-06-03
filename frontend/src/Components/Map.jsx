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
import { useSelector } from 'react-redux'
import owner from '../images/owner.png'
import L from 'leaflet'

function getLineColor(index) {
  const colors = ['red', 'green', 'blue', 'purple', 'orange']
  return colors[index % colors.length]
}

const getCircleOptions = (borderType) => ({
  color: borderType === 'main' ? 'blue' : 'green',
  fillColor: borderType === 'main' ? 'lightblue' : 'lightgreen',
  fillOpacity: 0.2,
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
  const [shape, setShape] = useState('circle')
  // const [owner, setOwner] = useState(null)
  const [nearestBorder, setNearestBorder] = useState(0)
  const [mainBorder, setMainBorder] = useState(0)

  useEffect(() => {
    setCenterPosition(mapObj.centerPosition)
    setOwnerLocation(mapObj.ownerLocation)
    setMarkers(mapObj.markers)
    setShape(mapObj.shape)
    // setOwner(mapObj.owner)
    setNearestBorder(mapObj.nearestBorder)
    setMainBorder(mapObj.mainBorder)
  })

  return (
    <>
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
    </>
  )
}

export default Map
