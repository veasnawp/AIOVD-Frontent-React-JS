import React, { useEffect, useState } from 'react'
import {
  AppShell, Navbar, Header, Text, rem, Box,
  useMantineTheme, Flex, ActionIcon, Select, Stack, Checkbox, Anchor, Tooltip, Button, Modal, Group, Title, TextInput, Center
} from '@mantine/core';
import { useClickOutside, useHotkeys } from '@mantine/hooks';
// import { useClickOutside, useWindowEvent, useViewportSize, useMediaQuery, useLocalStorage } from '@mantine/hooks';

import { matchesMedia } from './component/mantine/hooks';

import { MenuDropDown } from './component/mantine/Menus/MenusItems';
import {
  IconPencil, IconBrandBlogger, IconSettings, IconLogout,
  IconHome, IconBrandYoutube, IconBrandFacebook, IconWorld, IconFolderCog, IconMinus, IconSquare, IconSquareX, IconClipboard, IconDownload, IconTransformFilled, IconCut, Icon2fa,
  // IconBellRinging, IconFingerprint, IconKey, Icon2fa,
  // IconDatabaseImport, IconReceipt2, IconSwitchHorizontal,
} from '@tabler/icons-react';
import { themeColors } from './config';
import { MyDrawer } from './component/mantine/Drawer/Drawer';
import { ActionIconLoader, ButtonLoader } from './component/mantine/loader/ButtonLoader';
import { NavbarSimpleIndex } from './component/mantine/NavMenus/NavMenusIndex';
import { DownLoadComponent, IYouTube, VideoSettings } from './App/DownloadComponent/DLComponent';
import { ThemeSwitch, toggleScheme } from './component/mantine/helpers/helpers';
import useLocalStorages from './hooks/useLocalStorages';
import axios from 'axios';
import { localhost, addHeaders, headers, localStaticIcons } from './App/configs';
import useSettings, { SettingsContextValue, UseSettingsContextType } from './hooks/useSettings';
import { signOut } from './component/auth/auth_functions';
// import { refreshToken } from './configs/blogger/google.connect';
import { UserPayload } from './configs/interfaces/google';
import { colorSchemes, switchColor } from './App/variables';
import { WinMenuLabel, WindowMenu, WindowMenuDropDown } from './component/mantine/Menus/WindowMenu';
import ToggleMenuIcon from './component/mantine/Header/ToggleMenuIcon';
import { refreshToken } from './configs/blogger/google.connect';
import { dialog, dialogDefaultSelectFile } from './configs/electron/dialog';
import { Prettify } from './component/mantine/helpers/HelperType';
import { pushUserData, fixUserData } from './userData/connect';
import { UserProps, isValidEmail } from './pages/login';
import { openExternal } from './configs/electron/openExternal';
import { IconClipboardCheck } from '@tabler/icons-react';
import { MyLoadingOverlay } from './component/mantine/loader/loaderOverlay';
import { ConvertComponent } from './App/DownloadComponent/ConvertVideo';
import { CopyTextInput } from './component/mantine/copyButton';
import { CopyButton } from '@mantine/core';

