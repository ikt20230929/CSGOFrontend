import { Paper, TextInput, PasswordInput, Button, Title } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm } from '@mantine/form';
import CenteredContainer from './CenteredContainer';
export function RegisterForm({ onSubmit, isInvalid, error }) {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        form.setErrors({
            username: error,
            email: error,
            password: error
        });
    }, [isInvalid === true]);

    return (
        <CenteredContainer>
                <Paper className='logpage' withBorder={true} shadow="md" p={40} mt={20} radius="md" style={{ width: '500px' }}>
                    <Title ta="center">
                        Hozz létre egy fiókot!
                    </Title>
                    <form encType="application/json" onSubmit={form.onSubmit(onSubmit)}>
                        <TextInput classNames={{ input: 'logpage' }} {...form.getInputProps('username')} label="Felhasználónév" required />
                        <TextInput classNames={{ input: 'logpage' }} {...form.getInputProps('email')} label="Email" type="email" required />
                        <PasswordInput classNames={{ input: 'logpage' }} {...form.getInputProps('password')} label="Jelszó" required />
                        <Button variant="gradient"
                            gradient={{ from: 'rgba(0, 0, 0, 0.56)', to: 'yellow', deg: 90 }} type="submit" fullWidth={true} mt="xl">
                            Regisztrálok
                        </Button>
                    </form>
                </Paper>
        </CenteredContainer>
    );
};