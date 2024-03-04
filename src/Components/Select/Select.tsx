import React, { Children, cloneElement, ReactElement } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../Text";

export interface SelectItemProps {
  value: any;
  label: string;
}

interface InternalSelectItemProps extends SelectItemProps {
  isSelected: boolean;
  onSelect: (value: any) => void;
}

export function SelectItem(props: SelectItemProps) {
  const { value, label, onSelect, isSelected } =
    props as InternalSelectItemProps;
  return (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      style={{
        paddingVertical: 10,
      }}
    >
      <View>
        <Text>
          {label} {isSelected ? "✅" : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export interface SelectProps {
  value: any;
  onChange: (value: any) => void;
  children: ReactElement<SelectItemProps>[];
  label: string;
}

export function Select({ value, onChange, children, label }: SelectProps) {
  return (
    <View
      style={{
        gap: 10,
      }}
    >
      <Text style={{ fontWeight: "600" }}>{label}</Text>

      <View>
        {Children.map(children, (child) => {
          if (child) {
            return cloneElement(
              child as ReactElement<InternalSelectItemProps>,
              {
                isSelected: child.props.value === value,
                onSelect: onChange,
              }
            );
          }
        })}
      </View>
    </View>
  );
}
