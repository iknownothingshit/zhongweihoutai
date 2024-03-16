import { Select } from 'antd'
import { useState, useEffect } from 'react';
import { getFactoryList } from '@/api/factory';

type Props = {
    value: {
        id: number;
        name: string;
    };
    onChange: Function;
}

// 工厂选择器
const FactorySelector: React.FC<Props> = ({
    value, onChange
}) => {
    const [list, setList] = useState<FactoryAPI.Factory[]>([]);

    const getFactories = async () => {
        const { code, data } = await getFactoryList(
            {
                pageNum: 1,
                pageSize: 999,
            },
        );

        if (code !== 200) return;

        setList(data.records);
    }

    useEffect(() => {
        getFactories();
    }, [])

    const handleChange = (val: any) => {
        const item = list.find(l => l.id === val);

        if (item) onChange({
            id: item.id,
            name: item.name
        })
    }

    const filterOption = (input: string, option?: any) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <Select
            options={list.map(f => ({
                value: f.id,
                label: f.name
            }))}
            filterOption={filterOption}
            showSearch
            placeholder='请选择工厂'
            onSelect={handleChange}
            value={value?.id || ''}
        />
    )

}

export default FactorySelector;