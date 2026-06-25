"use client";

import { Controller, useFormContext, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DataObj = {
  id: string;
  description: string;
};

type Props<T extends FieldValues> = {
  fieldTitle: string;
  nameInSchema: Path<T>;
  data: DataObj[];
  className?: string;
};

export function SelectWithLabel<T extends FieldValues>({
  fieldTitle,
  nameInSchema,
  data,
  className,
}: Props<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors?.[nameInSchema]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={nameInSchema} className="text-base">
        {fieldTitle}
      </Label>

      <Controller
        name={nameInSchema}
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              id={nameInSchema}
              className={`w-full max-w-xs ${className}`}
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>

            <SelectContent>
              {data.map((item) => (
                <SelectItem key={`${nameInSchema}_${item.id}`} value={item.id}>
                  {item.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
