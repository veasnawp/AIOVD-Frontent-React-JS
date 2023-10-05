/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  Box, TextInput, PasswordInput, Text, Paper, Group,
  PaperProps, Button, Divider, Checkbox, Stack,
  useMantineTheme, ColorScheme, ButtonProps, Flex
} from '@mantine/core';

import { accessTokenRedirect } from '../configs/blogger/google.connect';
import { AppName, cn, colorSchemes, myLogo } from '../App/variables';
import { ThemeSwitch, toggleScheme, root } from '../component/mantine/helpers/helpers';
import { pushUserData } from "../userData/connect";
import { UserPayload } from "../configs/interfaces/google";
import useLocalStorages from "../hooks/useLocalStorages";
import { localhost } from "../App/configs";
import { Navigate, useLocation } from "react-router-dom";
import { ButtonLoader } from "../component/mantine/loader/ButtonLoader";



const GoogleIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="20" width="20">
      <path
        d="M14.72 8.16c0-.46-.05-.81-.11-1.16H8v2.4h3.97c-.1.62-.52 1.59-1.45 2.26v1.64h2.12c1.32-1.21 2.08-3.01 2.08-5.14z"
        fill="#4285F4"
      />
      <path
        d="M8 15c1.89 0 3.47-.63 4.63-1.69l-2.12-1.64c-.6.43-1.42.75-2.51.75-1.89 0-3.48-1.24-4.08-2.96H1.75v1.69C2.9 13.43 5.26 15 8 15z"
        fill="#34A853"
      />
      <path
        d="M3.92 9.45C3.77 9 3.66 8.51 3.66 8s.1-1 .26-1.45V4.86H1.75C1.27 5.81 1 6.87 1 8s.27 2.19.75 3.14l2.17-1.69z"
        fill="#FBBC05"
      />
      <path
        d="M8 3.58c1.36 0 2.27.58 2.79 1.08l1.9-1.83C11.47 1.69 9.89 1 8 1 5.26 1 2.9 2.57 1.75 4.86l2.17 1.69C4.52 4.83 6.11 3.58 8 3.58z"
        fill="#EA4335"
      />
      <path d="M1 1h14v14H1z" fill="none" />
    </svg>
  );
}

export const GoogleLoginButton = (props: ButtonProps): JSX.Element => {
  const [googleLogin, setGoogleLogin] = useState<boolean|string>(false)
  // const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // window.location.href = 'http://localhost:8080'
    // let tokenClient: null | any;
    if (typeof window === "undefined" || !window.gapi) {
      return;
    }

    if(googleLogin === true) {
      accessTokenRedirect();
    }
    setGoogleLogin(false)
  }, [googleLogin]);

  // return <div ref={divRef} />;
  const theme = useMantineTheme();
  const scheme = (color:ThemeSwitch) => toggleScheme(theme.colorScheme, color);
  return (
    <Button
      leftIcon={<GoogleIcon />}
      onClick={() => setGoogleLogin(true)}
      sx={{
        backgroundColor: scheme(colorSchemes.overSectionBGColor),
        borderColor: scheme(colorSchemes.borderColor),
        '&:hover': {
          backgroundColor: scheme(colorSchemes.sectionHoverBGColor),
        },
        ...props.sx
      }}
      {...props}
    >
      Sign in with Google
    </Button>
  );
};

interface AuthenticationFormProps extends PaperProps {
  colorScheme?: string | ColorScheme;
}

export type UserProps = [ UserPayload, (user: Record<string, any>) => void ]

