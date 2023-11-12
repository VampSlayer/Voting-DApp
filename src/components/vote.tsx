"use client";

import { useEffect, useState } from "react";
import { Connected } from "./connected";
import { Candidate, Results } from "./results";

const connect = async () => {
  const ConnectClient = (await import("../clients/connect")).default;
  const client = new ConnectClient();
  return client.connect();
};

const getVoteClient = async () => {
  const VoteClient = (await import("../clients/voting")).default;
  return new VoteClient();
};

const vote = async (id: number) => {
  return (await getVoteClient()).vote(id);
};

export const Vote = () => {
  const [address, setAddress] = useState("");
  const [votingState, setVotingState] = useState<Candidate[]>([]);
  const [remainingTimeToVote, setRemainingTimeToVote] = useState(0);
  const [hasVoted, sethasVoted] = useState(false);
  const [voteOption, setVoteOption] = useState(0);

  const handleAccountsChanged = (accounts: string) => {
    if (accounts.length > 0 && address !== accounts[0]) {
      setAddress(accounts[0]);
    } else {
      setAddress("");
    }
  };

  const listenForAccountChange = () => {
    if (window.ethereum) {
      // @ts-ignore
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        // @ts-ignore
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  };

  const updateVotingState = async () => {
    if (!address) return;
    var client = await getVoteClient();
    const votingStatePromise = client.getVotingState();
    const getRemainingTimeToVotePromise = client.getRemainingTimeToVote();
    const canVotePromise = client.hasVoted();

    const [votingState, getRemainingTimeToVote, canVote] = await Promise.all([
      votingStatePromise,
      getRemainingTimeToVotePromise,
      canVotePromise,
    ]);

    setVotingState(votingState ?? []);
    setRemainingTimeToVote(Number(getRemainingTimeToVote) ?? 0);
    sethasVoted(canVote);
  };

  useEffect(() => {
    updateVotingState();
    return listenForAccountChange();
  }, [address]);

  return (
    <div className="row justify-content-md-center">
      <div className="col">
        <div className="text-center">
          {address ? (
            <>
              <Connected
                address={address}
                remainingTimeToVote={remainingTimeToVote}
              ></Connected>
              {hasVoted ? (
                <h2>Thanks for you vote!</h2>
              ) : (
                <div className="col">
                  {votingState.map((candidate) => (
                    <div className="form-check" key={candidate.id}>
                      <label>
                        <input
                          type="radio"
                          name="react-tips"
                          value={candidate.id}
                          checked={voteOption === candidate.id}
                          onChange={() => setVoteOption(candidate.id)}
                          className="form-check-input"
                        />
                        {candidate.name}
                      </label>
                    </div>
                  ))}
                  <button
                    disabled={hasVoted}
                    onClick={async () => {
                      sethasVoted(await vote(voteOption));
                    }}
                    className="btn btn-secondary"
                  >
                    Vote
                  </button>
                </div>
              )}
              <Results candidates={votingState}></Results>
            </>
          ) : (
            <button
              onClick={async () => {
                setAddress((await connect()) ?? "");
              }}
              className="btn btn-secondary"
            >
              Login with Metamask
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
