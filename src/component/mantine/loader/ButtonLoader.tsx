import { Button, Loader, ButtonProps, Tooltip, ActionIcon } from '@mantine/core';
import type { DefaultMantineColor, TooltipProps, ActionIconProps, LoaderProps } from '@mantine/core';
import { useState } from 'react';
import { Prettify } from '../helpers/HelperType';
import type { PolymorphicComponentProps } from '@mantine/utils';

interface ButtonLoaderProps extends ButtonProps, React.HTMLAttributes<any> {
  icon?: React.ReactNode;
  color?: DefaultMantineColor;
  timeout?: number;
  callback?: {
    beforeSend?: (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
    success?: (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
  };
  useUnstyled?: boolean;
  tooltip?: Prettify<TooltipProps> ;
}

export function ButtonLoader({
  icon,
  color,
  timeout,
  callback,
  loaderProps,
  useUnstyled,
  tooltip,
  ...props
}: ButtonLoaderProps) {
  const [loader, setLoader] = useState(false)
  // const ButtonType = useUnstyled ? UnstyledButton : Button
  const buttonLoader =
    <Button
      color={color}
      onClick={(event)=> {
        setLoader(true);
        callback?.beforeSend?.(event)
        setTimeout(
          () => {
            callback?.success?.(event)
            setLoader(false);
          },
          timeout || 1500
        )
      }}
      rightIcon={
        loader === true ? (
          // tooltip?.label ?
          // <Tooltip label={tooltip.label} withArrow><Loader color={color} size={16} {...loaderProps} /></Tooltip>
          // :
          <Loader color={color} size={16} {...loaderProps} />
        )
        : icon
      }
      {...props}
    />
  return (
    tooltip?.label ?
    <Tooltip withArrow {...tooltip}>
      {buttonLoader}
    </Tooltip>
    : buttonLoader
  )
}

interface ActionIconLoaderProps extends PolymorphicComponentProps<"button", ActionIconProps> {
  icon?: React.ReactNode;
  loaderIcon?: React.ReactNode;
  timeout?: number;
  loaderProps?: Prettify<LoaderProps>;
  callback?: {
    beforeSend?: (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
    success?: (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
  };
  tooltip?: TooltipProps;
}

export function ActionIconLoader({
  icon,
  loaderIcon,
  timeout,
  callback,
  loaderProps,
  tooltip,
  ...props
}: ActionIconLoaderProps) {
  const [loader, setLoader] = useState(false)

  const actionIcon =
    <ActionIcon
      onClick={(event)=> {
        setLoader(true);
        callback?.beforeSend?.(event)
        setTimeout(
          () => {
            callback?.success?.(event)
            setLoader(false);
          },
          timeout || 1500
        )
      }}
      {...props}
    >
      {
        loader === true ? (
          loaderIcon
          ? loaderIcon
          : <Loader size={16} {...loaderProps} />
        )
        : icon
      }
    </ActionIcon>

  return (
    tooltip?.label ?
    <Tooltip withArrow {...tooltip}>
      {actionIcon}
    </Tooltip>
    : actionIcon
  )
}

