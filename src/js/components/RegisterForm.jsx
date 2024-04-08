import { Paper, TextInput, PasswordInput, Button, Title } from '@mantine/core';
import React from 'react';
import { Controller, Form, useForm } from 'react-hook-form';
import CenteredContainer from './CenteredContainer';
export function RegisterForm({ submitURL, onSuccess, onError }) {
    const { control } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    return (
        <CenteredContainer>
                <Paper className='logpage' withBorder shadow="md" p={40} mt={20} radius="md" style={{ width: '500px' }}>
                    <Title ta="center">
                        Hozz létre egy fiókot!
                    </Title>
                    <Form action={submitURL} encType="application/json" control={control} onSuccess={onSuccess} onError={onError}>
                        <Controller
                            control={control}
                            name="username"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput classNames={{ input: 'logpage' }} onChange={onChange} onBlur={onBlur} value={value} label="Felhasználónév" required />
                            )}
                        />
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput classNames={{ input: 'logpage' }} onChange={onChange} onBlur={onBlur} value={value} label="Email" type="email" required />
                            )}
                        />
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <PasswordInput classNames={{ input: 'logpage,' }} onChange={onChange} onBlur={onBlur} value={value} label="Jelszó" required />
                            )}
                        />
                        <Button variant="gradient"
                            gradient={{ from: 'rgba(0, 0, 0, 0.56)', to: 'yellow', deg: 90 }} type="submit" fullWidth={true} mt="xl">
                            Regisztrálok
                        </Button>
                    </Form>
                </Paper>
        </CenteredContainer>
    );
};