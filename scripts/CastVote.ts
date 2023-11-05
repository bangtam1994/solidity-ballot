import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { Ballot, Ballot__factory } from '../typechain-types';
dotenv.config();

const PROPOSALS = 5;

async function main() {
  // Receiving parameters, this time send contract deployed hash as parameter
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error('Parameters not provided');
  const contractAddress = parameters[0];
  const proposalNumber = parameters[1];

  console.log('PARAMETERS 0>>>', parameters[0]);
  console.log('PARAMETERS 1>>>', parameters[1]);

  // Configuring provider
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ''
  );

  const lastBlock = await provider.getBlock('latest');
  console.log(`Last block number: ${lastBlock?.number}`);
  const lastBlockTimestamp = lastBlock?.timestamp ?? 0;
  const lastBlockDate = new Date(lastBlockTimestamp * 1000);
  console.log(
    `Last block timestamp: ${lastBlockTimestamp} (${lastBlockDate.toLocaleDateString()} ${lastBlockDate.toLocaleTimeString()})`
  );

  // configuring wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider);
  console.log(`Using address ${wallet.address}`);
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`Wallet balance ${balance} ETH`);
  if (balance < 0.01) {
    throw new Error('Not enough ether');
  }

  // Read all current votes
  const ballotFactory = new Ballot__factory(wallet);
  const ballotContract = ballotFactory.attach(contractAddress) as Ballot;
  for (let index = 0; index < PROPOSALS; index++) {
    const tx = await ballotContract.proposals(index);
    console.log(
      `Proposal ${index} has currently  ${tx.voteCount} votes for name  ${tx.name}`
    );
  }

  // No need to deploy, use smart contract already deployed with npx ts-node --files ./scripts/CastVote.ts  contractAddress proposalNumber
  // smart contract address : 0xaff229ff28e0fec8ed99056af8f6f1e95244ca06
  const tx = await ballotContract.vote(proposalNumber);
  const receipt = await tx.wait();
  console.log(`Transaction completed ${receipt?.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
