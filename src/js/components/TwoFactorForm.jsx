import React, { useEffect } from 'react';
import { Paper, TextInput, Button, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import CenteredContainer from './CenteredContainer';
import { Link } from 'react-router-dom';

export const TwoFactorForm = ({ onSubmit, isInvalid, error, showWebAuthn }) => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            totpToken: ''
        }
    });

    useEffect(() => {
        form.setErrors({
            totpToken: error
        });
    }, [isInvalid === true]);

    return (
        <CenteredContainer size={"lg"}>
            <Paper className='logpage' withBorder={true} shadow="md" p={30} mt={30} radius="md">
                <Text>Adjon meg egy kódot a hitelesítő alkalmazásból.</Text>
                <form onSubmit={form.onSubmit(onSubmit)}>
                    <TextInput classNames={{ input: 'logpage' }} {...form.getInputProps('totpToken')} type='tel' pattern='[0-9]+' minLength={6} maxLength={6} label="2FA Kód" required />
                    {showWebAuthn && <Link to={"/login/webauthn"}>Próbálj újra bejelentkezni biztonsági kulccsal</Link>}
                    <Button type="submit" fullWidth={true} mt="xl">
                        Ellenőrzés
                    </Button>
                </form>
            </Paper>
        </CenteredContainer>
    );
};