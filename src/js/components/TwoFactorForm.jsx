import React from 'react';
import { Paper, TextInput, Button, Text } from '@mantine/core';
import { Container } from '@mantine/core';
import { Controller, Form, useForm } from 'react-hook-form';

export const TwoFactorForm = ({ submitURL, onSuccess, onError, userData }) => {
    const { control, register } = useForm();

    return (
        <Container size={420}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Text>Provide a code from your authenticator app.</Text>
                <Form action={submitURL} encType="application/json" control={control} onSuccess={onSuccess} onError={onError}>
                    <Controller
                        defaultValue={""}
                        control={control}
                        name="mfa.totpToken"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput name="totpToken" onChange={onChange} onBlur={onBlur} value={value} label="2FA Code" required />
                        )}
                    />
                    
                    <input hidden {...register("username")} value={userData.username} />
                    <input hidden {...register("password")} value={userData.password} />
                    <input hidden {...register("mfa.mfaType")} value="1" />
                    <Button type="submit" fullWidth mt="xl">
                        Verify
                    </Button>
                </Form>
            </Paper>
        </Container>
    );
};