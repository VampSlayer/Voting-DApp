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

export const Vote = (props: {
  candidates: Candidate[];
  remainingTimeToVote: number;
  isVotingLive: boolean;
}) => {
  const [address, setAddress] = useState("");
  const [votingState, setVotingState] = useState<Candidate[]>(props.candidates);
  const [remainingTimeToVote, setRemainingTimeToVote] = useState(
    props.remainingTimeToVote
  );
  const [isVotingLive, setIsVotingLive] = useState(props.isVotingLive);
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
    const canVotePromise = updateCanVote();

    const [votingState, canVote] = await Promise.all([
      votingStatePromise,
      canVotePromise,
    ]);

    setVotingState(votingState?.candidates ?? []);
    setRemainingTimeToVote(votingState?.reamainingTimeToVote ?? 0);
    setIsVotingLive(votingState?.isVotingLive);
    sethasVoted(canVote);
    debugger;
  };

  const updateCanVote = async () => {
    if (!address) return;
    var client = await getVoteClient();
    const canVote = await client.hasVoted();
    sethasVoted(canVote);
    return canVote;
  };

  useEffect(() => {
    updateCanVote();
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
              {isVotingLive ? (
                <>
                  {hasVoted ? (
                    <>
                      <h2>Thanks for you vote!</h2>
                      <Results candidates={votingState}></Results>
                    </>
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
                          updateVotingState();
                        }}
                        className="btn btn-secondary"
                      >
                        Vote
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <h2>Voting Finished</h2>
              )}
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
