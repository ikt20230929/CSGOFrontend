import { Paper, TextInput, PasswordInput, Button, Title } from '@mantine/core';
import React from 'react';
import { useForm } from '@mantine/form';
import CenteredContainer from './CenteredContainer';
export function RegisterForm({ onSubmit }) {
    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    return (
        <CenteredContainer>
                <Paper className='logpage' withBorder={true} shadow="md" p={40} mt={20} radius="md" style={{ width: '500px' }}>
                    <Title ta="center">
                        Hozz létre egy fiókot!
                    </Title>
                    <form encType="application/json" onSubmit={form.onSubmit(onSubmit)}>
                        <TextInput classNames={{ input: 'logpage' }} value={form.values.username} onChange={(event) => form.setFieldValue('username', event.currentTarget.value)} label="Felhasználónév" required />
                        <TextInput classNames={{ input: 'logpage' }} value={form.values.email} onChange={(event) => form.setFieldValue('email', event.currentTarget.value)} label="Email" type="email" required />
                        <PasswordInput classNames={{ input: 'logpage' }} value={form.values.password} onChange={(event) => form.setFieldValue('password', event.currentTarget.value)} label="Jelszó" required />
                        <Button variant="gradient"
                            gradient={{ from: 'rgba(0, 0, 0, 0.56)', to: 'yellow', deg: 90 }} type="submit" fullWidth={true} mt="xl">
                            Regisztrálok
                        </Button>
                    </form>
                </Paper>
        </CenteredContainer>
    );
};