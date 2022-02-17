class Range {
	constructor(low, high, name, weight) {
		this.low = low;
		this.high = high;
		this.name = name;
		this.weight = weight;
	}

	pick(i) {
		i = i % (this.high - this.low + 1);
		return this.low === 0 ? specialChars[i] : String.fromCharCode(this.low + i);
	}
}

const ranges = [
	new Range(0, 17, "selectSpecial", 1),
	new Range('a'.charCodeAt(0), 'z'.charCodeAt(0), "selectLc", 5),
	new Range('A'.charCodeAt(0), 'Z'.charCodeAt(0), "selectUc", 5),
	new Range(0x30, 0x39, "selectNumbers", 3)
]

var selected;
var totalWeight = 0;

const specialChars = "!@#$%^&*()_-+=/?><";

function charOf(i, j) {
	j = j % totalWeight;
	let r = 0;

	while(selected[r].weight <= j) {
		j -= selected[r].weight;
		r++;
	}

	return selected[r].pick(i);
}

function generate(len) {
	selected = ranges.filter(x => document.getElementById(x.name).checked);
	if(selected.length === 0) {
		return "";
	}
	totalWeight = selected.reduce((p, c) => p + c.weight, 0);

	let binary = new Uint16Array(len);
	crypto.getRandomValues(binary);
	return Array.from(binary).map(x => charOf(x >> 8, x % 256)).join('');
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