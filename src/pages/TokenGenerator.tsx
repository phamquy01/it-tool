import { useState, useEffect } from 'react';


const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?/~',
};

const TokenGenerator = () => {
  const [options, setOptions] = useState({
    uppercase: true,
    numbers: true,
    lowercase: true,
    symbols: false,
  });
  const [length, setLength] = useState(16);
  const [token, setToken] = useState('');

  const generateToken = () => {
    let chars = '';
    if (options.uppercase) chars += CHAR_SETS.uppercase;
    if (options.numbers) chars += CHAR_SETS.numbers;
    if (options.lowercase) chars += CHAR_SETS.lowercase;
    if (options.symbols) chars += CHAR_SETS.symbols;

    if (!chars) {
      setToken('');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setToken(result);
  };

  const handleSwitch = (key: keyof typeof options) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // Không cho phép tất cả đều false
      if (
        !next.uppercase &&
        !next.numbers &&
        !next.lowercase &&
        !next.symbols
      ) {
        return prev;
      }
      return next;
    });
  };

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
  };

  // Generate token on mount and when options/length change
  useEffect(() => {
    generateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, length]);

  return (
    <>
     
      <div className="max-w-[600px] mx-auto py-10 bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 ml-24 flex flex-col gap-3">
          <div className="flex flex-wrap gap-4 mb-6">
            {[
              { key: 'uppercase', label: 'Uppercase (ABC...)' },
              { key: 'numbers', label: 'Numbers (123...)' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <span className="text-[14px] font-medium text-gray-700 min-w-[110px]">
                  {item.label}
                </span>
                <span className="relative inline-block w-10 h-6">
                  <input
                    type="checkbox"
                    checked={options[item.key as keyof typeof options]}
                    onChange={() =>
                      handleSwitch(item.key as keyof typeof options)
                    }
                    className="sr-only peer"
                  />
                  <span
                    className={`absolute left-0 top-0 w-10 h-6 rounded-full transition-colors duration-200
                      ${
                        options[item.key as keyof typeof options]
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                  ></span>
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                      ${
                        options[item.key as keyof typeof options]
                          ? 'translate-x-4'
                          : ''
                      }`}
                  ></span>
                </span>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'lowercase', label: 'Lowercase (abc...)' },
              { key: 'symbols', label: 'Symbols (!-;...)' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <span className="text-[14px] font-medium text-gray-700 min-w-[110px]">
                  {item.label}
                </span>
                <span className="relative inline-block w-10 h-6">
                  <input
                    type="checkbox"
                    checked={options[item.key as keyof typeof options]}
                    onChange={() =>
                      handleSwitch(item.key as keyof typeof options)
                    }
                    className="sr-only peer"
                  />
                  <span
                    className={`absolute left-0 top-0 w-10 h-6 rounded-full transition-colors duration-200
                      ${
                        options[item.key as keyof typeof options]
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                  ></span>
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                      ${
                        options[item.key as keyof typeof options]
                          ? 'translate-x-4'
                          : ''
                      }`}
                  ></span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Length Slider */}
        <div className="mb-6 flex justify-center items-center">
          <p className="block text-[15px] text-gray-700 w-[120px]">
            Length ({length})
          </p>
          <input
            type="range"
            min={1}
            max={512}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border
              [&::-webkit-slider-thumb]:border-gray-400
              [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:duration-200
              [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border
              [&::-moz-range-thumb]:border-gray-400
              [&::-moz-range-thumb]:shadow
              [&::-ms-thumb]:appearance-none
              [&::-ms-thumb]:w-5
              [&::-ms-thumb]:h-5
              [&::-ms-thumb]:rounded-full
              [&::-ms-thumb]:bg-white
              [&::-ms-thumb]:border
              [&::-ms-thumb]:border-gray-400
              [&::-ms-thumb]:shadow
            "
            style={{
              background: `linear-gradient(to right, #059669 0%, #059669 ${
                ((length - 1) / (512 - 1)) * 100
              }%, #d1d5db ${((length - 1) / (512 - 1)) * 100}%, #d1d5db 100%)`,
            }}
          />
        </div>

        {/* Token Display */}
        <div className="mb-4">
          <textarea
            className="w-full h-50 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg focus:outline-none text-center text-[14px]"
            value={token}
            readOnly
            placeholder="Your generated token will appear here..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm cursor-pointer "
          >
            Copy
          </button>
          <button
            onClick={generateToken}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>
    </>
  );
};

export default TokenGenerator;
