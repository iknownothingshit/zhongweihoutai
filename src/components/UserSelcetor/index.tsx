import { Select } from 'antd'
import { useState, useEffect } from 'react';
import { getUsers } from '@/api/system';

type Props = {
    value: {
        id: number;
        name: string;
    };
    onChange: Function;
}

// 用户选择器
const UserSelector: React.FC<Props> = ({
    value, onChange
}) => {
    const [list, setList] = useState<SystemAPI.UserItem[]>([]);

    const getUsersList = async () => {
        const { code, data } = await getUsers(
            {
                pageNum: 1,
                pageSize: 999,
            },
        );

        if (code !== 200) return;

        setList(data.records);
    }

    useEffect(() => {
        getUsersList();
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
            placeholder='请选择用户'
            onSelect={handleChange}
            value={value.id}
        />
    )

}

export default UserSelector;