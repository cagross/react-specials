//Define all possible search terms here--terms which are indicative of a poultry, beef, or pork item.  These terms are requried to determine which meat category each items belongs.  This is very incomplete and inexact, as determining accurate and complete search terms is difficult.  Also, this data should eventually be moved to a database.

export function terms() {
	const searchTerms = {
		poultry: [
			"chicken",
			"roaster",
			"turkey",
			"duck",
			"hen",
			"goose",
			"turducken"
		],
		beef: [
			"beef",
			"steak",
			"round",
			"chuck",
			"rump",
			"mignon",
			"frank",
			// "bologna",
			// "lunch meat",
			"veal",
			// "ground",
			"roast",
			"porterhouse",
			"90 % lean"
		],
		pork: [
			"butt",
			"ham",
			"bacon",
			// "rib",
			"sausage",
			"pork"
		]
	}
	return searchTerms;
}