export function AuthenticationForm({
  colorScheme,
  ...props
}: AuthenticationFormProps) {
  const [singIn, setSignIn] = useState(false);
  const [active, setActive] = useState<any>(null);
  const [type, toggle] = useToggle(['Sign In', 'Sign Up']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val:string) => (isValidEmail(val) ? null : 'Invalid email'),
      password: (val:string) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });
  const name = form.values.name
  const email = form.values.email
  const password = form.values.password
  const isValidForm = isValidEmail(email) && password.length >= 6

  const theme = useMantineTheme();
  const scheme = (color:ThemeSwitch) => toggleScheme(colorScheme ?? theme.colorScheme, color);

  const location = useLocation();
  const [user, setUser] = useLocalStorages('user', '') as UserProps;
  const [token, setToken] = useLocalStorages('token', '');
  const isSuccessLogin = user && user.userId && token

  useEffect(() => {

    if (user && token && user.userId){
      // window.location.href = localhost('/dashboard')
    }
  },[form])

  return (
    <Box h="100vh" className={cn('login-wrapper')}
      sx={{
        '& * :not(.mantine-Checkbox-inner, .mantine-Checkbox-inner *)': {
          transition: "opacity 0.3s linear 2s"
        }
      }}
    >
      <Box h="100%">
        <Flex mx="auto" direction="column" justify="center" h="100%" w={420} maw="100%">
          <Paper {...props} p="xl"
            styles={{
              root: {
                border: `1px solid ${scheme(colorSchemes.sectionBorderColor)}`,
                boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
              }
            }}
            // sx={{
            //   border: `1px solid ${scheme(colorSchemes.sectionBorderColor)} !important`,
            //   boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
            // }}
          >
            <Box sx={{textAlign: "center"}}>
              <img
                className={cn('logo-image')} alt={AppName.concat(' Logo')}
                src={scheme(myLogo.main)} width={200}
              />
                <Text component="p" fz={"sm"} mt="md">
                  {type === 'Sign Up'
                    ? 'Already have an account? '
                    : "Don't have an account? "
                  }
                  <Text span role="button" fw={500} color="green" sx={{cursor:"pointer"}} onClick={() => toggle()} >
                    {type === 'Sign Up' ? "Sign In" : "Sign Up"}
                  </Text>
                </Text>
            </Box>

            <form onSubmit={form.onSubmit(() => {})}>
              <Stack>
                {type === 'Sign Up' && (
                  <TextInput
                    label="Name"
                    placeholder="Your name"
                    value={name}
                    onChange={(event) => {
                      form.setFieldValue('name', event.currentTarget.value)
                      setSignIn(false)
                    }}
                    radius="md"
                  />
                )}

                <TextInput
                  required
                  label="Email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(event) => {
                    form.setFieldValue('email', event.currentTarget.value)
                    setSignIn(false)
                    setActive(null)
                  }}
                  error={active === "userExist"
                    ? 'that email already sign up.'
                    : active === "wrongEmail" ? "incorrect email"
                    : (form.errors.email && 'Invalid email')
                  }
                  radius="md"
                />

                <PasswordInput
                  required
                  label="Password"
                  placeholder="Your password"
                  value={password}
                  onChange={(event) => {
                    form.setFieldValue('password', event.currentTarget.value)
                    setSignIn(false)
                    setActive(null)
                  }}
                  error={active === "wrongPassword" ? 'incorrect password' : (form.errors.password && 'Password should include at least 6 characters')}
                  sx={{
                    '& .mantine-PasswordInput-input': {
                      backgroundColor: scheme(colorSchemes.defaultBGColor),
                      borderColor: scheme(colorSchemes.borderColor),
                      borderRadius: 8,
                    },
                    '& input': {
                      borderRadius: "8px 0 0 8px",
                      border: "none",
                    },
                  }}
                />

                {type === 'Sign Up' && (
                  <Checkbox
                    label="I accept terms and conditions"
                    checked={form.values.terms}
                    onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                  />
                )}

                <Button onClick={() => window.location.href = window.location.href} >
                  Refresh
                </Button>
                <ButtonLoader type="submit"
                  loaderProps={{
                    color: "#ffffff"
                  }}
                  timeout={!isValidForm ? 10 : 1000}
                  callback={{
                    success: () => {
                      const profileObj = {email, name: name===""?email.split("@")[0]:name, picture:""} as UserPayload

                      if(isValidForm){
                        pushUserData(profileObj, "", {method: "GET"})
                        .then(res => {
                          const data = [...res.data] as UserPayload[]
                          const userExist = data.some(val => val.email === email)
                          let userLogin_ = data.filter(val => val.email === email && val.password)
                          .map(val => ({...val}))
                          let userLogin = userLogin_.length > 1
                          ? userLogin_.filter((v,i,a)=> a.findIndex(v2=> (v2.email===v.email))===i)[0]
                          : (userLogin_.length > 0 ? userLogin_[0] : {email:null,password:null})

                          if(!userExist && type === 'Sign Up'){
                            const dateISOString = (dayOfTheMonth=0, newDate?: string) => {
                              var date = newDate ? new Date(newDate) : new Date();
                              date.setDate(date.getDate() + dayOfTheMonth);
                              return date.toISOString().split('T')[0]
                            }
                            const trialUser = 7
                            const dateActivated = dateISOString()

                            pushUserData(profileObj, "",
                              {
                                body: {
                                  password,
                                  ...(window.electron ? { machineId: localStorage.getItem("machineId") } : undefined),
                                  license: {
                                    status: "trial",
                                    dateActivated,
                                    modifyDateActivated: dateActivated,
                                    activationDays: trialUser,
                                    expiredDate: dateISOString(trialUser, dateActivated)
                                  }
                                }
                              }
                            ).then(res => {
                              const data = res.data
                              if(data._id){
                                setUser({...data, userId: data._id})
                                setToken(data._id);
                                setTimeout(() => {
                                  window.location.href = localhost('/dashboard')
                                },50)
                              }
                            })
                          } else {
                            if(type === 'Sign In'){
                              if(userLogin.email !== email) {
                                setActive('wrongEmail');
                              } else if(userLogin.password !== password) {
                                setActive('wrongPassword');
                              } else {
                                setUser({...userLogin, userId: userLogin?._id})
                                setToken(userLogin?._id);
                                setTimeout(() => {
                                  window.location.href = localhost('/dashboard')
                                },10)
                              }
                            }
                            else setActive("userExist")
                          }
                        }).catch(err => console.log(err))
                      }

                    }
                  }}
                >
                  {upperFirst(type)}
                </ButtonLoader>
              </Stack>

            </form>
            <Divider
              color={scheme(colorSchemes.borderColor)}
              label={<Text color={scheme(colorSchemes.textColor)}>or connect with</Text>}
              labelPosition="center" my="lg"
            />
            <Group grow mb="md" mt="md">
              <GoogleLoginButton variant="default" />
            </Group>
          </Paper>
        </Flex>
      </Box>
    </Box>
  );
}

export const isValidEmail = (email:string) => {

  // /^\S+@\S+$/ /?_end=([0-9])&_start=([0-9])$/
  return /^(([^<>()[\]\\.,;:#\s@"]+(\.[^<>()[\]\\.,;:#\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  .test(email.toLowerCase())
}