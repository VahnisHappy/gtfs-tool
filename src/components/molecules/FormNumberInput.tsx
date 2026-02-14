import { Controller, useFormContext } from "react-hook-form";
import NumberInput, { type NumberInputProps } from "../atoms/NumberInput";

interface FormNumberInputProps extends Omit<NumberInputProps, 'value' | 'onChange'> {
  name: string;
}

export default function FormNumberInput({ name, ...rest }: FormNumberInputProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <NumberInput
                    {...rest}
                    value={field.value ?? ''}
                    onChange={(val) => field.onChange(val)}
                    error={!!error}
                />
            )}
        />
    );
}
