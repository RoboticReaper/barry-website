import { Overlay, Container, Title, Button, Text } from '@mantine/core';
import classes from './GalleryHero.module.css';

export function GalleryHero() {
  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container} size="md">
        <Title className={classes.title}>Coaching session gallery</Title>
        <Text className={classes.description} size="xl" mt="xl">
          Below are some images and videos of our coaching session. More text...
        </Text>

        <Button variant="gradient" size="xl" radius="xl" className={classes.control} component="a" href="#images">
          Get started
        </Button>
      </Container>
    </div>
  );
}