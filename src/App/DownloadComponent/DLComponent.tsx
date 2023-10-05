import { Button, Flex, Box, Text, createStyles, Stack, Modal, useMantineTheme, Textarea, Title, Group, Progress, ActionIcon, Tooltip, Center, TextInput, NumberInput, Checkbox, ScrollArea, Popover } from '@mantine/core';
import type { MantineTheme, Sx } from  '@mantine/core';
import { IconCircleDotFilled, IconClipboard, IconClockHour3, IconDeviceMobile, IconDeviceMobileRotated, IconEye, IconEyeOff, IconFileDescription, IconFolder, IconHandStop, IconMovie, IconPhoto, IconPlayerPlayFilled, IconPlayerStop, IconPointFilled, IconSquareRoundedArrowDown, IconSquareRoundedPlus, IconTransformFilled, IconTrash, IconWorld, IconWorldPlus, TablerIconsProps } from '@tabler/icons-react';
import { useEffect, useState } from 'react'
import AdvDataTable, { MantineDataTableProps } from '../../component/mantine/Table/AdvDataTable';
import { MRT_ColumnDef, MRT_RowSelectionState, MRT_TableInstance } from 'mantine-react-table';
import { ThemeSwitch, toggleScheme } from '../../component/mantine/helpers/helpers';
import { colorSchemes, switchColor } from '../variables';
import { ActionIconLoader, ButtonLoader } from '../../component/mantine/loader/ButtonLoader';
import axios from 'axios';
import useLocalStorages from '../../hooks/useLocalStorages';
import { localhost, headers, staticIcons, addHeaders } from '../configs';
import {SettingsContextType, SettingsContextValue} from '../../hooks/useSettings';
import MySelect from '../../component/mantine/Select/Select';
import { toCapitalized } from '../../utils/utils';
import { matchesMedia } from '../../component/mantine/hooks';
import { Prettify } from '../../component/mantine/helpers/HelperType';

export const useStylesToolbarCustomAction = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `1px solid ${theme.colors.gray[5]}`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `1px solid ${theme.colors.gray[8]}`,
  },

  buttonAction: {
    ...theme.fn.focusStyles(),
    backgroundColor: "transparent",
    // border: `1px solid ${theme.colors.orange[7]}`,
    borderRadius: 0,
    '&:hover': {
      // backgroundColor: 'rgb(114 174 230 / 25%)',
      backgroundColor: 'rgb(155 195 255 / 10%)',
    },
    '& .mantine-Button-inner': {
      alignItems: "center",
    },
    '& .mantine-Button-label': {
      justifyContent: "space-around",
      flexDirection: "column",
      "&:where(span, svg)": {
        color: theme.colors.gray[4],
        // color: `${theme.colors.orange[7]}`,
      }
    },
  },

}));

interface AuthAccountProps {
  username?: string; password?: string;
  type?: "YouTube"|"Facebook"|"Instagram"|"TikTok"|string|null;
  showPW?: boolean;
  selected?: boolean;
}

export type IYouTube = Prettify<PreIYouTube>

interface PreIYouTube extends OptionIYouTube{
  // info_dict: Record<string, any>,
  info_dict: {
    id: string;
    title: string;
    url_dl?: string;
    original_url?: string;
    webpage_url?: string;
    thumbnail?: string;
    thumbnail_base64?: string;
    duration: number;
    upload_date?: string;
    view_count?: string | number;
    uploader?: string;
    extractor_key?: string;
  },
  // onDownloading?: (videoId: string, formatIndex: number) => void;
  // completed?: any;
  // selected?: boolean;
}

export interface OptionIYouTube {
  url_dl?: string;
  video_only?: VideoFormat[];
  audio_only?: VideoFormat[];
  both?: VideoFormat[];
  requested_download?: VideoFormat[];
  onDownloading?: (videoId: string, formatIndex: number) => void;
  completed?: any;
  selected?: boolean;
  output_path?: string;
  output_file_path?: string;
}

type VideoFormat = {
  ext: string;
  filesize: string;
  filesize_num: number;
  resolution: string;
  url: string;
  video?: string;
  file_path?: string;
  output_path?: string;
  folder_path?: string;
}


export type VideoSettings = {
  videoLinks?: string;
  resolution?: string | null;
  download_type?: string | null;
  active_dlType?: any;
  download_as?: string | null;
  audio_format?: string | null;
} & Record<string, any>

interface YouTubeProps extends SettingsContextType {
  tableData: IYouTube[];
  setTableData: (data: IYouTube[], updateSettings?: Record<string, any>) => void;
  handleSettings: (updateSettings:Prettify<SettingsContextValue>, saveLocal?:boolean) => void;
  localTableData: IYouTube[],
  setLocalTableData: (data: IYouTube[]) => void;
  loadTableData: (tableData:IYouTube[], updateSettings?: Prettify<SettingsContextValue>) => void;
  videoSettings: VideoSettings,
  handleVideoSettings: (updateValue?:VideoSettings) => void,
}

