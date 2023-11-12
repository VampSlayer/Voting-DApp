import { Candidate } from "@/components/results";
import { contractAbi } from "@/contracts/voting-abi";
import { use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";
import { BigNumber } from "ethers";
import { Web3, Contract } from "web3";

class VotingServerClient {
  contractAddress: string;
  providerURL: string;
  web3: Web3;
  contractInstance: Contract<typeof contractAbi>;

  constructor(providerURL?: string, contractAddress?: string) {
    use(Web3ClientPlugin);
    this.contractAddress =
      contractAddress ?? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";
    this.providerURL = providerURL ?? process.env.API_URL ?? "";

    this.web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL));

    this.contractInstance = new this.web3.eth.Contract(
      contractAbi,
      this.contractAddress
    );
  }

  async getVotingState() {
    const getCandidatesAndVotesPromise = this.getCandidatesAndVotes();
    const isVotingLivePromise = this.isVotingLive();
    const getRemainingTimeToVotePromise = this.getRemainingTimeToVote();

    const [candidates, isVotingLive, remainingTimeToVote] = await Promise.all([
      getCandidatesAndVotesPromise,
      isVotingLivePromise,
      getRemainingTimeToVotePromise,
    ]);

    return {
      candidates,
      isVotingLive,
      remainingTimeToVote,
    };
  }

  async getCandidatesAndVotes() {
    const candidatesList: { name: string; voteCount: BigNumber }[] =
      await this.contractInstance.methods.getAllVotesOfCandiates().call();

    const formattedCandidates: Candidate[] = candidatesList.map(
      (candidate: { name: string; voteCount: BigNumber }, index: number) => {
        return {
          id: index,
          name: candidate.name,
          votes: Number(candidate.voteCount.toString()),
        };
      }
    );

    return formattedCandidates;
  }

  async isVotingLive(): Promise<boolean> {
    return this.contractInstance.methods.getVotingStatus().call();
  }

  async getRemainingTimeToVote() {
    const reamainingTime: BigNumber = await this.contractInstance.methods
      .getRemainingTime()
      .call();
    return Number(
      (Number(reamainingTime.toString()) / 60 / 60 / 24).toFixed(2)
    );
  }
}

export default VotingServerClient;
