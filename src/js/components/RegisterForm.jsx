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

<Center>
            <Paper className='regpage' withBorder shadow="md" p={30} mt={10} radius="md">
            <Title ta="center">
                Hozz létre egy fiókot!
            </Title>
                <Form action={submitURL} encType="application/json" control={control} onSuccess={onSuccess} onError={onError}>
                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput onChange={onChange} onBlur={onBlur} value={value} label="Felhasználónév" required />
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
                            <PasswordInput onChange={onChange} onBlur={onBlur} value={value} label="Jelszó" required />
                        )}
                    />
                    <Button variant="gradient"
      gradient={{ from: 'rgba(0, 0, 0, 0.56)', to: 'yellow', deg: 90 }} type="submit" fullWidth mt="xl">
                        Regisztrálok
                    </Button>
                </Form>
            </Paper>
            </Center>
        </Container>
        </Flex>
        
    );
};