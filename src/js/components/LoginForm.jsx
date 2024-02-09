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
  Center,
} from '@mantine/core';
import { Controller, Form, useForm } from "react-hook-form";

export function LoginForm({submitURL, onSubmit, onSuccess, onError, isInvalid }) {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });
  
  return (


<Center>
      <Paper className="regpage" withBorder shadow="md" p={30} mt={200} radius="md">
            <Container
     size={420} my={40}>
      <Title ta="center">
        Üdvözöljük!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Nincs még fiókod?{' '}
        <Anchor className="registernow" size="sm" component="button">
          Regisztrálj!
        </Anchor>
      </Text>
        <Form action={submitURL} onSubmit={handleSubmit(onSubmit)} encType="application/json" control={control} onSuccess={onSuccess} onError={onError}>
            <Controller control={control} name="username" render={({ field: { onChange, onBlur, value } }) => (
                <TextInput onChange={onChange} onBlur={onBlur} value={value} error={isInvalid} name="username" label="Felhasználónév" required />
            )} />
            <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput onChange={onChange} onBlur={onBlur} value={value} error={isInvalid} name="password" label="Jelszó" required mt="md" />
            )} />
            {isInvalid && <Text id="error" c="red">
              Helytelen felhasználónév vagy jelszó.
            </Text>}
            <Group justify="space-between" mt="lg">
            <Checkbox
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
            gradient={{ from: 'rgba(0, 0, 0, 0.6)', to: 'green', deg: 123 }} type="submit" fullWidth mt="xl" >
            Bejelentkezés
            </Button>
        </Form>
        </Container>
      </Paper>
      </Center>

  );
}