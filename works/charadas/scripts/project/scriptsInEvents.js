


const scriptsInEvents = {

	async Common_Event30_Act3(runtime, localVars)
	{
		console.log('randomizado ' + localVars.randomize)
	},

	async Common_Event30_Act4(runtime, localVars)
	{
		console.log(localVars.allFrames)
	},

	async Common_Event50_Act2(runtime, localVars)
	{
		console.log('roda musica menu')
	},

	async Common_Event52_Act2(runtime, localVars)
	{
		console.log('roda musica menu')
	},

	async Common_Event56_Act3(runtime, localVars)
	{
		console.log('roda musica gameplay')
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

