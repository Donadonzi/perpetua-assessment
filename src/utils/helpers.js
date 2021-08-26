const axios = require("axios");

const usedTrackIds = new Set();

const getLyrics = async (trackId) => {
	url = `https://api.musixmatch.com/ws/1.1/track.lyrics.get?&track_id=${trackId}&apikey=${process.env.API_KEY_1}`;

	const response = await axios.get(url);
	lyricsWordsList = response.data.message.body.lyrics.lyrics_body
		.replace(/(\r\n|\n|\r|[(0-9)])/gm, "")
		.replace("******* This Lyrics is NOT for Commercial use *******", " ")
		.split(" ");

	return lyricsWordsList;
};


const getRandomWords = (words) => {
	randomWords = new Set();
	while (randomWords.size < 5) {
		randomWord = words[Math.floor(Math.random() * words.length)];
		randomWords.add(randomWord);
	}

	return Array.from(randomWords).join("%2C");
};


const getNextTrack = async (trackId) => {

	const lyricWords = await getLyrics(trackId);
	const randoms = getRandomWords(lyricWords);
	const track = await axios.get(
		`https://api.musixmatch.com/ws/1.1/track.search?page_size=1&q_lyrics=${randoms}&quorum_factor=1&apikey=${process.env.API_KEY_1}`,
	).data.message.body.track_list[0];

	// CHECK IT"S NOT USED
	// if not in usedTrackIds



	return {
		title: track.track.track_name,
		artist: track.track.artist_name,
		track_id: track.track.track_id,
		url: track.track.track_share_url,
	};
}

module.exports = getNextTrack;




