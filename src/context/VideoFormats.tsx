import { createContext, useState } from "react";

const VideoFormatsContext = createContext({});

type VideoFormatsProviderProps = {
  children?: React.ReactNode,
}

export const VideoFormatsProvider = ({ children }: VideoFormatsProviderProps) => {
    const [videoFormats, setVideoFormats] = useState({});

    return (
        <VideoFormatsContext.Provider value={{ videoFormats, setVideoFormats }}>
          {children}
        </VideoFormatsContext.Provider>
    )
}

export default VideoFormatsContext;