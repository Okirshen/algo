#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

const path = require('path');
const fs = require('fs');
require('colors');

program
	.command('init')
	.description('Initialize a algo.json file')
	.action(() => {
		const cwd = process.cwd();
		const algoJsonPath = path.join(cwd, 'algo.json');
		if (fs.existsSync(algoJsonPath)) {
			console.log(`algo.json File already Initialized at ${cwd}`.red);
		} else {
			fs.writeFileSync(algoJsonPath, JSON.stringify(defaultAlgoJson));
			console.log(`algo.json File Initialized at ${cwd}`.green);
			console.log(
				`edit the algo.json file, create the algorithm and type ${
					'algo run'.blue
				} to test it`
			);
		}
	});

program
	.command('run')
	.description('Tests the algorithm')
	.action(() => {
		const cwd = process.cwd();
		const algoJsonPath = path.join(cwd, 'algo.json');
		if (fs.existsSync(algoJsonPath)) {
			const algoJson = JSON.parse(fs.readFileSync(algoJsonPath));
			const algo = require(path.join(cwd, 'main.js'));
			algoJson.tests.forEach((test, i) => {
				const algoOutput = algo(...JSON.parse(JSON.stringify(test.input)));
				const testRes =
					JSON.stringify(algoOutput) === JSON.stringify(test.output);
				let msg;
				if (testRes) {
					msg = `Test ${i + 1} Successful  Input: ${JSON.stringify(
						test.input
					)} output: [${algoOutput}]`.green;
					console.log(msg);
				} else {
					msg = `Test ${i + 1} Failed:`.red;
					console.log(msg);
					console.log(`  Input result: ${JSON.stringify(...test.input)}`);
					console.log(`  Expected result: ${JSON.stringify(test.output)}`);
					console.log(`  Actual result: ${JSON.stringify(algoOutput)}`);
				}
			});
		} else {
			console.log(`algo.json File doesn't exist at ${cwd}`.red);
		}
	});

program.version(pkg.version).parse(process.argv);
