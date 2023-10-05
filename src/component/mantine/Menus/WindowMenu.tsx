import { Button, useMantineTheme, Box, ButtonProps, Flex } from '@mantine/core';
import type { BoxProps } from '@mantine/core';
import type { PolymorphicComponentProps } from '@mantine/utils';
import { MenuDropDown } from "./MenusItems"
import type { MenuDropDownProps } from "./MenusItems"
import { switchColor } from "../../../App/variables"
import { ThemeSwitch, toggleScheme } from "../helpers/helpers";

export interface WindowMenuDropDownProps extends MenuDropDownProps {
  label?: string
}

type Prettify<T> = {
  [K in keyof T]: T[K]; // replace _
} & {}

interface WinMenuLabelProps {
  label?: string;
  hotkey?: string;
}

export const WinMenuLabel = (props?: WinMenuLabelProps) => {

  return (
    <Flex justify="space-between" direction="row">
      <span>{props?.label}</span>
      <span>{props?.hotkey}</span>
    </Flex>
  )
}

export const WindowMenuDropDown = ({
  label,
  ...props
}: Prettify<WindowMenuDropDownProps>) => {

  const theme = useMantineTheme();
  const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color)

  return (
    <MenuDropDown
      left={"0px!important"}
      menuProps={{
        transitionProps: undefined,
        withinPortal: false,
      }}
      boxProps={{
        sx: {
          display: "flex",
          alignItems: "center"
        }
      }}
      menuTarget={(menuOpened) =>
        <Button
          fw={"normal"}
          bg={`${menuOpened ? scheme(switchColor('rgb(155 195 255 / 10%)','#f0f0f0')) : "transparent"}!important`}
          px={8}
          h={24}
          sx={(theme) => ({
            borderRadius: 5,
            '&:hover': {
              backgroundColor: `${scheme(switchColor('rgb(155 195 255 / 10%)','#f0f0f0'))}!important`
            },
            '& *': {
              color: `${theme.colors.gray[3]}!important`
            },
            '& * :hover': {
              color: `${theme.white}!important`
            },
          })}
        >{label}</Button>
      }
      sx={({
        top: "45px !important",
        borderRadius: 0,
        "& .mantine-Menu-item": {
          paddingTop: 6,
          paddingBottom: 6,
          borderRadius: 5,
          "&:hover *": {
            color: "#ffffff",
          }
        }
      })}
      {...props}
    />
  )
}

interface WindowMenuProps extends PolymorphicComponentProps<"div", Prettify<BoxProps>> {
  dataItems?: {
    label?: React.ReactNode;
    props?: PolymorphicComponentProps<"button", Prettify<ButtonProps>>
  }[];
}

export const WindowMenu = ({
  dataItems,
  ...boxProps
}: WindowMenuProps) => {
  const theme = useMantineTheme();
  const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color)

  return (
    dataItems?.map((item, i) => {

      return(
        <Box
          key={i}
          sx={{
            display:"flex",
            alignItems: "center"
          }}
          {...boxProps}
        >
          <Button
            fw={"normal"}
            bg={`${"transparent"}!important`}
            px={8}
            h={30}
            sx={(theme) => ({
              '&:hover': {
                backgroundColor: `${scheme(switchColor('rgb(155 195 255 / 10%)','#f0f0f0'))}!important`
              },
              '& *': {
                color: `${theme.colors.gray[3]}!important`
              },
              '& * :hover': {
                color: `${theme.white}!important`
              },
            })}

            {...item.props}
          >{item.label}</Button>
        </Box>
      )
    })

  )
}