import { Conflict } from 'fejl';

import Model from '../models';

const { Car } = Model;

export default {
  allCar: async (req, res) => {
    try {
      const car = await Car.findAll({ order: [['carName', 'ASC']] });
      return res.status(200).json(car);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getCar: async (req, res) => {
    const car = await Car.findOne({ where: { id: req.params.id } });
    return res.status(200).json(car);
  },
  updateCar: async (req, res) => {
    try {
      const car = await Car.findOne({ where: { id: req.params.id } });
      await car.update({
        carName: req.body.carName,
        category: req.body.category,
        seatingCapacity: req.body.seatingCapacity,
        year: req.body.year,
        brandId: req.body.brandId,
      });
      return res.status(200).json({ msg: 'Car updated.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deletaCar: async (req, res) => {
    try {
      const car = await Car.findOne({ where: { id: req.params.id } });
      if (!car) {
        throw new Conflict('Car dose not exist.');
      }
      await car.destroy();
      return res.status(200).json({ msg: 'Car deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createCar: async (req, res) => {
    try {
      const car = await Car.create({
        carName: req.body.carName,
        category: req.body.category,
        seatingCapacity: req.body.seatingCapacity,
        year: req.body.year,
        brandId: req.body.brandId,
      });
      return res.status(201).json(car);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
