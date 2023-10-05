import axios from "axios";
import { localhost } from "../App/configs";
import { API_KEY } from "../configs/blogger/variables";
import { Prettify, UserPayload } from "../configs/interfaces/google";

export const pushUserData = async (
  profileObj?: UserPayload|string, credential?:string,
  config?: {
    userId?: string;
    method?: string;
    headers?: HeadersInit;
    body?: Record<string, any>
  }
) => {
  const url = localhost('/tc-json/v1/users').concat(
    config?.userId ? '/' + config?.userId: "",
    "?key="+(credential ? credential : API_KEY)
  );
  let data;
  if (typeof profileObj === "object" && config?.method !== "GET"){
    data = JSON.stringify({
        name: profileObj.name,
        email: profileObj.email,
        avatar: profileObj.picture,
        ...config?.body
      })
  }
  const response = await axios(
    url,
    {
      method: config?.method || "POST",
      headers: { "Content-Type": "application/json" },
      ...( config?.method === "GET" ? {} : {data: data} ),
    },
  );

  return response
}

export const fixUserData = async (
  profileObj: UserPayload & Record<string,any>, credential?:string,
  config?: {
    filterBy: "password" | "license" | string
  },
  callback?: (data:Prettify<UserPayload>[], userExist?:boolean, userLogin?:Prettify<UserPayload>|Record<string,any>) => void,
  error?: (err: any) => void,
) => {
  const email = profileObj.email
  const filterBy = config?.filterBy ?? "password"
  return pushUserData(profileObj, credential, {method: "GET"})
    .then(res => {
      const data = [...res.data] as UserPayload[]
      const userExist = data.some(val => val.email === email)
      let userLogin_ = data.filter(val => val.email === email && val[filterBy])
      .map(val => ({...val}))
      let userLogin = userLogin_.length > 1
      ? userLogin_.filter((v,i,a)=> a.findIndex(v2=> (v2.email===v.email))===i)[0]
      : (userLogin_.length > 0 ? userLogin_[0] : {email:null,[filterBy]:null})

      if(typeof callback === "function")
      callback?.(data, userExist, userLogin)
    })
    .catch(err => typeof error === "function" && error?.(err))

}
