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
import { Controller, Form, useForm } from "react-hook-form";
import CenteredContainer from "./CenteredContainer";
import { Link } from 'react-router-dom';

export function LoginForm({ submitURL, onSubmit, onSuccess, onError, isInvalid }) {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  return (
    <CenteredContainer>
      <Paper className="regpage" withBorder shadow="md" p={40} mt={20} radius="md">
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
          <Form action={submitURL} onSubmit={handleSubmit(onSubmit)} encType="application/json" control={control} onSuccess={onSuccess} onError={onError}>
            <Controller control={control} name="username" render={({ field: { onChange, onBlur, value } }) => (
              <TextInput classNames={{ input: 'regpage' }} onChange={onChange} onBlur={onBlur} value={value} error={isInvalid} name="username" label="Felhasználónév" required />
            )} />
            <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput classNames={{ input: 'regpage' }} onChange={onChange} onBlur={onBlur} value={value} error={isInvalid} name="password" label="Jelszó" required mt="md" />
            )} />
            {isInvalid && <Text id="error" c="red">
              Helytelen felhasználónév vagy jelszó.
            </Text>}
            <Group justify="space-between" mt="lg">
              <Checkbox
                classNames={{ input: 'regpage' }}
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
          </Form>
        </Container>
      </Paper>
    </CenteredContainer>
  );
}