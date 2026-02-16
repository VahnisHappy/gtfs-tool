import { Controller, useFormContext } from "react-hook-form";
import ColorPicker, { type ColorPickerProps } from "../atoms/ColorPicker";

interface FormColorPickerProps extends Omit<ColorPickerProps, 'value' | 'onChange'> {
  name: string;
}

export default function FormColorPicker({ name, ...rest }: FormColorPickerProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <ColorPicker
                    {...rest}
                    value={field.value || '#000000'}
                    onChange={field.onChange}
                />
            )}
        />
    );
}
