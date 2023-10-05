import { UnstyledButton, Avatar, Text, createStyles, rem, Card, Group, SimpleGrid, Box, Stack, Flex, Progress, useMantineTheme, Button, TextInput, ActionIcon, Tooltip, Center, Checkbox, Tabs, RangeSlider, Slider, ScrollArea, Textarea } from '@mantine/core';
import { headers, localhost, staticIcons } from '../configs';
import { ThemeSwitch, toggleScheme } from '../../component/mantine/helpers/helpers';
import { colorSchemes } from '../variables';
import { SettingsContextType, SettingsContextValue } from '../../hooks/useSettings';
import { VideoEmbed, VideoSettings, formatDuration, mantineDefaultProps, progressBar, useStylesToolbarCustomAction } from './DLComponent';
import { useEffect, useState } from 'react';
import AdvDataTable from '../../component/mantine/Table/AdvDataTable';
import { matchesMedia } from '../../component/mantine/hooks';
import { MRT_ColumnDef, MRT_RowSelectionState, MRT_TableInstance } from 'mantine-react-table';
import { Prettify } from '../../component/mantine/helpers/HelperType';
import axios from 'axios';
import { Icon3dRotate, IconAdjustmentsStar, IconCircleDotFilled, IconClockHour3, IconCrop, IconCut, IconFileDescription, IconFolder, IconFolderCog, IconHeart, IconHeartBroken, IconLayersIntersect2, IconMovie, IconPhoto, IconPlayerPlayFilled, IconRefresh, IconTransformFilled, IconTrash } from '@tabler/icons-react';
import { ActionIconLoader, ButtonLoader } from '../../component/mantine/loader/ButtonLoader';
import { dialog } from '../../configs/electron/dialog';
import MySelect from '../../component/mantine/Select/Select';
import { isNumber, toCapitalized } from '../../utils/utils';

interface ConvertComponentProps extends SettingsContextType {
  handleSettings: (updateSettings:Prettify<SettingsContextValue>, saveLocal?:boolean) => void;
  videoSettings: VideoSettings;
  handleVideoSettings: (updateSettings:Prettify<VideoSettings>) => void;
  localSettings: Prettify<SettingsContextValue>,
  handleLocalSettings: (updateSettings:Prettify<SettingsContextValue>) => void;
}

interface IFileMetaDataProps extends Record<string, any> {
  duration: number;
  ext: string;
  filename: string;
  filename_uri: string;
  filesize: string;
  filesize_num: number;
  folder_path: string;
  height: number;
  resolution: string;
  title: string;
  width: number;
  bit_rate: string;
  frame_rate: string;
  selected: boolean;
  completed: string;
}

export type IFileMetaData = Prettify<IFileMetaDataProps>

