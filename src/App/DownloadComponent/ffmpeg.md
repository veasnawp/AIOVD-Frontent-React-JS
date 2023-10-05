ffmpeg\ffmpeg -i "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/hd.mp4" -aspect 16:9 -filter_complex "[0:v]scale=640:360,setpts=PTS/1.0;[0:a]atempo=1.0" -c:v libx264 -c:a eac3 -pix_fmt yuv420p -preset superfast -b:v "1219000" -bufsize "3219000" -maxrate "3219000" -r 30 -qmin 0 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 20 -i_qfactor 0.75 -b_qfactor 1.1 "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/output/hd.mp4" -y

#SPEED
ffmpeg\ffmpeg -i "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/hd.mp4" -filter_complex "[0:v]hflip,setpts=PTS/2.0;[0:a]atempo=2.0" -c:v libx264 -c:a eac3 -preset superfast -b:v "1219000" -bufsize "3219000" -maxrate "3219000" -r 30 -qmin 0 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 20 -i_qfactor 0.75 -b_qfactor 1.1 "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/output/hq.mp4" -y

#Covert
ffmpeg\ffmpeg -i "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/hd.mp4" -c:v libx264 -c:a eac3 -preset superfast -b:v "1219000" -bufsize "3219000" -maxrate "3219000" -r 30 -qmin 0 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 20 -i_qfactor 0.75 -b_qfactor 1.1 "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/output/hq.mp4" -y

#SPLIT Per second
ffmpeg\ffmpeg -i "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/hd.mp4" -ss 00:00:00 -to 00:00:30 -c:a copy -c:v copy -preset p6 -b:v "1219000" -bufsize "3219000" -maxrate "3219000" -r 30 -qmin 0 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 20 -i_qfactor 0.75 -b_qfactor 1.1 "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/output/hq.mp4" -y



## NVIDIA ############################

#scale
ffmpeg\ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/hd.mp4" -filter_complex "[0:v]scale=640:360,setpts=PTS/1.0;[0:a]atempo=1.0" -vf scale_cuda=1280:720 -c:v h264_nvenc -c:a copy -preset p6 -tune hq -b:v "1219000" -bufsize "3219000" -maxrate "3219000" -qmin 0 -r 30 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 20 -i_qfactor 0.75 -b_qfactor 1.1 "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/output/hd.mp4" -y

#Covert
ffmpeg\ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/hd.mp4" -c:a acc -c:v h264_nvenc -preset p6 -tune hq -b:v "1219000" -bufsize "3219000" -maxrate "3219000" -qmin 0 -r 30 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 20 -i_qfactor 0.75 -b_qfactor 1.1 "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/output/hd.mkv" -y

ffmpeg\ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/4.mp4" -c:a copy -c:v h264_nvenc -b:v 220k -r 30 -g 250 "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/output/4.mp4" -y

-- SPEED UP

ffmpeg\ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/hd.mp4" -filter_complex "[0:v]setpts=PTS/2.0;[0:a]atempo=2.0" -c:v h264_nvenc -c:a eac3 -preset p6 -tune hq -b:v "1219000" -bufsize "3219000" -maxrate "3219000" -qmin 0 -r 30 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 20 -i_qfactor 0.75 -b_qfactor 1.1 "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/output/hd.mp4" -y

#Trim video
ffmpeg\ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/test-AAA.mp4" -ss 0 -to 30 -c:a copy -c:v copy -preset p6 -b:v "1219000" -bufsize "3219000" -maxrate "3219000" -r 30 -qmin 0 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 20 -i_qfactor 0.75 -b_qfactor 1.1 "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/output/test-AAA-split.mp4" -y

#SPLIT Per Minute
ffmpeg\ffmpeg -i "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/test-AAA.mp4" -c:a copy -c:v copy -map 0 -segment_time 115 -f segment -reset_timestamps 1 -preset p6 -b:v "1219000" -bufsize "3219000" -maxrate "3219000" -r 30 -qmin 0 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 20 -i_qfactor 0.75 -b_qfactor 1.1 "C:/Users/USER/Downloads/Video Downloader - tCode.tTool/Video Downloader/videos/test/Youtube/playlist/output/test-AAA-split-%d.mp4" -y

ffmpeg\ffmpeg -i "D:/VCAMCODE/Python/Projects/Video Downloder/video-yt-dlp-project-1/test/test1.mp4" -b:v 150816 -bufsize 452448 -maxrate 452448 -qmin 0 -g 250 -bf 3 -b_ref_mode middle -temporal-aq 1 -rc-lookahead 20 -i_qfactor 0.75 -b_qfactor 1.1 "D:/VCAMCODE/Python/Projects/Video Downloder/video-yt-dlp-project-1/test/output/test1.mp4" -y
