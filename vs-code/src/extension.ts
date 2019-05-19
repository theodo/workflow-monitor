import * as vscode from 'vscode';
import auth from './auth';
import { createSubscriptionClient, gqlClient } from './api';
import { calculateCurrentTaskTime } from './getTime';

// TODO : fix certificate on server ?
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0";

const gql = require('graphql-tag');
const MonitorReducers = require('../../cli/src/MonitorReducers');

let originalConfig = null as any;
let timerId: NodeJS.Timer;

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
		timerId = startLocalTimer(render);
	}));
}

function render(newState: any) {
	// not sure this works as intended, need to check if the taskChrono.dateLastStart is behaving correctly
	// possible milliseconds // other problem
	// task.realTime is the correct number of time elapsed; what is newState.taskChrono ? :D
	let currentTime = calculateCurrentTaskTime(newState.taskChrono);
	console.log(currentTime);
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

// TODO : needs to take pause into account
// an IF based on the current state 
// and react to state changes from server
function startLocalTimer(render: Function) {
	return setInterval(() => {
		// TODO : this is not a trustworthy method of calculating time
		// should be improved using a cached date to replace the 1000 ms
		if (!store.isSessionPaused) {
			store.taskChrono.elapsedTime += 1000;
			store = MonitorReducers(store, {type: 'UPDATE', state: store});
			render(store);
		}
	}, 1000);
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
	clearInterval(timerId);

	return cleanUp();
}

export function setAlertLevel(level: string): Thenable<void> {
	const colors:AlertColors = {
		red: "#ff0033dd",
		yellow: "#ecd71add" // TODO : not used at the moment
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