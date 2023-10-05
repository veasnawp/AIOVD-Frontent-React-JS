import type { ColorScheme } from '@mantine/core';
import { colorSchemes } from '../../../App/variables';

export function toggleSchemeStorage(dark: string, light: string) {
  // return colorScheme === 'dark' ? dark : light
  return window.localStorage.getItem('color-scheme') === 'dark' ? dark : light;
}

export type ThemeSwitch = {
  dark: string;
  light: string;
};

export function toggleScheme(colorScheme: string | ColorScheme, color: ThemeSwitch) {
  return colorScheme === 'dark' ? color.dark : color.light;
}

// type MantineThemeComponents = Record<string, any>;

export const root = (style: React.CSSProperties) => ({
  root: { ...style }
});

export const defaultMantineProvider = (colorScheme: string | ColorScheme) => {
  const scheme = (color: ThemeSwitch) => toggleScheme(colorScheme, color);
  const headingSizes = (fz: string) => ({
    fontSize: fz,
    lineHeight: '1.5',
    fontWeight: 500
  });

  return {
    headings: {
      sizes: {
        h1: headingSizes('30px'),
        h2: headingSizes('22px'),
        h3: headingSizes('21px'),
        h4: headingSizes('17px'),
        h5: headingSizes('14px'),
        h6: headingSizes('10px')
      }
    },
    components: {
      Title: {
        styles: {
          root: {
            color: scheme(colorSchemes.headingColor)
          }
        }
      },
      Paper: {
        styles: {
          ...root({
            backgroundColor: scheme(colorSchemes.sectionBGColor),
            borderRadius: 12
          })
        }
      }
    }
  };
};
