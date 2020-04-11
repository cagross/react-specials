import test from 'tape'; // assign the tape library to the variable "test"
// import * as name from "../src/change-calculator.js";
// import { calculateChange } from "../src/change-calculator.js";
import { loc } from "../src/module-store-location.js";


// console.log(storeLoc);
// console.log(testy());


// calculateChange();
// testy();

// import defaultExport from "../src/change-calculator.js";
// var promise = import("../src/change-calculator.js");
// var calculateChange = import("../src/change-calculator.js");
// var calculateChange = import("change-calculator.js");





// function sum (a, b) {
//   // your code to make the test pass goes here ...
//   return a+b;
// }

test('Correct store location is returned.', function (t) {
	const result = [
		'Giant Food',
		'7235 Arlington Blvd',
		'Falls Church, VA 22042'
	];
	t.deepEqual(result, loc()); // make this test pass by completing the add function!
	t.end();
});