import React from "react";
import ReactDOM from "react-dom";

let throwHttpError = (response) => {
    throw new Error(`Fetch(...) returned an error: ${response.status} ${response.statusText}`);
}
let getJsonOrFailOnHttpError = (response) => {
    return response.ok ? response.json() : throwHttpError(response);
};
let getEmptyOrFailOnHttpError = (response) => {
    return response.ok ? undefined : throwHttpError(response);
};

export class ProjectList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {projects:[]};
	}

	componentDidMount() {
		fetch("/api/project-list")
			.then(getJsonOrFailOnHttpError)
			.then(projects => this.setState({ projects }))
			.catch(err => void (console.log("fetching all projects failed:", err)));
	}

	render() {
		return (
			<ul>
				{this.state.projects.map(project => <li key={project.id}>{project.name}</li>)}
			</ul>);
	}
}