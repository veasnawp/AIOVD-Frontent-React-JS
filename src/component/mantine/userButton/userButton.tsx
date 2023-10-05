import {
  UnstyledButton,
  UnstyledButtonProps,
  Avatar,
  Text,
  Flex,
} from '@mantine/core';
// import { IconChevronRight } from '@tabler/icons-react';

interface UserButtonProps extends UnstyledButtonProps, React.DOMAttributes<any> {
  component?: "button" | "div" | string,
  className?: string,
  name?: string;
  email?: string;
  image?: string | null;
  imageSize?: number;
  icon?: React.ReactNode;
}

export function UserButton({
  component, className,
  image, imageSize, name, email, icon,
  ...props
}: UserButtonProps) {
  const size = { w: imageSize ?? 34, h: imageSize ?? 34, miw: imageSize ?? 34 }
  return (
    <UnstyledButton component={component as "button"} className={className}
      {...props}

    >
      <Flex align="center" gap={8}>
        <div className='user-details' style={{ flex: 1 }}>
          <Text size="sm" weight={500} sx={{textWrap:"nowrap"}}>
            {name || "User's Name"}
          </Text>

          { email && <Text color="dimmed" size="xs">
              {email}
            </Text>
          }
        </div>
        <Avatar src={image} radius="xl" {...size} sx={{
          "svg:hover": {
            stroke: "unset"
          }
        }} />
        {icon}
      </Flex>
    </UnstyledButton>
  );
}