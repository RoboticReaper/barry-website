import cx from 'clsx';
import { Title, Text, Container, Button, Overlay } from '@mantine/core';
import classes from './HeroImageBackground.module.css';

export function HeroImageBackground() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Welcome to Barry's Elite Tennis Academy{' '}
          {/* <Text component="span" inherit className={classes.highlight}>
            any stack
          </Text> */}
        </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Description goes here.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button className={classes.control} variant="white" size="lg">
            Get started
          </Button>
          <Button className={cx(classes.control, classes.secondaryControl)} size="lg">
            Learn more
          </Button>
        </div>
      </div>
    </div>
  );
}