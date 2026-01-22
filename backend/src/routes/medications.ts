import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { medicationService } from '../services/medicationService';
import { CreateMedicationSchema, UpdateMedicationSchema, DoseLogSchema } from '../validators/medicationValidator';
import { ZodError } from 'zod';
import { ObjectId } from 'mongodb';

const router = Router();

/**
 * POST /api/medications
 * Create a new medication
 */
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const validated = CreateMedicationSchema.parse(req.body);
    const medication = await medicationService.createMedication(
      new ObjectId(req.user?.id),
      validated
    );
    res.status(201).json(medication);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Failed to create medication' });
  }
});

/**
 * GET /api/medications
 * Get all medications for user
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const medications = await medicationService.getMedicationsByUser(
      new ObjectId(req.user?.id)
    );
    res.json(medications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
});

/**
 * GET /api/medications/:id
 * Get a single medication
 */
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const medication = await medicationService.getMedicationById(
      new ObjectId(req.params.id),
      new ObjectId(req.user?.id)
    );
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.json(medication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medication' });
  }
});

/**
 * PUT /api/medications/:id
 * Update a medication
 */
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const validated = UpdateMedicationSchema.parse(req.body);
    const medication = await medicationService.updateMedication(
      new ObjectId(req.params.id),
      new ObjectId(req.user?.id),
      validated
    );
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.json(medication);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Failed to update medication' });
  }
});

/**
 * DELETE /api/medications/:id
 * Delete (deactivate) a medication
 */
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const success = await medicationService.deleteMedication(
      new ObjectId(req.params.id),
      new ObjectId(req.user?.id)
    );
    if (!success) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete medication' });
  }
});

/**
 * POST /api/medications/:id/log-dose
 * Log a dose taken
 */
router.post('/:id/log-dose', authenticateToken, async (req: Request, res: Response) => {
  try {
    const validated = DoseLogSchema.parse({
      medication_id: req.params.id,
      ...req.body,
    });
    
    const doseLog = await medicationService.logDose(
      new ObjectId(req.user?.id),
      new ObjectId(validated.medication_id),
      validated.notes
    );
    res.status(201).json(doseLog);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Failed to log dose' });
  }
});

/**
 * GET /api/medications/:id/adherence
 * Get adherence stats for a medication
 */
router.get('/:id/adherence', authenticateToken, async (req: Request, res: Response) => {
  try {
    const daysBack = req.query.days ? parseInt(req.query.days as string) : 30;
    const stats = await medicationService.getAdherenceStats(
      new ObjectId(req.user?.id),
      new ObjectId(req.params.id),
      daysBack
    );
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch adherence stats' });
  }
});

export default router;
