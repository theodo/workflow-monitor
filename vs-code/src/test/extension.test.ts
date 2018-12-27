import * as assert from 'assert';
import * as myExtension from '../extension';
import * as vscode from 'vscode';

suite("Extension Tests", function() {
    afterEach(() => { myExtension.cleanUp();});

    test("When timer is below 0, the VS Code Interface should turn red", async function() {
        await myExtension.setAlertLevel('red');

        let workspace = vscode.workspace.getConfiguration('workbench');
        let config = workspace.get('colorCustomizations') as any;

        if (config && config['sideBar.background']) {
            assert.equal(config['sideBar.background'], "#ff0033dd");
        } else {
            assert.fail('Tested configuration not found');
        }
    });
});