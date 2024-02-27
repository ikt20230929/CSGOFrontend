import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSelector } from 'react-redux';
import { Button, Card, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { fetchEndpoint, fetchProfile } from '../Globals';
import axios from 'axios';
import { API_URL } from '../settings';

export default function UserOptionsPage() {
    const { profile } = useSelector(state => state.data);
    const { accessToken } = useSelector(state => state.auth);
    const [opened, { open, close }] = useDisclosure(false);
    const [totpSecret, setTotpSecret] = useState("");
    const [fallback, setFallback] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const totpToken = (await fetchEndpoint("totp")).data.message;
            if (totpToken == null) {
                navigate("/login");
                return;
            }

            setTotpSecret(totpToken)
        }
        if (opened) {
            setConfirmationCode("");
            setConfirm(false);
            setFallback(false);

            fetchData();
        };
    }, [opened]);

    const handleConfirmClick = async() => {
        if(confirmationCode.length != 6) return;
        var result = await axios.post(`${API_URL}/totp`, {code: confirmationCode}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            validateStatus: () => true
        });

        if(result.status == 204) {
            await fetchProfile();
            close();
        }else{
            setErrorMessage("Érveletlen kód");
        }
    }

    return (
        <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{ minHeight: "calc(100vh - 3.5rem)" }}>
            <Group mt="lg" mb="xs">
                <Text fw={500}>Két-faktoros authentikáció</Text>
                <Text fw={500}>{profile.userTotpEnabled ? "Aktív" : "Inaktív"}</Text>
                {!profile.userTotpEnabled && <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} radius="lg" onClick={open}>Aktiválás</Button>}
            </Group>
            <Modal opened={opened} title="Két-faktoros authentikáció" centered classNames={{ header: 'regpage', content: 'regpage' }} size={"auto"} onClose={close} withCloseButton={false} styles={{
                title: { textAlign: 'center' },
            }}>
                {confirm ? (
                    <>
                        <Stack align='center'>
                            <Text size='xl'>Adjon meg egy kódot a hitelesítő alkalmazásból.</Text>
                            <TextInput error={errorMessage}
                                value={confirmationCode}
                                onChange={(event) => setConfirmationCode(event.target.value)}
                                placeholder="Kód"
                                maxLength={6}
                                classNames={{ input: 'regpage' }}
                            />
                        </Stack>
                    </>
                ) : (
                    fallback ?
                        <Stack align='center'>
                            <Text size='xl'>Nem tudja beolvasni?</Text>
                            <Text>Adja meg az alábbi kulcsot a hitelesítő alkalmazásában vagy böngészőbővítményben.</Text>
                            <Text size='lg' fw={700}>{totpSecret.toLowerCase().match(/(.{4})/g).join(' ')}</Text>
                            <Button variant="default" onClick={() => { setFallback(false); }}>Vissza</Button>
                        </Stack> :
                        <>
                            <Stack align='center'>
                                <QRCodeSVG value={`otpauth://totp/CSGO:${profile.userName}?secret=${totpSecret}&issuer=CSGO`} includeMargin={true} />
                                <Text size='lg' fw={700}>Olvassa be a QR-kódot</Text>
                                <Text>Használjon hitelesítő alkalmást vagy böngészőbővítményt a beolvasáshoz.</Text>
                                <Button variant="default" onClick={() => { setFallback(true); }}>Nem tudja beolvasni?</Button>
                            </Stack>
                        </>
                )}
                <Group mt={20} gap={5} justify='flex-end'>
                    <Button onClick={close}>Mégse</Button>
                    {!confirm && <Button onClick={() => setConfirm(true)}>Tovább</Button>}
                    {confirm && <Button onClick={handleConfirmClick}>OK</Button>}
                </Group>
            </Modal>
        </Card>
    );
}