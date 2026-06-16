import { Controller, useFormContext, type RegisterOptions } from "react-hook-form";
import NumberInput, { type NumberInputProps } from "../atoms/NumberInput";

interface FormNumberInputProps extends Omit<NumberInputProps, 'value' | 'onChange'> {
  name: string;
  rules?: RegisterOptions;
}

export default function FormNumberInput({ name, rules, ...rest }: FormNumberInputProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            rules = {rules}
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
