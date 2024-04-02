const express = require('express');
const router = express.Router();
const Contract = require('../models/ContractSchma');
const { protect, checkUser } = require("../middleware/authMiddleware");

router.post('/', protect, checkUser, async (req, res) => {
    try {
        const contract = new Contract(req.body);
        await contract.save();
        res.status(201).send(contract);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', protect, checkUser, async (req, res) => {
    try {
        const contracts = await Contract.find();
        res.send(contracts);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', protect, checkUser, async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) {
            return res.status(404).send({ message: 'Contract not found' });
        }
        res.send(contract);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/user', protect, checkUser, async (req, res) => {
    try {
        const contracts = await Contract.find({ userId: req.user._id });
        if (!contracts) {
            return res.status(404).send({ message: 'User Contracts not found' });
        }
        res.send(contracts);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', protect, checkUser, async (req, res) => {
    try {
        const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contract) {
            return res.status(404).send({ message: 'Contract not found' });
        }
        res.send(contract);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', protect, checkUser, async (req, res) => {
    try {
        const contract = await Contract.findByIdAndDelete(req.params.id);
        if (!contract) {
            return res.status(404).send({ message: 'Contract not found' });
        }
        res.send({ message: 'Contract deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
