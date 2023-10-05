// import React from "react";
import { Drawer, Sx, useMantineTheme } from "@mantine/core";
import type { ModalBaseSettings } from "@mantine/core";
import { ThemeSwitch, toggleScheme } from "../helpers/helpers";
import { colorSchemes, switchColor } from "../../../App/variables";


interface DrawerContentStyles {
  bgColor?: ThemeSwitch;
  titleBorderBottom?: ThemeSwitch;
  sx?: Sx;
}

interface MyDrawProps extends ModalBaseSettings {
  side?: "left" | "right";
  opened: boolean;
  onClose(): void;
  sx?: Sx | (Sx | undefined)[];
  // props?: ModalBaseSettings;
  contentStyles?: DrawerContentStyles;
}

export const MyDrawer = ({
  side,
  opened, onClose,
  sx,
  contentStyles,
  ...props
}: MyDrawProps) => {
  const theme = useMantineTheme()
  const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color);
  const drawerContentStyles = {
    bgColor: contentStyles?.bgColor ?? colorSchemes.sectionBGColor,
    titleBorderBottom: contentStyles?.titleBorderBottom ?? switchColor("rgba(0, 2, 3, 0.3)","rgba(5, 5, 5, 0.06)"),
  }

  const sideDrawer:any = side === "right" ? {
    inner: {justifyContent:"flex-end", alignItems:"flex-end"},
    header: {justifyContent: "flex-end", flexDirection: "row-reverse"},
    transition: 'slide-left',
  } : undefined

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      // overlayProps={{ opacity: 0.8, blur: 1 }}
      // zIndex={1001}
      // size={350}
      {...props}
      sx={{
        "& .mantine-Overlay-root":{backgroundColor:"rgba(0, 0, 0, 0.45)"},
        "& .mantine-Drawer-inner":sideDrawer?.inner,
        "& .mantine-Drawer-content":{
          fontSize: '14px',
          fontWeight: 600,
          backgroundColor: scheme(drawerContentStyles.bgColor),
          color: scheme(colorSchemes.textColor),
          boxShadow: "-6px 0 16px 0 rgba(0, 0, 0, 0.08), -3px 0 6px -4px rgba(0, 0, 0, 0.12), -9px 0 28px 8px rgba(0, 0, 0, 0.05)",
          '& > :first-of-type': {
            backgroundColor: scheme(drawerContentStyles.bgColor),
            borderBottom: `1px solid ${scheme(colorSchemes.borderColor)}`
          },
          '& input:not([type="checkbox"]:checked), textarea': {
            backgroundColor: scheme(colorSchemes.defaultBGColor),
            borderColor: scheme(colorSchemes.borderColor),
          },
          ...(contentStyles?.sx || {})
        },
        "& .mantine-Drawer-header":{
          ...sideDrawer?.header,
          // justifyContent: "flex-end",
          // flexDirection: "row-reverse",
          gap: "5px",
          "& h2": { fontWeight:600 },
          "& button": { margin: 0 },
          "& button svg": { width: "1.5rem", height: "1.5rem" },
        },
        "& .mantine-Drawer-body:not(:only-child)":{
          padding: "1rem",
        },
        ...sx
      }}
      transitionProps={{ transition: sideDrawer?.transition || 'slide-right', duration: 300, timingFunction: 'ease' }}
    />
  )
}