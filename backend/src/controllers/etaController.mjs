import Bus from '../models/Bus.mjs';
import Location from '../models/Location.mjs';
import Route from '../models/Route.mjs';
import { getEta } from '../services/etaService.mjs';

// GET /api/eta/:busId/:stopSeq
export async function etaToStop(req, res) {
  const { busId, stopSeq } = req.params;
  const bus = await Bus.findById(busId).populate('route');
  if (!bus || !bus.route) return res.status(404).json({ message: 'Bus or route not found' });
  const seq = Number(stopSeq);
  const stop = bus.route.stops.find(s => s.sequence === seq);
  if (!stop) return res.status(404).json({ message: 'Stop not found in route' });
  const latest = await Location.findOne({ bus: busId }).sort({ createdAt: -1 });
  if (!latest) return res.status(404).json({ message: 'No location for bus' });
  try {
    const seconds = await getEta(latest.location.coordinates, stop.location.coordinates);
    if (seconds == null) return res.status(503).json({ message: 'ETA service unavailable' });
    res.json({ etaSeconds: seconds });
  } catch (e) {
    res.status(500).json({ message: 'Failed to compute ETA' });
  }
}


