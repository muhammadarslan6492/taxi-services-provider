import { Conflict } from 'fejl';

import Model from '../models';

const { Brand } = Model;

export default {
  allBrands: async (req, res) => {
    try {
      const brand = await Brand.findAll({ order: [['brandName', 'ASC']] });
      return res.status(200).json(brand);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getBrand: async (req, res) => {
    try {
      const brand = await Brand.findOne({ where: { id: req.params.id } });
      return res.status(200).json(brand);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateBrand: async (req, res) => {
    try {
      const brand = await Brand.findOne({ where: { id: req.params.id } });
      await brand.update({
        brandName: req.body.brandName,
      });
      return res.status(200).json({ msg: 'Brand updated.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deletaBrand: async (req, res) => {
    try {
      const brand = await Brand.findOne({ where: { id: req.params.id } });
      if (!brand) {
        throw new Conflict('Vehicle brand dose not exist.');
      }
      await brand.destroy();
      return res.status(200).json({ msg: 'Vehicle deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createBrand: async (req, res) => {
    try {
      const existing = await Brand.findOne({
        where: { brandName: req.body.brandName },
      });
      if (existing) {
        throw new Conflict('Vehicle brand name already exist.');
      }
      await Brand.create({
        brandName: req.body.brandName,
      });
      return res
        .status(201)
        .json({ msg: 'Vehicle brand created successfully.' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
