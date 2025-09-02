import Route from '../models/Route.mjs';

export async function listRoutes(req, res) {
  const routes = await Route.find();
  res.json({ routes });
}

export async function getRoute(req, res) {
  const route = await Route.findById(req.params.id);
  if (!route) return res.status(404).json({ message: 'Route not found' });
  res.json({ route });
}

export async function createRoute(req, res) {
  const route = await Route.create(req.body);
  res.status(201).json({ route });
}

export async function updateRoute(req, res) {
  const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!route) return res.status(404).json({ message: 'Route not found' });
  res.json({ route });
}

export async function deleteRoute(req, res) {
  const route = await Route.findByIdAndDelete(req.params.id);
  if (!route) return res.status(404).json({ message: 'Route not found' });
  res.json({ ok: true });
}


