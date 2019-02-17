import * as vscode from 'vscode';
import auth from './auth';

let originalConfig = null as any;
interface AlertColors {
	[key: string]: string;
	red: string;
	yellow: string;
}

function signIn(context: vscode.ExtensionContext) {
	auth.setContext(context);
	auth.askCredentials();
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
	}));

	// signIn();
	// getCurrentStateFromServer();
	// updateLocalState();
	// subscribeToUpdates();
}

// this method is called when your extension is deactivated
export function deactivate() {
	// TODO
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