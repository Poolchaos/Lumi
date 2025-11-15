import { body, query, param } from 'express-validator';

export const createPenaltyValidation = [
  body('workout_date')
    .isISO8601()
    .withMessage('Valid workout date is required'),
  body('severity')
    .isIn(['light', 'moderate', 'severe'])
    .withMessage('Severity must be light, moderate, or severe'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

export const resolvePenaltyValidation = [
  param('penaltyId')
    .isMongoId()
    .withMessage('Invalid penalty ID'),
];

export const getPenaltiesValidation = [
  query('resolved')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Resolved must be true or false'),
  query('severity')
    .optional()
    .isIn(['light', 'moderate', 'severe'])
    .withMessage('Severity must be light, moderate, or severe'),
];

export const getWeeklyStatsValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 52 })
    .withMessage('Limit must be between 1 and 52'),
];
