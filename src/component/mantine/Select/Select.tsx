import { Select, SelectItem } from '@mantine/core'
import { SelectProps } from '@mantine/core/lib/Select/Select'


interface MySelectProps extends SelectProps {
  dataItems?: readonly(string | SelectItem)[];
}

// type Item = string & Record<'value' | 'label', any>

export default function MySelect({
  dataItems,
  ...props
}: MySelectProps) {
  return (
    <Select
      // data={dataItems}
      shadow="xl"
      sx={(theme) => theme.colorScheme === "dark" ? {
        '& .mantine-Select-dropdown': {
          backgroundColor: 'rgb(40, 49, 66)',
          borderColor: "#4d5b75",
          '& .mantine-Select-itemsWrapper > [data-selected]': {
            backgroundColor: '#1b2531',
          },
          '& .mantine-Select-itemsWrapper > [data-hovered]:not([data-selected])': {
            backgroundColor: 'rgb(77 91 117 / 60%)',
          },
        }
      } : {}}
      {...props}
      // dropdownComponent={
      //   ({ children }) => ("testing")
      // }
      // initiallyOpened={true}
    />
  )
}
