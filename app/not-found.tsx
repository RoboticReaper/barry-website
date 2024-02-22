import { Title, Text, Button, Container, Group } from '@mantine/core';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import Link from 'next/link';
import classes from './NotFound.module.css';

export default function notFound() {
  return (
    <div>
      <HeaderMegaMenu />
      <Container className={classes.root}>
        <div className={classes.label}>404</div>
        <Title className={classes.title}>Page does not exist.</Title>
        <Text c="dimmed" size="lg" ta="center" className={classes.description}>
          Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
          been moved to another URL.
        </Text>
        <Group justify="center">
          <Button variant="subtle" size="md" component={Link} href="/">
            Take me back to home page
          </Button>
        </Group>
      </Container>
    </div>
  );
}