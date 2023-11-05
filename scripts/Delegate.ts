import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { Ballot, Ballot__factory } from '../typechain-types';
dotenv.config();

async function main() {
  // Receiving parameters, this time send contract deployed hash as parameter
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error('Parameters not provided');
  const contractAddress = parameters[0];

  // to create new wallet address, i used vanity-eth
  const delegateAddress = parameters[1];

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

  console.log('USING SMART CONTRACT ', contractAddress);
  console.log('FROM ADDRESS :', wallet.address);
  console.log('WILL DELEGATE VOTE TO :', delegateAddress);

  // Read all current votes
  const ballotFactory = new Ballot__factory(wallet);
  const ballotContract = ballotFactory.attach(contractAddress) as Ballot;

  // Delegate vote to new address
  // smart contract address : 0xaff229ff28e0fec8ed99056af8f6f1e95244ca06

  const tx = await ballotContract.delegate(delegateAddress);
  const receipt = await tx.wait();
  console.log(`Delegating completed ${receipt?.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