type MainProps = {
  className?: string;
  children?: React.ReactNode;
}

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export default function MainInterface({
  // className,
  children,
}: MainProps) {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  // const [openSubMenu, setOpenSubMenu] = useState<any>(null);
  const [active, setActive] = useState<any>(null);
  const refToggleMenu = useClickOutside(() => {
    setToggleMenu(false)
    setActive(null)
  });

  const largerThanSM = matchesMedia(767, "max");
  const isMobile = matchesMedia(480, "max");
  const smallerThanSM = matchesMedia(768, "min");

  const machineId = localStorage.getItem("machineId");
  const [activateLicense, setActivateLicense] = useState<any>(null);
  const [user, setUser] = useLocalStorages('user', '') as UserProps;
  const [token, setToken] = useLocalStorages('token', '');
  const {settings, setSettings} = useSettings();
  const [localSettings, setLocalSettings] = useLocalStorages("localSettings", "") as UseSettingsContextType;
  const handleSettings = (updateSettings:Prettify<SettingsContextValue>, saveLocal:boolean=false) => {
    setSettings({...settings, ...updateSettings})
    if(saveLocal) setLocalSettings({...localSettings, ...updateSettings})
  }
  const handleLocalSettings = (updateSettings:Prettify<SettingsContextValue>) => {
    setLocalSettings({...localSettings, ...updateSettings})
  }

  const [videoSettings, setVideoSettings] = useState<VideoSettings>({resolution: "720", download_type: "horizontal", active_dlType: 0});
  const handleVideoSettings = (updateValue?:VideoSettings) => {
    setVideoSettings({...videoSettings, ...updateValue})
    // setTesting({...videoSettings, ...updateValue})
  }

  const [localTableData, setLocalTableData] = useLocalStorages("tableData", "") as [IYouTube[], (data: IYouTube[]) => void]
  const tableData: IYouTube[] = settings.videoDownloadedData ?? (
    localTableData && typeof localTableData === "object" && localTableData.length > 0
    ? localTableData.map((data) => ({...data, selected: false}))
    : []
  )
  const setTableData = (data: IYouTube[], updateSettings?: Record<string, any>) => handleSettings({videoDownloadedData: data, ...updateSettings})

  const loadTableData = (tableData:IYouTube[], updateSettings?: Prettify<SettingsContextValue>) => {
    handleSettings({videoDownloadedData: tableData, ...updateSettings})
    setLocalTableData(tableData)
  }

  useHotkeys([
    ['mod+O', () => handleSettings({addLinksPopup: true})]
  ]);

  const [folderHistory, setFolderHistory] = useState('');
  const [isRememberFolder, setIsRememberFolder] = useState(true);

  useEffect(() => {
    if(window.electron && machineId){
      setTimeout(() => {
        if(isRememberFolder === true){
          axios.get(
            localhost('/settings/'), addHeaders({Authorization: `Bearer ${user.userId}`})
          ).then(async (res) => {
            if(res.status === 200){
              const data = await res.data
              // console.log(data)
              // if(localTableData){
              //   setTableData(localTableData)
              // }
              handleSettings({
                ...data
              })
            }
          }).catch((err) => console.log(err))
        }

        pushUserData("","",{
          method: "GET",
        }).then(async (res) => {
          const data = await res.data as UserPayload[]
          if(res.status === 200){
            const currentUser = data.filter(val => val.machineId === machineId && val.email === user.email)[0]
            const blockedUser = data.some(val => val.machineId === machineId && val.license.status === "blocked")

            // if(currentUser.license && currentUser.license?.status){
            //   const status = currentUser.license.status
            //   const license = currentUser.license
            //   if(status === "blocked"){
            //     setActivateLicense("registerLicense")
            //   } else if(status === "trial" || status === "activating"){
            //     setActivateLicense("registerLicense")
            //   } else if (license.expiredDate){
            //     const expiredDate = license.expiredDate
            //     var date = new Date();
            //     date.setDate(date.getDate()); // add 30 days
            //     const currentDate = date.toISOString().split('T')[0]

            //     if(currentDate >= expiredDate){
            //       setActivateLicense("renewLicense")
            //     }
            //   }
            // }
          }
        })

        axios.get( localhost('/assets?key='+machineId) )
        .then(async (res) => {
          if(res.status === 200){
            const data = await res.data
            // console.log(data)
            handleLocalSettings({ ...data })
          }
        }).catch((err) => console.log(err))
      },700)
    }
  }, [])

  useEffect(() => {
    if(videoSettings){
      console.log("videoSettings",videoSettings)
    }
    if(settings){
      console.log("settings",settings)
    }
  }, [settings, videoSettings])
  useEffect(() => {
    smallerThanSM && setToggleMenu(false)
  }, [smallerThanSM])
  useEffect(() => {
    const body = window.document.body
    if(largerThanSM){
      toggleMenu && (body.style.overflow = "hidden")
      !toggleMenu && (body.style.overflow = "")
    }
  }, [toggleMenu])

  const theme = useMantineTheme();
  const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color)

  const [activeContent, setActiveContent] = useState(1);
  const dataMenuItems = [
    { label: 'Home', icon: IconHome },
    { label: 'Download', icon: IconDownload },
    { label: 'Editor', icon: IconCut },
    { label: 'Authentication', icon: Icon2fa },
    // { link: '', label: 'Databases', icon: IconDatabaseImport },
    // { link: '', label: 'Authentication', icon: Icon2fa },
    // { link: '', label: 'Other Settings', icon: IconSettings },
  ];
  const downLoadComponentProps = {
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
  }
  const convertComponentProps = {
    settings,
    setSettings,
    handleSettings,
    videoSettings,
    handleVideoSettings,
    localSettings,
    handleLocalSettings,
  }
  const contents = [
    <div>Welcome to the Admin Panel</div>,
    // settings.refreshTable && settings.refreshTable === true ?
    // <MyLoadingOverlay loader={true} size={34}
    //   sx={{
    //     backgroundColor:scheme(colorSchemes.sectionBGColorTr(0.75)),
    //     backdropFilter: "blur(0.05rem)",
    //   }}
    // />
    // :
    <DownLoadComponent {...downLoadComponentProps}/>,
    <ConvertComponent {...convertComponentProps} />,
    <TwoFA/>,
  ]

  return (
    settings.refreshTable && settings.refreshTable === true ?
    <MyLoadingOverlay loader={true} size={34}
      sx={{
        backgroundColor:scheme(colorSchemes.sectionBGColorTr(0.75)),
        backdropFilter: "blur(0.05rem)",
      }}
    />
    :
    <AppShell
      styles={{
        main: {
          // background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          transition: "all .1s ease-in-out",
          background: "#1b2531",
          paddingLeft: toggleMenu && largerThanSM?`${160+16}px!important`:160+16,
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar hidden={!toggleMenu}
          withBorder={false}
          hiddenBreakpoint="sm"
          width={{ sm: 160, lg: 160 }}
          w={160}
          pt="lg"
          bg={"rgb(40, 49, 66)"}
          // bg={themeColors.navMenu.bg}
          className={"bp-admin-menu-wrapper has-sub-menu".concat(
            toggleMenu ? " is-collapse": ""
          )}
          sx={{
            // position: "relative",
            transition: "all .1s ease-in-out",
            ...(largerThanSM ? {} : {
              "&.is-collapse #bp-admin-menu": {
                " a": {
                  height: 34,
                  '& .bp-menu-name': {
                    position: "absolute",
                    left: "-999px",
                  },
                },
                "& ul.bp-submenu": {
                  position: "absolute",
                  top: "-1000em",
                },
                '& li.menu-top.current:after, li.menu-top.open-sub:after': {
                  borderWidth: "5px",
                },
              },
              "& #bp-admin-menu li.open-sub ul.bp-submenu": {
                top: "0px!important",
                left: toggleMenu ? "36px": "160px",
                zIndex: 9999,
                minWidth: "160px",
                width: "auto",
                borderLeft: "5px solid transparent",
                backgroundColor: themeColors.navMenu.subMenuBg,
                boxShadow: "0 3px 5px rgba(0,0,0,.2)"
              }
            }),
          }}
        >
          <NavbarSimpleIndex
            data={dataMenuItems}
            active={activeContent}
            setActive={setActiveContent}
            footerSection={(classes) => {
              return(
                <a className={classes.link}
                  onClick={(event) => {
                    event.preventDefault();
                    if (user.token && user.token.access_token){
                      refreshToken({
                        user, setUser,
                        callback: () => {
                          signOut({
                            user,
                            redirectTo: localhost('/login'),
                          })
                        }
                      })
                    } else if (user.userId){
                      signOut({
                        user,
                        redirectTo: localhost('/login'),
                      })
                    }
                  }}>
                  <IconLogout className={classes.linkIcon} stroke={1.5} />
                  <span>Logout</span>
                </a>
              )
            }}
          />
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 50 }}
          withBorder={false}
          bg={"rgb(40, 49, 66)"}
          // onClick={() => setActive()}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1000,
            boxShadow: "rgba(0, 0, 0, 0.75) 0px 1px 8px -1px",
            "& *": {
              color: "rgba(240,246,252,.6)",
            },
            "& .mantine-Text-root": {
              color: "#f0f0f0"
            },
            "& .inner-header-item:hover, & .inner-header-item:hover *": {
              color: "#ffffff !important",
              stroke: "#ffffff !important",
            },
            "& svg:hover": {
              stroke: "#ffffff",
            },
          }}
        >
          {/* Left Section */}
          <Flex>
            <Flex justify="flex-start" gap={5}
              // miw={largerThanSM ? undefined : 160}
              sx={{pointerEvents:"all"}}>
              <Box px="sm" pt={rem(0)}>
                {/* <Logo width={rem(120)} /> */}
                <Box id='headerDrag' sx={{
                  display: "flex",
                  padding: 3,
                  border: `1px solid #f0f0f0`,
                  borderRadius:"50px",
                }}><IconBrandBlogger /></Box>
              </Box>
              {largerThanSM &&
              <Flex align={"center"}>
                <ActionIcon
                  onClick={() => setToggleMenu(v => !v)}
                >
                  <ToggleMenuIcon toggleMenu={toggleMenu} />
                </ActionIcon>
              </Flex>}
              <WindowMenuDropDown
                label='Tasks'
                dataMenuItems={[
                  {
                    item: <WinMenuLabel label='Add new download' hotkey='Ctrl+O' />,
                    props: {
                      onClick: (e) => {
                        e.preventDefault()
                        setActiveContent(1)
                        handleSettings({addLinksPopup: true})
                      }
                    }
                  },
                  {
                    item: 'Add batch download',
                  },
                  {
                    item: 'Add batch download from clipboard', divider: true,
                    props: {
                      onClick: (e) => {
                        e.preventDefault()
                        setActiveContent(1)
                        navigator.clipboard.readText().then(result => {
                          handleSettings({addLinksPopup: true, videoLinks: result})
                        })
                      }
                    }
                  },
                  {
                    item: 'Import',
                    props: {
                      onClick: (e) => {
                        e.preventDefault()
                        setActiveContent(1)
                        dialog({
                          callbackName: "showOpenDialog",
                          dialogConfig: dialogDefaultSelectFile(),
                          callback: (result) => {
                            if (result.canceled === false && result.filePaths.length > 0)
                            axios.post(localhost('/readfile'), {
                              file_path: result.filePaths
                            }, headers)
                            .then(async (res) => {
                              const data = await res.data as {result: string[]}
                              handleSettings({addLinksPopup: true, videoLinks: data.result.join('\n')})
                            })
                            .catch((err) => {
                              handleSettings({openDialog: {
                                active: true,
                                title: "File Error!!!",
                                titleColor: "red",
                                content: "support only text file"
                              }})
                            })
                          },
                          error: (err) => console.log(err),
                        })
                      }
                    }
                  },
                  {
                    item: 'Export', divider: true,
                    props: {
                      onClick: (e) => {
                        e.preventDefault()
                        const selectData = tableData.filter(data => data.selected === true)
                        // console.log(selectData)
                        if (selectData.length > 0)
                        dialog({
                          callbackName: "showSaveDialog",
                          dialogConfig: dialogDefaultSelectFile({
                            title: "Save a file",
                            buttonLabel: "Save",
                          }),
                          callback: (result) => {
                            if (result.canceled === false && result.filePath){
                              const file_path = result.filePath
                              const folder_path = file_path.replace(/\\/g,'/').split('/').slice(0,-1).join('/')
                              console.log(file_path, folder_path)
                              axios.post(localhost('/writefile'), {
                                file_path,
                                text_value: selectData.map(data => data.info_dict.webpage_url).join('\n')
                              }, headers)
                              .then(async (res) => {
                                const data = await res.data as {result: string}
                                if(res.status === 200)
                                handleSettings({openDialog: {
                                  active: true,
                                  title: "File Saved",
                                  // titleColor: "#ffffff",
                                  content: (
                                    <Group align='center' position='center' >
                                      <Button
                                        variant='outline'
                                        onClick={() => {
                                          axios.post(localhost('/openfolder'), {
                                            file_path: folder_path
                                          }, headers)
                                          .then((res) => {
                                            return res.data
                                          })
                                          .catch((err) => console.log(err))
                                        }}
                                      >{`Open Folder`}</Button>
                                      <Button
                                        variant='outline'
                                        onClick={() => {
                                          axios.post(localhost('/openfile'), { file_path }, headers)
                                          .then((res) => {
                                            return res.data
                                          })
                                          .catch((err) => console.log(err))
                                        }}
                                      >{`Open File Saved`}</Button>
                                    </Group>
                                  )
                                }})
                              })
                              .catch((err) => console.log("Error",err))
                            }
                          },
                          error: (err) => console.log(err),
                        })
                      }
                    }
                  },
                  {
                    item: 'Exit',
                    props: {
                      onClick: (e) => {
                        e.preventDefault()
                        window.electron.ipcRenderer.send("CLOSE-APP")
                      }
                    }
                  },
                ]}
              />
              <WindowMenuDropDown
                label='File'
                dataMenuItems={[
                  {
                    item: 'Remove',
                    props: {
                      onClick: (e) => {
                        e.preventDefault()
                        if(settings.isSomeSelected && settings.isSomeSelected === true && tableData.length>0){
                          const deleteData = tableData.filter(data => data.selected !== true)
                          loadTableData(deleteData)
                          setTimeout(() => {
                            window.location.href = localhost('/refresh')
                          },10)
                        }
                      },
                    },
                    disable: settings.isSomeSelected && settings.isSomeSelected === true ? false : true
                  },
                  {
                    item: 'Redownload',
                    props: {
                      onClick: (e) => {
                        e.preventDefault()
                        if(settings.isSomeSelected && settings.isSomeSelected === true && tableData.length>0){
                          const url_list_selected = tableData.filter(data => data.selected === true)
                          .map(data => data.info_dict.webpage_url)
                          handleVideoSettings({videoLinks:url_list_selected.join('\n')})
                          handleSettings({
                            addLinksPopup:true
                          })
                        }
                      },
                    },
                    disable: settings.isSomeSelected && settings.isSomeSelected === true ? false : true
                  },
                ]}
              />
            </Flex>
          </Flex>
          <Box id='headerDrag' w="100%" h="100%"></Box>
          {/* Right Section */}
          <Flex justify="flex-start" pr="md" align={"center"}>
            <Flex align="center" >
              <ButtonLoader
                // unstyled
                title='Refresh'
                color='#ffffff'
                bg='transparent!important'
                px={0}
                sx={(theme) => ({
                  '& * :hover': {
                    color: `${theme.white}!important`
                  }
                })}

                callback={{
                  success: () => {
                    // refreshToken({user, setUser, redirectTo: window.location.href})
                    window.location.href = window.location.href
                  }
                }}
              >
                {` Refresh`}
              </ButtonLoader>
              <ActionIcon title="Settings" w={40} className={'menu-settings-icon'}
                onClick={() => setOpenDrawer(true)}
              >
                <IconSettings size={24} />
              </ActionIcon>
            </Flex>
            <MenuDropDown
              menuTargetProps={{
                sx: {
                  ...( isMobile ? {
                    "& .user-details": {
                      display:"none"
                    }
                  } : {})
                }
              }}
              userInfo={{
                username: user.name,
                avatar: user.picture,
                // avatar: user.picture ?? `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' stroke-width='2' stroke='%23f0f0f0' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0'/%3E%3Cpath d='M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'/%3E%3Cpath d='M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855'/%3E%3C/svg%3E`,
              }}
              // dataMenuItems={[
              //   {
              //     item: 'Edit Profile',
              //     icon: <IconPencil size="1.25rem" stroke={1.5} />,
              //   },
              //   {
              //     item: 'Account Settings',
              //     icon: <IconSettings size="1.25rem" stroke={1.5} />,
              //   },
              //   {
              //     item: 'Blogger Settings',
              //     icon: <IconBrandBlogger size="1.25rem" stroke={1.5} />,
              //     props: {
              //       onClick: () => setOpenDrawer(true),
              //     }
              //   },
              //   {
              //     item: 'Sign Out',
              //     icon: <IconLogout size="0.9rem" stroke={1.5} />,
              //     props: {
              //       onClick: () => {
              //         signOut({
              //           redirectTo: localhost('/login'),
              //         })
              //       }
              //     }
              //   },
              // ]}
            />
            {
              window.electron &&
              <Flex sx={{opacity:0, visibility:"hidden"}}>
                {[{icon: IconMinus}, {icon: IconSquare}, {icon: IconSquareX}].map((item,i) => {
                  return (
                    <ActionIcon key={i} size={45}>
                      <item.icon />
                    </ActionIcon>
                  )
                })}
              </Flex>
            }
          </Flex>
        </Header>
      }
      // aside={
      //   <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
      //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
      //       <Text>Application sidebar</Text>
      //     </Aside>
      //   </MediaQuery>
      // }
      // footer={
      //   <Footer height={60} p="md">
      //     Application footer
      //   </Footer>
      // }
    >
      {toggleMenu && <Box
        onClick={() => setToggleMenu(false)}
        sx={{
          position:'absolute',
          inset: 0,
          top: 'calc(var(--mantine-header-height))',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgb(28 35 47 / 70%)',
          zIndex: 99,
        }}
      ></Box>}
      { children }
      {dataMenuItems.map((item, index) => {

        return(
          <div key={index}
            // style={{display: index === activeContent ? "block" : "none"}}
          >
            { index === activeContent ? contents[index] : ""}
          </div>
        )
      })
      }
      <Box display="none">
        {localStaticIcons().map((icon,i) => <img key={i} src={icon} />)}
      </Box>
      <MyDrawer
        side='right'
        opened={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title="Settings"
        size={350}
        zIndex={1001}
        children={
          <Stack>
            {/* <Text>{settings.folder_history}</Text> */}
            <div>
              <TextInput
                label="Download folder"
                title='click the icon to select folder path'
                mb={10}
                sx={{
                  input:{fontSize: 12}
                }}
                // defaultValue={settings.folder_history}
                value={folderHistory !== '' ? folderHistory : settings.folder_history}
                // onChange={(e) => {
                //   setFolderHistory(e.currentTarget.value)
                // }}
                readOnly
                rightSection={
                  <ActionIcon
                    // variant="filled"
                    onClick={ () => {
                      dialog({
                        callbackName: "showOpenDialog",
                        callback: (result) => {
                          if (result.canceled === false && result.filePaths.length > 0)
                          setFolderHistory(result.filePaths[0])
                        },
                        error: (err) => console.log(err),
                      })
                    }}
                  >
                    <IconFolderCog color="#47d362" />
                  </ActionIcon>
                }
              />
              <div style={{display:"flex", justifyContent: "space-between", alignItems:"center"}}>
                <Checkbox
                  label={"remember"}
                  color='green'
                  size="xs"
                  checked={isRememberFolder}
                  onChange={() => setIsRememberFolder(v => !v)}
                />
                <ButtonLoader
                  color='white'
                  sx={(theme) => ({
                    backgroundColor: "transparent",
                    border: '1px solid rgba(24, 100, 171, 0.45)',
                    '&:hover': {
                      color: theme.colors.blue[1],
                      backgroundColor: "rgba(24, 100, 171, 0.45)",
                    }
                  })}
                  callback={{
                    success: () => {
                      if(folderHistory !== ''){
                        if (isRememberFolder === true){
                          axios.post(
                            localhost('/settings'),
                            {...settings, folder_history: folderHistory},
                            addHeaders({Authorization: `Bearer ${user.userId}`})
                          ).then(async (res) => {
                            if(res.status === 200){
                              // console.log(res.data)
                              handleSettings({...res.data})
                            }
                          })
                        } else {
                          setTimeout(() => {
                            handleSettings({folder_history: folderHistory})
                          },500)
                        }
                      }
                    }
                  }}
                >
                  Save
                </ButtonLoader>
              </div>
            </div>
            {/* <div>
            </div> */}
          </Stack>
        }
      />
      <Modal
        opened={settings?.openDialog?.active ?? false}
        onClose={() => handleSettings({openDialog: {active:false}})}
        withCloseButton={true}
        closeOnClickOutside={false}
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
          },
          '& .mantine-Modal-header': {
            color: settings.openDialog?.titleColor ?? undefined,
            backgroundColor: scheme(colorSchemes.overSectionBGColor)
          },
          '& .mantine-Modal-body:not(:only-child)': {
            paddingTop: 16,
          },
        }}
        title={settings.openDialog?.title}
      >
        {settings.openDialog?.content}
      </Modal>
      {videoSettings?.modal &&
        <Modal
          opened={videoSettings?.modal?.isOpen ?? false}
          onClose={() => handleVideoSettings({modal: {isOpen: false}})}
          withCloseButton={false}
          closeOnClickOutside={false}
          size={videoSettings?.modal?.size ?? 'xl'}
          centered
          mah={800}
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
          {videoSettings?.modal?.title &&
            <Title ta="center"
              sx={{ fontSize: 18, color: videoSettings?.modal?.titleColor ?? undefined, backgroundColor: scheme(colorSchemes.overSectionBGColor), padding:8, margin: "-1rem -1rem 1rem" }}
            >
              {videoSettings?.modal?.title}
            </Title>
          }
          { videoSettings?.modal?.content ?? ""}
          {/* <Group mt={'md'} position={'apart'}>
            <Button
              onClick={() => setActive(false)}
              variant="subtle"
              >
              Close
            </Button>
          </Group> */}
        </Modal>
      }
      <Modal
        opened={["registerLicense","renewLicense"].some(v => activateLicense === v)}
        // opened={activateLicense === "registerLicense" || activateLicense === "renewLicense"}
        onClose={() => setActivateLicense(null)}
        withCloseButton={false}
        closeOnClickOutside={false}
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
          },
          '& .mantine-Modal-header': {
            // color: settings.openDialog?.titleColor ?? undefined,
            backgroundColor: scheme(colorSchemes.overSectionBGColor)
          },
          '& .mantine-Modal-body:not(:only-child)': {
            paddingTop: 16,
          },
        }}
        // title={"Registration"}
      >
        <Title ta="center"
          sx={{ fontSize: 18, color: undefined, backgroundColor: scheme(colorSchemes.overSectionBGColor), padding:8, margin: "-1rem -1rem 1rem" }}
        >
          {activateLicense === "renewLicense" ? "Renew License" : "Registration"}
        </Title>
        <Stack>
          {
            [
              {
                label: "Name : ", placeholder: "enter your name",
                value: settings.licenseUsername ?? user.name,
                onChange: (e:ChangeEvent) => {
                  const licenseUsername = {licenseUsername: e.currentTarget.value}
                  handleSettings({...licenseUsername})
                },
                hidden: activateLicense === "renewLicense" ? "none" : undefined
              },
              {
                label: "Email : ", placeholder: "enter your email address",
                value: settings.licenseEmail ?? user.email,
                onChange: (e:ChangeEvent) => {
                  const licenseEmail = {licenseEmail: e.currentTarget.value}
                  handleSettings({...licenseEmail})
                  setActive(null)
                },
                error: active === "emailExist" && "User already exist with this Email",
                hidden: activateLicense === "renewLicense" ? "none" : undefined
              },
              {
                label: "Machine ID : ",
                value: machineId ?? "", readOnly: true,
                onChange: () => {},
                rightSection: (
                  <CopyButton value={machineId ?? ""}>
                    {({ copied, copy }) => (
                      <ActionIconLoader
                        tooltip={{ label: "copy",children:"" }}
                        timeout={100}
                        icon={<IconClipboard size={16} color={theme.colors.cyan[5]}/>}
                        loaderIcon={
                          <IconClipboardCheck size={16} color={theme.colors.cyan[5]} />
                        }
                        callback={{
                          success(event) {
                            copy()
                          },
                        }}
                      />
                    )}
                  </CopyButton>
                )
              },
              {
                label: "License Key : ", placeholder: "enter your license key",
                value: activateLicense === "renewLicense" ? (user?.license?.key ?? "") : (settings.licenseKey ?? ""),
                onChange: (e:ChangeEvent) => {
                  const licenseKey = {licenseKey: e.currentTarget.value}
                  handleSettings({...licenseKey})
                  setActive(null)
                },
                error: active === "wrongLicenseKey" && "incorrect license key"
              },
            ].map((item, i) => {
              return(
                <Group key={i} position='apart' display={item.hidden}>
                  <Text span w={"90px"}>{item.label}</Text>
                  <TextInput placeholder={item.placeholder} w={"calc(100% - 110px)"}
                    value={item.value}
                    onChange={(e)=> item.onChange(e)}
                    error={item.error}
                    readOnly={activateLicense === "renewLicense" ? true : item.readOnly}
                    rightSection={item.rightSection}
                  />
                </Group>
              )
            })
          }
          {active === "invalidRegistration" && <Text span fz={"xs"} color='red'>{`User already exist with this Email or incorrect license key`}</Text>}
          <Group position='apart'>
            <div>
              <Tooltip label={`Copy Machine ID and click here to contact us for ${activateLicense === "renewLicense" ? "Renewing License" : "Getting License"}`} withArrow withinPortal zIndex={2000}>
              <Anchor fz={13}
                onClick={() => {
                  const publish$link = localSettings.publish$link
                  if (publish$link){
                    openExternal({ url: publish$link.telegram.channel, })
                  }
                }}
              >
                {activateLicense === "renewLicense" ? "Renew License" : "Get License"}
              </Anchor></Tooltip>
            </div>
            <ButtonLoader
              loaderProps={{color:theme.white}}
              timeout={activateLicense === "renewLicense" ? 0 : undefined}
              callback={{
                beforeSend: (e) => {
                  e.preventDefault()
                  const publish$link = localSettings.publish$link
                  if(activateLicense === "renewLicense" && publish$link){
                    openExternal({ url: publish$link.telegram.channel, })
                  }
                  console.log()
                },
                success: async () => {
                  if (activateLicense !== "renewLicense"){
                    const email = settings.licenseEmail ?? user.email
                    const profileObj = {
                      name: settings.licenseUsername ?? user.name,
                      email,
                      picture: user.picture,
                    } as any

                    if(isValidEmail(email) && settings.licenseKey && settings.licenseKey.length > 20){
                      fixUserData(profileObj,"", {filterBy: "license"},
                        async (data, userExist, userLogin) => {
                          const licenseExist = data.some(val => val.license && val.license?.key === settings.licenseKey)

                          if((!userExist || userLogin?.email === user.email) && licenseExist){
                            if (userExist && userLogin?.email !== user.email){
                              setActive('emailExist')
                            } else {
                              const currentUser = data.filter(val => val.machineId === machineId && val.email === user.email)[0]
                              console.log(currentUser)
                              if(currentUser.license?.key === settings.licenseKey){
                                await pushUserData(profileObj, "",
                                  { userId: user.userId, method: "PUT",
                                    body: {
                                      license: {
                                        ...currentUser.license,
                                        status: "activated",
                                      },
                                      ...(window.electron && machineId ? { machineId: machineId } : undefined)
                                    }
                                  }
                                ).then(res => {
                                  const data = res.data
                                  setUser({...data, userId: data._id})
                                  setToken(data._id);
                                })
                                .catch(err => console.log(err))
                              } else {
                                setActive("wrongLicenseKey")
                              }
                            }
                          } else {
                            if(!licenseExist){
                              setActive("wrongLicenseKey")
                            } else {
                              setActive("emailExist")
                            }
                          }
                        }
                      )
                    } else {
                      setActive("wrongLicenseKey")
                    }
                  }
                }
              }}
            >{activateLicense === "renewLicense" ? "Contact Us" : `Register`}</ButtonLoader>
          </Group>
        </Stack>
      </Modal>
    </AppShell>
  );
}

