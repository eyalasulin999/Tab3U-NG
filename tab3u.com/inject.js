function banner() {
	console.log(`%c
                    /$$$$$$$$        /$$        /$$$$$$  /$$   /$$ 
                    |__  $$__/       | $$       /$$__  $$| $$  | $$
                       | $$  /$$$$$$ | $$$$$$$ |__/  \\ $$| $$  | $$
                       | $$ |____  $$| $$__  $$   /$$$$$/| $$  | $$
                       | $$  /$$$$$$$| $$  \\ $$  |___  $$| $$  | $$
                       | $$ /$$__  $$| $$  | $$ /$$  \\ $$| $$  | $$
                       | $$|  $$$$$$$| $$$$$$$/|  $$$$$$/|  $$$$$$/
                       |__/ \\_______/|_______/  \\______/  \\______/ 
                
                            Tab3U script injected - FuCk Tab4U
                `, "color: #ed4e4c");
}

function chordsMapping() {
	// Get elements with class `chords` & `chords_en`
	const chordLines = document.getElementsByClassName("chords");
	const chordLinesEN = document.getElementsByClassName("chords_en");

	// Merge chords & convert to an Array()
	const mergedChordLines = [...new Set([...chordLines, ...chordLinesEN])];

	// Extract chords from each line & remove dups
	global.chords = [...new Set(mergedChordLines.flatMap(line => Array.from(line.getElementsByClassName("c_C"))))];
}

// Extract root & suffix of a chord
function parseSingleChord(chord) {
	const match = chord.match(/^([A-G]#?)(.*)$/);
	return match ? { root: match[1], suffix: match[2] } : null;
}

// Transpose a note (without any suffix)
function transposeNote(note, semitones) {
	const chromatic = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

	let index = chromatic.indexOf(note);
	if (index === -1) return note;

	let newIndex = (index + semitones) % chromatic.length;
	if (newIndex < 0) newIndex += chromatic.length;

	return chromatic[newIndex];
}

// Normalize a chord (example: Ebm --transpose--> Fbm --normalize--> Em)
function normalizeChord(chord) {
	const normalize = { "Cb": "B", "Db": "C#", "Eb": "D#", "Fb": "E", "Gb": "F#", "Ab": "G#", "Bb": "A#", "E#": "F", "B#": "C", "#b": "" };

	for (const key in normalize) {
		chord = chord.replace(key, normalize[key]);
	}

	return chord;
}

function transposeChord(chord, semitones) {
	// Slash chords handling
	const [rootChord, bassChord] = chord.split('/');

	// Root chord transpose
	const { root: rootChordRoot, suffix: rootChordSuffix } = parseSingleChord(rootChord);
	const newRootChord = `${transposeNote(rootChordRoot, semitones)}${rootChordSuffix}`;

	// Bass chord transpose (if exists)
	if (bassChord) {
		const { root: bassChordRoot, suffix: bassChordSuffix } = parseSingleChord(bassChord);
		const newBassChord = `${transposeNote(bassChordRoot, semitones)}${bassChordSuffix}`;
		return `${newRootChord}/${newBassChord}`;
	}

	return `${normalizeChord(newRootChord)}`;
}

// Transpose all chords (by offset from original tone)
function transposeChords(tone) {
	semitones = (tone - global.currentTranspose) * 2;
	global.currentTranspose = tone;

	global.chords.forEach(chord => {
		chord.innerText = transposeChord(chord.innerText, semitones);
	});
}

function isMobile() {
	return document.querySelector("meta[name='apple-mobile-web-app-capable']") ? true : false;
}

function getEasyVersionElements() {
	return global.isMobile ? [document.querySelector("a.pannelB2.cME1"), document.querySelector("a.linkSM1")] : [document.getElementById("eLinkZ")];
}

function getEasyVersionTone() {
	const easyVersionElement = getEasyVersionElements()[0];
	return easyVersionElement ? parseFloat(new URL(easyVersionElement.href).searchParams.get("ton")) : null;
}

function renderEasyVersion() {
	const easyVersionElements = getEasyVersionElements();
	easyVersionElements.forEach(easyVersionElement => {
		if (global.currentTranspose === global.easyVersionTone) {
			easyVersionElement.innerText = "לטון המקורי";
		}
		else {
			easyVersionElement.innerText = "גרסה קלה";
		}
	});
}

function easyVersionCallback() {
	if (global.currentTranspose === global.easyVersionTone) {
		toneChangeCallback(0);
	}
	else {
		toneChangeCallback(global.easyVersionTone);
	}
}

function overrideEasyVersion() {
	const easyVersionElements = getEasyVersionElements();
	easyVersionElements.forEach(easyVersionElement => {
		easyVersionElement.removeAttribute("href");
		easyVersionElement.setAttribute("onclick", "easyVersionCallback();");
	});
}

function getToneChangeElements() {
	return document.getElementsByClassName("tonOpt h");
}

function toneChangeCallback(tone) {
	transposeChords(tone);
	if (global.easyVersionTone) {
		renderEasyVersion();
	}
	renderToneChange();
}

function overrideToneChange() {
	const toneChangeElements = getToneChangeElements();
	Array.from(toneChangeElements).forEach(toneChangeElement => {
		toneChangeElement.setAttribute("onclick", `toneChangeCallback(${toneChangeElement.innerText});`);
	});
}

function renderToneChange() {
	const currentToneElement = document.querySelector("span.optTCChoosen");
	const toneChangeElements = getToneChangeElements();

	if (global.currentTranspose === 0) {
		currentToneElement.innerText = "שנה טון";
	}
	else {
		currentToneElement.innerText = `שנה טון (${global.currentTranspose})`
	}

	Array.from(toneChangeElements).forEach(toneChangeElement => {
		if (parseFloat(toneChangeElement.innerText) === global.currentTranspose) {
			toneChangeElement.classList.add("currTon")
		}
		else {
			if (toneChangeElement.classList.contains("currTon")) {
				toneChangeElement.classList.remove("currTon");
			}
		}
	});
}

function init() {
	// GLOBALS
	window.global = window.global || {};
	global.chords = Array();
	global.isMobile = isMobile();
	global.currentTranspose = 0.0;
	global.easyVersionTone = getEasyVersionTone();

	banner();
	chordsMapping();
	if (global.easyVersionTone) {
		overrideEasyVersion();
	}
	overrideToneChange();
}

// Run init() function when window loaded
window.onload = () => {
	init();
};
