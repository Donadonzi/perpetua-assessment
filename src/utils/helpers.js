const axios = require("axios");

const playlist = [];

const isPlayed = (track_id) => {
	return playlist.includes(track_id);
};


const callTracksApi = async (query) => {
	const response = await axios.get(
		`https://api.musixmatch.com/ws/1.1/track.search?&q_lyrics=${query}&quorum_factor=1&apikey=${process.env.API_KEY_1}`,
	);
	return response.data.message.body.track_list;
};


const getLyrics = async (trackId) => {
	url = `https://api.musixmatch.com/ws/1.1/track.lyrics.get?&track_id=${trackId}&apikey=${process.env.API_KEY_1}`;

	const response = await axios.get(url);
	lyricsWordsList = response.data.message.body.lyrics.lyrics_body
		.replace(/(\r\n|\n|\r|[(0-9)]|,|\.)/gm, "")
		.replace("******* This Lyrics is NOT for Commercial use *******", " ")
		.split(" ");
	return lyricsWordsList;
};


const getRandomWords = (words) => {
	randomWords = new Set();
	let counter = 1;
	while (randomWords.size < 5) {
		randomWord = words[Math.floor(Math.random() * words.length)];
		randomWords.add(randomWord);
		counter++;
		// avoid infinite loop
		if (counter > 20) {
			break;
		}
	}
	return Array.from(randomWords).join(",");
};


const getFirstTrack = async (query) => {
	trackList = await callTracksApi(query);
	const firstTrack = trackList[0];
	if (firstTrack) {
		playlist.push(firstTrack.track.track_id);
		return {
			title: firstTrack.track.track_name,
			artist: firstTrack.track.artist_name,
			track_id: firstTrack.track.track_id,
			url: firstTrack.track.track_share_url,
		};
	}
	return null;	
};


const getNextTrack = async (trackId) => {
	let index = 0;
	let counter = 1;
	const lyricWords = await getLyrics(trackId);
	const randoms = getRandomWords(lyricWords);
	const trackList = await callTracksApi(randoms);
	let track = trackList[index];
	while (!track) {
		// avoid infinite loop
		if (counter > 20) {
			return null;
		}
		const newRandoms = getRandomWords(lyricWords);
		const anotherTrackList = await callTracksApi(newRandoms);
		track = anotherTrackList[index];
		counter++;
	}
	// Return a non-played track with lyrics unless not found
	while (isPlayed(track.track.track_id)) {
		index++;
		if (index > trackList.length) {
			return null;
		}
		track = trackList[index];
		if (track.track.has_lyrics != 1) {
			continue;
		}
	}

	playlist.push(track.track.track_id);

	return {
		title: track.track.track_name,
		artist: track.track.artist_name,
		track_id: track.track.track_id,
		url: track.track.track_share_url,
	};
};


module.exports = { getNextTrack, getFirstTrack };
