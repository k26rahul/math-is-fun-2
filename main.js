const log = console.log.bind(console);
const $ = document.querySelector.bind(document);

const allowedEntries = `000, 045, 055, 065, 075, 085, 095, 100, 105, 110, 115, 145, 155, 165, 175, 185,

195, 200, 205, 210, 215, 220, 225, 245, 435, 440, 445, 500, 510, 520, 530, 540, 550, 555, 570, 600, 610, 620, 630, 640, 780, 800, 810, 820, 830, 840, 850, 855, 930, 940, 950, 955, 960, 965, 970, 975,

255, 265, 275, 285, 295, 300, 305, 310,

315, 320, 325, 330, 335, 365, 375, 385,

395, 400, 405, 410, 415, 420, 425, 430,

650, 655, 660, 665, 670, 700, 710, 720,

730, 740, 750, 755, 760, 765, 770, 775,

860, 865, 870, 875, 880, 885, 890, 920,

980, 985, 990, 995, 450, 675, 120`.split(",").reduce((acc, el) => {
		acc.push(el.trim());
		return acc;
	}, []);

function calc() {
	let result;
	let listInput = $("#listInput").value.split(',').filter(el => el !== "");
	let rInput = Number($("#rInput").value);
	let orderInput = $("#orderInput").checked;
	let repetitionInput = $("#repetitionInput").checked;

	localStorage.listInput = JSON.stringify(listInput);
	localStorage.rInput = rInput;
	localStorage.orderInput = orderInput;
	localStorage.repetitionInput = repetitionInput;
	localStorage.filterInput = $("#filterInput").checked;

	$("#rSpan").innerText = rInput;
	$("#nSpan").innerText = listInput.length;
	if (orderInput) {
		if (repetitionInput) {
			result = permutationWithRepetition(listInput, rInput);
			$("#operationSpan").innerText = "PERMUTATION-WITH-REPETITION";
			$("#operationFormulaSpan").innerHTML = "n<sup>r</sup>";
		}
		else {
			result = gen(`permutation`, listInput, rInput);
			$("#operationSpan").innerText = "PERMUTATION";
			$("#operationFormulaSpan").innerHTML = "<sup>n!</sup>&frasl;<sub>(n-r)!</sub>";
		}
	}
	else {
		if (repetitionInput) {
			result = combinationWithRepetition(listInput, rInput);
			$("#operationSpan").innerText = "COMBINATION-WITH-REPETITION";
			$("#operationFormulaSpan").innerHTML = "<sup>(n+r-1)!</sup>&frasl;<sub>r!(n-1)!</sub>";
		}
		else {
			result = gen(`combination`, listInput, rInput);
			$("#operationSpan").innerText = "COMBINATION";
			$("#operationFormulaSpan").innerHTML = "<sup>n!</sup>&frasl;<sub>r!(n-r)!</sub>";
		}
	}

	result = result.reduce((acc, el) => {
		acc.push(el.join(""));
		return acc;
	}, []);
	let totalEntries = result.length;

	result = [...new Set(result)];
	let withoutDupEntries = result.length;

	if ($("#filterInput").checked) {
		result = result.reduce((acc, el) => {
			if (allowedEntries.includes(el)) acc.push(el);
			return acc;
		}, []);
	}
	let filteredEntries = result.length;

	$("#totalEntriesSpan").innerText = totalEntries;
	$("#withDupEntriesSpan").innerText = totalEntries - withoutDupEntries;
	$("#withoutDupEntriesSpan").innerText = withoutDupEntries;
	$("#filteredEntriesSpan").innerText = withoutDupEntries - filteredEntries;
	$("#shownEntriesSpan").innerText = filteredEntries;

	$("#resultOutput").innerHTML = "";
	result.forEach(el => {
		let span = document.createElement("span");
		span.innerText = `{${el}} `;
		$("#resultOutput").append(span);
	});
}

function gen(operation, list, r) {
	let resultGenerator = G[operation](list, r);
	let result = [];
	let go = true;
	do {
		let next = resultGenerator.next().value;
		if (next === undefined) {
			go = false;
		}
		else {
			result.push([...next]);
		}
	} while (go);
	return result;
}

function combinationWithRepetition(list, r) {
	let data = Array(r);
	let results = [];
	(function f(pos, start) {
	  if(pos === r) {
	    results.push(data.slice());
	    return;
	  }
	  for(let i=start; i<list.length; ++i) {
	    data[pos] = list[i];
	    f(pos+1, i);
	  }
	})(0, 0);
	return results;
}

function permutationWithRepetition(list, r) {
  var holdingArr = [];
  var recursiveFun = function(singleSolution) {
      if (singleSolution.length > r-1) {
        holdingArr.push(singleSolution);
        return;
      }
      for (var i=0; i < list.length; i++) {
        recursiveFun(singleSolution.concat([list[i]]));
      }
  };
  recursiveFun([]);
  return holdingArr;
};
