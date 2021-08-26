const express = require("express");
const axios = require('axios');
const getNextTrack = require('../utils/helpers')

const router = new express.Router();


// Get the first two tracks
router.get("/api/first-two", async (req, res) => {
	url = `https://api.musixmatch.com/ws/1.1/track.search?page_size=1&q_lyrics=${req.query.category}&quorum_factor=1&apikey=${process.env.API_KEY_1}`;

	const response = await axios.get(url);
	const trackList = response.data.message.body.track_list;
	const tracks = [];
	
	const firstTrack = response.data.message.body.track_list[0];
	tracks.push({
		title: firstTrack.track.track_name,
		artist: firstTrack.track.artist_name,
		track_id: firstTrack.track.track_id,
		url: firstTrack.track.track_share_url,
	});

	secondTrack = await getNextTrack(firstTrack.track_id);
	tracks.push(secondTrack)

	res.send(tracks);
});

// Get next tracks
router.get('/api/next-track', async (req, res) => {
	nextTrack = getNextTrack(req.query.track_id);  // frontend provides the previous track_id
	
	res.send(nextTrack.data)
});

module.exports = router;



				
