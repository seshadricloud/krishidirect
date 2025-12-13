import express from 'express';
import {
  getFarmers,
  getFarmerById,
  createFarmer,
  updateFarmer,
  deleteFarmer
} from '../controllers/farmerController.js';

const router = express.Router();

// Route to get all farmers
router.get('/', getFarmers);

// Route to get a farmer by ID
router.get('/:id', getFarmerById);

// Route to create a new farmer
router.post('/', createFarmer);

// Route to update a farmer by ID
router.put('/:id', updateFarmer);

// Route to delete a farmer by ID
router.delete('/:id', deleteFarmer);

export default router;