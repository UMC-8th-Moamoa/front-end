import React from 'react';

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

const QuantityCounter: React.FC<Props> = ({ value, onChange, min = 1, max = 99 }) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleDecrease}
        disabled={value <= min}
        className="w-8 h-8 rounded-full border border-gray-300 text-lg font-bold text-gray-600 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
      >
        –
      </button>
      <span className="text-lg font-medium w-6 text-center">{value}</span>
      <button
        onClick={handleIncrease}
        disabled={value >= max}
        className="w-8 h-8 rounded-full border border-gray-300 text-lg font-bold text-gray-600 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
};

export default QuantityCounter;