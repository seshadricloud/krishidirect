// filepath: KrishiDirect/KrishiDirect/backend/src/services/farmerService.js
import Farmer from '../models/farmerModel.js';

// Fetch all farmers from the database
export const getFarmers = async () => {
  try {
    const farmers = await Farmer.find();
    return farmers;
  } catch (error) {
    throw new Error('Error fetching farmers: ' + error.message);
  }
};

// Fetch a single farmer by ID
export const getFarmerById = async (id) => {
  try {
    const farmer = await Farmer.findById(id);
    if (!farmer) {
      throw new Error('Farmer not found');
    }
    return farmer;
  } catch (error) {
    throw new Error('Error fetching farmer: ' + error.message);
  }
};

// Add a new farmer to the database
export const addFarmer = async (farmerData) => {
  try {
    const newFarmer = new Farmer(farmerData);
    await newFarmer.save();
    return newFarmer;
  } catch (error) {
    throw new Error('Error adding farmer: ' + error.message);
  }
};

// Update an existing farmer by ID
export const updateFarmer = async (id, farmerData) => {
  try {
    const updatedFarmer = await Farmer.findByIdAndUpdate(id, farmerData, { new: true });
    if (!updatedFarmer) {
      throw new Error('Farmer not found');
    }
    return updatedFarmer;
  } catch (error) {
    throw new Error('Error updating farmer: ' + error.message);
  }
};

// Delete a farmer by ID
export const deleteFarmer = async (id) => {
  try {
    const deletedFarmer = await Farmer.findByIdAndDelete(id);
    if (!deletedFarmer) {
      throw new Error('Farmer not found');
    }
    return deletedFarmer;
  } catch (error) {
    throw new Error('Error deleting farmer: ' + error.message);
  }
};