export const ConvertComponent = ({
  settings,
  setSettings,
  handleSettings,
  videoSettings,
  handleVideoSettings,
  localSettings,
  handleLocalSettings,
}: ConvertComponentProps) => {
  const [active, setActive] = useState<any|null>(null);

  const isMobileDevice = matchesMedia(480, "max");
  const largerThanSM = matchesMedia(767, "max");

  const [stateHelper, setStateHelper] = useState<any>(null);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [progressNum, setProgressNum] = useState<number>(0);

  const tableConvertData: IFileMetaData[] = localSettings?.videoConvertData ?? []
  const tableData: IFileMetaData[] = settings?.videoConvertData ?? (
    tableConvertData.length > 0
    ? tableConvertData.map((data) => ({...data, selected: false}))
    : []
  )

  const columns: MRT_ColumnDef<IFileMetaData>[] = [
    {
      id: 'title',
      header: 'File Name',
      accessorKey: 'title',
      Cell: ({ cell }) => {
        const info_dict = cell.row.original

        const duration = info_dict.duration
        const videoDuration = new Date(duration * 1000).toISOString().slice(duration >= 3600 ? 11 : 14, 19)

        return (
          <Flex gap={8}>
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
                  minWidth: 50,
                  minHeight: 50,
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
                    width: "30px",
                    height: "30px !important",
                    verticalAlign: "middle",
                    top: "20%",
                    filter: "brightness(0.8)",
                    // boxShadow: "rgb(24, 26, 27) 0px 0px 10px 0px",
                    cursor: "pointer"
                  },
                  '&:hover img, &:hover video': {
                    filter: "brightness(0.5)",
                  },
                }}
              >
                <div className='player'
                  onClick={() => {
                    info_dict.filename &&
                    axios.post(localhost('/openfile'), {
                      file_path: info_dict.filename
                    }, headers)
                    .then((res) => {
                      return res.data
                    })
                    .catch((err) => console.log(err))
                  }}
                >
                  <div className='player-icon'><IconPlayerPlayFilled /></div>
                </div>
                {
                  <img src={staticIcons('mp4-file.png')} />
                }
              </Box>
            </Flex>
            {/* <img src={`https://i.ytimg.com/vi/${data.info_dict.id}/default.jpg`} /> */}
            <Stack spacing={"md"} w={"100%"}>
              {/* <Input value={data.info_dict.thumbnail} /> */}
              <Text fz={13}
                onContextMenu={(e) => {
                  e.preventDefault(); // prevent the default behaviour when right clicked
                  // setTesting({test: "Right Click"});
                }}
              >{info_dict.title}</Text>
              { videoSettings?.onConverting &&
                <Progress
                  size="sm" bg={scheme(colorSchemes.defaultBGColor)}
                  value={info_dict.completed === "progressing" ? progressNum : 100}
                  // value={progressNum}
                  color={info_dict.completed === "uncompleted" ? "gray" : "green"}
                  animate={
                    // rowIndex === iDownloading &&
                    info_dict.completed === "progressing"
                  }
                />
              }
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
                  <Text span fz={12.5} sx={{lineHeight:0}}>{info_dict.filesize}</Text>
                </Flex>
                <Flex align={"center"} justify={"center"} gap={4}>
                  <IconPhoto size={15} />
                  <Text span fz={12.5} sx={{lineHeight:0}}>
                    {(info_dict.resolution ?? "N/A")}
                  </Text>
                </Flex>
                <Flex align={"center"} justify={"center"} gap={4}>
                  <IconMovie size={15} />
                  <Text span fz={12.5} sx={{lineHeight:0}}>{info_dict.ext.toUpperCase()}</Text>
                </Flex>
                <Flex align={"center"} justify={"center"} gap={4}>
                  <Text span fz={12.5} sx={{lineHeight:0}}>{`Frame rate: ${info_dict.frame_rate}FPS`}</Text>
                </Flex>
              </Flex>
            </Stack>
          </Flex>
        )
      },
    },
    {
      id: 'action',
      header: '',
      accessorKey: 'folder_path',
      size: 80,
      enableColumnActions: false,
      enableColumnOrdering: false,
      enableSorting: false,
      enableEditing: false,
      Cell: ({ cell }) => {
        const body = {
          file_path: cell.row.original.folder_path
        }

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
  ]

  const theme = useMantineTheme();
  const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color)

  useEffect(() => {

    progressBar(setProgressNum);
  },[])

  const { classes } = useStylesToolbarCustomAction()

  const ToolbarCustomAction = (table: MRT_TableInstance) => {
    return (
      <Stack sx={({
        width: "100%",
      })}>
        <Flex gap={0} justify={"space-between"}
          sx={({
            backgroundColor: "rgb(40, 49, 66)",
            border: "1px solid #1c232f",
            width: "100%",
          })}
        >
          <Flex gap={0}>
            {
              [
                {label: "Delete", icon: IconTrash, color: "#F03E3E", tooltip: "Remove selected files from the list",
                  disable: active !== "enableDeleteButton",
                  onClick: () => {
                    // console.log(tableData)
                    if(tableData.length > 0){
                      const deleteData = tableData.filter(data => data.selected !== true)
                      handleSettings({videoConvertData: deleteData})
                      table.resetRowSelection(true)
                      setActive(false)
                    }
                  },
                },
                {label: "Edit", icon: IconCut, color: "green",
                  tooltip: "Edit selected items from the list",
                  disable: active !== "enableDeleteButton",
                  onClick: () => {
                    if(tableData.length > 0){
                      const data_selected = tableData.filter(data => data.selected === true)
                      const file_path_list_selected = data_selected.map(data => data.filename)

                      const useSettingsContext = {
                        settings,
                        handleSettings,
                        localSettings,
                        handleLocalSettings,
                      }
                      handleVideoSettings({
                        filePaths:file_path_list_selected.join('\n'),
                        modal: {
                          title: "Edit Video",
                          isOpen: true,
                          size: 880,
                          content: (
                            <ActionsVideoConverter
                              {...useSettingsContext}
                              renderContent={ (settings, editorSettings) =>
                                <Group mt={'md'} position={'apart'}>
                                  <Button
                                    onClick={() => {
                                      handleSettings({videoConvertData: tableData.map(data => ({...data, selected: false}))})
                                      handleVideoSettings({modal: {isOpen: false}})
                                    }}
                                    variant="subtle"
                                    >
                                    Close
                                  </Button>
                                  <ButtonLoader
                                    variant="filled"
                                    loaderProps={{
                                      color: "#ffffff"
                                    }}
                                    callback={{
                                      beforeSend(event) {
                                        event.preventDefault();
                                      },
                                      success(event) {
                                        const configEditorSettings = (key:string,dataKey:string,defaultValue?:Record<string,any>) => editorSettings?.[key] ? {[dataKey]:editorSettings?.[key]} : defaultValue || {}

                                        const dfFrameRate = settings.frameRate && settings.frameRate !== "0" ? {frame_rate:settings.frameRate} : {}

                                        const configCMD = (key:string,cb:(settingsKey:any) => string[]) =>
                                        settings[key] ? cb(settings[key]) : []

                                        let convert_to = settings.convert_to
                                        let gpu = settings.gpu
                                        let convert_cmd = ["-c:v", gpu ? "h264_nvenc" : "libx264"]

                                        const isIOS = convert_to?.includes('iPhone')||convert_to?.includes('iPad')
                                        if(convert_to?.includes("HEVC")){
                                          convert_to = settings.convert_to?.split(' ')[1]
                                          convert_cmd = ["-c:v", gpu?"hevc_nvenc":"libx265","-tag:v","hvc1"]
                                        } else if(isIOS){
                                          convert_to = "mp4"
                                          convert_cmd = ["-c:v", gpu?"hevc_nvenc":"libx265","-crf","28","-b:a","128k","-tag:v","hvc1"]
                                        } else if(convert_to?.includes('Android')){
                                          convert_to = "mp4"
                                          convert_cmd = ["-c:v", gpu?"h264_nvenc":"libx264","-crf","23","-b:a","128k"]
                                        }

                                        let filter_cmd = []
                                        if (gpu){
                                        } else {
                                          const filter_complex = (val?:string,speed="1.0") => ['-filter_complex',`"[0:v]${val?val+",":""}setpts=PTS/${speed};[0:a]atempo=${speed}"`]
                                          filter_cmd = filter_complex()
                                        }

                                        const preset = gpu ? ['-preset', 'p4','-tune','hq'] : ['-preset', 'superfast']
                                        const dfConvert = () => [
                                          ...convert_cmd,
                                          ...preset,
                                          '-qmin', '0',
                                          ...configCMD("frameRate",(val)=> val !== "0" ? ["-r",`${val}`] : []),
                                          '-g', '250',
                                          '-bf', '3',
                                          '-b_ref_mode', 'middle',
                                          '-temporal-aq', '1',
                                          '-rc-lookahead', '20',
                                          '-i_qfactor', '0.75',
                                          '-b_qfactor', '1.1'
                                        ]

                                        let bodyData = {
                                          file_list: file_path_list_selected,
                                          convert_to: convert_to?.toLowerCase(),
                                          gpu: settings.gpu,
                                          cmd: [
                                            ...["-c:a", isIOS ? "eac3" : "copy"],
                                            ...dfConvert(),
                                          ],
                                          for_loop: false,
                                        }

                                        handleVideoSettings({onConverting: true})
                                        handleSettings({
                                          videoConvertData: tableData.filter(data => data.selected === true)
                                          .map(val => ({...val,completed:"progressing"}))
                                        })
                                        if(settings.editorActionButton === "Convert"){
                                          axios.post(localhost('/convert_video'), bodyData, headers)
                                          .then(async (res) => {
                                            const data = await res.data
                                            // console.log(res, data)
                                            handleSettings({
                                              videoConvertData: (data.result as IFileMetaData[]).map(val => ({...val,completed:"completed"}))
                                            })
                                          })
                                          .catch(err => console.log(err))
                                        }
                                        else if(settings.editorActionButton === "Cut"){
                                          if (editorSettings.isPerSecond){
                                            axios.all(
                                              file_path_list_selected.map(async (file) => {
                                                const data = {
                                                  file_path: file,
                                                  second_split: editorSettings.cutPerSecond,
                                                  gpu: settings.gpu,
                                                  cpu: settings.cpuUsing,
                                                  // localhost: "",
                                                }

                                                return axios.post(localhost('/split_video_args_per_second'), data, headers)
                                                .then(async (res) => {
                                                  const data = await res.data
                                                  return data
                                                })
                                                .catch(err => console.log(err))
                                              })
                                            )
                                            .then(axios.spread(async (...responses) => {
                                              // type ResDATA = {}
                                              const tableData: IFileMetaData[] = []
                                              let res_data = responses.filter(data => data.result)
                                              res_data.map((data) => data.result)
                                              .map((data) => {
                                                [...data].forEach(fileData => tableData.push(fileData))
                                                return data
                                              })

                                              if(res_data.length > 0){
                                                handleSettings({
                                                  videoConvertData: (tableData as IFileMetaData[]).map(val => ({...val,completed:"completed"}))
                                                })
                                              }
                                              // console.log(res_data, tableData)
                                            }))
                                          } else {
                                            const data = {
                                              file_list: file_path_list_selected,
                                              second_from: editorSettings.cuttingTime[0],
                                              second_to: editorSettings.cuttingTime[1],
                                              ...configEditorSettings("cutRenderTo","convert_to"),
                                              ...configEditorSettings("output_folder","cutChangeFolder"),
                                              ...(settings.frameRate && settings.frameRate !== "0" && {
                                                args_after:[
                                                  "-c:a","copy",
                                                  "-r", settings.frameRate
                                                ]
                                              }),
                                              gpu: settings.gpu,
                                              // output_folder: "",
                                              cpu: settings.cpuUsing,
                                              // localhost: "",
                                            }
                                            axios.post(localhost('/split_video_args'), data, headers)
                                            .then(async (res) => {
                                              const data = await res.data
                                              // return data
                                              handleSettings({
                                                videoConvertData: (data.result as IFileMetaData[]).map(val => ({...val,completed:"completed"}))
                                              })
                                            })
                                            .catch(err => console.log(err))
                                          }
                                        }
                                        else if(settings.editorActionButton === "Merge"){
                                          const isSameResolution = data_selected.every(data => data.width === data_selected[0].width && data.frame_rate === data_selected[0].frame_rate)
                                          const data = {
                                            file_list: file_path_list_selected,
                                            isSameResolution,
                                            // ...(editorSettings.mergeRenderTo && {convert_to:editorSettings.mergeRenderTo}),
                                            // ...(editorSettings.mergeChangeFilename && {file_name:editorSettings.mergeChangeFilename}),
                                            // ...(editorSettings.mergeChangeFolder && {output_folder:editorSettings.mergeChangeFolder}),
                                            ...configEditorSettings("mergeRenderTo","convert_to"),
                                            ...configEditorSettings("mergeChangeFolder","output_folder"),
                                            ...configEditorSettings("mergeChangeFilename","file_name"),
                                            ...dfFrameRate,
                                            gpu: settings.gpu,
                                            cpu: settings.cpuUsing,
                                            // localhost: "",
                                          }
                                          console.log(data)
                                          axios.post(localhost('/merge_video'), data, headers)
                                          .then(async (res) => {
                                            const data = await res.data
                                            console.log(data)
                                            handleSettings({
                                              videoConvertData: ([data.result] as IFileMetaData[]).map(val => ({...val,completed:"completed"}))
                                            })
                                          })
                                          .catch(err => console.log(err))
                                        }
                                      },
                                    }}
                                    >
                                    { settings.editorActionButton }
                                  </ButtonLoader>
                                </Group>
                              }
                            />
                          )
                        },
                      })
                      table.resetRowSelection(true)
                      setActive(false)
                    }
                  },
                },
              ].map((item) => {

                return (
                  <Button key={item.label} title={item.tooltip}
                    className={classes.buttonAction} h={60} w={60} p={0}
                    onClick={item.onClick}
                    disabled={item.disable}
                  >
                    <item.icon color={item.color} size={30} stroke={1.6}/>
                    <Text span fz={12}>{item.label}</Text>
                  </Button>
                )
              })
            }
          </Flex>
          <Flex gap={0} align={"center"}>
            <ActionIconLoader title={"load files from folder that selected and show on table"}
              icon={<IconRefresh size={20} stroke={2}/>}
              loaderProps={{
                color: "#ffffff"
              }}
              timeout={500}
              callback={{
                beforeSend(e) {e.preventDefault()},
                success() {
                  videoSettings?.selectFolderPath &&
                  axios.post(localhost("/getvidedata"),
                    {folder_path: videoSettings?.selectFolderPath}, headers
                  ).then(res => {
                    const data = res.data;
                    if(res.status === 200){
                      handleVideoSettings({onConverting: false})
                      handleSettings({videoConvertData: data.result})
                    }
                  }).catch(err => console.log(err))
                },
              }}
            />
            <TextInput
              title='click the icon to select folder path'
              placeholder='C:\path\ . . .'
              px={10}
              sx={{
                input:{fontSize: 12}
              }}
              value={videoSettings?.selectFolderPath ?? ""}
              readOnly
              rightSection={
                <ActionIcon
                  // variant="filled"
                  onClick={ () => {
                    dialog({
                      callbackName: "showOpenDialog",
                      callback: (result) => {
                        if (result.canceled === false && result.filePaths.length > 0){
                          axios.post(localhost("/getvidedata"),
                            {folder_path: result.filePaths[0]}, headers
                          ).then(res => {
                            const data = res.data;
                            if(res.status === 200){
                              handleVideoSettings({selectFolderPath: result.filePaths[0], onConverting: false})
                              handleSettings({videoConvertData: data.result})
                            }
                          }).catch(err => console.log(err))

                        }
                      },
                      error: (err) => console.log(err),
                    })
                  }}
                >
                  <IconFolderCog color="#47d362" />
                </ActionIcon>
              }
            />
          </Flex>
        </Flex>
      </Stack>
    )
  }


  return(
    <Box>
      <Stack>
        <AdvDataTable
          columns={columns}
          data={tableData}
          enableFullScreenToggle={false}
          displayColumnDefOptions={{
            'mrt-row-select': {
              size: 40,
            },
          }}
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
          {...mantineDefaultProps(scheme, theme) as any}
          renderTopToolbarCustomActions={({table}) => {
            return (
              ToolbarCustomAction(table)
            )
          }}
          mantineSelectAllCheckboxProps={({table}) => ({
            title: "Select All",
            color: 'green',
            onClick: () => {
              if(tableData.length > 0){
                const updateTableData = tableData.map((data) => ({...data, selected: !table.getIsAllRowsSelected()}))
                handleSettings({videoConvertData: updateTableData})

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
              const rowData = row.original as IFileMetaData
              const updateData = tableData.map((data,i) => i !== row.index ? data : { ...data, selected: !rowData.selected })
              const isSomeSelected = updateData.some(data => data.selected === true)

              if(isSomeSelected){
                setActive("enableDeleteButton")
                handleSettings({videoConvertData: updateData, updateData, isSomeSelected})
                // handleLocalSettings({})
              } else {
                setActive(false)
                handleSettings({videoConvertData: updateData, updateData, isSomeSelected})
              }
            },
            selected: rowSelection[row.id],
          })}
        />
      </Stack>
    </Box>
  )
}

