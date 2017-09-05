import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import classnames from "classnames";

import { buildProject } from "../api";


const View = ({projects, buildProject}) => (
	<ul>
		{projects.map(project => (
			<li key={project.id}>
				{project.name}
				&nbsp;
				<span className={classnames("status", project.status)}>{project.statusText}</span>
				&nbsp;
				<button onClick={() => buildProject(project.id)}>build</button>
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