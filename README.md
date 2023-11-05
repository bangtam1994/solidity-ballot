# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

check : https://github.com/Encode-Club-Solidity-Bootcamp/Lesson-05

To create a project from base :

```shell
npm init
npm install --save-dev hardhat
npx hardhat init --> create typescript prokect
npm i -d mocha
npm i -d @nomicfoundation/hardhat-toolbox@^3.0.0

```

create a .mocharc.json file:

{
"require": "hardhat/register",
"timeout": 40000,
"\_": ["test*/**/*.ts"]
}

Edit the configuration file for Typescript
tsconfig.json file:

"include": ["./scripts", "./test", "./typechain-types"],
"files": ["./hardhat.config.ts"],

Then to create typechain-types

```shell
npx hardhat compile
```

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

# USING THE SCRIPTS

In the scripts folder, you will find several scripts to deploy and interact with a smart contract.
You can deploy Ballot.sol using DeployWithEthers.ts

```shell
npx ts-node --files ./scripts/DeployWithEthers.ts "arg1" "arg2"
```

You can add arguments such as proposal names for Ballot in the command line.

Then with the deployed smart contract address, you can interact; for instance

```shell
npx ts-node ./scripts/CastVote.ts 0xaff229ff28e0fec8ed99056af8f6f1e95244ca06 1
```

With 0xaff229ff28e0fec8ed99056af8f6f1e95244ca06 being the smartContractAddress and 1 the index in the list of the proposals.

Yo read vote, just do

```shell
npx ts-node ./scripts/ReadVote.ts 0xaff229ff28e0fec8ed99056af8f6f1e95244ca06
```
