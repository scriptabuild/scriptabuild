
module.exports = function transform(orig, dictionary, depth = 10, maxIterations = 10) {
	if (orig !== null &&
		typeof orig !== "object" &&
		typeof(orig) !== "function"
	) return replace(orig, dictionary, maxIterations);

	// Make the copy share the same prototype as the original
	var copy = new orig.constructor();

	// Copy every enumerable property not from the prototype
	for (var key in orig) {
		if (orig.hasOwnProperty(key)) {
			if (depth === undefined || depth > 0) {
				copy[key] = transform(orig[key], dictionary, depth === undefined ? undefined : depth - 1);
			}
			else {
				copy[key] = orig[key];
			}
		}
	}

	return copy;
}

function replace(s, dictionary, remainingIterations = 10) {
	if (typeof s != "string") return s;

	return s.replace(/%(.*?)%/g, function(match, subMatch1) {
		if (dictionary[subMatch1] === undefined) {
			return `%${subMatch1}%`;
		}
		return replace(dictionary[subMatch1], dictionary, remainingIterations - 1)
	});
}
