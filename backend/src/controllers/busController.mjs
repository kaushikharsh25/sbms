import Bus from '../models/Bus.mjs';

export async function listBuses(req, res) {
  const buses = await Bus.find().populate('driver route');
  res.json({ buses });
}

export async function getBus(req, res) {
  const bus = await Bus.findById(req.params.id).populate('driver route');
  if (!bus) return res.status(404).json({ message: 'Bus not found' });
  res.json({ bus });
}

export async function createBus(req, res) {
  const bus = await Bus.create(req.body);
  res.status(201).json({ bus });
}

export async function updateBus(req, res) {
  const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!bus) return res.status(404).json({ message: 'Bus not found' });
  res.json({ bus });
}

export async function deleteBus(req, res) {
  const bus = await Bus.findByIdAndDelete(req.params.id);
  if (!bus) return res.status(404).json({ message: 'Bus not found' });
  res.json({ ok: true });
}


