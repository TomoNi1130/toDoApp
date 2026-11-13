type Props = {
  name: string;
  uncompletedCount: number;
};

const WellcomeMsg = (props: Props) => {
  return (
    <p>
      Welcome {props.name}, you have {props.uncompletedCount} uncompleted tasks.
    </p>
  );
};

export default WellcomeMsg;
