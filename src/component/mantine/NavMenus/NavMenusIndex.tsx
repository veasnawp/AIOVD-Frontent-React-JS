import { createStyles, Navbar, getStylesRef, rem } from '@mantine/core';
import { Prettify } from '../helpers/HelperType';

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.colors.gray[5]}`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.colors.gray[8]}`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: 13,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[5],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    // borderRadius: theme.radius.sm,
    fontWeight: 500,
    cursor: "pointer",
    '&:hover': {
      // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colors.cyan[3],

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colors.cyan[3],
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.colors.cyan[7],
      color: theme.white,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.white,
      },
    },
  },
}));

export type ClassesNavbarSimpleIndex = {
  header?: string;
  footer?: string;
  link?: string;
  linkIcon?: string;
  linkActive?: string;
}

type DataNavbar = {
  link?: string;
  label: string;
  icon: (props: any) => JSX.Element;
}

interface NavbarSimpleIndexProps {
  data?: Prettify<DataNavbar>[];
  active?: number;
  setActive?: (index: number) => void;
  footerSection?: (classes: Prettify<ClassesNavbarSimpleIndex>) => JSX.Element | JSX.Element[];
}

export function NavbarSimpleIndex({
  data,
  active,
  setActive,
  footerSection,
}: NavbarSimpleIndexProps) {
  const { classes, cx } = useStyles();
  // const [active, setActive] = useState(0);

  const links = data?.map((item, index) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: index === active })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive?.(index);
        // setActiveContentIndex?.(index);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <>
      <Navbar.Section grow>
        {links}
      </Navbar.Section>

      { footerSection &&
      <Navbar.Section className={classes.footer}>
        {footerSection?.(classes)}
        {/* <a href="" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a href="" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a> */}
      </Navbar.Section>
      }
    </>
  );
}