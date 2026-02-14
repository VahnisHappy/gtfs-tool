import { Controller, useFormContext } from "react-hook-form";
import SelectInput, { type SelectInputProps } from "../atoms/SelectInput";

interface FormSelectInputProps extends Omit<SelectInputProps, 'value' | 'onChange'> {
  name: string;
}

export default function FormSelectInput({ name, ...rest }: FormSelectInputProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <SelectInput
                    {...rest}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                />
            )}
        />
    );
}