interface ConvertVideoByArgs {
  file_list: string[],
  convert_to: string,
  suffix_file?: string,
  args_before: string[],
  args_after: string[],
}

export const convertVideoByArgs = ({
  file_list,
  convert_to,
  suffix_file,
  args_before,
  args_after,
}: Prettify<ConvertVideoByArgs>) => {

  // const argsBefore = gup ? [] :

  const data = {
    file_list,
    convert_to,
    suffix_file,
    args_before,
    args_after,
  }

  return axios.post(localhost('/convert_video_args'), data)
}

const videoConverterData = [
  { title: 'MP4', icon: "mp4-file.png", color: 'violet' },
  { title: 'MOV', icon: "mov-file.png", color: 'indigo' },
  { title: 'WMV', icon: "wmv-file.png", color: 'blue' },
  { title: 'AVI', icon: "avi-file.png", color: 'green' },
  { title: 'FLV', icon: "flv-file.png", color: 'teal' },
  { title: 'MKV', icon: "mkv-file.png", color: 'cyan' },
  { title: 'HEVC MP4', icon: "hevc-mp4-file.png", color: 'pink' },
  { title: 'HEVC MKV', icon: "hevc-mkv-file.png", color: 'red' },
  { title: 'iPhone/iPod', icon: "iphone.png", color: 'teal' },
  { title: 'iPad', icon: "ipad.png", color: 'cyan' },
  { title: 'Android Phone', icon: "android-phone.png", color: 'pink' },
  { title: 'Android Tablet', icon: "android-tablet.png", color: 'pink' },
];

