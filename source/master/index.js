import Store from "../store";

console.log('in ./master');

var ds = new Store("../../temp/demostore/");

let initialState = {
	projects: []
};

ds.setInitialState(initialState);

ds.registerEventhandler("ADD_PROJECT", (state, action) => {
	return { ...state,
		projects: [...state.projects, action.project]
	};
});

ds.restore();

// ds.dispatch({type:"ADD_PROJECT", project: {name: "new project no. 16"}});
// ds.dispatch({type:"ADD_PROJECT", project: {name: "new project no. 17"}});
// ds.snapshot();
// ds.dispatch({type:"ADD_PROJECT", project: {name: "new project no. 18"}});
// ds.dispatch({type:"ADD_PROJECT", project: {name: "new project no. 19"}});


console.log("state", ds.getState());