export const DownLoadComponent = ({
  settings,
  setSettings,
  tableData,
  setTableData,
  handleSettings,
  localTableData,
  setLocalTableData,
  loadTableData,
  videoSettings,
  handleVideoSettings,
}: YouTubeProps) => {
  const [openAddLinks, setOpenAddLinks] = useState(false);
  const [active, setActive] = useState<any|null>(null);

  const isMobileDevice = matchesMedia(480, "max");
  const largerThanSM = matchesMedia(767, "max");
  // const smallerThanSM = matchesMedia(768, "min");

  const [stateHelper, setStateHelper] = useState<any>(null);
  // const [videoSettings, setVideoSettings] = useState<VideoSettings>({resolution: "720", download_type: "horizontal", active_dlType: 0});
  // const handleVideoSettings = (updateValue?:VideoSettings) => {
  //   setVideoSettings({...videoSettings, ...updateValue})
  //   // setTesting({...videoSettings, ...updateValue})
  // }

  const [localVideoSettings, setLocalVideoSettings] = useLocalStorages("localVideoSettings", "") as [
    VideoSettings, (setValue: VideoSettings) => void
  ];
  const handleLocalVideoSettings = (updateValue?:VideoSettings) => {
    setLocalVideoSettings({...localVideoSettings, ...updateValue})
    // setTesting({...videoSettings, ...updateValue})
  }

  const [invalidLinksDL, setInvalidLinksDL] = useState<string[]>([]);

  const videoFormatSelection = () => {
    const resolutions = videoSettings.download_type === "horizontal"
      ? [ "640x360", "854x480", "1280x720", "1920x1080", "2560x1440", "3840x2160" ]
      : [ "360x640", "480x854", "720x1280", "1080x1920", "1440x2560", "2160x3840" ]
    const resolutionText = isMobileDevice ? "" : "Resolution: "
    return [
      // { value: '720', label: 'Select Quality - Default 720p' },
      { value: '360', label: `${resolutionText + resolutions[0]} - Normal` },
      { value: '480', label: `${resolutionText + resolutions[1]} - Standard` },
      { value: '720', label: `${resolutionText + resolutions[2]} - HD` },
      { value: '1080', label: `${resolutionText + resolutions[3]} - Full HD` },
      { value: '1440', label: `${resolutionText + resolutions[4]} - 2K` },
      { value: '2160', label: `${resolutionText + resolutions[5]} - 4K` },
    ]
  }

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  // const [iDownloading, setIDownloading] = useState<number|null>(null);
  const [progressNum, setProgressNum] = useState<number>(0);

  const updatedTableData = (rowIndex:number, valueUpdate: OptionIYouTube, updateSettings?: Prettify<SettingsContextValue>, saveLocal=true) => {
    const newTableData = tableData.map((data,i) => i !== rowIndex ? data : { ...data, ...valueUpdate })
    if(saveLocal) loadTableData(newTableData, {...updateSettings})
    // setLocalTableData(newTableData)
    return newTableData
  }

  const columns: MRT_ColumnDef<IYouTube>[] = [
    {
      id: 'title',
      header: 'File Name',
      accessorKey: 'info_dict.title',
      meta: {
        filterOperator: 'contains'
      },
      // size: 600,
      Cell: ({ cell }) => {
        // cell.getValue<string>().toLocaleString()
        // console.log(cell.row.original, table)
        // const rowIndex = cell.row.index
        const data = cell.row.original
        const requested_dl = cell.row.original.requested_download as VideoFormat[]
        const _default = requested_dl[0]

        const info_dict = data.info_dict
        const duration = info_dict.duration
        // const filesize = _default.filesize.includes(',') ? _default.filesize.split(',')[0] : _default.filesize
        const videoDuration = formatDuration(duration)

        const isDownloadAudio = videoSettings.download_as && videoSettings.download_as === "audio"

        const extractor = info_dict.extractor_key?.toLowerCase()
        const favicon = extractor === "youtube"
        ? "https://www.youtube.com/s/desktop/0c0555f3/img/favicon.ico"
        : extractor === "tiktok"
        ? "https://www.tiktok.com/favicon.ico"
        : extractor === "instagram"
        ? "https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png"
        : extractor === "facebook"
        ? "https://cdn-icons-png.flaticon.com/128/733/733547.png"
        : extractor === "douyin"
        ? "https://p-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/favicon.png"
        : extractor === "kuaishou"
        ? "https://static.yximgs.com/udata/pkg/WEB-LIVE/kwai_icon.8f6787d8.ico"
        : null;

        return (
          <Flex gap={8}>
            <VideoEmbed
              filePath={_default.file_path}
              content={
                info_dict.thumbnail_base64
                // thumbnail?.includes("//instagram.")
                  // ? <video playsInline preload="none" src={_default.video}></video>
                  ? <img src={info_dict.thumbnail_base64} />
                  : <img src={info_dict.thumbnail} />
              }
              Sx={{
                minWidth: 120
              }}
            />
            {/* <img src={`https://i.ytimg.com/vi/${info_dict.id}/default.jpg`} /> */}
            <Stack spacing={"md"} w={"100%"}>
              {/* <Input value={info_dict.thumbnail} /> */}
              <Text fz={13}
                onContextMenu={(e) => {
                  e.preventDefault(); // prevent the default behaviour when right clicked
                  // setTesting({test: "Right Click"});
                }}
              >{info_dict.title}</Text>
              <Progress
                size="sm" bg={scheme(colorSchemes.defaultBGColor)}
                value={data.completed === "progressing" ? progressNum : 100}
                // value={progressNum}
                color={data.completed === "uncompleted" ? "gray" : "green"}
                animate={
                  // rowIndex === iDownloading &&
                  data.completed === "progressing"
                }
              />
              <Flex gap={16} sx={{
                paddingTop: 8,
                borderTop: `1px dashed rgb(193 194 197 / 50%)`,
              }}>
                <Flex align={"center"} justify={"center"} gap={4}>
                  <IconClockHour3 size={15} />
                  <Text span fz={12.5} sx={{lineHeight:0}}>{videoDuration}</Text>
                </Flex>
                <Flex align={"center"} justify={"center"} gap={4}>
                  <IconFileDescription size={15} />
                  <Text span fz={12.5} sx={{lineHeight:0}}>{_default.filesize}</Text>
                </Flex>
                <Flex align={"center"} justify={"center"} gap={4}>
                  <IconPhoto size={15} />
                  <Text span fz={12.5} sx={{lineHeight:0}}>
                    {isDownloadAudio ? "audio" : (_default.resolution ?? "N/A")}
                  </Text>
                </Flex>
                <Flex align={"center"} justify={"center"} gap={4}>
                  <IconMovie size={15} />
                  <Text span fz={12.5} sx={{lineHeight:0}}>{_default.ext.toUpperCase()}</Text>
                </Flex>
                <Flex align={"center"} justify={"center"} gap={4}>
                  {
                    favicon
                    ? <img src={favicon} width={15} height={15} />
                    : <IconWorld size={15} />
                  }
                  <Text span fz={12.5} sx={{lineHeight:0}}>{info_dict.extractor_key}</Text>
                </Flex>
              </Flex>
            </Stack>
          </Flex>
        )
      },
    },
    {
      id: 'action',
      header: 'Action',
      accessorKey: 'info_dict.extractor_key',
      size: 80,
      enableColumnActions: false,
      enableColumnOrdering: false,
      enableSorting: false,
      enableEditing: false,
      Cell: ({ cell }) => {
        const body = {
          file_path: cell.row.original.requested_download?.[0].folder_path
        }
        const headers = { headers: { Accept: "application/json", } }

        return (
          <Center>
          <Tooltip label="open file folder" withArrow>
            <ActionIcon
              onClick={() => {
                axios.post(localhost('/openfolder'), body, headers)
                .then((res) => {
                  return res.data
                })
                .catch((err) => console.log(err))
              }}
            >
              <IconFolder color={scheme(colorSchemes.textColor)} />
            </ActionIcon>
          </Tooltip>
          </Center>
        )
      }
    },
    // {
    //   id: 'categories',
    //   header: 'Categories',
    //   // accessorKey: 'categories',
    //   size: 120,
    // },

  ]

  const theme = useMantineTheme();
  const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color)
  const { classes } = useStylesToolbarCustomAction();

  const [testing, setTesting] = useState<any|null>(null);

  useEffect(() => {
    handleVideoSettings({
      authAccounts: localVideoSettings.authAccounts ?? [{
        username: "",
        password: "",
        type: "YouTube",
        showPW: false,
        selected: true
      }],
      authScrollHeight: localVideoSettings.authScrollHeight ?? 30,
      useAuth: false,
      download_site_type: [
        {value: "youtube.com", label:"YouTube"},
        {value: "facebook.com", label:"Facebook"},
        {value: "instagram.com", label:"Instagram"},
        {value: "tiktok.com", label:"TikTok"}
      ],
      limit_download: 0,
      onUpdating: false,
    })
    setTimeout(() => {
      const info_dicts = (i:number) => ({
        info_dict: {
          id: "jNtkXeOm0AM"+i,
          title: "⚡🎵 Epic Electric Timer - 15 Seconds Countdown 🎵⚡ TIMER "+i,
          original_url: "https://www.youtube.com/watch?v=jNtkXeOm0AM",
          webpage_url: "https://www.youtube.com/watch?v=jNtkXeOm0AM",
          thumbnail: "https://instagram.fpnh5-5.fna.fbcdn.net/v/t51.2885-15/361097007_263138159781678_1699230075108105868_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08&_nc_ht=instagram.fpnh5-5.fna.fbcdn.net&_nc_cat=1&_nc_ohc=GyIwSpqToDkAX-DFCKd&edm=AP_V10EBAAAA&ccb=7-5&oh=00_AfBqc8Fh05Uqza_CpGeP9dYYpPt-2jzLcEz0jouRtVom7w&oe=64BED771&_nc_sid=2999b8",
          // thumbnail: "https://i.ytimg.com/vi/jNtkXeOm0AM/default.jpg",
          duration: 15,
        },
        video_only: [],
        audio_only: [],
        both: [],
        requested_download: [{
          ext: "mp4",
          filesize: "4.12MiB",
          filesize_num: 3485982,
          resolution: "1280x720",
          url: "https://i.ytimg.com/vi/jNtkXeOm0AM/0.jpg",
          video: "",
        }],
        completed: i % 2 ? "progressing" : "completed",
        selected: false,
      }) as IYouTube;
      const info_dicts_noProgress = [...Array(6).keys()].map((_,i) => info_dicts(i))
      // loadTableData([...info_dicts_noProgress])
    }, 500)

    progressBar(setProgressNum);
  }, [])

  useEffect(() => {
    if(testing){
      console.log(testing)
    }
    if(tableData){
      // console.log(tableData)
    }
  }, [testing, videoSettings, tableData])




  const ToolbarCustomAction = (table: MRT_TableInstance) => {
    return (
      <Stack sx={({
        width: "100%",
      })}>
        <Flex gap={0}
          sx={({
            backgroundColor: "rgb(40, 49, 66)",
            border: "1px solid #1c232f",
            width: "100%",
          })}
        >
          {
            [
              {label: "Add URL", icon: IconSquareRoundedPlus,
                onClick: () => {
                  // setOpenAddLinks(true)
                  handleSettings({addLinksPopup: true})
                },
              },
              // {label: "Resume", icon: IconSquareRoundedArrowDown, disable: true, tooltip: "in development"},
              // {label: "Stop", icon: IconPlayerStop, disable: true, tooltip: "in development"},
              // {label: "Stop All", icon: IconHandStop, disable: true, tooltip: "in development"},
              {label: "Delete", icon: IconTrash, color: "#F03E3E", tooltip: "Remove selected files from the list",
                onClick: () => {
                  // console.log(tableData)
                  if(tableData.length > 0){
                    const deleteData = tableData.filter(data => data.selected !== true)
                    loadTableData(deleteData)
                    table.resetRowSelection(true)
                    setActive(false)
                  }
                },
                disable: active !== "enableDeleteButton"
              },
              {label: "Download", icon: IconSquareRoundedArrowDown, color: "#2f9e44", tooltip: "Redownload selected items from the list",
                onClick: () => {
                  if(tableData.length > 0){
                    const url_list_selected = tableData.filter(data => data.selected === true)
                    .map(data => data.info_dict.webpage_url)
                    // handleVideoSettings({videoLinks:url_list_selected.join('\n')})
                    handleSettings({
                      // videoDownloadedData: tableData.map(data => ({...data, selected:false})),
                      addLinksPopup:true,
                      videoLinks:url_list_selected.join('\n')
                    })
                    // table.resetRowSelection(true)
                    // setActive(false)
                  }
                },
                disable: active !== "enableDeleteButton"
              },
              // {label: "Edit", icon: IconTransformFilled, color: "#2f9e44", tooltip: "Edit selected videos from the list",
              //   onClick: () => {
              //     if(tableData.length > 0){
              //       const file_path_list_selected = tableData.filter(data => data.selected === true)
              //       .map(data => data.requested_download?.[0].file_path)

              //       const useSettingsContext = {
              //         settings,
              //         handleSettings,
              //       }
              //       handleVideoSettings({
              //         filePaths:file_path_list_selected.join('\n'),
              //         modal: {
              //           title: "Convert Video",
              //           isOpen: true,
              //           content: (
              //             <ActionsVideoConverter
              //               renderContent={
              //                 <Group mt={'md'} position={'apart'}>
              //                   <Button
              //                     onClick={() => handleVideoSettings({modal: {isOpen: false}})}
              //                     variant="subtle"
              //                     >
              //                     Close
              //                   </Button>
              //                   <ButtonLoader
              //                     variant="filled"
              //                     callback={{
              //                       beforeSend(event) {
              //                         event.preventDefault();
              //                       },
              //                       success(event) {
              //                       },
              //                     }}
              //                     >
              //                     Convert
              //                   </ButtonLoader>
              //                 </Group>
              //               }
              //               {...useSettingsContext}
              //             />
              //           )
              //         },
              //       })
              //       // table.resetRowSelection(true)
              //       // setActive(false)
              //     }
              //   },
              //   disable: active !== "enableDeleteButton"
              // },
            ].map((item) => {

              return (
                <Button key={item.label} title={item.tooltip}
                  className={classes.buttonAction} h={60} w={60} p={0}
                  onClick={item.onClick}
                  disabled={item.disable}
                  sx={{
                    "& :where(svg)":{
                      color: item.color
                    }
                  }}
                >
                  <item.icon color={item.color} size={30} stroke={1.6}/>
                  <Text span fz={12}>{item.label}</Text>
                </Button>
              )
            })

          }
        </Flex>
      </Stack>
    )
  }

  return (
    <Box>
      <Stack>
        {
          // <Flex>
          //   <Box>
          //     <img src={"https://i.ytimg.com/vi/jNtkXeOm0AM/0.jpg"} />
          //   </Box>
          //   <Box>
          //     <Title order={1} fz="md"></Title>
          //   </Box>
          // </Flex>
        }
        <AdvDataTable
          // autoResetAll={active === "resetAll"}
          columns={columns}
          data={tableData}
          enableFullScreenToggle={false}
          // initialState={{density: "xs"}}
          displayColumnDefOptions={{
            'mrt-row-select': {
              size: 40,
            },
          }}
          enableFilters={true}
          // enableColumnDragging={false}
          // enableHiding={false}
          // enableColumnActions={true}
          // enableColumnOrdering={false}
          // initialState={{
          //   pagination: { pageSize: 5, pageIndex: 0 },
          //   showGlobalFilter: true,
          // }}
          // mantinePaginationProps={{
          //   rowsPerPageOptions: ['5', '10', '15', '20', '25', '30', '50', '100', '200'],
          // }}
          // paginationDisplayMode="pages"
          enableRowSelection
          // getRowId={(row) => row.id}
          onRowSelectionChange={setRowSelection}
          state={{rowSelection}}
          mantineTableBodyRowProps={({row}) => ({
            sx: {
              '&, &:hover': {
                backgroundColor: rowSelection[row.id] == true ? `rgba(47, 158, 68, 0.15) !important` : undefined,
              },
              '& > td': {
                backgroundColor: rowSelection[row.id] == true ? `unset !important` : undefined,
              },
            }
          })}
          // renderEmptyRowsFallback={({table}) => {
          //   return <div style={{textAlign:'center'}}>No Data Found</div>;
          // }}
          mantineSelectAllCheckboxProps={({table}) => ({
            title: "Select All",
            color: 'green',
            onClick: () => {
              if(tableData.length > 0){
                const updateTableData = tableData.map((data) => ({...data, selected: !table.getIsAllRowsSelected()}))
                setTableData(updateTableData)

                if(!table.getIsAllRowsSelected()){
                  setActive("enableDeleteButton")
                } else {
                  setActive(false)
                }
              }
            }
          })}
          mantineSelectCheckboxProps={({ row, table }) => ({
            title: "Select",
            color: 'green',
            onClick: () => {
              setRowSelection((prev) => ({
                ...prev,
                [row.id]: !prev[row.id],
              }));
              const data = row.original as IYouTube
              const updateData = updatedTableData(row.index, {selected: !data.selected},{},false)
              const isSomeSelected = updateData.some(data => data.selected === true)

              if(isSomeSelected){
                setActive("enableDeleteButton")
                updatedTableData(row.index, {selected: !data.selected}, {updateData, isSomeSelected})
              } else {
                setActive(false)
                updatedTableData(row.index, {selected: !data.selected}, {updateData, isSomeSelected})
              }
            },
            selected: rowSelection[row.id],
          })}
          {...mantineDefaultProps(scheme, theme) as any}
          // paperSx={{
          //   backgroundColor: scheme(colorSchemes.defaultBGColor),
          //   border: `1px solid ${scheme(colorSchemes.sectionBorderColor)}`,
          //   '& .is-data-table': {
          //     borderBottom: 0,
          //   },
          //   '& .is-top-toolbar, .is-data-table, .is-bottom-toolbar': {
          //     backgroundColor: scheme(colorSchemes.sectionBGColor),
          //     '& input': {
          //       backgroundColor: '#1b2531',
          //     }
          //   },
          //   '& .is-top-toolbar': {
          //     marginBottom: 20,
          //     backgroundColor: "unset"
          //   }
          // }}
          // mantineTableProps={{
          //   striped: true,
          //   fontSize: "xs",
          //   // variant: "outline",
          //   // highlightOnHover: true,
          //   // withColumnBorders: true,
          //   // horizontalSpacing: "md",
          //   // verticalSpacing: "xl",
          //   sx: ({
          //     color: scheme(switchColor("#b4bed2","#455560")),
          //     '& tbody tr td:first-of-type': {
          //       width: "5%"
          //     },
          //     '&[data-striped] tbody tr:nth-of-type(odd)': {
          //       backgroundColor: scheme(switchColor('rgb(39 46 59)','#ffffff')),
          //     },
          //     '&[data-striped] tbody tr:nth-of-type(even)': {
          //       backgroundColor: scheme(switchColor('','rgb(155 195 255 / 10%)')),
          //     },
          //     '&[data-striped] tbody tr:is(:nth-of-type(odd),:nth-of-type(even))': {
          //       '& input': {
          //         backgroundColor: scheme(colorSchemes.defaultBGColor),
          //         // borderColor: `${scheme(colorSchemes.sectionBorderColor)}`,
          //       },
          //       '&:hover': {
          //         '& > td': {
          //           backgroundColor: 'unset !important',
          //         },
          //         backgroundColor: scheme(colorSchemes.sectionHoverBGColor) + '',
          //       }
          //     },
          //   })
          // }}
          // mantineTableHeadProps={{
          //   sx: {
          //     '& tr': {
          //       backgroundColor: "unset",
          //       '& th': {
          //         borderBottomColor: `rgb(255 255 255 / 10%) !important`,
          //         '&:nth-of-type(2)': {
          //           width: "100%",
          //         }
          //       },
          //       '& input': {
          //         backgroundColor: "#1b2531"
          //       }
          //     }
          //   }
          // }}
          // mantineTableBodyProps={{
          //   sx: {
          //     tableLayout: "fixed",
          //     '& td': {
          //       borderTopColor: `rgb(255 255 255 / 10%) !important`,
          //       whiteSpace: "normal",
          //       // verticalAlign: "top",
          //     },
          //     '& tr:last-of-type > td': {
          //       borderBottomColor: `rgb(255 255 255 / 10%) !important`,
          //     },
          //     '& td .row-actions': {
          //       color: "#a7aaad",
          //       fontSize: "13px",
          //       padding: "2px 0 0",
          //       position: "relative",
          //       left: "-9999em"
          //     },
          //     '& td:hover .row-actions': {
          //       left: 0
          //     },
          //   }
          // }}
          // mantineBottomToolbarProps={{
          //   sx: {
          //     '&, *': {
          //       fontSize: "13px !important",
          //     },
          //     ...(
          //       theme.colorScheme === "dark" ? {
          //         // '& .mantine-Select-root > .mantine-Select-dropdown': {},
          //         '& .mantine-Select-root > .mantine-Select-dropdown': {
          //           backgroundColor: 'rgb(40, 49, 66)',
          //           borderColor: "#4d5b75",
          //           '& .mantine-Select-itemsWrapper > [data-selected]': {
          //             backgroundColor: '#1b2531',
          //           },
          //           '& .mantine-Select-itemsWrapper > [data-hovered]:not([data-selected])': {
          //             backgroundColor: 'rgb(77 91 117 / 60%)',
          //           },
          //         }
          //       } : {}
          //     )
          //   }
          // }}

          renderTopToolbarCustomActions={({table}) => {
            return (
              ToolbarCustomAction(table)
            )
          }}
          // onPaginationChange={20}
          renderBelowSection={
            <>
            {/* <Textarea fz={10} mt={30}
              value={testing ? JSON.stringify(testing, null, 2) : ""}
              readOnly
              autosize
              minRows={4}
              maxRows={10}
            /> */}
            <Modal
              opened={settings.addLinksPopup ?? false}
              onClose={() => handleSettings({addLinksPopup: false})}
              withCloseButton={false}
              closeOnClickOutside={true}
              size={'xl'}
              centered
              mah={600}
              sx={{
                '& .mantine-Modal-content': {
                  // height: "600px"
                  '& :where(textarea)': {
                    backgroundColor: "#05101e !important",
                    // backgroundColor: scheme(colorSchemes.defaultBGColor),
                    borderColor: `${scheme(colorSchemes.sectionBorderColor)}`
                  },
                }
              }}
            >
              <Title ta="center"
                sx={{ fontSize: 22, backgroundColor: scheme(colorSchemes.overSectionBGColor), padding:8, margin: "-1rem -1rem 1rem" }}
              >
                {/* Enter Video Links To Download */}
                AIO Video Downloader By TCTT
              </Title>
              <Textarea
                placeholder={
                  "Enter your video url one per line \n\n" +
                  "example:\n" +
                  "https://www.youtube.com/watch?v=VIDEO_ID\n" +
                  "https://www.youtube.com/shorts/VIDEO_ID\n" +
                  "https://www.facebook.com/(1000123456789/videos/ | watch?v=)VIDEO_ID\n" +
                  "https://www.instagram.com/(p | reel | reels)/VIDEO_ID\n" +
                  "https://www.tiktok.com/@username/video/VIDEO_ID\n" +
                  "https://www.douyin.com/video/VIDEO_ID\n" +
                  "https://www.kuaishou.com/short-video/VIDEO_ID\n" +
                  ". . .\n"+
                  "or\n" +
                  "https://www.youtube.com/(@username | /channel/CHANNEL_ID)\n"+
                  "https://www.youtube.com/playlist?list=PLAYLISTID1\n"+
                  "https://www.instagram.com/username\n"+
                  "https://www.facebook.com/(username | PAGE_ID)\n"+
                  "https://www.tiktok.com/@username\n"+
                  "https://www.douyin.com/user/USER_ID\n"+
                  "https://www.kuaishou.com/profile/USER_ID\n"
                  // ". . .\n"
                }
                value={settings.videoLinks ?? ""}
                onChange={(e) => {
                  handleSettings({videoLinks: e.currentTarget.value})
                }}
                autosize
                minRows={15}
                maxRows={20}
                mb={"sm"}
                rightSectionProps={{
                  style: {
                    alignItems: "flex-start",
                    padding: "5px 0",
                    width: 120,
                    backgroundColor: scheme(colorSchemes.sectionBGColor),
                    border: "1px solid #4d5b75",
                    borderRadius: "0 8px 8px 0",
                  }
                }}
                rightSection={
                  <Stack spacing={"xs"}>
                    <ButtonLoader
                      loaderProps={{
                        color: theme.colors.cyan[5]
                      }}
                      variant='light'
                      p={0}
                      w={100} h={30}
                      fz={12}
                      timeout={500}
                      callback={{
                        beforeSend: (e) => e.preventDefault(),
                        success: () => {
                          navigator.clipboard.readText().then(result => {
                            handleSettings({videoLinks: result})
                          })
                        },
                      }}
                      icon={<IconClipboard size={16} color={theme.colors.cyan[5]}/>}
                      tooltip={{
                        label:"paste video links from clipboard", children: ""
                      }}
                    >{`Paste`}</ButtonLoader>
                      <div>
                        <Checkbox label={`One Profile`} labelPosition='left'
                          title={`${videoSettings.limit_dl_tooltip?"show":"hide"} description on hover`}
                          color='green' size="xs" mb={8}
                          checked={videoSettings.limit_dl_tooltip ?? false}
                          onChange={() =>
                            handleVideoSettings({limit_dl_tooltip: !videoSettings.limit_dl_tooltip})
                          }
                        />
                        <Tooltip disabled={videoSettings.limit_dl_tooltip ?? false} label="download limit: limit is 0 (zero) it will download all available videos"
                        withArrow withinPortal zIndex={2001}
                        >
                          <NumberInput
                            // label="Video Limit"
                            placeholder="0"
                            value={videoSettings.limit_download ?? 0}
                            onChange={(e) => handleVideoSettings({limit_download:e})}
                            min={0}
                            radius="xs"
                            size="xs"
                            w={100}
                          />
                        </Tooltip>
                      </div>
                      <MySelect
                        title={"download sort by"}
                        value={videoSettings.download_sortBy ?? "newest"}
                        // onChange={setVideoResolution}
                        onChange={(e) => { handleVideoSettings({ download_sortBy: e }) }}
                        data={
                          ["newest", "popular", "oldest"]
                          .map(val => ({value: val, label: toCapitalized(val)}))
                        }
                        w={100}
                        radius="xs"
                        size='xs'
                        maxDropdownHeight={200}
                      />
                  </Stack>
                }
              />
              { videoSettings.onUpdating &&
                <Box
                  sx={{
                    border: '2px solid #4d5b75', marginTop: 30,
                    padding: "20px 0"
                  }}
                >
                  <Group mt="-36px" pb={15} px={15} position='apart'>
                    <Box px={8} bg={scheme(colorSchemes.sectionBGColor)}>
                    <Checkbox label={`Use Authorization`} color='green' size="sm"
                      sx={{
                        '& .mantine-Checkbox-body > *': {
                          '& label': {
                            fontSize: 14
                          },
                        },
                        '& .mantine-Checkbox-body > .mantine-Checkbox-inner': {
                          '& .mantine-Checkbox-input:checked+.___ref-icon': {
                            color: "#47d362",
                          }
                        },
                      }}
                      checked={videoSettings.useAuth ?? false}
                      onChange={() => handleVideoSettings({
                        useAuth: !videoSettings.useAuth,
                        ...(
                          videoSettings.authAccounts && videoSettings.authAccounts.length > 0
                          ? {authAccounts:
                            [...videoSettings.authAccounts].map(acc => videoSettings.useAuth === false ? {...acc, showPW:false} : {...acc})
                          }
                          : {}
                        )
                      })}
                    />
                    </Box>
                    <Tooltip label="Add new login account" withArrow>
                      <ActionIcon disabled={!videoSettings.useAuth??false} bg={scheme(colorSchemes.sectionBGColor)+"!important"}
                        onClick={() => {
                          const account:AuthAccountProps = {
                            username: "",
                            password: "",
                            type: "YouTube",
                            showPW: false,
                            selected: true
                          }
                          const authAccounts: AuthAccountProps[] = videoSettings.authAccounts ? [...videoSettings.authAccounts, {...account}] : []
                          const authScrollHeight = authAccounts.length > 0 ? authAccounts.length * (30+16) : 30
                          handleVideoSettings({
                            authAccounts,
                            authScrollHeight: authScrollHeight >= 200 ? 200 : authScrollHeight
                          })
                        }}
                      ><IconSquareRoundedPlus /></ActionIcon>
                    </Tooltip>
                  </Group>
                  <ScrollArea h={videoSettings.authScrollHeight ?? 30} type='never'><Stack>
                    {
                      videoSettings.authAccounts && [...(videoSettings.authAccounts) as AuthAccountProps[]]
                      ?.map((account,i) => {
                        const useAuth = (videoSettings.useAuth
                        ? account.selected : false) as boolean
                        const authAccounts: AuthAccountProps[]  = videoSettings.authAccounts ?? []
                        const authAccountChange = (value:AuthAccountProps,addMore?:VideoSettings) => {
                          const authAccountChange = authAccounts.length > 0
                                ? authAccounts.map((acc,idx) => i === idx ? {...acc, ...value} : {...acc})
                                : [{...account, ...value}]
                          handleVideoSettings({
                            authAccounts: authAccountChange,
                            ...addMore
                          })
                          handleLocalVideoSettings({
                          authAccounts: authAccountChange.map(acc => ({...acc, showPW:false})),
                          authScrollHeight: videoSettings.authScrollHeight,
                          })
                        }
                        const authAccountDelete = () => {
                          const authAccountChange = authAccounts.filter((acc,idx) => i !== idx)
                          handleVideoSettings({
                            authAccounts: authAccountChange,
                            authScrollHeight: videoSettings.authScrollHeight - (30+16)
                          })
                          handleLocalVideoSettings({
                          authAccounts: authAccountChange.map(acc => ({...acc, showPW:false})),
                          authScrollHeight: videoSettings.authScrollHeight - (30+16)
                          })
                        }

                        return(
                          <Flex key={i} justify={"space-around"} sx={{
                            '& .mantine-InputWrapper-root :where(input)': {
                              height: 30,
                              minHeight: 30,
                            }
                          }} >
                            <Flex align="center" gap={10}>
                              <Checkbox
                                disabled={!videoSettings.useAuth}
                                title='Enable login account'
                                labelPosition="left"
                                size="xs"
                                sx={(theme) => ({
                                  '& .mantine-Checkbox-body > .mantine-Checkbox-inner': {
                                    '& .mantine-Checkbox-input:checked+.___ref-icon': {
                                      color: videoSettings.useAuth ? theme.colors.cyan[5] : theme.colors.gray[5],
                                      width: "76%"
                                    }
                                  },
                                })}
                                icon={IconCircleDotFilled}
                                checked={account.selected}
                                onChange={() => { authAccountChange({selected: !account.selected}) }}
                              />
                            <TextInput disabled={!useAuth}
                              placeholder='username' w={160}
                              value={account.username}
                              onChange={(e) => { authAccountChange({username: e.currentTarget.value}) }}
                            />
                            </Flex>
                            <TextInput disabled={!useAuth} type={account.showPW ?'text':'password'}
                                placeholder='password' w={160}
                                value={account.password}
                                onChange={(e) => { authAccountChange({password: e.currentTarget.value}) }}
                                rightSection={
                                  <ActionIcon
                                    size={20}
                                    onClick={() => authAccountChange({showPW: !account.showPW})}
                                  >{account.showPW?<IconEyeOff/>:<IconEye/>}</ActionIcon>
                                }
                              />
                            <Flex align="center" gap={10}>
                              <MySelect
                                disabled={!useAuth}
                                title='Select type of site to login. If not you can create a new site by clicking green button icon'
                                placeholder={"select site"}
                                value={account.type}
                                onChange={(e) => { authAccountChange({type: e}) }}
                                data={videoSettings.download_site_type}
                                w={isMobileDevice ? 160 : 160}
                                maxDropdownHeight={300}
                                radius="md"
                                dropdownPosition="top"
                                withinPortal
                                zIndex={2000}
                              />
                              {
                                i<= 0
                                ? <Popover
                                    width={300} position="top" withArrow shadow="xl" withinPortal zIndex={2000}>
                                    <Popover.Target>
                                      <ActionIcon disabled={!useAuth} title='add new type of login site'>
                                        <IconWorldPlus color={!useAuth ? theme.colors.gray[5] : theme.colors.green[5]}/>
                                      </ActionIcon>
                                    </Popover.Target>
                                    <Popover.Dropdown p={0} bg={scheme(colorSchemes.sectionBGColor)}>
                                      <TextInput placeholder='example.com'
                                        error={active === "siteCheckIsValid"?"invalid type of site. . .  [example.com]":undefined}
                                        errorProps={{
                                          style: {
                                            padding: '5px',
                                          }
                                        }}
                                        onChange={(e) => {
                                          const type = e.currentTarget.value.trim();
                                          const siteCheckIsValid = /^((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(type)

                                          if(siteCheckIsValid){
                                            setStateHelper({
                                              type,
                                              download_site_type: { value: type.toLowerCase(), label: type }
                                            })
                                            setActive(null)
                                          } else {
                                            setStateHelper(null)
                                            setActive("siteCheckIsValid")
                                          }
                                        }}
                                        rightSection={
                                          <ActionIconLoader
                                            tooltip={{ label: "Add Site",children:"" }}
                                            timeout={300}
                                            callback={{
                                              beforeSend: (e) => e.preventDefault(),
                                              success: () => {
                                                if(stateHelper && stateHelper?.type){
                                                  const type = stateHelper.type
                                                  const isValidSiteType = [...videoSettings.download_site_type].some(site =>
                                                    site.value === stateHelper.download_site_type.value
                                                  )
                                                  if(!isValidSiteType){
                                                    authAccountChange(
                                                      {type},
                                                      {download_site_type: [...videoSettings.download_site_type, {...stateHelper.download_site_type}]}
                                                    )
                                                    setStateHelper(null)
                                                  }
                                                }
                                              }
                                            }}
                                            loaderProps={{
                                              color: theme.colors.cyan[5]
                                            }}
                                            icon={<IconSquareRoundedPlus color={theme.colors.cyan[5]}/>}
                                          />
                                        }
                                      />
                                    </Popover.Dropdown>
                                  </Popover>
                                :
                                  <ActionIcon disabled={!useAuth} title="Delete login account"
                                    onClick={authAccountDelete}
                                  ><IconTrash color={!useAuth ? theme.colors.gray[5] : '#F03E3E'} /></ActionIcon>
                              }
                            </Flex>
                          </Flex>
                        )
                      })
                    }
                  </Stack></ScrollArea>
                </Box>
              }
              <Group mt={'md'} position={'apart'} sx={{
                justifyContent: largerThanSM ? "space-evenly" : undefined,
              }}>
                <Button
                  onClick={() => handleSettings({addLinksPopup: false})}
                  variant="subtle"
                  size='xs'
                  fz={14}
                  >
                  Close
                </Button>
                <Flex align="center" gap={10}>
                  {/* <Tooltip
                    label={`Videos will download HD minimum resolution \n if you don't select one of the Quality`}
                    // position="bottom"
                  >
                  </Tooltip> */}
                    <MySelect
                      title={"select download as video(mp4) or audio(mp3)"}
                      value={videoSettings.download_as ?? "video"}
                      // onChange={setVideoResolution}
                      onChange={(e) => { handleVideoSettings({ download_as: e }) }}
                      data={
                        ["video", "audio"]
                        .map(val => ({value: val, label: toCapitalized(val)}))
                      }
                      w={80}
                      maxDropdownHeight={90}
                      radius="xs"
                      size='xs'
                    />
                    {videoSettings.download_as && videoSettings.download_as === "audio"
                      ? <MySelect
                        placeholder={"select"}
                        value={videoSettings.audio_format ?? "128"}
                        // onChange={setVideoResolution}
                        onChange={(e) => { handleVideoSettings({ audio_format: e }) }}
                        data={
                          ["320", "256", "192", "128", "64"]
                          .map(val => ({value: val, label:`${val}kbps`}))
                        }
                        w={100}
                        maxDropdownHeight={300}
                        radius="xs"
                        size='xs'
                      />
                      :
                      <MySelect
                        placeholder={"Select Quality - Default 720p"}
                        value={videoSettings.resolution ?? "720"}
                        // onChange={setVideoResolution}
                        onChange={(e) => { handleVideoSettings({ resolution: e }) }}
                        data={videoFormatSelection()}
                        w={isMobileDevice ? 140 : 200}
                        maxDropdownHeight={300}
                        radius="xs"
                        size='xs'
                      />
                    }
                  {
                    ["horizontal","vertical"].map((val, i) => (
                      <Tooltip key={val} label={`${toCapitalized(val)} Video`} withArrow>
                      <ActionIcon
                        // title={i === 0 ? "Horizontal Video" : "Vertical Video"}
                        variant={videoSettings.active_dlType === i ? 'filled' : "light"}
                        color={'cyan'}
                        size={"md"}
                        radius={"xs"}
                        onClick={() => { handleVideoSettings({download_type: val, active_dlType: i}) }}
                      >
                        {val === "horizontal"
                          ? <IconDeviceMobileRotated size={26}/>
                          : <IconDeviceMobile size={26}/>
                        }
                      </ActionIcon>
                      </Tooltip>
                    ))
                  }
                </Flex>
                <ButtonLoader
                  variant='outline'
                  color='#ffffff' size='xs' fz={14}
                  timeout={1000}
                  callback={{
                    async success() {
                      // if(videoSettings.videoLinks?.trim().startsWith('https')){
                      //   const textLinks = videoSettings.videoLinks.trim()
                      //   var videoLinks = textLinks.split('\n')
                      //   const [video_list, isProfile] = fixOneProfile(videoLinks)

                      //   const ytPlaylistId = videoLinks.map((youtubeLink) => getYouTubeID(youtubeLink.trim(), "list")).filter(v => typeof v === "string") as string[]
                      //   const yt_playlist = ytPlaylistId.map(id => `https://www.youtube.com/playlist?list=${id}`)
                      //   const isYTPlaylist = textLinks.includes("youtube.com/playlist?list=")

                      //   console.log(isProfile,isYTPlaylist)
                      //   if(isProfile || isYTPlaylist){
                      //     const all_playlist = isProfile ? finalValidLinks(video_list.join("\n")) : yt_playlist
                      //     // console.log("all_playlist", isProfile,yt_playlist)

                      //     const resExtractVideoList = await axios.post(
                      //       localhost('/youtube/playlist'),
                      //       {
                      //         all_playlist: all_playlist,
                      //         option: {
                      //           limit: videoSettings.limit_download ?? 0,
                      //         }
                      //       },
                      //       headers
                      //     )
                      //     if(resExtractVideoList.status === 200){
                      //       videoLinks = resExtractVideoList.data.all_video_list
                      //     }
                      //   } else {
                      //     videoLinks = finalValidLinks(textLinks)
                      //   }
                      //   console.log(videoLinks)
                      //   // setTesting(videoLinks)
                      //   // const videoIds = videoLinks.map((youtubeLink) => getYouTubeID(youtubeLink.trim())).filter(v => typeof v === "string")

                      //   // if(videoLinks.length > 0){
                      //   //   downloadVideos({
                      //   //     videoLinks,
                      //   //     settings,
                      //   //     videoSettings,
                      //   //     handleSettings,
                      //   //     tableData,
                      //   //     loadTableData,
                      //   //     setInvalidLinksDL,
                      //   //     setActive,
                      //   //     isProfile,
                      //   //     isYTPlaylist,
                      //   //     ytPlaylistId
                      //   //   })
                      //   // }
                      // }

                      await getVideosFromMultipleProfile({
                        settings,
                        videoSettings,
                        handleSettings,
                        tableData,
                        loadTableData,
                        setInvalidLinksDL,
                        setActive,
                      })
                    },
                  }}
                >
                  Download Now
                </ButtonLoader>
              </Group>
            </Modal>
            <Modal
              opened={active === "invalidLinks"}
              onClose={() => setActive(false)}
              withCloseButton={false}
              // closeOnClickOutside={false}
              size={'md'}
              centered
              mah={600}
              sx={{
                '& .mantine-Modal-content': {
                  // height: "600px"
                  '& :where(input, textarea)': {
                    backgroundColor: scheme(colorSchemes.defaultBGColor),
                    borderColor: `${scheme(colorSchemes.sectionBorderColor)}`
                  },
                }
              }}
            >
              <Title ta="center"
                sx={{ fontSize: 22, color: "red", backgroundColor: scheme(colorSchemes.overSectionBGColor), padding:8, margin: "-1rem -1rem 1rem" }}
              >
                Invalid Links
              </Title>
              <Textarea
                value={invalidLinksDL.join('\n')}
                readOnly
                autosize
                minRows={15}
                maxRows={20}
                mb={"sm"}
                // error={
                //   error == true ? "invalid data"
                //     : (isSameLicense == true
                //       // ? "License Key or Machine ID already exists"
                //       ? true
                //       : undefined
                //     )
                // }
                // onChange={ (e) => {setError(false); setIsSameLicense(false)}}
              />
              <Group mt={'md'} position={'apart'}>
                <Button
                  onClick={() => setActive(false)}
                  variant="subtle"
                  >
                  Close
                </Button>
              </Group>
            </Modal>

            </>
          }
        />
      </Stack>
    </Box>
  )
}

export function progressBar(setProgressNum:(val:number)=>void) {
  var i = 0
  if (i === 0) {
    i = 1;
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 75) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        setProgressNum(width)
      }
    }
  }
}

