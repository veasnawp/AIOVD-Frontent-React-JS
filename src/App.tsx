import React, { useEffect, useState } from 'react'
import { Routes, Route, Outlet, useLocation, Navigate, Link } from 'react-router-dom';
import MainInterface from './mainInterface'
import { Global, MantineProvider, useMantineTheme } from '@mantine/core';
import { useLocalStorage, useHotkeys } from '@mantine/hooks';
import { ThemeSwitch, defaultMantineProvider, toggleScheme, root } from './component/mantine/helpers/helpers';
import { cn, colorSchemes, switchColor } from './App/variables';
import { AuthenticationForm, UserProps } from './pages/login';
import RequireAuth from './component/auth/RequireAuth';
import { MyLoadingOverlay } from './component/mantine/loader/loaderOverlay';
import useLocalStorages from './hooks/useLocalStorages';
import { UserPayload } from './configs/interfaces/google';
import { getAccessToken } from './configs/blogger/google.connect';
import { parseJwt } from './component/auth/auth_functions';
import { pushUserData } from './userData/connect';
import axios from 'axios';
import { localhost } from './App/configs';

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request) => {
  const token = window.localStorage.getItem("token")
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

const MyGlobalStyles = () => {
  return (
    <Global
      styles={(theme) => {
        const scheme = (color: ThemeSwitch) => toggleScheme(theme.colorScheme, color)
        return ({
          '*, *::before, *::after': {
            boxSizing: 'border-box',
          },

          body: {
            // ...theme.fn.fontStyles(),
            // fontFamily: `'Roboto', ${theme.fontFamily}`,
            backgroundColor: "transparent !important",
            // backgroundColor: scheme(switchColor(colorSchemes.defaultBGColor.dark, "#eeeeee")),
            color: scheme(colorSchemes.textColor),
            lineHeight: theme.lineHeight,
            overflowX: "hidden",
            // fontFamily: "'Poppins', sans-serif",
            // WebkitAppRegion: "drag",
            "&::-webkit-scrollbar-thumb, * ::-webkit-scrollbar-thumb": {
              background: scheme(colorSchemes.sectionBGColor),
              borderRadius: "10px"
            },
            "&::-webkit-scrollbar-track, * ::-webkit-scrollbar-track": {
              background: scheme(colorSchemes.defaultBGColor),
              borderRadius: "10px"
            },
            "&::-webkit-scrollbar, * ::-webkit-scrollbar": { width: "5px" },
            "& *": {
              // "-webkit-user-select": "none",
              userSelect: "none",
            },
            "& #headerDrag": {
              // "-webkit-app-region": "drag",
              WebkitAppRegion: "drag",
            },
          },
          'img': {
            WebkitUserDrag: "none",
          },
          [`:where(.${cn('layout')})`]: {
            display: "flex",
            flex: "auto",
            flexDirection: "column",
            minHeight: "0",
            backgroundColor: scheme(colorSchemes.defaultBGColor),
          },
          [`:where(.${cn('row-layout')})`]: {
            display: "flex",
            flexFlow: "column wrap",
            minWidth: "0",
          },
          [`.'text-gray'`]: {
            color: '#455560!important',
          },
          ...(theme.colorScheme === "dark" ? {
            '.mantine-Select-dropdown': {
              backgroundColor: 'rgb(40, 49, 66)',
              borderColor: "#4d5b75",
              boxShadow: scheme(colorSchemes.boxShadow),
              '& .mantine-Select-itemsWrapper > [data-selected]': {
                backgroundColor: '#1b2531',
              },
              '& .mantine-Select-itemsWrapper > [data-hovered]:not([data-selected])': {
                backgroundColor: 'rgb(77 91 117 / 60%)',
              },
            }
          } : {}),
          '.mantine-Modal-root': {
            '& > *': {
              zIndex: 1999,
            },
          },
          ['.mantine-Modal-inner']: {
            alignItems: "center",
            // zIndex: 1999,
            '& .mantine-Modal-content': {
              zIndex: 2000,
              backgroundColor: scheme(colorSchemes.sectionBGColor),
              boxShadow: scheme(colorSchemes.boxShadow),
              "&::-webkit-scrollbar-thumb": {
                background: scheme(colorSchemes.textColor),
                borderRadius: "10px"
              },
              "&::-webkit-scrollbar-track": {
                // background: "var(--lr-opacity-10)",
                borderRadius: "10px"
              },
              "&::-webkit-scrollbar": { width: "5px" },
            },
            '& :where(.mantine-Input-wrapper,.mantine-Checkbox-inner) > :is(input,textarea,input:disabled,textarea:disabled)': {
              backgroundColor: scheme(colorSchemes.defaultBGColor),
              borderColor: scheme(colorSchemes.borderColor),
            },
          },
          [`body :where(.mantine-Input-wrapper,.mantine-Checkbox-inner,.mantine-Modal-content) :is(input:not(:checked),textarea,input:disabled,textarea:disabled)`]: {
            backgroundColor: scheme(colorSchemes.defaultBGColor),
            borderColor: scheme(colorSchemes.borderColor),
          },
          [`body :where(.mantine-Popover-dropdown) .mantine-Popover-arrow`]: {
            backgroundColor: scheme(colorSchemes.defaultBGColor),
          },
          // Advanced Data Table
          [`.adv-data-table`]: {
            padding: 20,
            border: `1px solid ${scheme(colorSchemes.sectionBorderColor)}`,
            borderRadius: 12,
            backgroundColor: scheme(colorSchemes.sectionBGColor),
            '& > :not(:last-of-type)': {
              marginBottom: 20,
            },
            '&.is-full-screen': {
              inset: "0px",
              height: "100vh",
              margin: "0px",
              maxHeight: "100vh",
              maxWidth: "100vw",
              padding: '30px',
              position: "fixed",
              width: "100vw",
              zIndex: 10,
              '& .mantine-Paper-root': {
                position: 'unset',
                width: '100% !important',
              },
              '& .is-bottom-toolbar': {
                padding: '0 30px !important',
              },
            }
          },
        })
      }}
    />
  );
};

export default function App() {
  const [colorScheme, setColorScheme] = useLocalStorage({
		key: 'color-scheme',
		defaultValue: 'dark',
		getInitialValueInEffect: true,
	});
  const toggleColorScheme = (value?:string) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  };
  useHotkeys([['mod+J', () => toggleColorScheme()]]);
  const theme = useMantineTheme();
  const scheme = (color:ThemeSwitch) => toggleScheme(colorScheme, color)

  const [active, setActive] = useState<any>(false);
  const [loader, setLoader] = useState<boolean|string|null>(false)

  const location = useLocation();
  const [user, setUser] = useLocalStorages('user', '') as UserProps;
  const [token, setToken] = useLocalStorages('token', '');
  const isSuccessLogin = user && user.userId && token

  const isAuthRedirectSuccess = location.search.includes("googleapis.com");


  useEffect(() => {
    // if(location.pathname.includes('.html')){
    //   window.location.href = localhost()
    // }
    // console.log(location)
    if(location.pathname === '/') {

      if(!user && !token) {
        getAccessToken({ callback: async (dataToken, credential) => {
          const profileObj = credential ? parseJwt(credential) : null;

          if (profileObj) {
            const userObj = { ...profileObj, avatar: profileObj.picture, token:dataToken, refresh_token: dataToken.refresh_token }
            setUser(userObj)
            setToken(credential);

            const response = await pushUserData(profileObj, credential as string,
              {
                body: window.electron ? { machineId: localStorage.getItem("machineId") } : undefined
              }
            )
            const data = await response.data;

            if (response.status === 200) {
              setUser({ ...userObj, userId: data._id})
              // setToken(credential);
              // window.location.href = localhost('/bp-admin')
              setTimeout(() => {
                setLoader("success_login")
                // window.location.href = localhost('/dashboard')
              }, 500)
            } else {
              // console.log(data)
              return Promise.reject();
            }
            return Promise.resolve();
          }
        }});
      }
      // else {
      //   window.location.href = user && token
      //     ? localhost('/bp-admin') : localhost('/login')
      // }
    }

  }, [location, user, token])

  return (
    <MantineProvider
        withCSSVariables withGlobalStyles withNormalizeCSS
        theme={{
          colorScheme: colorScheme as any,
          // fontFamily: '"Roboto","Arial",sans-serif',
          // fontFamily: `'Roboto', ${theme.fontFamily}`,
          primaryColor: 'cyan',
          defaultRadius: 'md',
          ...defaultMantineProvider(colorScheme) as any
        }}
      ><MyGlobalStyles/>
      <Routes>
        <Route path="/" element={<Outlet />}>
          {/* public routes */}
          <Route path="login" element={
            isSuccessLogin
            ? <Navigate to="/dashboard" state={{ from: location }} replace />
            : <AuthenticationForm colorScheme={colorScheme} />
          } />
          {/* <Route path="register" element={<Register />} />
          <Route path="linkpage" element={<LinkPage />} />
          <Route path="unauthorized" element={<Unauthorized />} /> */}

          {/* we want to protect these routes */}
          <Route element={<Outlet />}>
            <Route element={
              location.pathname === '/'
              ? (
                  isSuccessLogin
                  ? <Navigate to="/dashboard" state={{ from: location }} replace />
                  : <Outlet />
                )
              : <Navigate to="/login" state={{ from: location }} replace />
            }>
              <Route path="/" element={
                  isAuthRedirectSuccess ?
                  <>
                    <MyLoadingOverlay loader={loader === false} size={34}
                      sx={{
                        backgroundColor:scheme(colorSchemes.sectionBGColorTr(0.75)),
                        backdropFilter: "blur(0.05rem)",
                      }}
                    />
                    {
                      loader === "success_login" &&
                      <Navigate to="/dashboard" state={{ from: location }} replace />
                    }
                  </>
                  : <Navigate to="/login" state={{ from: location }} replace />
                }
              />
            </Route>

            <Route element={<RequireAuth user={user} token={token} />}>
              {/* <Route path="bp-admin" element /> */}
              <Route path="dashboard" element={<MainInterface/>} />

              {/* <Route path="posts" element={<PostList/>} /> */}
            </Route>

            <Route path='refresh' element={<Navigate to="/dashboard" state={{ from: location }} replace />}/>

            {/*<Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="admin" element={<Admin />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
              <Route path="lounge" element={<Lounge />} />
            </Route> */}
          </Route>

          {/* catch all */}
          <Route path="*" element={
            <article style={{ padding: "100px" }}>
              <h1>Oops!</h1>
              <p>Page Not Found</p>
              <div className="flexGrow">
                <Link to={window.origin}>Visit Our Homepage</Link>
              </div>
            </article>
          } />
        </Route>
      </Routes>
      {/* <MainInterface /> */}
    </MantineProvider>
  )
}
