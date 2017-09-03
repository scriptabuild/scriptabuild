import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import { ProjectSummary } from "./projectSummary";

const View = ({projects}) => (
	<ul>
		{projects.map(project => (
			<li key={project.id}><ProjectSummary project={project} /></li>
		))}
	</ul>
);

const mapStateToProps = state => ({
	projects: state.projects,
});

const mapDispatchToProps = dispatch => ({
});

export const ProjectList = connect(mapStateToProps, mapDispatchToProps)(View);