export const mantineDefaultProps = (
  scheme: (color: ThemeSwitch) => string,
  theme: MantineTheme
) => {

  return ({
    paperSx:{
      backgroundColor: scheme(colorSchemes.defaultBGColor),
      border: `1px solid ${scheme(colorSchemes.sectionBorderColor)}`,
      '& .is-data-table': {
        borderBottom: 0,
      },
      '& .is-top-toolbar, .is-data-table, .is-bottom-toolbar': {
        backgroundColor: scheme(colorSchemes.sectionBGColor),
        '& input': {
          backgroundColor: '#1b2531',
        }
      },
      '& .is-top-toolbar': {
        marginBottom: 20,
        backgroundColor: "unset",
        "& > div > div:last-child": {
          position: "absolute",
          top: 30,
          right: 0
        }
      }
    },
    mantineTableProps:{
      striped: true,
      fontSize: "xs",
      sx: ({
        color: scheme(switchColor("#b4bed2","#455560")),
        '& tbody tr td:first-of-type': {
          width: "5%"
        },
        '&[data-striped] tbody tr:nth-of-type(odd)': {
          backgroundColor: scheme(switchColor('rgb(39 46 59)','#ffffff')),
        },
        '&[data-striped] tbody tr:nth-of-type(even)': {
          backgroundColor: scheme(switchColor('','rgb(155 195 255 / 10%)')),
        },
        '&[data-striped] tbody tr:is(:nth-of-type(odd),:nth-of-type(even))': {
          '& input': {
            backgroundColor: scheme(colorSchemes.defaultBGColor),
            // borderColor: `${scheme(colorSchemes.sectionBorderColor)}`,
          },
          '&:hover': {
            '& > td': {
              backgroundColor: 'unset !important',
            },
            backgroundColor: scheme(colorSchemes.sectionHoverBGColor) + '',
          }
        },
      })
    },
    mantineTableHeadProps:{
      sx: {
        '& tr': {
          backgroundColor: "unset",
          '& th': {
            borderBottomColor: `rgb(255 255 255 / 10%) !important`,
            '&:nth-of-type(2)': {
              width: "100%",
            }
          },
          '& input': {
            backgroundColor: "#1b2531"
          }
        }
      }
    },
    mantineTableBodyProps:{
      sx: {
        tableLayout: "fixed",
        '& td': {
          borderTopColor: `rgb(255 255 255 / 10%) !important`,
          whiteSpace: "normal",
          // verticalAlign: "top",
        },
        '& tr:last-of-type > td': {
          borderBottomColor: `rgb(255 255 255 / 10%) !important`,
        },
        '& td .row-actions': {
          color: "#a7aaad",
          fontSize: "13px",
          padding: "2px 0 0",
          position: "relative",
          left: "-9999em"
        },
        '& td:hover .row-actions': {
          left: 0
        },
      }
    },
    mantineBottomToolbarProps:{
      sx: {
        '&, *': {
          fontSize: "13px !important",
        },
        ...(
          theme.colorScheme === "dark" ? {
            // '& .mantine-Select-root > .mantine-Select-dropdown': {},
            '& .mantine-Select-root > .mantine-Select-dropdown': {
              backgroundColor: 'rgb(40, 49, 66)',
              borderColor: "#4d5b75",
              '& .mantine-Select-itemsWrapper > [data-selected]': {
                backgroundColor: '#1b2531',
              },
              '& .mantine-Select-itemsWrapper > [data-hovered]:not([data-selected])': {
                backgroundColor: 'rgb(77 91 117 / 60%)',
              },
            }
          } : {}
        )
      }
    },
  })
}

