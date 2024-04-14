<script setup lang="ts">
import type { GeoJSONSource } from 'mapbox-gl'
import { makeMap } from './map'

const map = makeMap('app', [5.061929354865619, 52.648325417008046], 13.0)
const base_url = `http://${process.env.NETRID_SP_ENDPOINT}/demo/flights`

async function getData(lng1: number, lat1: number, lng2: number, lat2: number, updateSource: any) {
  try {
    return fetch(
      `${base_url}?view=${lat1.toFixed(2)},${lng1.toFixed(2)},${lat2.toFixed(2)},${lng2.toFixed(2)}&recent_positions_duration=10`,
      {
        method: 'get',
        headers: {
          Accept: '*/*',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        return data.flights.map(function (a: any): any {
          return {
            type: 'Feature',
            properties: {
              rotation: a.current_state.track,
              description: a.id
            },
            geometry: {
              type: 'Point',
              coordinates: [a.current_state.position.lng, a.current_state.position.lat]
            }
          }
        })
      })
  } catch (err: any) {
    throw new Error(err)
  }
}

map.on('load', async () => {
  map.addSource('flights', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

  map.loadImage('./src/assets/rotorcraft.png', function (error, image) {
    if (error) {
      throw error
    }

    map.addImage('rotorcraft', image as HTMLImageElement)
    map.addLayer({
      id: 'flights',
      type: 'symbol',
      source: 'flights',
      layout: {
        'icon-image': 'rotorcraft',
        'icon-size': 1,
        'icon-allow-overlap': true,
        'text-allow-overlap': true,
        'icon-rotate': ['get', 'rotation'],
        'text-field': ['get', 'description'],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 11,
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.05,
        'text-offset': [0, 2]
      },
      paint: {
        'text-color': '#2abb94'
      }
    })
  })
})

const updateSource = setInterval(async () => {
  try {
    let bounds = map.getBounds()
    let southwest = bounds.getSouthWest()
    let northeast = bounds.getNorthEast()

    // console.log("bounds", southwest, northeast)
    const features = await getData(
      northeast.lng,
      northeast.lat,
      southwest.lng,
      southwest.lat,
      updateSource
    )

    console.log('features', features)
    const flightSource: GeoJSONSource = map.getSource('flights') as GeoJSONSource
    flightSource.setData({
      type: 'FeatureCollection',
      features: features
    })
  } catch (err) {
    console.error(err)
  }
}, 500)
</script>

<template>
  <body>
    <div id="mapbox-el"></div>
  </body>
</template>

<style scoped>
/* #mapbox-el { position: absolute; top: 0; bottom: 0; width: 1024px; } */
</style>
