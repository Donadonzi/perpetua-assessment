const express = require("express");
const {getFirstTrack, getNextTrack} = require('../utils/helpers')

const router = new express.Router();


// Get the first two tracks
router.get("/api/first-two", async (req, res) => {
	const tracks = [];
	const firstTrack = await getFirstTrack(req.query.category);
	if (firstTrack) {
		tracks.push(firstTrack);
	}
	
	const secondTrack = await getNextTrack(firstTrack.track_id);
	if (secondTrack) {
		tracks.push(secondTrack);
	}
	if (tracks) {
		res.status(200).send(tracks);
	} else {
		res.status(404).send({ message: 'No tracks found' });
	}

});

// Get next tracks
router.get('/api/next-track', async (req, res) => {
	nextTrack = await getNextTrack(req.query.track_id);  // assuming frontend provides the previous track_id
	if (nextTrack) {
		res.status(200).send(nextTrack);
	} else {
		res.status(404).send({ message: "No tracks found" });
	}
	
});

module.exports = router;