const useStylesCard = createStyles((theme) => {
  const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color)
  return ({
    card: {
      backgroundColor: "transparent",
    },

    title: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      fontWeight: 700,
    },

    item: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      borderRadius: theme.radius.md,
      height: rem(130),
      backgroundColor: scheme(colorSchemes.defaultBGColor),
      transition: 'box-shadow 150ms ease, transform 100ms ease',

      '&:hover': {
        backgroundColor: scheme(colorSchemes.sectionHoverBGColor),
        border:`1px solid ${scheme(colorSchemes.borderColor)}`,
        // boxShadow: theme.shadows.md,
        // transform: 'scale(1.05)',
      },
    },
    itemActive: {
      backgroundColor: scheme(colorSchemes.sectionHoverBGColor),
      border:`1px solid ${scheme(colorSchemes.borderColor)}`,
      // boxShadow: theme.shadows.md,
      // transform: 'scale(1.05)',
    }
  })
});

interface VideoConverterSettings extends Record<string,any> {
  convert_to?: string;
  frameRate?: string;
  gpu?: boolean;
  customFrameRate?: boolean;
  editorActionButton?: string;
  cpu?: string;
  cpuUsing?: string;
}

interface ActionsVideoConverterProps {
  renderContent?: (stateSettings:Prettify<VideoConverterSettings>, cutSettings:Prettify<CutVideoSettingProps>) => React.ReactNode;
  videoSettings?: Prettify<VideoSettings>;
  settings?: Prettify<SettingsContextValue & VideoConverterSettings>;
  handleSettings?: (settings: Prettify<SettingsContextValue>, saveLocal?:boolean) => void;
  localSettings?: Prettify<SettingsContextValue & VideoConverterSettings>;
  handleLocalSettings?: (settings: Prettify<SettingsContextValue & VideoConverterSettings>) => void;
}

