import * as vscode from 'vscode';
import auth from '../../cli/src/auth';

let originalConfig = null as any;
interface AlertColors {
	[key: string]: string;
	red: string;
	yellow: string;
}

function signIn() {
	auth.askCredentials();
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('extension.casper.red', () => {
		setAlertLevel('red')
			.then(() => {
				console.log('Alert level set to red');
			});
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.casper.yellow', () => {
		setAlertLevel('yellow')
			.then(() => {
				console.log('Alert level set to yellow');
			});
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.casper.reset', () => {
		cleanUp();
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}

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