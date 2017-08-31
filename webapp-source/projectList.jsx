import React from "react";
import ReactDOM from "react-dom";
import {getJsonOrFailOnHttpError} from "./fetch-utils";

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
