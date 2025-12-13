// filepath: KrishiDirect/KrishiDirect/backend/src/controllers/farmerController.js
import Farmer from '../models/farmerModel.js';
import { handleError } from '../middlewares/errorHandler.js';

// @desc    Get all farmers
// @route   GET /api/farmers
// @access  Public
const getFarmers = async (req, res) => {
    try {
        const farmers = await Farmer.find();
        res.status(200).json(farmers);
    } catch (error) {
        handleError(res, error);
    }
};

// @desc    Get farmer by ID
// @route   GET /api/farmers/:id
// @access  Public
const getFarmerById = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }
        res.status(200).json(farmer);
    } catch (error) {
        handleError(res, error);
    }
};

// @desc    Create a new farmer
// @route   POST /api/farmers
// @access  Private
const createFarmer = async (req, res) => {
    try {
        const newFarmer = new Farmer(req.body);
        await newFarmer.save();
        res.status(201).json(newFarmer);
    } catch (error) {
        handleError(res, error);
    }
};

// @desc    Update farmer by ID
// @route   PUT /api/farmers/:id
// @access  Private
const updateFarmer = async (req, res) => {
    try {
        const updatedFarmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFarmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }
        res.status(200).json(updatedFarmer);
    } catch (error) {
        handleError(res, error);
    }
};

// @desc    Delete farmer by ID
// @route   DELETE /api/farmers/:id
// @access  Private
const deleteFarmer = async (req, res) => {
    try {
        const deletedFarmer = await Farmer.findByIdAndDelete(req.params.id);
        if (!deletedFarmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }
        res.status(204).send();
    } catch (error) {
        handleError(res, error);
    }
};

export default {
    getFarmers,
    getFarmerById,
    createFarmer,
    updateFarmer,
    deleteFarmer,
};