export const VideoEmbed = (
  {filePath, content, Sx, iconProps, ...props}
  : {filePath?:string, content?:React.ReactNode, Sx?: Sx, iconProps?: Prettify<TablerIconsProps>} & Record<string,any>
) => {

  return (
    <Flex pos={"relative"} align={"center"}>
      <Box
        sx={{
          filter: "brightness(1)",
          backgroundColor: colorSchemes.defaultBGColor.dark,
          position: "relative",
          paddingTop: "56.25%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          // minWidth: 120,
          '& .player': {
            position: "absolute",
            top: "0",
            width: "100%",
            height: "100%",
            cursor: "pointer",
            zIndex: 2,
            '& .player-icon': {
              position: "absolute",
              top: "50%",
              left: "50%",
              WebkitTransform: "translate3d(-50%, -50%, 0)",
              transform: "translate3d(-50%, -50%, 0)",
              zIndex: 1,
              // backgroundColor: "var(--lr-opacity-30)",
              // boxShadow: "0px 0px 10px 3px var(--lr-opacity-80) inset",
              borderRadius: "100%",
              transition: "all .17s ease",
              '& > svg': {
                opacity: 0
              },
            },
            '&:hover svg': {
              opacity: 1
            },
          },
          '& img, video': {
            position: "absolute",
            width: "auto",
            height: "100%",
            verticalAlign: "middle",
            top: "0",
            filter: "brightness(0.8)",
            boxShadow: "rgb(24, 26, 27) 0px 0px 10px 0px",
            cursor: "pointer"
          },
          '&:hover img, &:hover video': {
            filter: "brightness(0.5)",
          },
          ...Sx
        }}
        {...props}
      >
        <div className='player'
          onClick={() => {
            filePath &&
            axios.post(localhost('/openfile'), {
              file_path: filePath
            }, headers)
            .then((res) => {
              return res.data
            })
            .catch((err) => console.log(err))
          }}
        >
          <div className='player-icon'><IconPlayerPlayFilled {...iconProps} /></div>
        </div>
        { content }
      </Box>
    </Flex>
  )
}

