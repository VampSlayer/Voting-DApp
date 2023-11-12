import { Candidate } from "@/components/results";
import { contractAbi } from "@/contracts/voting-abi";
import { ethers, BigNumber } from "ethers";

class VotingClient {
  contractAddress: string;

  constructor(contractAddress?: string) {
    this.contractAddress =
      contractAddress ?? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";
  }

  async getVotingState() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        this.contractAddress,
        contractAbi,
        signer
      );
      const candidatesList = await contractInstance.getAllVotesOfCandiates();
      const formattedCandidates: Candidate[] = candidatesList.map(
        (candidate: { name: string; voteCount: BigNumber }, index: number) => {
          return {
            id: index,
            name: candidate.name,
            votes: candidate.voteCount.toNumber(),
          };
        }
      );
      return formattedCandidates;
    }
  }

  async isVotingLive() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        this.contractAddress,
        contractAbi,
        signer
      );
      return contractInstance.getVotingStatus();
    }
  }

  async getRemainingTimeToVote() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        this.contractAddress,
        contractAbi,
        signer
      );
      const reamainingTime: BigNumber =
        await contractInstance.getRemainingTime();
      return (reamainingTime.toNumber() / 60 / 60 / 24).toFixed(2);
    }
  }

  async vote(id: number) {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        this.contractAddress,
        contractAbi,
        signer
      );

      const tx = await contractInstance.vote(id);

      await tx.wait();

      return this.hasVoted();
    }
  }

  async hasVoted() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        this.contractAddress,
        contractAbi,
        signer
      );
      return contractInstance.voters(await signer.getAddress());
    }
  }
}

export default VotingClient;
