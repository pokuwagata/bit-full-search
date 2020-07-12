import * as React from "react";

const App = () => {
  const [d, setD] = React.useState(5);
  const [n, setN] = React.useState(0);
  const [isRun, setIsRun] = React.useState(true);

  React.useEffect(() => {
    setN(0);
  }, [d]);

  React.useEffect(() => {
    if (nToBits(n).length > d) {
      setIsRun(false);
    }
  }, [n]);

  useInterval(
    () => {
      setN(n + 1);
    },
    isRun ? 500 : null
  );

  const nToBits = (n: number) =>
    n
      .toString(2)
      .split("")
      .map((b) => Number(b));

  return (
    <div>
      <Input setD={setD} setIsRun={setIsRun}></Input>
      <p>digits: {d}</p>
      <Plus n={n} setN={setN}></Plus>
      <p>current: {n}</p>
      <Bits d={d} bits={nToBits(n)} setIsRun={setIsRun}></Bits>
    </div>
  );
};

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = React.useRef<() => void>();

  React.useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    if (delay) {
      let id = setInterval(() => {
        savedCallback.current();
      }, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const Input = (props: {
  setD: React.Dispatch<React.SetStateAction<number>>;
  setIsRun: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [v, setV] = React.useState<string>("5");
  React.useEffect(() => {
    props.setD(Number(v));
    props.setIsRun(true);
  }, [v]);
  return (
    <input type="text" value={v} onChange={(e) => setV(e.target.value)}></input>
  );
};

const Plus = (props: {
  n: number;
  setN: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <button
      onClick={() => {
        props.setN(props.n + 1);
      }}
    >
      +
    </button>
  );
};

const Bits = (props: {
  d: number;
  bits: number[];
  setIsRun: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { d, bits, setIsRun } = props;
  if (bits.length > d) {
    return <>-</>;
  }
  const base = Array.from({ length: d - bits.length }, () => 0);
  return (
    <>
      {base.concat(bits).map((b, i) => (
        <span key={i}>{b}</span>
      ))}
    </>
  );
};

export default App;