export const youtubeHeaders = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-us,en;q=0.5",
    "Sec-Fetch-Mode": "navigate"
  }
}

interface GetVideosFromMultipleProfileProps {
  settings: Prettify<SettingsContextValue>;
  videoSettings: Prettify<VideoSettings>;
}


interface DownloadVideosProps {
  videoLinks?: string[];
  settings: Prettify<SettingsContextValue>;
  videoSettings: Prettify<VideoSettings>;
  handleSettings: (settings: VideoSettings) => void;
  tableData: IYouTube[];
  loadTableData: (data: IYouTube[], updateSettings?: Record<string,any>) => void;
  setInvalidLinksDL: (data: any) => void;
  setActive: (data: any) => void;
  isProfile?: boolean;
  isYTPlaylist?: boolean;
  ytPlaylistId?: string[];
}


export async function getVideosFromMultipleProfile(
  props: DownloadVideosProps
){

  const {
    settings,
    videoSettings,
    handleSettings,
    tableData,
    loadTableData,
    setInvalidLinksDL,
    setActive,
  } = props

  if(settings.videoLinks?.trim().startsWith('http')){
    const textLinks = settings.videoLinks.trim()
    var videoLinks = textLinks.split('\n')
    const genericLinks = videoLinks.filter((link) => {
      const _ = link.split("?")[0].split(".")
      const ext = _[_.length - 1]
      return !( ext.length <= 2 || ext.length > 4) && link;
    })
    const [video_list, isProfile] = fixOneProfile(videoLinks)
    console.log(video_list, isProfile)

    const ytPlaylistId = videoLinks.map((youtubeLink) => getYouTubeID(youtubeLink.trim(), "list")).filter(v => typeof v === "string") as string[]
    const yt_playlist = ytPlaylistId.map(id => `https://www.youtube.com/playlist?list=${id}`)
    const isYTPlaylist = textLinks.includes("youtube.com/playlist?list=")

    // console.log(isProfile,isYTPlaylist)
    if(genericLinks.length > 0){
      videoLinks = genericLinks
    }
    else if(isProfile || isYTPlaylist){
      const profile_url_list = isProfile ? finalValidLinks(video_list.join("\n")) : yt_playlist
      // console.log("all_playlist", profile_url_list,yt_playlist)

      const resExtractVideoList = await axios.post(
        localhost('/aio-dlp/get_videos_profile'),
        {
          "profile_url_list": [...profile_url_list, ...yt_playlist],
          "limit": videoSettings.limit_download ?? 0,
          "sort_by": videoSettings.download_sortBy ?? "newest",
          // "youtube_video_type": "videos",
          // "tiktok_extract_server": "1",
        },
        addHeaders({"Content-Type":"application/json"})
      )
      if(resExtractVideoList.status === 200){
        videoLinks = resExtractVideoList.data
        console.log("[videoLinks]", videoLinks)
      }
    } else {
      videoLinks = finalValidLinks(textLinks)
    }

    const folderPath = (extractor_key?:string, uploader?:string) => settings.folder_history ? {
      folderpath: settings.folder_history + (
        isProfile
        ? `\\${extractor_key}\\${uploader}`
        : isYTPlaylist
        ? `\\${extractor_key}\\playlist`
        : ""
      )
    } : {}

    var save_as = ""
    if(isProfile) save_as = "profile"
    else if(isYTPlaylist) save_as = "profile"

    if(videoLinks.length > 0){
      class AIODownloader {
        dataDownloadCompleted: any[] = []
        completed = false
        videoLinks = []

        async multipleDownload(videoLinks:string[]){

          const allData = await axios.all(
            videoLinks.map(async (videoLink, i) => {
              // const videoId = getYouTubeID(videoLink)

              return await axios.post(
                localhost('/aio-dlp?url='+(videoLink)),
                {
                  url: videoLink,
                  download: false,
                  save_as: save_as,
                  ...(settings.folder_history ? {
                    folderpath: settings.folder_history
                  } : {}),
                  resolution: videoSettings.resolution,
                  download_type: videoSettings.download_type,
                },
                addHeaders({"Content-Type":"application/json"})
              ).then((res) => {
                if(res.status == 200){
                  // console.log("[Generic]", res, videoLink)
                  const data: IYouTube = res.data
                  const url_dl = data.url_dl ? {url_dl: data.url_dl}
                    : genericLinks.length > 0 || videoLink.includes("&download_with_info_dict=") ? {url_dl: videoLink}
                    : {}

                  const req_dl = data.requested_download as VideoFormat[]
                  const info_dict: IYouTube = {
                    ...res.data,
                    requested_download: req_dl && req_dl.length > 0 && Array.isArray(req_dl)
                      ? req_dl.map((val) => ({
                        ...val, filesize: " ... ", resolution: " ... ", ext: " ... ",
                      }))
                      : [{
                        ext: " ... ",
                        filesize: " ... ",
                        filesize_num: " ... ",
                        resolution: " ... ",
                        url: data.info_dict.webpage_url
                      }],
                    ...url_dl,
                    completed: "progressing"
                  }
                  // this.dataDownloadCompleted.push(info_dict)
                  // this.getAllData()
                  // setTesting(data.output_path ?? data)
                  // loadTableData([...tableData, data])
                  return info_dict
                }
              })
              .catch(err => (err))
            })
          )
          .then((allData) => {
            let invalidLinks: string[] = []
            let validData: IYouTube[] = []
            // console.log("[Douyin and Kuaishou] - allData", allData)
            allData.map((data) => {
              if(data.info_dict){
                validData.push(data)
              } else if(data.config) {
                const url:string = JSON.parse(data.config.data).url
                invalidLinks.push(url)
              }
            })

            const isDownloadAudio = videoSettings.download_as && videoSettings.download_as === "audio"
            if(validData.length > 0){
              // loadTableData([...tableData, ...validData])
              if(isDownloadAudio){
                validData = validData.map((data) => ({
                  ...data,
                  info_dict: {
                    ...data.info_dict,
                    title: data.info_dict.title + " [audio]"
                  }
                }))
              }
              handleSettings({
                videoDownloadedData: [...tableData, ...validData],
                addLinksPopup: false
              })

              // handleSettings({addLinksPopup: false})

              axios.all(
                validData.map(async (data, i) => {
                  const info_dict = data.info_dict
                  const url_dl = data.url_dl
                  const videoLink = (
                    url_dl && url_dl?.includes("&download_with_info_dict=")
                    ? url_dl : info_dict.webpage_url
                  ) as string
                  // const videoId = getYouTubeID(videoLink)
                  return await axios.post(
                    localhost('/aio-dlp?url='+(videoLink)),
                    {
                      url: videoLink,
                      download: true,
                      save_as: save_as,
                      ...(settings.folder_history ? {
                        folderpath: settings.folder_history
                      } : {}),
                      filename: info_dict.title,
                      resolution: videoSettings.resolution,
                      download_type: videoSettings.download_type,
                      ...(isDownloadAudio
                        ? {download_audio: videoSettings?.audio_format ?? "128"}
                        :{}
                      )
                    },
                    addHeaders({"Content-Type":"application/json"})
                  )
                })
              ).then(axios.spread(async (...responses) => {
                // console.log("axios spread", responses)
                let res_data: IYouTube[] = responses.map(val => val.data)
                if(isDownloadAudio){
                  res_data = res_data.map(data => ({
                    ...data,
                    requested_download: data.requested_download?.map(val => ({
                      ...val,
                      file_path: `${val.file_path?.split(`.${val.ext}`)[0]} [audio].${val.ext}`
                    }))
                  }))
                }
                console.log('res_data',res_data)
                axios.all(
                  res_data.map(async (data) => {
                    const req_dl = data.requested_download?.[0] as VideoFormat
                    return await axios.post(localhost('/filemetadata'), {
                      file_path: req_dl.file_path
                    }, headers)
                  })
                ).then(axios.spread(async (...responses) => {
                  const file_metadata: Record<string,any>[] = responses.map(val => val.data.result)

                  const updateData = validData.map((data, i) => {

                    const _data = ({
                      ...data,
                      requested_download: res_data[i].requested_download?.map(val => ({
                        ...val, ...file_metadata[i],
                        // ...(isDownloadAudio && {file_path: `${val.file_path?.split(`.${val.ext}`)[0]} [audio].${val.ext}`})
                      })),
                      completed: "completed",
                    })
                    this.dataDownloadCompleted.push(_data)
                    return _data
                  })
                  // const all_data = this.getAllData().downloadCompleted
                  // console.log('updateData',all_data)
                  loadTableData([...tableData, ...updateData], {addLinksPopup: false})
                }))

                // setTesting([...updateData])
                return res_data
              }))
              .then((data) => {
                if(invalidLinks.length > 0 && data){
                  setInvalidLinksDL(invalidLinks)
                  setActive("invalidLinks");
                }
              })
              .catch(err => console.log("Error Download", err))

            } else {
              if(invalidLinks.length > 0){
                setInvalidLinksDL(invalidLinks)
                setActive("invalidLinks");
              }
            }
            // const all_data = this.getAllData().downloadCompleted
            // loadTableData([...tableData, ...all_data], {addLinksPopup: false})
            return [validData, invalidLinks]
          })
          .catch(err => console.log("Error Data", err))
          // console.log(this.getAllData())
        }
        getAllData(){
          return {
            downloadCompleted: this.dataDownloadCompleted,
            completed: this.completed
          }
        }
      }

      videoLinks = videoLinks.filter(link => link.trim().startsWith("http"))
      let aio_dlp = new AIODownloader()
      aio_dlp.multipleDownload(videoLinks)

      // const download_runtime = arraySplitting(videoLinks, 1)
      // // console.log(download_runtime)
      // let aio_dlp = new AIODownloader()
      // download_runtime.map((videoLinks, i) => {
      //   aio_dlp.multipleDownload(videoLinks)
      // })

      // var timer = setInterval(() => {
      //   var all_data = aio_dlp.getAllData()
      //   const dataDownloadCompleted = all_data.downloadCompleted
      //   console.log("[Final Final]", all_data)
      //   completed = all_data.completed
      //   console.log(dataDownloadCompleted.length === videoLinks.length)
      //   if(dataDownloadCompleted.length === videoLinks.length){
      //     console.log(dataDownloadCompleted, videoLinks)
      //     clearInterval(timer)
      //   }
      // }, 1000)

    }


    // if(videoLinks.length > 0){
    //   function multipleDownload(videoLinks:string[]){

    //     axios.all(
    //       videoLinks.map(async (videoLink, i) => {
    //         // const videoId = getYouTubeID(videoLink)

    //         return await axios.post(
    //           localhost('/aio-dlp?url='+(videoLink)),
    //           {
    //             url: videoLink,
    //             download: false,
    //             save_as: save_as,
    //             ...(settings.folder_history ? {
    //               folderpath: settings.folder_history
    //             } : {}),
    //             resolution: videoSettings.resolution,
    //             download_type: videoSettings.download_type,
    //           },
    //           addHeaders({"Content-Type":"application/json"})
    //         ).then((res) => {
    //           if(res.status == 200){
    //             // console.log("[Generic]", res, videoLink)
    //             const data: IYouTube = res.data
    //             const url_dl = data.url_dl ? {url_dl: data.url_dl}
    //               : genericLinks.length > 0 || videoLink.includes("&download_with_info_dict=") ? {url_dl: videoLink}
    //               : {}

    //             const req_dl = data.requested_download as VideoFormat[]
    //             const info_dict: IYouTube = {
    //               ...res.data,
    //               requested_download: req_dl && req_dl.length > 0 && Array.isArray(req_dl)
    //                 ? req_dl.map((val) => ({
    //                   ...val, filesize: " ... ", resolution: " ... ", ext: " ... ",
    //                 }))
    //                 : [{
    //                   ext: " ... ",
    //                   filesize: " ... ",
    //                   filesize_num: " ... ",
    //                   resolution: " ... ",
    //                   url: data.info_dict.webpage_url
    //                 }],
    //               ...url_dl,
    //               completed: "progressing"
    //             }
    //             // setTesting(data.output_path ?? data)
    //             // loadTableData([...tableData, data])
    //             return info_dict
    //           }
    //         })
    //         .catch(err => (err))
    //       })
    //     )
    //     .then((allData) => {
    //       let invalidLinks: string[] = []
    //       let validData: IYouTube[] = []
    //       console.log("[Douyin and Kuaishou] - allData", allData)
    //       allData.map((data) => {
    //         if(data.info_dict){
    //           validData.push(data)
    //         } else if(data.config) {
    //           const url:string = JSON.parse(data.config.data).url
    //           invalidLinks.push(url)
    //         }
    //       })

    //       const isDownloadAudio = videoSettings.download_as && videoSettings.download_as === "audio"
    //       if(validData.length > 0){
    //         // loadTableData([...tableData, ...validData])
    //         if(isDownloadAudio){
    //           validData = validData.map((data) => ({
    //             ...data,
    //             info_dict: {
    //               ...data.info_dict,
    //               title: data.info_dict.title + " [audio]"
    //             }
    //           }))
    //         }
    //         handleSettings({
    //           videoDownloadedData: [...tableData, ...validData],
    //           addLinksPopup: false
    //         })

    //         // handleSettings({addLinksPopup: false})

    //         axios.all(
    //           validData.map(async (data, i) => {
    //             const info_dict = data.info_dict
    //             const url_dl = data.url_dl
    //             const videoLink = (
    //               url_dl && url_dl?.includes("&download_with_info_dict=")
    //               ? url_dl : info_dict.webpage_url
    //             ) as string
    //             // const videoId = getYouTubeID(videoLink)
    //             return await axios.post(
    //               localhost('/aio-dlp?url='+(videoLink)),
    //               {
    //                 url: videoLink,
    //                 download: true,
    //                 save_as: save_as,
    //                 ...(settings.folder_history ? {
    //                   folderpath: settings.folder_history
    //                 } : {}),
    //                 filename: info_dict.title,
    //                 resolution: videoSettings.resolution,
    //                 download_type: videoSettings.download_type,
    //                 ...(isDownloadAudio
    //                   ? {download_audio: videoSettings?.audio_format ?? "128"}
    //                   :{}
    //                 )
    //               },
    //               addHeaders({"Content-Type":"application/json"})
    //             )
    //           })
    //         ).then(axios.spread(async (...responses) => {
    //           // console.log("axios spread", responses)
    //           let res_data: IYouTube[] = responses.map(val => val.data)
    //           if(isDownloadAudio){
    //             res_data = res_data.map(data => ({
    //               ...data,
    //               requested_download: data.requested_download?.map(val => ({
    //                 ...val,
    //                 file_path: `${val.file_path?.split(`.${val.ext}`)[0]} [audio].${val.ext}`
    //               }))
    //             }))
    //           }
    //           console.log('res_data',res_data)
    //           axios.all(
    //             res_data.map(async (data) => {
    //               const req_dl = data.requested_download?.[0] as VideoFormat
    //               return await axios.post(localhost('/filemetadata'), {
    //                 file_path: req_dl.file_path
    //               }, headers)
    //             })
    //           ).then(axios.spread(async (...responses) => {
    //             const file_metadata: Record<string,any>[] = responses.map(val => val.data.result)

    //             const updateData = validData.map((data, i) => {

    //               return ({
    //                 ...data,
    //                 requested_download: res_data[i].requested_download?.map(val => ({
    //                   ...val, ...file_metadata[i],
    //                   // ...(isDownloadAudio && {file_path: `${val.file_path?.split(`.${val.ext}`)[0]} [audio].${val.ext}`})
    //                 })),
    //                 completed: "completed",
    //               })
    //             })
    //             console.log('updateData',updateData)
    //             loadTableData([...tableData, ...updateData], {addLinksPopup: false})
    //           }))

    //           // setTesting([...updateData])
    //           return res_data
    //         }))
    //         .then((data) => {
    //           if(invalidLinks.length > 0 && data){
    //             setInvalidLinksDL(invalidLinks)
    //             setActive("invalidLinks");
    //           }
    //         })
    //         .catch(err => console.log("Error Download", err))

    //       } else {
    //         if(invalidLinks.length > 0){
    //           setInvalidLinksDL(invalidLinks)
    //           setActive("invalidLinks");
    //         }
    //       }
    //     })
    //     .catch(err => console.log("Error Data", err))
    //   }

    //   videoLinks = videoLinks.filter(link => link.trim().startsWith("http"))
    //   const download_runtime = arraySplitting(videoLinks, 2)
    //   console.log(download_runtime)
    //   for (let i in download_runtime) {
    //     // console.log(download_runtime[i])
    //     multipleDownload(download_runtime[i])
    //   }
    // }
  }
}



