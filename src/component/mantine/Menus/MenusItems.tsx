import { ReactNode, useState } from 'react';
import { Menu, DefaultProps, Sx, MenuItemProps, useMantineTheme, MenuProps, Box, Button } from '@mantine/core';
import type { BoxProps } from '@mantine/core';
import type { PolymorphicComponentProps } from '@mantine/utils';
import { UserButton } from '../userButton/userButton';
import { themeColors } from '../../../config';
import { colorSchemes, switchColor } from '../../../App/variables';
import { ThemeSwitch, toggleScheme } from '../helpers/helpers';
import { Prettify } from '../helpers/HelperType';


export interface MenuDropDownProps extends DefaultProps, React.ComponentPropsWithoutRef<'div'>{
  menuTarget?: (menuOpened?:boolean, dataMenuItems?:Prettify<DataMenuItems>[]) => ReactNode;
  dataMenuItems?: Prettify<DataMenuItems>[];
  sxMenuItem?: Sx | (Sx | undefined)[];
  userInfo?: {
    username?: string,
    avatar?: string,
  };
  menuProps?: MenuProps;
  menuTargetProps?: DefaultProps;
  boxProps?: PolymorphicComponentProps<"div", Prettify<BoxProps>>
}

export interface DataMenuItems {
  label?:string;
  item?: ReactNode;
  icon?: ReactNode;
  divider?: boolean;
  disabled?:boolean;
  props?: Prettify<MenuItemsProps>;
  boxProps?: PolymorphicComponentProps<"div", Prettify<BoxProps>>;
  disable?: boolean;
}
interface MenuItemsProps extends Prettify<MenuItemProps>, React.DOMAttributes<any> {
  component?: any;
  href?:string;
}

export function MenuDropDown({
  menuTarget,
  dataMenuItems,
  sxMenuItem,
  userInfo,
  sx,
  menuProps,
  menuTargetProps,
  boxProps,
  ...props
}: MenuDropDownProps) {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const theme = useMantineTheme();
  const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color)

  const MenuItems = dataMenuItems?.map((menu, index) => {

    return (
      <Box key={index} {...menu.boxProps}
      sx={{
        ...(menu.disable && {
          "& .mantine-Menu-item, .mantine-Menu-item:hover": {
            cursor: "default",
            backgroundColor: "#373A40",
            borderBottom: `1px solid ${scheme(switchColor('rgb(39 46 59)','#f0f0f0'))}`
          }
        }),
        ...menu?.boxProps?.sx
      }}
      >
        { menu.label && <Menu.Label>{menu.label}</Menu.Label> }
        <Menu.Item {...menu.props} icon={menu.icon} sx={sxMenuItem}>
          { menu.item }
        </Menu.Item>
        { menu.divider && <Menu.Divider /> }
      </Box>
    )
  })

  return (
    <Box pos="relative" {...boxProps}>
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
      zIndex={1001}
      {...menuProps}
    >
      <Menu.Target>
        <Box className='dropdown-menu-target' {...menuTargetProps}>
          {
            menuTarget ? menuTarget(userMenuOpened, dataMenuItems) :
            <UserButton
              className={'user'}
              image={userInfo?.avatar}
              name={userInfo?.username}
              sx={{
                display: 'block',
                width: '100%',
                "& *": {
                  color: userMenuOpened && dataMenuItems ? theme.colors.cyan[3] + '!important' : undefined,
                },
                "&:hover *": {
                  color: theme.colors.cyan[3],
                  cursor: dataMenuItems ? undefined : "default"
                }
              }}
            />
          }
        </Box>
      </Menu.Target>
      { dataMenuItems &&
        <Menu.Dropdown
          sx={{
            backgroundColor: scheme(switchColor('rgb(39 46 59)','#f0f0f0')),
            border: "none",
            boxShadow: "0px 8px 10px 1px rgba(0,0,0,.14), 0px 3px 14px 2px rgba(0,0,0,.12), 0px 5px 5px -3px rgba(0,0,0,.2)",
            "& *": {
              color: "#f0f0f1",
            },
            "& .mantine-Menu-item": {
              backgroundColor: scheme(switchColor('rgb(39 46 59)','#f0f0f0')) + '!important',
              "&:hover": {
                backgroundColor: scheme(switchColor('rgb(155 195 255 / 10%)','#f0f0f0')) + '!important',
              },
              "&:hover *": {
                backgroundColor: 'unset !important',
                color: themeColors.header.hoverColor,
              }
            },
            "& .mantine-Menu-divider": {
              borderColor: "rgb(155 195 255 / 20%)",
            },
            ...sx,
          }}
          {...props}
        >
          { MenuItems }
        </Menu.Dropdown>
      }
    </Menu>
    </Box>
  );
}
