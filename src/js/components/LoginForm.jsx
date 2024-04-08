import React from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import { useForm } from "@mantine/form";
import CenteredContainer from "./CenteredContainer";
import { Link } from 'react-router-dom';

export function LoginForm({ onSubmit, isInvalid }) {
  const form = useForm({
    initialValues: {
      username: '',
      password: ''
    }
  });

  return (
    <CenteredContainer>
      <Paper className="logpage" withBorder={true} shadow="md" p={40} mt={20} radius="md">
        <Container
          size={420} my={40}>
          <Title ta="center">
            Üdvözöljük!
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Nincs még fiókod?{' '}
            <Link size="sm" to="/register">
              Regisztrálj!
            </Link>
          </Text>
          <form onSubmit={form.onSubmit(onSubmit)} encType="application/json">
            <TextInput classNames={{ input: 'logpage' }} onChange={(event) => form.setFieldValue('username', event.currentTarget.value)} value={form.values.username} error={isInvalid} name="username" label="Felhasználónév" required />
            <PasswordInput classNames={{ input: 'logpage' }} onChange={(event) => form.setFieldValue('password', event.currentTarget.value)} value={form.values.password} error={isInvalid} name="password" label="Jelszó" required mt="md" />
            {isInvalid && <Text id="error" c="red">
              Helytelen felhasználónév vagy jelszó.
            </Text>}
            <Group justify="space-between" mt="lg">
              <Checkbox
                classNames={{ input: 'logpage' }}
                defaultChecked
                label="Emlékezz rám"
                description="Ezzel megjegyezteted adataid"
                color="teal"
                size="md"
              />
              <Anchor component="button" size="sm">
                Elfelejtetted a jelszavad?
              </Anchor>
            </Group>
            <Button
              variant="gradient"
              gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 123 }} type="submit" fullWidth={true} mt="xl" >
              Bejelentkezés
            </Button>
          </form>
        </Container>
      </Paper>
    </CenteredContainer>
  );
}