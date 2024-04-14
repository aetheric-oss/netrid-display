import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl, { Map } from 'mapbox-gl'

export const makeMap = (id: string | HTMLElement, center: [number, number], zoom: number): Map => {
  mapboxgl.accessToken = 'REPLACE_ME'
  const map = new Map({
    container: id,
    center,
    zoom,
    antialias: true,
    style: `mapbox://styles/aetheric/clt5tmzbo003l01qp2hngc1gn`
  })

  map.setMinZoom(8)
  map.setMaxZoom(null)

  // disable map rotation using right click + drag
  map.dragRotate.disable()

  // disable map rotation using touch rotation gesture
  map.touchZoomRotate.disableRotation()

  map.setMaxPitch(0)
  map.setMinPitch(0)

  map.touchPitch.disable()

  return map
}
