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

export function LoginForm({submitURL, onSubmit, onSuccess, onError, isInvalid }) {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });
  
  return (
    <Container size={420} my={40}>
      <Title ta="center">
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Form action={submitURL} onSubmit={handleSubmit(onSubmit)} encType="application/json" control={control} onSuccess={onSuccess} onError={onError}>
            <Controller control={control} name="username" render={({ field: { onChange, onBlur, value } }) => (
                <TextInput onChange={onChange} onBlur={onBlur} value={value} error={isInvalid} name="username" label="Username" required />
            )} />
            <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput onChange={onChange} onBlur={onBlur} value={value} error={isInvalid} name="password" label="Password" required mt="md" />
            )} />
            {isInvalid && <Text id="error" c="red">
              Invalid username or password.
            </Text>}
            <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
                Forgot password?
            </Anchor>
            </Group>
            <Button type="submit" fullWidth mt="xl">
            Sign in
            </Button>
        </Form>
      </Paper>
    </Container>
  );
}