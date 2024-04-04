import React, { Children, cloneElement, ReactElement } from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";
import { Text } from "../Text";
import { useTheme } from "@react-navigation/native";

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
        paddingHorizontal: 20,
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
  getLabel: (value: any) => string;
}

export function Select({
  value,
  onChange,
  children,
  label,
  getLabel,
}: SelectProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setIsOpen(true)}>
        <Text style={{ fontWeight: "600" }}>{label}</Text>

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.text,
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: value ? theme.colors.text : "gray" }}>
            {getLabel(value)}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="none"
        transparent
        statusBarTranslucent
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            style={{
              width: "80%",
              backgroundColor: theme.colors.card,
              paddingVertical: 20,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                marginHorizontal: 20,
                fontWeight: "600",
                marginBottom: 10,
              }}
            >
              {label}
            </Text>

            {Children.map(children, (child) => {
              if (child) {
                return cloneElement(
                  child as ReactElement<InternalSelectItemProps>,
                  {
                    isSelected: child.props.value === value,
                    onSelect: (value: any) => {
                      onChange(value);
                      setIsOpen(false);
                    },
                  },
                );
              }
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
