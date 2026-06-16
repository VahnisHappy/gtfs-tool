import { Controller, useFormContext } from "react-hook-form";
import type { RegisterOptions } from "react-hook-form";
import SelectInput, { type SelectInputProps } from "../atoms/SelectInput";

interface FormSelectInputProps extends Omit<SelectInputProps, 'value' | 'onChange'> {
  name: string;
  rules?: RegisterOptions;
}

export default function FormSelectInput({ name, rules, ...rest }: FormSelectInputProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <SelectInput
                    {...rest}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!error}
                />
            )}
        />
    );
}
