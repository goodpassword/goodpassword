const ranges = [
	[0, 17, "selectSpecial"],
	['a'.charCodeAt(0), 'z'.charCodeAt(0), "selectLc"],
	['A'.charCodeAt(0), 'Z'.charCodeAt(0), "selectUc"],
	[0x30, 0x39, "selectNumbers"]
]

var selected;
var totalLength = 0;

const specialChars = "!@#$%^&*()_-+=/?><";

function charOf(i) {
	i = i % totalLength;
	let r = 0;

	while(selected[r][0] + i > selected[r][1]) {
		i -= selected[r][1] - selected[r][0] + 1;
		r++;
	}

	return selected[r][0] === 0 ? specialChars[i] : String.fromCharCode(selected[r][0] + i);
}

function generate(len) {
	selected = ranges.filter(x => document.getElementById(x[2]).checked);
	if(selected.length === 0) {
		return "";
	}
	totalLength = selected.reduce((p, c) => p + c[1] - c[0] + 1, 0);
	let binary = new Uint8Array(len);
	crypto.getRandomValues(binary);
	return Array.from(binary).map(x => charOf(x)).join('');
}

function output() {
	let o = document.getElementById("output");
	let len = document.getElementById("length");

	let length = parseInt(len.value);
	if(isNaN(length)) {
		alert("Invalid length");
		return;
	}

	o.value = generate(length)
}