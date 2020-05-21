const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Garden = require('../models/garden');

router.get('/', (req, res, next) => {
	Garden.find((error, gardens) => {
		if(error) return res.status(500).json({error: error});
		return res.status(200).json({
			gardens: gardens
		});
	});
});

router.get('/:gardenId', (req, res, next)=> {
	Garden.findById(req.params.gardenId, (error, garden) => {
		if(error) return res.status(500).json({error: error});
		return res.status(200).json({
			garden: garden
		});
	});
});

router.post('/', (req, res, next) => {
	const garden = new Garden({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		body: req.body.body
	});
	garden.save((error, result) => {
		if(error) return res.status(500).json({error: error});
		return res.status(200).json({
			message: 'New garden created',
			createdGarden: garden
		})
	});
});

router.put('/:gardenId', (req, res, next)=>{
	Garden.updateOne({_id: req.params.gardenId}, {$set: {title: req.body.title, body: req.body.body}}, (error, garden) => {
		if(error) return res.status(500).json({error: error});
		return res.status(200).json({
			message: 'Garden updated',
			updatedGarden: garden
		});
	});
});

router.delete('/:gardenId', (req, res, next)=>{
	Garden.deleteOne({_id: req.params.gardenId}, (error, garden) => {
		if(error) return res.status(500).json({error: error});
		return res.status(200).json({
			message: 'Garden removed',
			removedGarden: garden
		});
	});
});

module.exports = router;