// export const downloadVideos = async (props:DownloadVideosProps) => {
//   const {
//     videoLinks,
//     settings,
//     videoSettings,
//     handleSettings,
//     tableData,
//     loadTableData,
//     setInvalidLinksDL,
//     setActive,
//     isProfile,
//     isYTPlaylist,
//     ytPlaylistId
//   } = props

//   const outputPath = (extractor_key?:string, uploader?:string) => settings.folder_history ? {
//     output_path: settings.folder_history + (
//       isProfile
//       ? `\\${extractor_key}\\${uploader}`
//       : isYTPlaylist
//       ? `\\${extractor_key}\\playlist`
//       : ""
//     )
//   } : {}

//   return axios.all(
//     videoLinks.map(async (videoLink, i) => {
//       const videoId = getYouTubeID(videoLink)

//       return await axios.post(
//         localhost('/youtube/dl/'+(videoId ?? (i+1) * currentSimpleDate())),
//         {
//           url: videoLink,
//           ...(settings.folder_history ? {
//             folderpath: settings.folder_history
//           } : {}),
//           resolution: videoSettings.resolution,
//           download_type: videoSettings.download_type,
//         },
//         headers
//       ).then((res) => {
//         if(res.status == 200){
//           const data: IYouTube = res.data
//           const req_dl = data.requested_download as VideoFormat[]
//           const info_dict: IYouTube = {
//             ...res.data,
//             requested_download: req_dl.length > 0
//               ? req_dl.map((val) => ({
//                 ...val, filesize: " ... ", resolution: " ... ", ext: " ... ",
//               }))
//               : [{
//                 ext: " ... ",
//                 filesize: " ... ",
//                 filesize_num: " ... ",
//                 resolution: " ... ",
//                 url: data.info_dict.webpage_url
//               }],
//             completed: "progressing"
//           }
//           // setTesting(data.output_path ?? data)
//           // loadTableData([...tableData, data])
//           return info_dict
//         }
//       })
//       .catch(err => (err))
//     })
//   )
//   .then((allData) => {
//       let invalidLinks: string[] = []
//       let validData: IYouTube[] = []
//       allData.map((data) => {
//         if(data.info_dict){
//           validData.push(data)
//         } else if(data.config) {
//           const url:string = JSON.parse(data.config.data).url
//           invalidLinks.push(url)
//         }
//       })

