import { Controller, useFormContext } from "react-hook-form";
import type { RegisterOptions } from "react-hook-form";
import TextInput, { type TextInputProps } from "../atoms/TextInput";

interface FormInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  name: string;
  rules?: RegisterOptions;
}

export default function FormInput ({name, rules, ...rest}: FormInputProps) {
    const { control } = useFormContext();

    return(
        <Controller
            name = {name}
            control = {control}
            rules = {rules}
            render={({ field, fieldState: { error } }) => (
                <TextInput
                {...rest}
                value={field.value || ''}
                onChange={field.onChange}
                error={!!error}
                />
            )}
        />
    )
}