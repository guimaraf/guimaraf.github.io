
// This class helps manage audio playback code. You may find it useful
// to re-use it in your own projects as well.
export default class AudioManager
{
	constructor(runtime, contextOpts)
	{
		this.runtime = runtime;
		this.audioContext = null;
		
		// Create the AudioContext. Most browsers use AudioContext,
		// but Safari still uses webkitAudioContext. One of the two
		// should always be supported.
		if (typeof AudioContext !== "undefined")
			this.audioContext = new AudioContext(contextOpts);
		else if (typeof webkitAudioContext !== "undefined")
			this.audioContext = new webkitAudioContext(contextOpts);
		else
			throw new Error("AudioContext not supported");
	}
	
	// This wraps the audioContext's decodeAudioData in a promise, since
	// some browsers only support the callback version. Also, unfortunately
	// Safari does not yet have built-in support for decoding WebM Opus files.
	// To work around this Construct provides its own WebM Opus decoder
	// which can be used as a fallback.
	decodeAudioData(arrayBuffer, isWebM)
	{
		// Note if a non-WebM file is passed, always use the built-in decoder.
		if (this.runtime.assets.isWebMOpusSupported || !isWebM)
		{
			// Built-in support for WebM Opus: use built-in decoder,
			// and wrap in a promise so it can be used with 'await'.
			return new Promise((resolve, reject) =>
			{
				this.audioContext.decodeAudioData(arrayBuffer, resolve, reject);
			});
		}
		else
		{
			// No built-in support for WebM Opus: use Construct's decoder
			return this.runtime.assets.decodeWebMOpus(this.audioContext, arrayBuffer);
		}
	}
	
	// Load an AudioBuffer from a project file name e.g. "sfx5.webm".
	async loadSound(url)
	{
		// Check if the given file uses the .webm extension.
		const isWebM = url.toLowerCase().endsWith(".webm");
		
		// Note that media files, including sound and music, are
		// exported under a media folder, so add that to the URL.
		const audioUrl = this.runtime.assets.mediaFolder + url;

		// Ask the runtime to fetch the URL as an ArrayBuffer
		// for decoding. Don't use a normal 'fetch' because it
		// doesn't work in preview mode or on some platforms
		// like Cordova which use local files.
		const arrayBuffer = await this.runtime.assets.fetchArrayBuffer(audioUrl);

		// Once the compressed audio data has been loaded as an
		// ArrayBuffer, decode it to an AudioBuffer ready for playback.
		// Note indicate if the file is WebM since it may need to
		// switch to a fallback if the browser doesn't support WebM.
		const audioBuffer = await this.decodeAudioData(arrayBuffer, isWebM);

		return audioBuffer;
	}
	
	// Play an AudioBuffer.
	playSound(audioBuffer)
	{
		const source = this.audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(this.audioContext.destination);
		source.start(0);
	}
	
	// Load a music track. This uses the <audio> element instead of
	// Web Audio, because music tracks tend to be a lot longer,
	// and Web Audio can only play fully decompressed tracks, whereas
	// the <audio> element can stream tracks. However if the browser
	// does not have built-in support for decoding WebM Opus, instead
	// switch to using loadSound() which can use Construct's decoder.
	async loadMusic(url)
	{
		// Check if the given file uses the .webm extension.
		const isWebM = url.toLowerCase().endsWith(".webm");
		
		// If there is no built-in support for WebM Opus, swap to using
		// loadSound() since it can use Construct's decoder. This is
		// less efficient, but there are no other options for playing
		// WebM Opus audio. Construct's Audio plugin works the same way.
		if (isWebM && !this.runtime.assets.isWebMOpusSupported)
			return this.loadSound(url);
		
		// Otherwise if there is built-in support for WebM Opus continue
		// with creating an <audio> element.
		const audioElem = new Audio();
		
		// Use getMediaFileUrl to get a URL that can be used in the
		// src attribute. Don't set the src directly because it doesn't
		// work in preview mode or on some platforms like Cordova that
		// use local files.
		const musicUrl = await this.runtime.assets.getMediaFileUrl("epicArpg.webm");
		audioElem.src = musicUrl;
		
		// Load the audio element, and wait for the canplaythrough event
		// to fire to indicate it's loaded enough to play to the end.
		audioElem.load();
		await this.waitForCanPlayThrough(audioElem);
		
		return audioElem;
	}
	
	// Helper method to return a promise that resolves when the
	// "canplaythrough" event fires, indicating it's ready for playback.
	// It also rejects if the error event fires.
	waitForCanPlayThrough(audioElem)
	{
		return new Promise((resolve, reject) =>
		{
			audioElem.addEventListener("canplaythrough", resolve);
			audioElem.addEventListener("error", reject);
		});
	}
	
	playMusic(audio)
	{
		// loadMusic switches to using Web Audio if the browser does not
		// support WebM Opus. In this case an AudioBuffer will end up
		// passed to this method instead of an <audio> element. If this
		// happens switch to calling playSound() instead.
		if (audio instanceof AudioBuffer)
		{
			this.playSound(audio);
		}
		else
		{
			// Just use the play() method of HTMLMediaElement. It will
			// start streaming playback without fully decompressing the file.
			audio.play();
		}
	}
}