//       const isDownloadAudio = videoSettings.download_as && videoSettings.download_as === "audio"
//       if(validData.length > 0){
//         // loadTableData([...tableData, ...validData])
//         if(isDownloadAudio){
//           validData = validData.map((data) => ({
//             ...data,
//             info_dict: {
//               ...data.info_dict,
//               title: data.info_dict.title + " [audio]"
//             }
//           }))
//         }
//         handleSettings({
//           videoDownloadedData: [...tableData, ...validData],
//           addLinksPopup: false
//         })
//         // handleSettings({addLinksPopup: false})

//         axios.all(
//           validData.map(async (data, i) => {
//             const info_dict = data.info_dict
//             const videoLink = info_dict.webpage_url as string
//             const videoId = getYouTubeID(videoLink)
//             return await axios.post(
//               localhost('/youtube/dl/'+(videoId ?? (i+1) * currentSimpleDate())),
//               {
//                 url: videoLink,
//                 ...(outputPath(info_dict.extractor_key, info_dict.uploader)),
//                 resolution: videoSettings.resolution,
//                 download_type: videoSettings.download_type,
//                 download: true,
//                 filename: info_dict.title,
//                 ...(isDownloadAudio
//                   ? {
//                     yt_opts: {
//                       format: 'bestaudio/best',
//                       // writethumbnail: true,
//                       postprocessors: [
//                         {
//                           'key': 'FFmpegExtractAudio',
//                           'preferredcodec': 'mp3',
//                           'preferredquality': videoSettings?.audio_format ?? "128",
//                         },
//                       ],
//                     }
//                   }:{}
//                 ),
//               },
//               headers
//             )
//           })
//         ).then(axios.spread(async (...responses) => {
//           // console.log("axios spread", responses)
//           let res_data: IYouTube[] = responses.map(val => val.data)
//           if(isDownloadAudio){
//             res_data = res_data.map(data => ({
//               ...data,
//               requested_download: data.requested_download?.map(val => ({
//                 ...val,
//                 file_path: `${val.file_path?.split(`.${val.ext}`)[0]} [audio].${val.ext}`
//               }))
//             }))
//           }

//           axios.all(
//             res_data.map(async (data) => {
//               const req_dl = data.requested_download?.[0] as VideoFormat
//               return await axios.post(localhost('/filesize'), {
//                 file_path: req_dl.file_path
//               }, headers)
//             })
//           ).then(axios.spread(async (...responses) => {
//             const data_filesize: string[] = responses.map(val => val.data.result)

//             const updateData = validData.map((data, i) => {

//               return ({
//                 ...data,
//                 ...(outputPath(data.info_dict.extractor_key, data.info_dict.uploader)),
//                 requested_download: res_data[i].requested_download?.map(val => ({
//                   ...val, filesize: data_filesize[i],
//                   // ...(isDownloadAudio && {file_path: `${val.file_path?.split(`.${val.ext}`)[0]} [audio].${val.ext}`})
//                 })),
//                 completed: "completed",
//               })
//             })
//             loadTableData([...tableData, ...updateData], {addLinksPopup: false})
//           }))

//           // setTesting([...updateData])
//           return res_data
//         }))
//         .then((data) => {
//           if(invalidLinks.length > 0 && data){
//             setInvalidLinksDL(invalidLinks)
//             setActive("invalidLinks");
//           }
//         })
//         .catch(err => console.log("Error Download", err))
//       } else {
//         if(invalidLinks.length > 0){
//           setInvalidLinksDL(invalidLinks)
//           setActive("invalidLinks");
//         }
//       }
//   })
//   .catch(err => console.log("Error Data", err))
// }

// export const downloadVideos = async (props:DownloadVideosProps) => {
//   const {
//     videoLinks,
//     settings,
//     videoSettings,
//     handleSettings,
//     tableData,
//     loadTableData,
//     setInvalidLinksDL,
//     setActive,
//     isProfile,
//     isYTPlaylist,
//     ytPlaylistId
//   } = props

//   const outputPath = (extractor_key?:string, uploader?:string) => settings.folder_history ? {
//     output_path: settings.folder_history + (
//       isProfile
//       ? `\\${extractor_key}\\${uploader}`
//       : isYTPlaylist
//       ? `\\${extractor_key}\\playlist`
//       : ""
//     )
//   } : {}

//   return axios.all(
//     videoLinks.map(async (videoLink, i) => {
//       const videoId = getYouTubeID(videoLink)

