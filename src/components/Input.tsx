import React from 'react';
import { cn } from '../utils/helpers/utils';

export interface ActionButton {
  icon: React.ReactNode;
  onClick: () => void;
  show?: boolean;
}

interface InputWithActionsProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  actions?: ActionButton[];
  containerClassName?: string;
}

const Input: React.FC<InputWithActionsProps> = ({
  actions = [],
  containerClassName,
  ...props
}) => {
  // Lọc ra các action thực sự hiển thị
  const visibleActions = actions.filter((action) => action.show !== false);

  // Tính toán padding right: mỗi button ~38px, thêm khoảng cách an toàn 8px
  const paddingRight =
    visibleActions.length > 0 ? visibleActions.length * 38 + 8 : 12;

  return (
    <div className={cn('input-wrapper relative', containerClassName)}>
      <input
        {...props}
        style={{
          paddingRight,
          paddingLeft: '12px',

          ...(props.style || {}),
        }}
      />
      {visibleActions.map((action, idx) => (
        <button
          key={idx}
          type="button"
          style={{
            right: `${idx * 38 + 6}px`,
            zIndex: 10,
            cursor: 'pointer',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={action.onClick}
          tabIndex={-1}
          className="absolute hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
};

export default Input;
