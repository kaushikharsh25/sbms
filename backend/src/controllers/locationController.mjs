import Location from '../models/Location.mjs';

export async function pushLocation(req, res) {
  const { busId, lng, lat, speedKph, heading } = req.body;
  if (!busId || typeof lng !== 'number' || typeof lat !== 'number') {
    return res.status(400).json({ message: 'busId, lng, lat required' });
  }
  const location = await Location.create({
    bus: busId,
    driver: req.user.id,
    location: { type: 'Point', coordinates: [lng, lat] },
    speedKph,
    heading
  });
  res.status(201).json({ location });
}

export async function getLatestLocation(req, res) {
  const { busId } = req.params;
  const latest = await Location.findOne({ bus: busId }).sort({ createdAt: -1 });
  if (!latest) return res.status(404).json({ message: 'No location yet' });
  res.json({ location: latest });
}

export async function getBusLocationHistory(req, res) {
  const { busId } = req.params;
  const limit = Number(req.query.limit || 100);
  const items = await Location.find({ bus: busId }).sort({ createdAt: -1 }).limit(limit);
  res.json({ items });
}


