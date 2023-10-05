import { Switch, Group, useMantineTheme, ColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

interface ColorSchemeContextProps {
  colorScheme: ColorScheme;
  toggleColorScheme(colorScheme?: ColorScheme): void;
}

export function SwitchToggle({ colorScheme, toggleColorScheme }: ColorSchemeContextProps) {
  // const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  return (
    <Group position="right" my={0}>
      <Switch
        checked={colorScheme === 'dark'}
        onChange={() => toggleColorScheme()}
        size="md"
        onLabel={<IconSun color={theme.white} size="1.25rem" stroke={1.5} />}
        offLabel={<IconMoonStars color={theme.colors.gray[6]} size="1.25rem" stroke={1.5} />}
      />
    </Group>
  );
}