import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import { buildProject } from "../api";

import { ProjectSummary } from "./ProjectSummary";

const View = ({projects, buildProject}) => (
	<ul>
		{projects.map(project => (
			<li key={project.id}>
				<ProjectSummary project={project} />
				<button onClick={() => buildProject(project.id)}>[build]</button>
			</li>
		))}
	</ul>
);

const mapStateToProps = state => ({
	projects: state.projects,
});

const mapDispatchToProps = dispatch => ({
	buildProject(id) { console.log(`Requesting build for ${id}`); buildProject(id, dispatch)}
});

export const ProjectList = connect(mapStateToProps, mapDispatchToProps)(View);