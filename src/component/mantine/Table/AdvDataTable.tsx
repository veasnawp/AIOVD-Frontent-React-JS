import React, { useEffect, useState } from 'react';
import { MantineReactTable } from 'mantine-react-table';
import type { MantineReactTableProps } from 'mantine-react-table';
// import { TableOptions } from '@tanstack/react-table';
import { Box, useMantineTheme, MantineProvider, Sx } from '@mantine/core';


export type MantineDataTableProps = MantineReactTableProps

// type AdvDataTableProps <TData extends Record<string, any> = {}> = Omit<Partial<TableOptions<TData>>, 'columns' | 'data' | 'defaultColumn' | 'enableRowSelection' | 'expandRowsFn' | 'getRowId' | 'globalFilterFn' | 'initialState' | 'onStateChange' | 'state'> &

type AdvDataTableProps <TData extends Record<string, any> = {}> = Omit<Partial<MantineReactTableProps<TData>>, 'columns' | 'data'> & {
  data: TData[];
  // setTableData: React.Dispatch<React.SetStateAction<TData[]>>;
  columns: any[];
  className?: string;
  paperSx?: Sx;
  renderAboveSection?: React.ReactNode
  renderBelowSection?: React.ReactNode
}


export default function AdvDataTable({
  data,
  columns,
  className,
  paperSx,
  renderAboveSection,
  renderBelowSection,
  ...props
}: AdvDataTableProps) {
  const [isFullScreen, setFullScreen] = useState<boolean>(false);

  const theme = useMantineTheme();
  // const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color)

  // Dom Element
  const randomSelector = parseInt(String(Math.random() * 100000))
  const dSelector = (data:string,value:string) => `[data-${data}="${value}"]`;
  const selectors = {
    dataTitleValue: `bp-admin-id-${randomSelector}`,
    dataTile: () => dSelector('table-title', selectors.dataTitleValue),
  }

  useEffect(() => {
    document.querySelectorAll('#root header, #root nav, #root footer').forEach((e, i) => {
      e?.setAttribute('style', isFullScreen ? 'opacity: 0;visibility:hidden': '');
    })
    const tableEle = document.querySelector('.bp-adv-data-table')
    if(isFullScreen) tableEle?.classList.add('is-full-screen');
    else tableEle?.classList.remove('is-full-screen');
  }, [isFullScreen]);

  useEffect(() => {
    ["is-top-toolbar", "is-data-table", "is-bottom-toolbar"].forEach((cls,i) => {
      const ele = document.querySelector(`.mantine-Paper-root > :nth-of-type(${i+1})`)
      if(ele != null && !ele.classList.contains(cls)){
        ele.classList.add(cls)
      }
    })
  }, [data, isFullScreen]);


  const table = {
    mantinePaperProps:{
      shadow: 'none',
      withBorder: false,
      sx: {
        borderRadius: 0,
        // backgroundColor: "#ffffff",
        '& * a, a': { color: "#2271b1", textDecoration: "none" },
        '& > :first-of-type': {
          gap: "15px",
          // marginBottom: "20px",
          minHeight: 0,
        },
        '& .is-top-toolbar > *': {
          padding: 0,
        },
        ...paperSx
      },
      ...props.mantinePaperProps
    },
    mantineTableProps:{
      striped: true,
      sx: {
        tableLayout: "fixed",
        // '& :where(thead tr > th, tbody tr > td)': {
        //   padding: "1rem !important",
        // },
      },
      ...props.mantineTableProps
    },
    mantineTableBodyProps:{
      sx: {
        '& tr': {
          position: 'relative',
        },
        '& tr > td': {
          verticalAlign: "top",
        },
      },
      ...props.mantineTableBodyProps
    },
    enableFullScreenToggle:true,
    onIsFullScreenChange: ()=> setFullScreen(v => !v),
    enableFilters: false,
    enableColumnDragging: false,
    enableHiding: false,
    enableColumnActions: false,
    enableColumnOrdering: false,
    initialState: {density: "xs", ...props.initialState},
    enableDensityToggle: false,
    columns,
    data,
    positionActionsColumn: "last",
    state:{ isFullScreen },
    mantineFilterSelectProps:{
      color: 'green',
    },
    positionToolbarAlertBanner: "none",
    // mantinePaginationProps: {
    //   rowsPerPageOptions: ['5', '10', '15', '20', '25', '30', '50', '100', '200'],
    // },
    // paginationDisplayMode: "pages"
  } as MantineReactTableProps


  return (
    <>
      <MantineProvider
        withCSSVariables withGlobalStyles withNormalizeCSS
        theme={{ ...theme, primaryColor: 'cyan', defaultRadius: 'md', }}
      >
        <Box
          className={"bp-adv-data-table" + (className ? ` ${className}`:"")}
          data-table-title={selectors.dataTitleValue}
        >
        {renderAboveSection}
        <MantineReactTable
          // mantinePaperProps={{
          //   shadow: 'none',
          //   withBorder: false,
          //   sx: {
          //     borderRadius: 0,
          //     // backgroundColor: "#ffffff",
          //     '& * a, a': { color: "#2271b1", textDecoration: "none" },
          //     '& > :first-of-type': {
          //       gap: "15px",
          //       // marginBottom: "20px",
          //       minHeight: 0,
          //     },
          //     '& .is-top-toolbar > *': {
          //       padding: 0,
          //     },
          //     ...paperSx
          //   },
          //   ...props.mantinePaperProps
          // }}
          // mantineTableProps={{
          //   striped: true,
          //   sx: {
          //     tableLayout: "fixed",
          //     // '& :where(thead tr > th, tbody tr > td)': {
          //     //   padding: "1rem !important",
          //     // },
          //   },
          //   ...props.mantineTableProps
          // }}
          // mantineTableBodyProps={{
          //   sx: {
          //     '& tr': {
          //       position: 'relative',
          //     },
          //     '& tr > td': {
          //       verticalAlign: "top",
          //     },
          //   },
          //   ...props.mantineTableBodyProps
          // }}
          // enableFullScreenToggle
          // onIsFullScreenChange={()=> setFullScreen(v => !v)}
          // enableFilters={false}
          // enableColumnDragging={false}
          // enableHiding={false}
          // enableColumnActions={false}
          // enableColumnOrdering={false}
          // initialState={{density: "xs", ...props.initialState}}
          // enableDensityToggle={false}
          // columns={columns}
          // data={data}
          // positionActionsColumn="last"
          // state={{ isFullScreen }}
          // mantineFilterSelectProps={{
          //   color: 'green',
          // }}
          // positionToolbarAlertBanner="none"
          {...table}
          {...props}
        />
        {renderBelowSection}
        </Box>
      </MantineProvider>
    </>
  );
};

// const validateRequired = (value: string) => !!value.length;
// const validateEmail = (email: string) =>
//   !!email.length &&
//   email
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//     );
// const validateAge = (age: number) => age >= 18 && age <= 50;