interface CutVideoSettingProps extends Record<string, any> {
  cuttingTime: [number,number];
  cutPerSecond: number;
  isPerSecond: boolean;
  mergeChangeFolder?: string;
  mergeChangeFilename?: string;
  mergeRenderTo?: string;
}

export function ActionsVideoConverter(props?: Prettify<ActionsVideoConverterProps>) {
  const { classes, theme, cx } = useStylesCard();
  const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color)

  let tableData = (props?.settings?.videoConvertData as IFileMetaData[]).filter(video => video.selected === true)
  const isMultiSelected = tableData.length > 1
  const fileSelected = !isMultiSelected ? tableData[0] : Array(...tableData).sort((a, b) => (a.duration > b.duration ? 1 : -1))[0]
  const duration = fileSelected.duration
  const defaultDuration = duration > 20 ? (duration > 60 ? 60 : 30) : 10

  const settings = props?.settings;
  const localSettings = props?.localSettings;

  const [stateSettings, setStateSettings] = useState<Prettify<VideoConverterSettings>>({
    convert_to: settings?.convert_to ?? videoConverterData[0].title,
    frameRate: settings?.frameRate ?? "0",
    gpu: localSettings?.gpu ?? false,
    customFrameRate: settings?.customFrameRate ?? false,
    editorActionButton: localSettings?.editorActionButton ?? "Convert",
    cpu: settings?.cpu,
    cpuUsing: localSettings?.cpuUsing ?? (settings?.cpu && Number(settings?.cpu) > 6 ? String(Number(settings.cpu) - 2) : settings?.cpu),
  });
  const handleStateSettings = (updateSettings: Record<string,any>) => {
    setStateSettings({...stateSettings, ...updateSettings})
  }
  const [value, setValue] = useState<[number,number]>([0,60]);
  const [endValue, setEndValue] = useState([0,60]);
  const [editorSettings, setEditorSettings] = useState<CutVideoSettingProps>({
    cuttingTime: [0, defaultDuration],
    cutPerSecond : defaultDuration,
    isPerSecond: false,
  });
  const handleEditorSettings = (updateSettings: Record<string,any>) => {
    setEditorSettings({...editorSettings, ...updateSettings})
  }

  useEffect(() => {
    props?.handleSettings?.({ ...stateSettings })
    props?.handleLocalSettings?.({gpu: stateSettings.gpu, cpuUsing: stateSettings.cpuUsing, editorActionButton: stateSettings.editorActionButton})
  },[stateSettings])

  // useEffect(() => {
  //   const arr = Array(...tableData).sort((a, b) => (a.duration > b.duration ? 1 : -1))
  //   console.log(arr)
  // },[])


  const items = videoConverterData.map((item, i) => (
    <UnstyledButton key={item.title}
      className={cx(classes.item, { [classes.itemActive]: stateSettings.convert_to === item.title })}
      onClick={(e) => {
        e.preventDefault();
        handleStateSettings({convert_to: item.title })
      }}
    >
      <Avatar size="xl" src={staticIcons(item.icon)} />
      <Text size="xs" mt={7}>
        {item.title}
      </Text>
    </UnstyledButton>
  ));

  return (
    <Card className={classes.card} p={0}>
      <Box sx={{
        paddingBottom: 16,
        marginBottom: 16,
        borderBottom: `1px solid ${scheme(colorSchemes.borderColorTr("30%"))}`,
      }}>
        <Group position="apart">
          <Text className={classes.title}></Text>
          {/* <Anchor size="xs" color="dimmed" sx={{ lineHeight: 1 }}>
            + 21 other services
          </Anchor> */}
          <Flex align={"center"} gap={10}>
            <div title={`Support only NVIDIA GPU acceleration`}>
            <Checkbox label={`Enable GUP`} labelPosition='right'
              size="sm"
              checked={stateSettings.gpu}
              onChange={() =>
                handleStateSettings({gpu: !stateSettings.gpu})
              }
              sx={{
                '& .mantine-Checkbox-body > .mantine-Checkbox-inner': {
                  '& .mantine-Checkbox-input:checked': {
                    borderColor: "#2f9e44",
                  },
                  // '& .mantine-Checkbox-input:checked+.___ref-icon': {
                  //   color: "#47d362",
                  // }
                },
              }}
            />
            </div>
            <MySelect
              title={`Select CPU (Threads ${stateSettings.cpu})`}
              placeholder={"CPU (Threads) . . ."}
              value={stateSettings?.cpuUsing}
              // onChange={setVideoResolution}
              onChange={(e) => { handleStateSettings({ cpuUsing: e }) }}
              data={
                [...Array(Number(stateSettings.cpu)).keys()]
                .map((val) => ({value: String(val+1), label: `CPU: ${val+1} Threads`}))
              }
              w={160}
              maxDropdownHeight={200}
              radius="md"
            />
            { stateSettings?.customFrameRate ?
              <TextInput
                placeholder={"enter frame rate"}
                value={stateSettings?.frameRate ? stateSettings?.frameRate: undefined}
                onChange={(e) => {
                  const val = e.currentTarget.value
                  handleStateSettings({ frameRate: (val && val !== "0" && isNumber(val)) ? val : "0" })
                }}
                w={200}
              />
              :
              <MySelect
                title={"select frame rate"}
                placeholder={"Frame Rate"}
                value={stateSettings?.frameRate}
                // onChange={setVideoResolution}
                onChange={(e) => { handleStateSettings({ frameRate: e }) }}
                data={
                  ["0", "24", "25", "30", "50", "60"]
                  .map((val,i) => ({value: val, label: i === 0 ? "select frame rate" : toCapitalized(`${val}.00 frames/second`)}))
                }
                w={200}
                maxDropdownHeight={200}
                radius="md"
              />
            }
            <ActionIcon
              title='custom frame rate'
              variant='outline'
              color={stateSettings?.customFrameRate ? "green":"gray"}
              onClick={() => handleStateSettings({customFrameRate: !stateSettings?.customFrameRate})}
            ><IconCircleDotFilled /></ActionIcon>
          </Flex>
        </Group>
      </Box>
      <Tabs color="teal" defaultValue={localSettings?.editorActionButton ? localSettings?.editorActionButton.toLowerCase() : "convert"} >
        <Tabs.List position='apart' sx={{
          gap: 5,
          borderColor: scheme(colorSchemes.borderColorTr("30%")),
          '& > button': {
            backgroundColor: scheme(colorSchemes.defaultBGColor),
          },
          '& > button[data-active], > button:hover': {
            backgroundColor: scheme(colorSchemes.borderColor),
          },
          // '& > button:hover': {
          //   borderColor: "currentcolor",
          // },
        }}>
          { [
              { value: "convert", icon: <IconTransformFilled />, color: "cyan" },
              { value: "cut", icon: <IconCut />, color: "teal" },
              { value: "merge", icon: <IconLayersIntersect2 />, color: "orange" },
              { value: "crop", icon: <IconCrop />, color: "pink", disable: true },
              { value: "rotate", icon: <Icon3dRotate />, color: "grape", disable: true },
              { value: "effect", icon: <IconAdjustmentsStar />, color: "violet", disable: true },
            ].map(item => {
              return(
                <Tabs.Tab
                  key={item.value}
                  disabled={item.disable}
                  value={item.value}
                  color={item.color}
                  title={item.value.toUpperCase()}
                  icon={item.icon}
                  w={{base: undefined, sm: "calc((100% / 6) - 6px)"}}
                  sx={{
                    "&:hover": {
                      borderColor: item.color,
                    }
                  }}
                  onClick={() => { handleStateSettings({editorActionButton: toCapitalized(item.value)}) }}
                >{toCapitalized(item.value)}</Tabs.Tab>
              )
            })
          }
        </Tabs.List>
        { [
            {
              value: "convert", content:
              <SimpleGrid cols={6}>
                {items}
              </SimpleGrid>
            },
            {
              value: "cut", content:
              <Box px="sm">
                <Flex gap={10} justify={"space-between"} direction={{ base: 'column', sm: 'row' }}>
                  <Flex gap={16} direction={"column"} w={"100%"}>
                  <VideoEmbed
                    filePath={fileSelected.filename}
                    content={
                      <Box component='img' src={staticIcons('mp4-file.png')}
                        sx={{top: "25%!important", height: "100px!important",boxShadow:"none!important"}}
                      />
                    }
                    Sx={{ width: "100%"}}
                    iconProps={{
                      size: 50
                    }}
                  />
                  {editorSettings.isPerSecond ?
                    <Slider
                      styles={{ thumb: { borderWidth: rem(2), padding: rem(3) } }}
                      sx={{
                        "& .mantine-Slider-track:before": {
                          backgroundColor: scheme(colorSchemes.borderColor)
                        }
                      }}
                      color="red"
                      label={formatDuration}
                      max={duration}
                      min={0}
                      step={1}
                      marks={[{value:0, label:"0s"}, {value:duration, label:formatDuration(duration)+'s'}]}
                      defaultValue={defaultDuration}
                      thumbSize={20}
                      thumbChildren={<IconHeart size="1rem" key="1" />}
                      value={editorSettings.cutPerSecond}
                      onChange={(value) => handleEditorSettings({cutPerSecond: value})}
                      // onChangeEnd={(value) => handleEditorSettings({cutSettings: value})}
                    />
                    :
                    <RangeSlider
                      styles={{ thumb: { borderWidth: rem(2), padding: rem(3) } }}
                      sx={{
                        "& .mantine-Slider-track:before": {
                          backgroundColor: scheme(colorSchemes.borderColor)
                        }
                      }}
                      color="red"
                      label={formatDuration}
                      max={duration}
                      min={0}
                      step={1}
                      marks={[{value:0, label:"0s"}, {value:duration, label:formatDuration(duration)+'s'}]}
                      defaultValue={[0, defaultDuration]}
                      thumbSize={20}
                      thumbChildren={[<IconHeart size="1rem" key="1" />, <IconHeartBroken size="1rem" key="2" />]}
                      value={editorSettings.cuttingTime}
                      onChange={(value) => handleEditorSettings({cuttingTime: value})}
                      // onChangeEnd={(value) => handleEditorSettings({cutSettings: value})}
                    />
                  }
                  <Text>{editorSettings.cuttingTime.join("-") + " @ " + editorSettings.cuttingTime.join("-")}</Text>
                  </Flex>
                  <Box maw={{base:"100%", sm: 300}} w={"100%"} >
                    <Stack>
                      <div title="example: 1mn25s video and cut 10s, it will get 7 videos(0-10,11-21,...,61-25)">
                        <Checkbox
                          label={`Cut video per second/minute/hour`}
                          labelPosition='right'
                          size="sm"
                          checked={editorSettings.isPerSecond}
                          onChange={() =>
                            handleEditorSettings({isPerSecond: !editorSettings.isPerSecond})
                          }
                          sx={{
                            '& .mantine-Checkbox-body > .mantine-Checkbox-inner': {
                              '& .mantine-Checkbox-input:checked': {
                                borderColor: "#2f9e44",
                              },
                              // '& .mantine-Checkbox-input:checked+.___ref-icon': {
                              //   color: "#47d362",
                              // }
                            },
                          }}
                        />
                      </div>
                      <TextInput
                        label="Output folder (option)"
                        title='click the icon to select folder path (option)'
                        placeholder='C:/path/. . ./. . .'
                        mb={10}
                        sx={{ input:{fontSize: 12} }}
                        value={editorSettings?.cutChangeFolder ?? ""}
                        readOnly
                        rightSection={
                          <ActionIcon
                            // variant="filled"
                            onClick={ () => {
                              dialog({
                                callbackName: "showOpenDialog",
                                callback: (result) => {
                                  if (result.canceled === false && result.filePaths.length > 0)
                                  handleEditorSettings({cutChangeFolder: result.filePaths[0]})
                                },
                                error: (err) => console.log(err),
                              })
                            }}
                          >
                            <IconFolderCog color="#47d362" />
                          </ActionIcon>
                        }
                      />
                      <MySelect
                        title={"render to video type"}
                        value={editorSettings?.cutRenderTo ?? "mp4"}
                        // onChange={setVideoResolution}
                        onChange={(e) => { handleEditorSettings({ cutRenderTo: e }) }}
                        data={
                          ["mp4","mov","wmv","avi","flv","mkv"]
                          .map(val => ({value: val, label: val.toUpperCase()}))
                        }
                        w={90}
                        maxDropdownHeight={240}
                        radius="md"
                      />
                    </Stack>
                  </Box>
                </Flex>
              </Box>
            },
            { value: "merge", content:
              <Box>
                <Flex gap={10} justify={"space-between"} direction={{ base: 'column', sm: 'row' }}>
                  <Flex gap={16} direction={"column"} w={"100%"}>
                    {/* <ScrollArea h={440}></ScrollArea> */}
                    <Textarea
                      value={tableData.map(data => data.filename).join('\n')}
                      readOnly
                      minRows={15}
                      // mih={420}
                    />
                  </Flex>
                  <Box maw={{base:"100%", sm: 300}} w={"100%"} >
                    <Stack>
                      {/* <Text>{settings.folder_history}</Text> */}
                      <div>
                        <TextInput
                          label="Output folder (option)"
                          title='click the icon to select folder path (option)'
                          placeholder='C:/path/. . ./. . .'
                          mb={10}
                          sx={{ input:{fontSize: 12} }}
                          value={editorSettings?.mergeChangeFolder ?? ""}
                          readOnly
                          rightSection={
                            <ActionIcon
                              // variant="filled"
                              onClick={ () => {
                                dialog({
                                  callbackName: "showOpenDialog",
                                  callback: (result) => {
                                    if (result.canceled === false && result.filePaths.length > 0)
                                    handleEditorSettings({mergeChangeFolder: result.filePaths[0]})
                                  },
                                  error: (err) => console.log(err),
                                })
                              }}
                            >
                              <IconFolderCog color="#47d362" />
                            </ActionIcon>
                          }
                        />
                        <TextInput
                          label="Filename (option)"
                          title='write file name without extension'
                          placeholder='write file name without extension'
                          mb={10}
                          sx={{ input:{fontSize: 14} }}
                          value={editorSettings?.mergeChangeFilename ?? ""}
                          onChange={(e) => handleEditorSettings({mergeChangeFilename: e.currentTarget.value})}
                        />
                        <MySelect
                          title={"render to video type"}
                          value={editorSettings?.mergeRenderTo ?? "mp4"}
                          // onChange={setVideoResolution}
                          onChange={(e) => { handleEditorSettings({ mergeRenderTo: e }) }}
                          data={
                            ["mp4","mov","wmv","avi","flv","mkv"]
                            .map(val => ({value: val, label: val.toUpperCase()}))
                          }
                          w={90}
                          maxDropdownHeight={240}
                          radius="md"
                        />
                      </div>
                    </Stack>
                  </Box>
                </Flex>
              </Box>
            },
            { value: "crop", content: "3" },
            { value: "rotate", content: "4" },
            { value: "effect", content: "5" },
          ].map(item => {
            return(
              <Tabs.Panel key={item.value} value={item.value} mih={300} mt="md">
                {item.content}
              </Tabs.Panel>
            )
          })
        }
      </Tabs>
      {props?.renderContent?.(stateSettings, editorSettings)}
    </Card>
  );
}

