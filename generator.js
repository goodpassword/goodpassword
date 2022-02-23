class Range {
	get weight() {
		let v = parseInt(this.self.value);
		if(isNaN(v) || v < 0) {
			return 0;
		}
		return Math.min(10, v);
	}

	set weight(v) {
		this.self.value = v;
	}

	get checked() {
		return this.weight > 0;
	}

	check() {
		if(this.checked) {
			this.oldWeight = this.weight;
			this.weight = 0;
		}
		else {
			this.weight = this.oldWeight;
		}
		this.cbox.checked = this.checked;
	}

	pick(i) {
		i = i % (this.high - this.low + 1);
		return this.low === 0 ? specialChars[i] : String.fromCharCode(this.low + i);
	}

	static checkListener(e) {
		ranges.find(r => r.cbox === e.target).check();
	}

	constructor(low, high, name, weight) {
		this.self = document.getElementById(name);
		this.low = low;
		this.high = high;
		this.weight = weight;
		this.oldWeight = weight;
		this.cbox = Array.from(this.self.parentNode.childNodes).find(n => n.type === "checkbox");
		this.cbox.addEventListener("click", Range.checkListener);
	}
}

const ranges = [
	new Range(0, 17, "weightSpecial", 1),
	new Range('a'.charCodeAt(0), 'z'.charCodeAt(0), "weightLc", 5),
	new Range('A'.charCodeAt(0), 'Z'.charCodeAt(0), "weightUc", 5),
	new Range(0x30, 0x39, "weightNumbers", 3)
]

var selected;
var totalWeight = 0;

const specialChars = "!@#$%^&*()_-+=/?><";

function charOf(i, j) {
	j = j % totalWeight;
	let r = 0;

	let w = selected[r].weight;
	while(w <= j) {
		j -= w;
		r++;
		w = selected[r].weight;
	}

	return selected[r].pick(i);
}

function generate(len) {
	selected = ranges.filter(x => x.checked);
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
	if(isNaN(length) || length < 1) {
		alert("Invalid length");
		return;
	}

	o.value = generate(length)
}
