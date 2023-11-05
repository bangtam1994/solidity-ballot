import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Ballot } from '../typechain-types';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.encodeBytes32String(array[index]));
  }
  return bytes32Array;
}

const PROPOSALS = ['Prop1', 'Prop2', 'Prop3']; //need to be short
async function deployContract() {
  const signers = await ethers.getSigners();

  // or do a mapping or use the function convert
  const proposals = PROPOSALS.map(ethers.encodeBytes32String);

  const ballotFactory = await ethers.getContractFactory('Ballot');
  const ballotContract = await ballotFactory.deploy(proposals);
  await ballotContract.waitForDeployment();
  return { ballotContract, signers };
}

describe('Ballot', async () => {
  describe('when the contract is deployed', async () => {
    it('has the provided proposals', async () => {
      const { ballotContract } = await loadFixture(deployContract);

      // for array and mapping, cannot return them all. We can only return one out of time.
      // Then we need to deconstruct the object
      // then we have to convert the bytes32 to origin "Prop1"
      /*  ----- EXAMPLE ------
      // const proposals0 = await ballotContract.proposals(0);
      expect(PROPOSALS[0]).to.eq(ethers.decodeBytes32String(proposals0.name));
*/
      // Better is to use a loop to loop all the array
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.decodeBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it('has zero votes for all proposals', async () => {
      const { ballotContract } = await loadFixture(deployContract);

      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount).to.eq(0);
      }
    });

    it('sets the deployer address as chairperson', async () => {
      const { ballotContract, signers } = await loadFixture(deployContract);
      const deployerAddress = signers[0].address;
      const chairpersonAddress = await ballotContract.chairperson();

      expect(deployerAddress).to.eq(chairpersonAddress);
    });

    it('sets the voting weight for the chairperson as 1', async () => {
      const { ballotContract } = await loadFixture(deployContract);
      const chairpersonAddress = await ballotContract.chairperson();
      const chairpersonVoter = await ballotContract.voters(chairpersonAddress);

      expect(chairpersonVoter.weight).to.eq(1);

      const zeroAddressVoter = await ballotContract.voters(ethers.ZeroAddress);
      expect(zeroAddressVoter.weight).to.eq(0); //because mapping always return a value
    });
  });

  describe('when the chairperson interacts with the giveRightToVote function in the contract', async () => {
    it('gives right to vote for another address', async () => {
      const { ballotContract, signers } = await loadFixture(deployContract);
      const firstAddressVoter = await ballotContract.voters(signers[1].address);
      expect(firstAddressVoter.weight).to.eq(0);
      await ballotContract
        .connect(signers[0])
        .giveRightToVote(signers[1].address);

      // OR
      const tx = await ballotContract.giveRightToVote(signers[1].address);
      await tx.wait();

      //

      const firstAddressVoterAfter = await ballotContract.voters(
        signers[1].address
      );

      // now give weight to this one
      expect(firstAddressVoterAfter.weight).to.eq(1);
    });
    it('can not give right to vote for someone that has voted', async () => {
      const { ballotContract, signers } = await loadFixture(deployContract);

      let firstVoter = await ballotContract.voters(signers[1].address);
      firstVoter = { ...firstVoter, voted: true }; // changing to has voted
      expect(
        await ballotContract
          .connect(signers[0])
          .giveRightToVote(signers[1].address)
      ).to.be.revertedWith('The voter already voted.');
    });
    it('can not give right to vote for someone that has already voting rights', async () => {
      const { ballotContract, signers } = await loadFixture(deployContract);

      let firstVoter = await ballotContract.voters(signers[1].address);
      firstVoter = { ...firstVoter, weight: 1n };
      expect(
        await ballotContract
          .connect(signers[0])
          .giveRightToVote(signers[1].address)
      ).to.be.reverted;
    });
  });

  describe('when the voter interacts with the vote function in the contract', async () => {
    // TODO
    it('should register the vote', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when the voter interacts with the delegate function in the contract', async () => {
    // TODO
    it('should transfer voting power', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when an account other than the chairperson interacts with the giveRightToVote function in the contract', async () => {
    // TODO
    it('should revert', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when an account without right to vote interacts with the vote function in the contract', async () => {
    // TODO
    it('should revert', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when an account without right to vote interacts with the delegate function in the contract', async () => {
    // TODO
    it('should revert', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when someone interacts with the winningProposal function before any votes are cast', async () => {
    // TODO
    it('should return 0', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when someone interacts with the winningProposal function after one vote is cast for the first proposal', async () => {
    // TODO
    it('should return 0', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when someone interacts with the winnerName function before any votes are cast', async () => {
    // TODO
    it('should return name of proposal 0', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when someone interacts with the winnerName function after one vote is cast for the first proposal', async () => {
    // TODO
    it('should return name of proposal 0', async () => {
      throw Error('Not implemented');
    });
  });

  describe('when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals', async () => {
    // TODO
    it('should return the name of the winner proposal', async () => {
      throw Error('Not implemented');
    });
  });
});
