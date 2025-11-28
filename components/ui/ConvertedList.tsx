import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Section from './Section'
import { ListItem } from './ListItem'
import iOS from '@/styles/ios'
import { Plus } from 'lucide-react-native'

type ConvertedListProps = {
  title: string;
  buttonTitle: string;
  items: string[];
  onUpdateItem: (index: number, item: string) => void;
  onDeleteItem: (index: number) => void;
  onAddItem: () => void;
  displayNumbers?: boolean;
}
const AddButton = ({
  onPress,
  title,
}: {
  onPress: () => void;
  title: string;
}) => (
  <TouchableOpacity style={styles.addButton} onPress={onPress}>
    <Plus size={20} color={iOS.colors.tint} strokeWidth={2.5} />
    <Text style={styles.addButtonText}>{title}</Text>
  </TouchableOpacity>
);

const ConvertedList = ({ title, buttonTitle, items, onUpdateItem, onDeleteItem, onAddItem, displayNumbers }: ConvertedListProps) => {
  return (
    <>

        <Section title={title} count={items.length}>
        {items.map((item, index) => (
          <ListItem
            key={Math.random() + index}
            item={item}
            number={displayNumbers? index + 1: undefined}
            onUpdate={(ing) => onUpdateItem(index, ing)}
            onDelete={() => onDeleteItem(index)}
          />
        ))}
        <AddButton title={buttonTitle} onPress={onAddItem}/>
  
        </Section>
    </>

  )
}

export default ConvertedList

const styles = StyleSheet.create({
    section: {
    marginHorizontal: iOS.spacing.standard,
    marginBottom: iOS.spacing.standard,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: iOS.colors.systemBackground,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: iOS.spacing.compact,
    backgroundColor: iOS.colors.systemBackground,
    padding: 12,
    paddingHorizontal: iOS.spacing.standard,
    minHeight: 44,
  },

  addButtonText: {
    ...iOS.typography.body,
    color: iOS.colors.tint,
  },
})