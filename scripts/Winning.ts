import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { Ballot, Ballot__factory } from '../typechain-types';
dotenv.config();

async function main() {
  // Receiving parameters, this time send contract deployed hash as parameter
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error('Parameters not provided');
  const contractAddress = parameters[0];

  console.log('USING SMART CONTRACT ', contractAddress);

  // Configuring provider
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ''
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

  // Check winning name & proposal
  // smart contract address : 0xaff229ff28e0fec8ed99056af8f6f1e95244ca06

  const winner = await ballotContract.winnerName();
  const totalVoteCount = await ballotContract.winningProposal();
  const winnerStr = ethers.decodeBytes32String(winner);

  console.log(
    `Winning proposal name :  ${winnerStr} with ${totalVoteCount} votes`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
