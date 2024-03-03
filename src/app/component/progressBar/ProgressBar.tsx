import React from 'react';
import * as Progress from '@radix-ui/react-progress';

const ProgressBar = () => {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Progress.Root
      className="relative overflow-hidden bg-blackA6 rounded-full w-[70%] h-[30px]"
      style={{
        transform: 'translateZ(0)',
      }}
      value={progress}
    >
      <Progress.Indicator
        className="   bg-[#F15281]  w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)] relative"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      >

        <div
          className="absolute  w-full  top-0  left-0 bottom-0 flex items-center justify-center text-white"
        >
          {progress}%
        </div>
      </Progress.Indicator>
    </Progress.Root>
  );
};

export default ProgressBar;
