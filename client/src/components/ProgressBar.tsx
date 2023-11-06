import { useState, useEffect, JSX } from "react";

interface Props {
    valueStart: number
    valueEnd: number
    children: (value: number) => JSX.Element
}

export default function ProgressProvider(props: Props) {
    const [value, setValue] = useState(props.valueStart);
    useEffect(() => {
        setValue(props.valueEnd);
    }, [props.valueEnd]);

    return props.children(value);
}