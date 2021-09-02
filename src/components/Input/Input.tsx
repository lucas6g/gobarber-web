import React, {
  InputHTMLAttributes,
  useState,
  useCallback,
  useRef,
} from 'react';
import { IconBaseProps } from 'react-icons';
import './Input.css';
import { FiAlertCircle } from 'react-icons/fi';
import Tooltip from '../Tooltip/Tooltip';

interface Inputprops extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
  error?: string;
  containerStyle?: object;
}

const Input: React.FC<Inputprops> = ({
  name,
  type,
  placeholder,
  icon: Icon,
  onChange,
  error,
  containerStyle,
  value,
}: Inputprops) => {
  // criando uma referencia para o input
  const inputRef = useRef<HTMLInputElement>(null);

  const [isInputFocus, setIsInputFocus] = useState(false);
  const [isInputFilled, setIsInputFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsInputFocus(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsInputFocus(false);

    if (inputRef.current?.value) {
      setIsInputFilled(true);
    } else {
      setIsInputFilled(false);
    }
  }, []);

  return (
    <div
      style={containerStyle}
      id={error && !isInputFocus ? 'error' : ''}
      className={isInputFocus ? 'input-container focus' : 'input-container'}
    >
      {Icon ? (
        <Icon
          size={20}
          className={isInputFocus || isInputFilled ? 'focus' : ''}
        />
      ) : null}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        ref={inputRef}
        value={value}
      />

      {error ? (
        <Tooltip title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Tooltip>
      ) : null}
    </div>
  );
};

export default Input;
