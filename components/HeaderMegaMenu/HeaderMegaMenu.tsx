'use client';

import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  useMantineTheme,
  Image
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes2 from './ProfileControl.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
} from '@tabler/icons-react';
import classes from './HeaderMegaMenu.module.css';
import '@/app/fb'
import { user as initUser } from '@/app/fb';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { MantineProvider } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';

const mockdata = [
  {
    icon: IconCode,
    title: 'Reason 1',
    description: "It's good",
  },
  {
    icon: IconCoin,
    title: 'Reason 2',
    description: "Because why not",
  },
  {
    icon: IconBook,
    title: 'Reason 3',
    description: "Join us",
  },
  {
    icon: IconFingerprint,
    title: 'Reason 4',
    description: 'Ok',
  },
  {
    icon: IconChartPie3,
    title: 'Reason 5',
    description: 'Almost there',
  },
  {
    icon: IconNotification,
    title: 'Reason 6',
    description: "I'm learning now",
  },
];


export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const [user, changeUser] = useState(initUser);
  const theme = useMantineTheme();
  const router = useRouter();

  useEffect(() => {
    // listen to user data event
    document.addEventListener('userChanged', (u) => {
      // @ts-ignore
      var newUser: User = u.detail.newUser;
      changeUser(newUser);
    })


  }, [])

  function ProfileControl() {
    return (
      <UnstyledButton className={classes2.user} onClick={() => { router.push("/profile") }}>
        <Group>

          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {user.displayName}
            </Text>

            <Text c="dimmed" size="xs">
              {user.email}
            </Text>
          </div>

          <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
        </Group>
      </UnstyledButton>
    );
  }

  function ProfileControlSmall() {
    return (
      <UnstyledButton className={classes2.userSmall} onClick={() => { router.push("/profile") }}>
        <Group>

          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {user.displayName}
            </Text>

            <Text c="dimmed" size="xs">
              {user.email}
            </Text>
          </div>

          <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
        </Group>
      </UnstyledButton>
    );
  }

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon style={{ width: rem(22), height: rem(22) }} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box>
      <MantineProvider>
        <Notifications autoClose={4000} />
      </MantineProvider>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link href="/" style={{height: "100%"}}>
            <Image src="/logoFull.jpg" h="100%"/>
          </Link>
          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={classes.link}>
              Home
            </Link>
            <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Learn
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.blue[6]}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Reasons you should learn tennis</Text>
                  {/* <Anchor href="#" fz="xs">
                      View all
                    </Anchor> */}
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" c="dimmed">
                        Book a lesson now!
                      </Text>
                    </div>
                    <Button variant="default">Get started</Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            <Link href="/about" className={classes.link}>
              About Us
            </Link>
            <a href="#" className={classes.link}>
              Gallery
            </a>
          </Group>


          {user == null ? <Group visibleFrom="sm">

            <Button variant="default" component={Link} href="/login">Log in</Button>
            <Button component={Link} href="/signup">Sign up</Button>
          </Group> : <ProfileControl />}


          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Link href="/" className={classes.link}>
            Home
          </Link>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Learn
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
              />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <Link href="/about" className={classes.link}>
            About us
          </Link>
          <Link href="#" className={classes.link}>
            Gallery
          </Link>

          <Divider my="sm" />

          {user == null ? <Group justify="center" grow pb="xl" px="md">
            <Button variant="default" component={Link} href="/login">Log in</Button>
            <Button component={Link} href="/signup">Sign up</Button>
          </Group> : <ProfileControlSmall />}


        </ScrollArea>
      </Drawer>
    </Box>
  );
}