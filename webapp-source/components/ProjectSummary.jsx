import React from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";

export const ProjectSummary = ({ project }) => (
	<span>
		{project.name} <span className={classnames("status", project.status)}>{project.statusText}</span>
	</span>
);
