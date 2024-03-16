import { Input, Space } from 'antd'

type Props = {
    value: string[];
    onChange: Function;
    num?: number;
}

// 标签输入
const TagSelector: React.FC<Props> = ({
    value = [],
    onChange,
    num = 3
}) => {

    const handleChange = (val: string, index: number) => {
        const arr = [...value];
        arr[index] = val || '';
        onChange(arr);
    }

    return <Space>
        {new Array(num).fill('').map((t, i) => {
            return <Input placeholder='请输入' key={i} onChange={(e: any) => handleChange(e.target.value, i)} value={value[i]} />
        })}
    </Space>
}

export default TagSelector;
