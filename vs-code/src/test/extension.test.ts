import * as assert from 'assert';
import * as caspr from '../extension';
import * as vscode from 'vscode';

describe("Extension Tests", function () {
    afterEach(() => { caspr.cleanUp(); });

    it("When timer is below 0, the VS Code Interface should turn red", async function () {
        await caspr.setAlertLevel('red');

        let workspace = vscode.workspace.getConfiguration('workbench');
        let config = workspace.get('colorCustomizations') as any;

        if (config && config['activityBar.background']) {
            assert.equal(config['activityBar.background'], "#ff0033dd");
        } else {
            assert.fail('Tested configuration not found');
        }
    });

    xit("test renderer", function () {
        let newState = {
            isSessionPaused: false,
            currentStep: "WORKFLOW", tasks: [
                {
                    id: "96d94905-1f4d-4432-bf20-8bf965d16561",
                    label: "run the cli in console",
                    estimatedTimeText: "10",
                    estimatedTime: 600000,
                    realTime: 221344
                }
            ],
            taskChrono: { dateLastStart: 1551737834032, elapsedTime: 74069 },
            globalChrono: { dateLastStart: 1551737834032, elapsedTime: 1135424636 },
            currentTaskIndex: 1
        };
    });
});