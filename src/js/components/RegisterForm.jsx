import { Paper, TextInput, PasswordInput, Button, Container, Text, Title, Center, Flex } from '@mantine/core';
import React from 'react';
import { Controller, Form, useForm } from 'react-hook-form';
export function RegisterForm({ submitURL, onSuccess, onError }) {
    const { control } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    return (
    <Flex
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
        <Container style={{ width: '500px' }}>
            <Title ta="center">
                Create an account
            </Title>

            <Paper withBorder shadow="md" p={30} mt={10} radius="md">
                <Form action={submitURL} encType="application/json" control={control} onSuccess={onSuccess} onError={onError}>
                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput onChange={onChange} onBlur={onBlur} value={value} label="Username" required />
                        )}
                    />
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput onChange={onChange} onBlur={onBlur} value={value} label="Email" type="email" required />
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <PasswordInput onChange={onChange} onBlur={onBlur} value={value} label="Password" required />
                        )}
                    />
                    <Button type="submit" fullWidth mt="xl">
                        Register
                    </Button>
                </Form>
            </Paper>
        </Container>
        </Flex>
    );
};