interface ActionsVideoEditorProps extends ActionsVideoConverterProps {}

export function ActionsVideoEditor(props?: Prettify<ActionsVideoEditorProps>) {
  const settings = props?.settings;

  const { classes, theme, cx } = useStylesCard();
  const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color)
  const [stateSettings, setStateSettings] = useState<Prettify<VideoConverterSettings>>({
    convert_to: settings?.convert_to ?? videoConverterData[0].title,
    frameRate: settings?.frameRate ?? "0",
    gpu: props?.localSettings?.gpu ?? false,
    customFrameRate: settings?.customFrameRate ?? false,
  });
  const handleStateSettings = (updateSettings: Record<string,any>) => {
    setStateSettings({...stateSettings, ...updateSettings})
  }

  useEffect(() => {
    props?.handleSettings?.({ ...stateSettings })
    props?.handleLocalSettings?.({gpu: stateSettings.gpu})
  },[stateSettings])

  const items = videoConverterData.map((item, i) => (
    <UnstyledButton key={item.title}
      className={cx(classes.item, { [classes.itemActive]: stateSettings.convert_to === item.title })}
      onClick={(e) => {
        e.preventDefault();
        handleStateSettings({convert_to: item.title })
      }}
    >
      <Avatar size="xl" src={staticIcons(item.icon)} />
      <Text size="xs" mt={7}>
        {item.title}
      </Text>
    </UnstyledButton>
  ));

  return (
    <Card className={classes.card} p={0}>
      <Box sx={{
        paddingBottom: 16,
        borderBottom: `1px solid ${scheme(colorSchemes.borderColorTr("30%"))}`,
      }}>
        <Group position="apart">
          <Text className={classes.title}>Video Files Support</Text>
          {/* <Anchor size="xs" color="dimmed" sx={{ lineHeight: 1 }}>
            + 21 other services
          </Anchor> */}
          <Flex align={"center"} gap={10}>
            <div title={`Support only NVIDIA GPU acceleration`}>
            <Checkbox label={`Enable GUP`} labelPosition='right'
              size="sm"
              checked={stateSettings.gpu}
              onChange={() =>
                handleStateSettings({gpu: !stateSettings.gpu})
              }
              sx={{
                '& .mantine-Checkbox-body > .mantine-Checkbox-inner': {
                  '& .mantine-Checkbox-input:checked': {
                    borderColor: "#2f9e44",
                  },
                  // '& .mantine-Checkbox-input:checked+.___ref-icon': {
                  //   color: "#47d362",
                  // }
                },
              }}
            />
            </div>
            { stateSettings?.customFrameRate ?
              <TextInput
                placeholder={"enter frame rate"}
                value={stateSettings?.frameRate ? stateSettings?.frameRate: undefined}
                onChange={(e) => {
                  const val = e.currentTarget.value
                  handleStateSettings({ frameRate: (val && val !== "0" && isNumber(val)) ? val : "0" })
                }}
                w={200}
              />
              :
              <MySelect
                title={"select frame rate"}
                placeholder={"Frame Rate"}
                value={stateSettings?.frameRate}
                // onChange={setVideoResolution}
                onChange={(e) => { handleStateSettings({ frameRate: e }) }}
                data={
                  ["0", "24", "25", "30", "50", "60"]
                  .map((val,i) => ({value: val, label: i === 0 ? "select frame rate" : toCapitalized(`${val}.00 frames/second`)}))
                }
                w={200}
                maxDropdownHeight={200}
                radius="md"
              />
            }
            <ActionIcon
              title='custom frame rate'
              variant='outline'
              color={stateSettings?.customFrameRate ? "green":"gray"}
              onClick={() => handleStateSettings({customFrameRate: !stateSettings?.customFrameRate})}
            ><IconCircleDotFilled /></ActionIcon>
          </Flex>
        </Group>
        <Tabs color="teal" defaultValue="covert">
          <Tabs.List sx={{
            gap: 2,
            borderColor: scheme(colorSchemes.borderColorTr("30%")),
            '& > button': {
              backgroundColor: scheme(colorSchemes.defaultBGColor),
            },
            '& > button[data-active], > button:hover': {
              backgroundColor: scheme(colorSchemes.sectionHoverBGColor),
            },
            '& > button:hover': {
              borderColor: "currentcolor",
            },
          }}>
            { [
                { value: "covert", icon: <IconTransformFilled />, color: "cyan" },
                { value: "cut", icon: <IconCut />, color: "teal" },
                { value: "merge", icon: <IconLayersIntersect2 />, color: "orange" },
                { value: "crop", icon: <IconCrop />, color: "pink" },
                { value: "rotate", icon: <Icon3dRotate />, color: "grape" },
                { value: "effect", icon: <IconAdjustmentsStar />, color: "violet" },
              ].map(item => {
                return(
                  <Tabs.Tab
                    key={item.value}
                    value={item.value}
                    color={item.color}
                    title={item.value.toUpperCase()}
                    icon={item.icon}
                    // sx={{
                    //   "&:hover": {
                    //     borderColor: item.color + "!important",
                    //   }
                    // }}
                  >{toCapitalized(item.value)}</Tabs.Tab>
                )
              })
            }
          </Tabs.List>
          { [
              { value: "covert", content: "1" },
              { value: "cut", content: "1" },
              { value: "merge", content: "2" },
              { value: "crop", content: "3" },
              { value: "rotate", content: "4" },
              { value: "effect", content: "5" },
            ].map(item => {
              return(
                <Tabs.Panel key={item.value} value={item.value}>
                  {item.value}
                </Tabs.Panel>
              )
            })
          }
        </Tabs>
      </Box>
      {props?.renderContent?.(stateSettings)}
    </Card>
  );
}

interface FFmpegArgsProps {
  trim: [number,number]
}

const ffmpeg = ({
  trim,
}: FFmpegArgsProps) => {

  `"-ss","0","-to","120",
  "-filter_complex",f"[0:v]{scale}=720:720,setpts=PTS/2.0",
  # "-c:v","copy",
  # "-c:v","libx264",
  # "-c:v","h264_nvenc" if gpu else "libx264",
  "-an",
  # "-r","30",`
  let trimFromTo = []

  if(trim.every(num => isNumber(num))){
    trimFromTo = ["-ss",`${trim[0]}`,"-to",`${trim[1]}`]
  }
}