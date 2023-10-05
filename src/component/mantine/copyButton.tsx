import { useState } from "react";
import { Button, ButtonProps, CopyButton, Loader, Input, ActionIcon, ActionIconProps, Tooltip, TooltipProps } from '@mantine/core';
import type { InputProps } from '@mantine/core';
import { IconClipboard, IconClipboardCheck } from "@tabler/icons-react";
import type { PolymorphicComponentProps } from '@mantine/utils';

type ValueObject = {
  textToCopy: string;
  ButtonProps?: ButtonProps
}

function CopyTextButton({textToCopy, ...ButtonProps}: ValueObject) {
  const [loader, setLoader] = useState<boolean|null>(false);

  return (
    <CopyButton value={textToCopy}>
      {({ copied, copy }) => (
        <Button {...ButtonProps} color={loader == true ? 'teal' : 'orange'}
          // disabled={loader == true ? true : undefined}
          // aria-disabled={loader == true ? true : false}
          onClick={ (e) => {
            e.preventDefault()
            setLoader(null)
            setTimeout(() => {
              setLoader(true)
              copy();
            },1500)
            setTimeout(() => {
              setLoader(false)
            },8000)
          }}
          rightIcon={loader === null ? <Loader color='orange' size={16} /> : ""}
        >
          { loader == true ? 'Copied' : 'Copy Live Data' }
        </Button>
      )}
    </CopyButton>
  )
};

export default CopyTextButton;

type CopyTextProps = {
  tooltipText?: string;
  tooltipColor?: string;
  textToCopy: string;
  tooltipProps?: TooltipProps,
  actionIconProps?: ActionIconProps,
  iconSize?: string | number;
  enableOnlyActionIcon?: boolean;
} & PolymorphicComponentProps<"input", InputProps>

export const defaultTooltipProps:any = {
  position:"right",
  withArrow: true,
  arrowPosition:"center",
}

type CopyProp = {
  copied:boolean;
  copy:()=>void
}

export function CopyTextInput({
  textToCopy,
  tooltipText,
  tooltipColor,
  tooltipProps,
  actionIconProps,
  iconSize,
  enableOnlyActionIcon,
  ...props
}: CopyTextProps) {
  const defaultProps = tooltipProps ?? {...defaultTooltipProps}

  const ActionIconCopy = (copied:boolean, copy:()=>void) => (
    <ActionIcon
      {...actionIconProps}
      onClick={copy}
    >
      {copied ? (
        <IconClipboardCheck size={iconSize || 20} />
      ) : (
        <IconClipboard size={iconSize || 20} />
      )}
    </ActionIcon>
  );
  const ActionElement = (copied:boolean, copy:()=>void) => (
    enableOnlyActionIcon == true
    ? ActionIconCopy(copied, copy)
    : (
      <Input
        size={"sm"}
        type="text"
        value={textToCopy}
        readOnly
        rightSection={ActionIconCopy(copied, copy)}
        {...props}
      />
    )
  );

  return (
    <CopyButton value={textToCopy}>
      {({ copied, copy }) => (
        <Tooltip color={tooltipColor} label={tooltipText || "click the icon to copy"} {...defaultProps}>
          {ActionElement(copied, copy)}
        </Tooltip>
      )}
    </CopyButton>
  )
};

