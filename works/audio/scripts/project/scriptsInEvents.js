"use strict";


// Import the main script as Main so scripts in
// events can access methods like Main.PlaySfx5().
import * as Main from "./main.js";


{
	const scriptsInEvents = {

		async EventSheet1_Event1_Act1(runtime, localVars)
		{
			Main.PlaySfx5();
		},

		async EventSheet1_Event2_Act1(runtime, localVars)
		{
			Main.PlaySfx7();
		},

		async EventSheet1_Event3_Act1(runtime, localVars)
		{
			Main.PlayMusic();
		}

	};
	
	self.C3.ScriptsInEvents = scriptsInEvents;
}