const TwoFA = () => {
  const [otp, setOTP] = useState({
    secretKey: "",
    code: "",
  })

  const theme = useMantineTheme();
  const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color)
  return (
    <Center maw={480} h={200} mx="auto" p={10}
      bg={scheme(colorSchemes.sectionBGColor)}
    >
      <Box maw={480} w="100%">
        <Stack>
          <Text fz={34} fw={600} align='center' mb={16}>{"2 Factor Authentication"}</Text>
          <TextInput
            value={otp.secretKey}
            placeholder='AT3K OP5X CJQ1 . . .'
            onChange={(e) => setOTP({...otp, secretKey: e.currentTarget.value})}
            rightSectionWidth={64}
            rightSection={
              <ButtonLoader
                loaderProps={{
                  color: theme.colors.cyan[5]
                }}
                variant='light'
                p={0}
                w={60} h={32}
                fz={12}
                timeout={200}
                callback={{
                  beforeSend: (e) => e.preventDefault(),
                  success: () => {
                    if(otp.secretKey && otp.secretKey !== ''){
                      axios.post(localhost('/2fa'),
                        {key: otp.secretKey},
                        headers
                      ).then(res => {
                        setOTP({...otp, code: res.data.result})
                      })
                      .catch(err => console.log(err))
                    }
                    // navigator.clipboard.readText().then(result => {
                    //   setSecretKey(result)
                    // })
                  },
                }}
                // icon={<IconClipboard size={16} color={theme.colors.cyan[5]}/>}
                tooltip={{
                  label:"Get Code", children: ""
                }}
              >{`Submit`}</ButtonLoader>
            }
          />
          <CopyTextInput placeholder='click submit to get code' textToCopy={otp.code} tooltipText='Copy' />
        </Stack>
      </Box>
    </Center>
  )
}