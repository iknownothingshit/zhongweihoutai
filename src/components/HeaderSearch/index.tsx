import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { AutoComplete, Input } from 'antd';
import { history } from '@umijs/max';
import classNames from 'classnames';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import React, { useRef } from 'react';
import styles from './index.less';

export type HeaderSearchProps = {
  onSearch?: Function;
  onChange?: (value?: string) => void;
  onVisibleChange?: (b: boolean) => void;
  className?: string;
  placeholder?: string;
  options?: any[];
  defaultVisible?: boolean;
  visible?: boolean;
  defaultValue?: string;
  value?: string;
};

const HeaderSearch: React.FC<HeaderSearchProps> = (props) => {
  const {
    className,
    defaultValue,
    onVisibleChange,
    placeholder,
    visible,
    defaultVisible,
    ...restProps
  } = props;

  const inputRef = useRef<InputRef | null>(null);

  const [value, setValue] = useMergedState<string | undefined>(defaultValue, {
    value: props.value,
    onChange: props.onChange,
  });

  const [searchMode, setSearchMode] = useMergedState(defaultVisible ?? false, {
    value: props.visible,
    onChange: onVisibleChange,
  });

  const inputClass = classNames(styles.input, {
    [styles.show]: searchMode,
  });

  // 点击跳转
  const onSelect = (val: string) => {
    history.push(val);
  };

  return (
    <div
      className={classNames(className, styles.headerSearch)}
      onClick={() => {
        setSearchMode(true);
        if (searchMode && inputRef.current) {
          inputRef.current.focus();
        }
      }}
      onTransitionEnd={({ propertyName }) => {
        if (propertyName === 'width' && !searchMode) {
          if (onVisibleChange) {
            onVisibleChange(searchMode);
          }
        }
      }}
    >
      <SearchOutlined
        key="Icon"
        style={{
          cursor: 'pointer',
          color: "#5C5C5C"
        }}
      />
      <AutoComplete
        allowClear={true}
        key="AutoComplete"
        className={inputClass}
        popupClassName={styles.popup}
        value={value}
        options={restProps.options}
        onSelect={(val) => onSelect(val)}
      >
        <Input
          // size="small"
          ref={inputRef}
          defaultValue={defaultValue}
          allowClear={false}
          placeholder={placeholder}
          onInput={(e: any) => {
            setValue(e.target?.value);
            if (restProps.onSearch) {
              restProps.onSearch(e.target?.value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (restProps.onSearch) {
                restProps.onSearch(value);
              }
            }
          }}
          onBlur={() => {
            setSearchMode(false);
          }}
        />
      </AutoComplete>
    </div>
  );
};

export default React.memo(HeaderSearch);
