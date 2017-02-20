import Store from "../store";

console.log('in ./master');

var ds = new Store("../../temp/demostore/");

let initialState = {
	projects: []
};

function addProject(state = initialState, action){
	switch(action.type){
		case "ADD_PROJECT":
			return {...state,
				projects: [...state.projects, action.project]
			};

		default:
			return state;
	}
}

ds.registerEventhandler(addProject);

ds.restore();


// ds.dispatch({type:"ADD_PROJECT", project: {name: "new project no. 16"}});
// ds.dispatch({type:"ADD_PROJECT", project: {name: "new project no. 17"}});
// ds.snapshot();
// ds.dispatch({type:"ADD_PROJECT", project: {name: "new project no. 18"}});
// ds.dispatch({type:"ADD_PROJECT", project: {name: "new project no. 19"}});


console.log("state", ds.getState());
