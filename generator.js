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

	constructor(name, weight, pick) {
		this.self = document.getElementById(name);
		this.weight = weight;
		this.oldWeight = weight;
		this.cbox = Array.from(this.self.parentNode.childNodes).find(n => n.type === "checkbox");
		this.checkListener = () => this.check();
		this.cbox.addEventListener('click', this.checkListener);
		this.pick = pick;
	}
}

const ranges = [
	new Range("weightSpecial", 1, i => specialChars[i % specialChars.length]),
	new Range("weightLc", 5, i => String.fromCharCode(i % 26 + 'a'.charCodeAt(0))),
	new Range("weightUc", 5, i => String.fromCharCode(i % 26 + 'A'.charCodeAt(0))),
	new Range("weightNumbers", 3, i => `${i % 10}`)
]

const specialChars = "!@#$%^&*()_-+=/?><";

function charOf(i, j, selected, totalWeight) {
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
	let selected = ranges.filter(x => x.checked);
	if(selected.length === 0) {
		return "";
	}
	let totalWeight = selected.reduce((p, c) => p + c.weight, 0);

	let binary = new Uint16Array(len);
	crypto.getRandomValues(binary);
	return Array.from(binary).map(x => charOf(x >> 8, x % 256, selected, totalWeight)).join('');
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
