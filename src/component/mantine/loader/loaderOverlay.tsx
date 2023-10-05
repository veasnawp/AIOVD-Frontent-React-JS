import { Box, Flex, Loader, MantineNumberSize, DefaultMantineColor , Sx } from "@mantine/core";


interface LoadingOverlayProps {
  renderContent?: React.ReactNode;
  loader: boolean;
  loaderType?: 'bars' | 'oval' | 'dots';
  size?: MantineNumberSize;
  color?: DefaultMantineColor ;
  zIndex?: number;
  sx?: Sx | (Sx | undefined)[];
}

/**
 *
 * @param loader: true if you want to show the loading overlay
 * @param sx: set background color and blur when it's loading overlay
 * @example sx:
 * sx={{
 *    backgroundColor:scheme(colorSchemes.sectionBGColorTr(0.75)),
 *    backdropFilter: "blur(0.05rem)",
 * }}
 */

export const MyLoadingOverlay = ({renderContent, loader, loaderType, size, color, zIndex, sx}: LoadingOverlayProps) => {

  const zIndex_ = zIndex || 200
  return (
    loader ?
      <Flex justify="center" align="center"
        sx={{
          position: "absolute", inset: 0,
          overflow: "hidden", zIndex: zIndex_,
            ...sx,
        }}
      >
        {/* <Loader color={color} variant={loaderType} size={size||24} sx={{zIndex: zIndex_ + 1}} /> */}
        <Flex justify="center" align="center" direction="column"
          sx={{
            position: "absolute", inset: 0,
            // width: "50%", height: "50%",
            // backdropFilter: "blur(0.1rem)",
            // borderRadius: "10px",
            // boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 8px -1px",
            zIndex: zIndex_,
          }}
        >
          <Loader color={color} variant={loaderType} size={size||24} sx={{zIndex: zIndex_ + 1}} />
        </Flex>
      </Flex>
    : renderContent
  )
};