//       return await axios.post(
//         localhost('/youtube/dl/'+(videoId ?? (i+1) * currentSimpleDate())),
//         {
//           url: videoLink,
//           ...(settings.folder_history ? {
//             output_path: settings.folder_history
//           } : {}),
//           resolution: videoSettings.resolution,
//           download_type: videoSettings.download_type,
//           // download: true,
//         },
//         headers
//       ).then((res) => {
//         if(res.status == 200){
//           const data: IYouTube = res.data
//           const req_dl = data.requested_download as VideoFormat[]
//           const info_dict: IYouTube = {
//             ...res.data,
//             requested_download: req_dl.length > 0
//               ? req_dl.map((val) => ({
//                 ...val, filesize: " ... ", resolution: " ... ", ext: " ... ",
//               }))
//               : [{
//                 ext: " ... ",
//                 filesize: " ... ",
//                 filesize_num: " ... ",
//                 resolution: " ... ",
//                 url: data.info_dict.webpage_url
//               }],
//             completed: "progressing"
//           }
//           // setTesting(data.output_path ?? data)
//           // loadTableData([...tableData, data])
//           return info_dict
//         }
//       })
//       .catch(err => (err))
//     })
//   )
//   .then((allData) => {
//       let invalidLinks: string[] = []
//       let validData: IYouTube[] = []
//       allData.map((data) => {
//         if(data.info_dict){
//           validData.push(data)
//         } else if(data.config) {
//           const url:string = JSON.parse(data.config.data).url
//           invalidLinks.push(url)
//         }
//       })

//       const isDownloadAudio = videoSettings.download_as && videoSettings.download_as === "audio"
//       if(validData.length > 0){
//         // loadTableData([...tableData, ...validData])
//         if(isDownloadAudio){
//           validData = validData.map((data) => ({
//             ...data,
//             info_dict: {
//               ...data.info_dict,
//               title: data.info_dict.title + " [audio]"
//             }
//           }))
//         }
//         handleSettings({
//           videoDownloadedData: [...tableData, ...validData],
//           addLinksPopup: false
//         })
//         // handleSettings({addLinksPopup: false})

//         axios.all(
//           validData.map(async (data, i) => {
//             const info_dict = data.info_dict
//             const videoLink = info_dict.webpage_url as string
//             const videoId = getYouTubeID(videoLink)
//             return await axios.post(
//               localhost('/youtube/dl/'+(videoId ?? (i+1) * currentSimpleDate())),
//               {
//                 url: videoLink,
//                 ...(outputPath(info_dict.extractor_key, info_dict.uploader)),
//                 resolution: videoSettings.resolution,
//                 download_type: videoSettings.download_type,
//                 download: true,
//                 filename: info_dict.title,
//                 ...(isDownloadAudio
//                   ? {
//                     yt_opts: {
//                       format: 'bestaudio/best',
//                       // writethumbnail: true,
//                       postprocessors: [
//                         {
//                           'key': 'FFmpegExtractAudio',
//                           'preferredcodec': 'mp3',
//                           'preferredquality': videoSettings?.audio_format ?? "128",
//                         },
//                       ],
//                     }
//                   }:{}
//                 ),
//               },
//               headers
//             )
//           })
//         ).then(axios.spread(async (...responses) => {
//           // console.log("axios spread", responses)
//           let res_data: IYouTube[] = responses.map(val => val.data)
//           if(isDownloadAudio){
//             res_data = res_data.map(data => ({
//               ...data,
//               requested_download: data.requested_download?.map(val => ({
//                 ...val,
//                 file_path: `${val.file_path?.split(`.${val.ext}`)[0]} [audio].${val.ext}`
//               }))
//             }))
//           }

//           axios.all(
//             res_data.map(async (data) => {
//               const req_dl = data.requested_download?.[0] as VideoFormat
//               return await axios.post(localhost('/filesize'), {
//                 file_path: req_dl.file_path
//               }, headers)
//             })
//           ).then(axios.spread(async (...responses) => {
//             const data_filesize: string[] = responses.map(val => val.data.result)

//             const updateData = validData.map((data, i) => {

//               return ({
//                 ...data,
//                 ...(outputPath(data.info_dict.extractor_key, data.info_dict.uploader)),
//                 requested_download: res_data[i].requested_download?.map(val => ({
//                   ...val, filesize: data_filesize[i],
//                   // ...(isDownloadAudio && {file_path: `${val.file_path?.split(`.${val.ext}`)[0]} [audio].${val.ext}`})
//                 })),
//                 completed: "completed",
//               })
//             })
//             loadTableData([...tableData, ...updateData], {addLinksPopup: false})
//           }))

//           // setTesting([...updateData])
//           return res_data
//         }))
//         .then((data) => {
//           if(invalidLinks.length > 0 && data){
//             setInvalidLinksDL(invalidLinks)
//             setActive("invalidLinks");
//           }
//         })
//         .catch(err => console.log("Error Download", err))
//       } else {
//         if(invalidLinks.length > 0){
//           setInvalidLinksDL(invalidLinks)
//           setActive("invalidLinks");
//         }
//       }
//   })
//   .catch(err => console.log("Error Data", err))
// }

function fixOneProfile(videoLinks:string[]): [string[], boolean] {
  const video_list:string[] = []
  const isProfile:boolean[] = []
  videoLinks.map(link => {
    const match = (pattern:string|RegExp) => link.match(new RegExp(pattern))
    const isGeneric = link.includes("&download_with_info_dict=")

    if(match('\.instagram\.com') && !isGeneric){
      if(!(["p","reel","reels"].some(v => v===link.split("instagram.com/")[1].split('/')[0]))){
        video_list.push(link)
        isProfile.push(true)
      }
    }
    else if(match('\.tiktok\.com') && !isGeneric){
      if(!link.includes("/video/")){
        video_list.push(link)
        isProfile.push(true)
      }
    }
    else if(match('\.youtube\.com') || match('\.youtu\.be')){
      if(match("youtube\.com\/channel") || match("youtube\.com\/@")){
        video_list.push(link)
        isProfile.push(true)
      }
    }
    else if(match('\.facebook\.com')){
      if(!(["/videos/","/watch?v=","/watch/?v="].some((v) => link.includes(v)))){
        video_list.push(link)
        isProfile.push(true)
      }
    }
    else if(match('\.kuaishou\.com/profile/') && !isGeneric){
      video_list.push(link)
      isProfile.push(true)
    }
    else if((match('\.douyin\.com/user/') || match('\.douyin\.com/share/user/')) && !isGeneric){
      video_list.push(link)
      isProfile.push(true)
    }
  })
  return [video_list, isProfile.length > 0]
}

function finalValidLinks(textLinks:string) {
  const allLinks = textLinks.split('\n')

  return allLinks.map((link) => {
    const match = (pattern:string|RegExp) => link.match(new RegExp(pattern))
    var url:string;

    const isGeneric = link.includes("&download_with_info_dict=")

    if(match('\.youtube\.com') || match('\.youtu\.be') && !isGeneric){
      if (link.includes('/@') || link.includes('/channel')) {
        const channelId = link.split('youtube.com/')[1]
        url = `https://www.youtube.com/${channelId}`
      } else if(link.includes('/playlist?list=')) {
        url = `https://www.youtube.com/playlist?list=${link.split('/playlist?list=')[1]}`
      } else {
        const videoId = match('\/shorts\/')
            ? link.split('/shorts/')[1]
            : match('\/embed\/')
            ? link.split('/embed/')[1]
            : link.split('/watch?v=')[1];

        url = `https://www.youtube.com/watch?v=${videoId}`
      }
    }
    else if(match('\.facebook\.com') && !isGeneric){
      const videoIdOrProfile = link.split('facebook.com/')[1]
      url = `https://web.facebook.com/${videoIdOrProfile}`
    }
    else if(match('\.instagram\.com') && !isGeneric){
      const videoIdOrProfile = link.replace(/reels/g, 'reel').split('instagram.com/')[1]
      url = `https://www.instagram.com/${videoIdOrProfile}`
    }
    else if(match('\.tiktok\.com')){
      const videoIdOrProfile = link.split('tiktok.com/')[1]
      url = `https://www.tiktok.com/${videoIdOrProfile}`
    }
    else if(match('\.kuaishou\.com') && !isGeneric){
      if (link.includes('/profile/')) {
        const userId = link.split('/profile/')[1]
        url = `https://www.kuaishou.com/profile/${userId}`
      } else if (link.includes("v.kuaishou.com")) {
        const videoId = link.split('kuaishou.com/')[1]
        url = `https://v.kuaishou.com/${videoId}`
      } else {
        const videoId = link.split('/short-video/')[1]
        url = `https://www.kuaishou.com/short-video/${videoId}`
      }
    }
    else if(match('\.douyin\.com') && !isGeneric){
      if (link.includes('/user/') || link.includes("share/user/")) {
        const userId = link.split('/user/')[1]
        url = `https://www.douyin.com/user/${userId}`
      } else if (link.includes("v.douyin.com")) {
        const videoId = link.split('douyin.com/')[1]
        url = `https://v.douyin.com/${videoId}`
      } else {
        const videoId = link.split('/video/')[1]
        url = `https://www.douyin.com/video/${videoId}`
      }
    } else {
      url = link
    }

    return url.trim()
  })

  // youtubeLinks.map((youtubeLink) => getYouTubeID(youtubeLink.trim())).filter(v => typeof v === "string")

}

function currentSimpleDate(){
  const date = new Date()
  return Number(`${date.getFullYear()}${date.getMonth()}${date.getDate()}`)
}

function youtube_validate(url:string|any): boolean {
  var regExp = /^(?:https?:\/\/)?(?:www\.)?(youtube\.com|youtu\.be)(?:\S+)?$/;
  return url.match(regExp) && url.match(regExp).length > 0;
}

export function getYouTubeID(url:string, re:string='v'){
  var reg = new RegExp(`[&?]${re}=([a-z0-9_]+)`,"i");
  var match = reg.exec(url);

  if (match && match[1].length > 0 && youtube_validate(url)){
      return match[1];
  }else{
      return;
  }

}

export function formatDuration(second:number) {
  return new Date(second * 1000).toISOString().slice(second >= 3600 ? 11 : 14, 19)
}

function arraySplitting(array: any[], chunk:number){
  var arr = array;
  var arr_length = arr.length
  var newArr = []
  var lastArr = []
  if((arr.length % chunk) === 0){
    newArr = [...arr]
  } else {
    let mode = arr_length % chunk
    newArr = arr.slice(0, -(mode))
    lastArr = arr.slice(arr_length - mode, arr_length)
  }
  var arr_splitting = [...Array(newArr.length / chunk).keys()].map((_) => {
    return arr.splice(0, chunk)
  })
  arr_splitting = lastArr.length > 0
      ? [...arr_splitting, lastArr]
      : arr_splitting

  return arr_splitting
}

  // constructor(){
  //   this.cursor = "";
  //   this.hasMore = true;
  //   this.data = [];
  // }




