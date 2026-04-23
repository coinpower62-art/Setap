import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Delete, 
  RotateCcw, 
  Settings, 
  History, 
  Plus, 
  Minus, 
  X as Multiplier, 
  Divide, 
  Equal, 
  Percent 
} from 'lucide-react';

type Operator = '+' | '-' | '*' | '/' | null;

export default function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<{ equation: string; result: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (nextOperator: Operator) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      const result = performCalculation(currentValue, inputValue, operator);
      setPrevValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
    setEquation(`${prevValue !== null && operator ? prevValue : display} ${nextOperator || ''}`);
  };

  const performCalculation = (left: number, right: number, op: Operator): number => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      default: return right;
    }
  };

  const handleEqual = () => {
    const inputValue = parseFloat(display);

    if (operator && prevValue !== null) {
      const result = performCalculation(prevValue, inputValue, operator);
      const fullEquation = `${prevValue} ${operator} ${inputValue} =`;
      
      setHistory([{ equation: fullEquation, result: String(result) }, ...history].slice(0, 50));
      setDisplay(String(result));
      setEquation('');
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setEquation('');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const toggleHistory = () => setShowHistory(!showHistory);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
      if (e.key === '.') handleNumber('.');
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('*');
      if (e.key === '/') handleOperator('/');
      if (e.key === 'Enter' || e.key === '=') handleEqual();
      if (e.key === 'Escape') clearAll();
      if (e.key === 'Backspace') handleBackspace();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, prevValue, operator, waitingForOperand]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200 p-0 sm:p-4">
      {/* Phone Frame for Desktop */}
      <div className="w-[300px] h-[600px] bg-[#121212] rounded-[40px] shadow-2xl border-[8px] border-slate-900 relative flex flex-col overflow-hidden">
        
        {/* Android Status Bar Simulation */}
        <div className="h-12 w-full flex items-center justify-between px-8 pt-4">
          <span className="text-xs font-medium text-white/90">9:41</span>
          <div className="flex gap-2 items-center text-white/90">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 011.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
          </div>
        </div>

        {/* Header Tools */}
        <div className="flex justify-between px-6 py-2">
          <button onClick={toggleHistory} className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <History size={18} className="text-slate-500" />
          </button>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
              <Settings size={18} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Display Area */}
        <div className="flex-grow flex flex-col justify-end px-5 pb-6 text-right overflow-hidden relative">
          <AnimatePresence mode="popLayout">
            {equation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-base font-light text-slate-500 mb-1 truncate"
              >
                {equation}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div 
            key={display}
            initial={{ opacity: 0.5, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-5xl font-normal tracking-tighter truncate overflow-hidden"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {display}
          </motion.div>

          {/* History Overlay */}
          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-20 bg-[#121212] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-medium text-white">History</h2>
                  <button onClick={toggleHistory} className="text-rose-400 font-medium">Close</button>
                </div>
                <div className="overflow-y-auto h-full pb-20 no-scrollbar">
                  {history.length === 0 ? (
                    <div className="text-center mt-20 text-slate-500 italic">No history yet</div>
                  ) : (
                    history.map((item, idx) => (
                      <div key={idx} className="mb-6 text-right border-b border-slate-800 pb-4">
                        <div className="text-slate-500 mb-1">{item.equation}</div>
                        <div className="text-2xl font-medium text-white">{item.result}</div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Control Divider */}
        <div className="h-px w-4/5 mx-auto bg-slate-800 mb-6"></div>

        {/* Controls Grid */}
        <div className="p-5 pb-8 grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <CalcButton label="AC" onClick={clearAll} variant="accent" />
          <CalcButton label="%" onClick={handlePercent} variant="accent" />
          <CalcButton label="÷" onClick={() => handleOperator('/')} variant="operator" />
          <CalcButton label="DEL" onClick={handleBackspace} variant="accent" icon={<Delete size={18} />} />

          {/* Row 2 */}
          <CalcButton label="7" onClick={() => handleNumber('7')} />
          <CalcButton label="8" onClick={() => handleNumber('8')} />
          <CalcButton label="9" onClick={() => handleNumber('9')} />
          <CalcButton label="×" onClick={() => handleOperator('*')} variant="operator" />

          {/* Row 3 */}
          <CalcButton label="4" onClick={() => handleNumber('4')} />
          <CalcButton label="5" onClick={() => handleNumber('5')} />
          <CalcButton label="6" onClick={() => handleNumber('6')} />
          <CalcButton label="−" onClick={() => handleOperator('-')} variant="operator" />

          {/* Row 4 */}
          <CalcButton label="1" onClick={() => handleNumber('1')} />
          <CalcButton label="2" onClick={() => handleNumber('2')} />
          <CalcButton label="3" onClick={() => handleNumber('3')} />
          <CalcButton label="+" onClick={() => handleOperator('+')} variant="operator" />

          {/* Row 5 */}
          <CalcButton label="+/-" onClick={() => {}} className="col-span-1" />
          <CalcButton label="0" onClick={() => handleNumber('0')} />
          <CalcButton label="." onClick={() => handleNumber('.')} />
          <CalcButton label="=" onClick={handleEqual} variant="equal" />
        </div>

        {/* Android Navigation Bar Simulation */}
        <div className="h-12 w-full flex items-center justify-center">
          <div className="h-1 w-32 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

interface CalcButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'accent' | 'equal';
  icon?: ReactNode;
  className?: string;
}

function CalcButton({ label, onClick, variant = 'number', icon, className = '' }: CalcButtonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'number': return 'sleek-number';
      case 'operator': return 'sleek-operator';
      case 'accent': return 'sleek-functional';
      case 'equal': return 'sleek-equal';
      default: return 'sleek-number';
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`sleek-button w-13 h-13 text-xl ${getVariantClass()} ${className}`}
    >
      {icon ? (
        <span className="flex items-center justify-center">{icon}</span>
      ) : (
        <span className={variant === 'accent' ? 'text-lg font-medium' : 'font-normal'}>{label}</span>
      )}
    </motion.button>
  );
}
