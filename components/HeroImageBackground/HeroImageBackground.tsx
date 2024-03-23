import cx from 'clsx';
import { Title, Text, Container, Button, Overlay } from '@mantine/core';
import Link from 'next/link';
import classes from './HeroImageBackground.module.css';

export function HeroImageBackground() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Welcome to BEST Academy
        </Title>

        <Container size={700}>
          <Text size="lg" className={classes.description}>
            Our mission is to provide the highest quality level tennis and soccer instructions to students of all ages and abilities in a serious but fun environment. 
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button className={classes.control} variant="white" size="lg" component={Link} href="/about">
            Get started
          </Button>
          <Button className={cx(classes.control, classes.secondaryControl)} size="lg" component={Link} href="/about">
            Learn more
          </Button>
        </div>
      </div>
    </div>
  );
}