import React from 'react';
import { Paper, TextInput, Button, Text } from '@mantine/core';
import { Controller, Form, useForm } from 'react-hook-form';
import CenteredContainer from './CenteredContainer';

export const TwoFactorForm = ({ submitURL, onSuccess, onError, userData }) => {
    const { control, register } = useForm();

    return (
        <CenteredContainer size={"lg"}>
            <Paper className='regpage' withBorder shadow="md" p={30} mt={30} radius="md">
                <Text>Adjon meg egy kódot a hitelesítő alkalmazásból.</Text>
                <Form action={submitURL} encType="application/json" control={control} onSuccess={onSuccess} onError={onError}>
                    <Controller
                        defaultValue={""}
                        control={control}
                        name="mfa.totpToken"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput classNames={{ input: 'regpage' }} name="totpToken" onChange={onChange} onBlur={onBlur} value={value} label="2FA Kód" required />
                        )}
                    />
                    
                    <input hidden {...register("username")} value={userData.username} />
                    <input hidden {...register("password")} value={userData.password} />
                    <input hidden {...register("mfa.mfaType")} value="1" />
                    <Button type="submit" fullWidth={true} mt="xl">
                        Ellenőrzés
                    </Button>
                </Form>
            </Paper>
        </CenteredContainer>
    );
};