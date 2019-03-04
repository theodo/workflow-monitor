import * as vscode from 'vscode';
import auth from './auth';
import { createSubscriptionClient, gqlClient } from './api';

// TODO : fix certificate on server ?
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0";

const gql = require('graphql-tag');
const MonitorReducers = require('../../cli/src/MonitorReducers');

let originalConfig = null as any;
interface AlertColors {
	[key: string]: string;
	red: string;
	yellow: string;
}

// TODO : check these two types with the server documentation
type ServerUserData = {
	data: {
		currentUser: {
			state: any,
		}
	}
};

// TODO : check these two types with the server documentation
type ServerUpdateData = {
	data: {
		state: any,
	}
};

let store = MonitorReducers();

function signIn(context: vscode.ExtensionContext) {
	auth.setContext(context);
	return auth.askCredentials();
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('extension.caspr.red', () => {
		setAlertLevel('red')
			.then(() => {
				console.log('Alert level set to red');
			});
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.caspr.yellow', () => {
		setAlertLevel('yellow')
			.then(() => {
				console.log('Alert level set to yellow');
			});
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.caspr.reset', () => {
		cleanUp();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.caspr.test', async () => {
		await signIn(context);
		getCurrentStateFromServer()
			.then((data: ServerUserData) => { updateLocalState(data, render); })
			.catch((error: Error) => {
				console.log(error);
			});

		subscribeToUpdates(render);
	}));
}

function render(newState: any) {
	const getTime = (dateLastPause: any, chrono: any) => {
	if (!chrono.dateLastStart) { 

		return 0;
	}

	const now = (new Date()).getTime();

	return dateLastPause ?
		chrono.elapsedTime + (dateLastPause - chrono.dateLastStart)
		: chrono.elapsedTime + (now - chrono.dateLastStart);
	};

	let currentTime = getTime(newState.dateLastPause, newState.taskChrono);
	let estimatedTime = newState.tasks[newState.currentTaskIndex].estimatedTime;

	if (currentTime > estimatedTime) {
		setAlertLevel('red')
			.then(() => {
				console.log('Alert level set to red');
			});
	} else {
		cleanUp()
			.then(() => {
				console.log('Alert level set to green');
			});
	}
}

function subscribeToUpdates(render: Function) {
	createSubscriptionClient().subscribe({
		next (data: ServerUpdateData) {
			console.log(data);
			store = MonitorReducers(store, {type: 'UPDATE', state: JSON.parse(data.data.state)});
			render(store);
		}
	});
}

function updateLocalState({
	data: {
		currentUser: {
			state
		}
	}
}: ServerUserData, render: Function) {
	if (state) {
		store = MonitorReducers(store, { type: 'UPDATE', state: JSON.parse(state) });
		render(store);
	}
}

function getCurrentStateFromServer(): Promise<ServerUserData> {
	return gqlClient
      .query({
        query: gql`
          {
            currentUser { state }
          }
        `,
      });
}

// this method is called when your extension is deactivated
export function deactivate() {
	return cleanUp();
}

export function setAlertLevel(level: string): Thenable<void> {
	const colors:AlertColors = {
		red: "#ff0033dd",
		yellow: "#ecd71add"
	};

	let config = {
		"activityBar.background": colors[level],
		"activityBar.foreground": "#000000"
	};

	let workspace = vscode.workspace.getConfiguration('workbench');
	if (originalConfig === null) {
		originalConfig = workspace.get('colorCustomizations');
	}

	return workspace.update('colorCustomizations', {...originalConfig, ...config}, vscode.ConfigurationTarget.Global);
}

export function cleanUp(): Thenable<void> {
	let workspace = vscode.workspace.getConfiguration('workbench');
	return workspace.update('colorCustomizations', originalConfig, vscode.ConfigurationTarget.Global);
}