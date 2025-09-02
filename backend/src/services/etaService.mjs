import axios from 'axios';

export async function getEtaUsingGoogleMaps(originLngLat, destLngLat) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  const params = new URLSearchParams({
    origin: `${originLngLat[1]},${originLngLat[0]}`,
    destination: `${destLngLat[1]},${destLngLat[0]}`,
    key
  });
  const url = `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`;
  const { data } = await axios.get(url);
  const duration = data.routes?.[0]?.legs?.[0]?.duration?.value; // seconds
  return typeof duration === 'number' ? duration : null;
}

export async function getEtaUsingMapbox(originLngLat, destLngLat) {
  const token = process.env.MAPBOX_ACCESS_TOKEN;
  if (!token) return null;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originLngLat[0]},${originLngLat[1]};${destLngLat[0]},${destLngLat[1]}?access_token=${token}`;
  const { data } = await axios.get(url);
  const duration = data.routes?.[0]?.duration; // seconds
  return typeof duration === 'number' ? duration : null;
}

export async function getEta(originLngLat, destLngLat) {
  const g = await getEtaUsingGoogleMaps(originLngLat, destLngLat);
  if (g != null) return g;
  const m = await getEtaUsingMapbox(originLngLat, destLngLat);
  if (m != null) return m;
  return null;
}


