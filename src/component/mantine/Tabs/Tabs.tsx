import { Tabs } from '@mantine/core';
import type { TabsProps, TabsListProps, TabProps } from '@mantine/core';
import { Prettify } from '../helpers/HelperType';

type TabValuesProps = {
  titleValue: string[];
  titleContent: React.ReactNode[];
  contents: React.ReactNode[];
}

interface CustomTabsProps extends TabsProps {
  defaultValue?: string | null;
}

export default function MyTabs({
  defaultValue,
  ...props
}: CustomTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} orientation="vertical" {...props}></Tabs>
  )
}

interface TabContentsProps {
  tabValues?: Prettify<TabValuesProps>;
  tabListProps?: Prettify<TabsListProps>;
  childTabProps?: Prettify<TabProps>;
}

export function TabContents({
  tabValues,
  tabListProps,
  childTabProps,
}: TabContentsProps) {

  return (
    <>
      <Tabs.List {...tabListProps}>
        {
          tabValues?.titleValue.map((title, i) => (
            <Tabs.Tab value={title.toLowerCase().replace(/ /g, '_')}
              {...childTabProps}
            >
              {tabValues?.titleContent[i]}
            </Tabs.Tab>
          ))
        }
      </Tabs.List>
      {
        tabValues?.contents.map((content, i) => (
          <Tabs.Panel value={tabValues.titleValue[i].toLowerCase().replace(/ /g, '_')}>
            {content}
          </Tabs.Panel>
        ))
      }
    </>
  );
}