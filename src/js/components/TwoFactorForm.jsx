import React from 'react';
import { Paper, TextInput, Button, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import CenteredContainer from './CenteredContainer';

export const TwoFactorForm = ({ onSubmit }) => {
    const form = useForm({
        initialValues: {
            totpToken: ''
        }
    });

    return (
        <CenteredContainer size={"lg"}>
            <Paper className='regpage' withBorder={true} shadow="md" p={30} mt={30} radius="md">
                <Text>Adjon meg egy kódot a hitelesítő alkalmazásból.</Text>
                <form onSubmit={form.onSubmit(onSubmit)}>
                    <TextInput classNames={{ input: 'regpage' }} name="totpToken" value={form.values.totpToken} onChange={(event) => form.setFieldValue('totpToken', event.currentTarget.value)} label="2FA Kód" required />
                    <Button type="submit" fullWidth={true} mt="xl">
                        Ellenőrzés
                    </Button>
                </form>
            </Paper>
        </CenteredContainer>
    );
};