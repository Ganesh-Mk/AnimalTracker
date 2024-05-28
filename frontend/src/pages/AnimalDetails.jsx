import React from 'react'
import { useSelector } from 'react-redux'
import { ResponsiveBar } from '@nivo/bar'

function AnimalDetails() {
  // Fetching data from Redux store
  const animalData = useSelector((state) => state.animal)
  console.log(animalData)

  // Generate data for the bar charts
  const meterChartData = [
    {
      id: 'Meters',
      meters: animalData.animalMeter,
    },
  ]

  const kmChartData = [
    {
      id: 'Kilometers',
      kilometers: animalData.animalKm,
    },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Animal Details</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Detailed information about your animal
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Calendar icon path */}
            </svg>
            <span>{animalData.animalDate}</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Clock icon path */}
            </svg>
            <span>{animalData.animalTime}</span>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Name
              </span>
              <h2 className="text-2xl font-bold">{animalData.animalName}</h2>
            </div>
            <div className="grid gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Position
              </span>
              <p>
                Latitude: {animalData.animalLat}, Longitude:{' '}
                {animalData.animalLong}
              </p>
            </div>
            <div className="grid gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Meters
              </span>
              <div className="flex items-center gap-4">
                <p className="text-3xl w-[15vw] font-bold">
                  {animalData.animalMeter} m
                </p>
                <div className="w-[560px] aspect-[4/3]">
                  <ResponsiveBar
                    data={meterChartData}
                    keys={['meters']}
                    indexBy="id"
                    margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                    padding={0.3}
                    layout="vertical"
                    colors={{ scheme: 'nivo' }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Total Meters',
                      legendPosition: 'middle',
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Meters',
                      legendPosition: 'middle',
                      legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                      from: 'color',
                      modifiers: [['darker', 1.6]],
                    }}
                    role="application"
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Kilometers
              </span>
              <div className="flex items-center gap-4">
                <p className="text-3xl w-[15vw] font-bold">
                  {animalData.animalKm} km
                </p>
                <div className="w-[560px] aspect-[4/3]">
                  <ResponsiveBar
                    data={kmChartData}
                    keys={['kilometers']}
                    indexBy="id"
                    margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                    padding={0.3}
                    layout="vertical"
                    colors={{ scheme: 'nivo' }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Total Kilometers',
                      legendPosition: 'middle',
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Kilometers',
                      legendPosition: 'middle',
                      legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                      from: 'color',
                      modifiers: [['darker', 1.6]],
                    }}
                    role="application"
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Status
              </span>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                {animalData.animalOutside === false
                  ? 'Inside border and Safe'
                  : 'Outside border and not Safe'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimalDetails
