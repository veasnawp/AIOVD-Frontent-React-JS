import { useContext, useDebugValue } from "react";
import VideoFormatsContext from "../context/VideoFormats";
// import { UserPayload } from "../configs/interfaces/google";
type VideoFormatsContextValue = {
  info_dicts: {
    [key in string]: string | any[] | null // TODO add type for each format object here.
  }
}

interface VideoFormatsContextType {
  videoFormats: VideoFormatsContextValue;
  setVideoFormats: (value: VideoFormatsContextValue) => void;
}

const useVideoFormats = () => {
    const { videoFormats } = useContext(VideoFormatsContext) as VideoFormatsContextType;
    useDebugValue(videoFormats, auth => auth ? "Logged In" : "Logged Out")
    return useContext(VideoFormatsContext) as VideoFormatsContextType;
}

export default useVideoFormats;