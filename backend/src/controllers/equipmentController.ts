import { Response } from 'express';
import { validationResult } from 'express-validator';
import Equipment from '../models/Equipment';
import { AuthRequest } from '../middleware/auth';

export const getEquipment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { type, available } = req.query;
    const filter: Record<string, unknown> = { user_id: req.user?.userId };

    if (type) {
      filter.equipment_type = type;
    }

    if (available !== undefined) {
      filter.is_available = available === 'true';
    }

    const equipment = await Equipment.find(filter).sort({ created_at: -1 });

    res.json({ equipment });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createEquipment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const equipment = new Equipment({
      user_id: req.user?.userId,
      ...req.body,
    });

    await equipment.save();

    res.status(201).json({ equipment });
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEquipment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const equipment = await Equipment.findOne({
      _id: req.params.id,
      user_id: req.user?.userId,
    });

    if (!equipment) {
      res.status(404).json({ error: 'Equipment not found' });
      return;
    }

    Object.assign(equipment, req.body);
    await equipment.save();

    res.json({ equipment });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEquipment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const equipment = await Equipment.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user?.userId,
    });

    if (!equipment) {
      res.status(404).json({ error: 'Equipment not found' });
      return;
    }

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
