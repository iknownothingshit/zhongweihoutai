import { SelectLang, useModel, useIntl } from '@umijs/max';
import { Space } from 'antd';
import React, { useState, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { debounce } from 'lodash-es';
import HeaderSearch from '../HeaderSearch';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import formatRoutes from './formatRoutes';

export type SiderTheme = 'light' | 'dark';

interface UserRoute {
  value: string;
  label: string;
  key: string;
}

const GlobalHeaderRight: React.FC = () => {
  const intl = useIntl();
  const [options, setOptions] = useState<UserRoute[]>([]); // 查找结果

  // 搜索池
  const searchTool = useMemo(() => {
    const routes = formatRoutes(intl);
    return new Fuse(routes, {
      // 轻量级搜索工具https://fusejs.io/api/options.html#fuzzy-matching-options
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        {
          name: 'label',
          weight: 0.7,
        },
        {
          name: 'value',
          weight: 0.3,
        },
      ],
    });
  }, []);

  // 模糊查找
  const onSearch = useCallback(
    debounce((query: string) => {
      if (query !== '') {
        const res: any[] = searchTool.search(query);
        setOptions(res);
      } else {
        setOptions([]);
      }
    }, 150),
    [],
  );

  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { layout } = initialState.settings;
  let className = styles.right;

  if ((layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue=""
        options={options}
        onSearch={onSearch}
      />
      <Avatar />
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
