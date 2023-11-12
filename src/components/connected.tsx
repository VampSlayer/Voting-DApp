export const Connected = ({
  address,
  remainingTimeToVote,
}: {
  address: string;
  remainingTimeToVote: number;
}) => {
  return (
    <>
      <p>Connected Account: {address}</p>
      <p>Remaning Time to Vote: {remainingTimeToVote} days</p>
    </>
  );
};
