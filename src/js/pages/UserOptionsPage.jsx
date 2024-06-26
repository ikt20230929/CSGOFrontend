import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSelector } from 'react-redux';
import { Button, Card, Group, Modal, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { coerceToArrayBuffer, coerceToBase64Url, fetchEndpoint, fetchProfile } from '../Globals';
import axios from 'axios';
import { API_URL } from '../settings';

export default function UserOptionsPage() {
    const { profile } = useSelector(state => state.data);
    const { accessToken } = useSelector(state => state.auth);
    const modal1 = useDisclosure(false);
    const modal2 = useDisclosure(false);
    const modal3 = useDisclosure(false);
    const [totpSecret, setTotpSecret] = useState("");
    const [fallback, setFallback] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [assertionData, setAssertionData] = useState("");
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

        if (modal1[0] || modal2[0] || modal3[0]) {
            setPassword("");
            setErrorMessage("");
            setConfirmationCode("");
            setConfirm(false);
            setFallback(false);

            if (modal1[0]) fetchData();
            if (modal3[0]) fetchWebAuthn();
        };
    }, [modal1[0], modal2[0], modal3[0]]);

    const handleConfirmClick = async () => {
        if (confirmationCode.length != 6) return;
        var result = await axios.post(`${API_URL}/totp`, { code: confirmationCode }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            validateStatus: () => true
        });

        if (result.status == 200) {
            await fetchProfile();
            modal1[1].close();
        } else {
            setErrorMessage(result.data.message);
        }
    }

    const fetchWebAuthn = async () => {
        try {
            const response = await axios.delete(`${API_URL}/webauthn`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                validateStatus: () => true,
                data: {
                    mode: 1
                }
            });

            if (response.status !== 200) {
                return;
            }

            const publicKeyOptions = JSON.parse(response.data.message);
            const challenge = publicKeyOptions.challenge.replace(/-/g, "+").replace(/_/g, "/");
            publicKeyOptions.challenge = Uint8Array.from(atob(challenge), c => c.charCodeAt(0));

            publicKeyOptions.allowCredentials.forEach(function (listItem) {
                var fixedId = listItem.id.replace(/\_/g, "/").replace(/\-/g, "+");
                listItem.id = Uint8Array.from(atob(fixedId), c => c.charCodeAt(0));
            });

            let credential = await navigator.credentials.get({ publicKey: publicKeyOptions });
            let authData = new Uint8Array(credential.response.authenticatorData);
            let clientDataJSON = new Uint8Array(credential.response.clientDataJSON);
            let rawId = new Uint8Array(credential.rawId);
            let sig = new Uint8Array(credential.response.signature);

            const assertionData = {
                id: credential.id,
                rawId: coerceToBase64Url(rawId),
                type: credential.type,
                clientExtensionResults: credential.getClientExtensionResults(),
                response: {
                    authenticatorData: coerceToBase64Url(authData),
                    clientDataJSON: coerceToBase64Url(clientDataJSON),
                    signature: coerceToBase64Url(sig)
                }
            };

            setAssertionData(assertionData);

        } catch (err) {
            console.log(err);
        }
    };

    const disableWebAuthn = async () => {
        if (password.length == 0 || assertionData.length == 0) return;

        try {
            const authResponse = await axios.delete(`${API_URL}/webauthn`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                validateStatus: () => true,
                data: {
                    mode: 2,
                    password: password,
                    data: assertionData
                }
            });

            if (authResponse.status !== 200) {
                return;
            } else {
                await fetchProfile();
                modal3[1].close();
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleDisableClick = async () => {
        if (confirmationCode.length != 6) return;
        if (password.length == 0) return;

        var result = await axios.delete(`${API_URL}/totp`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                code: confirmationCode,
                password: password
            },
            validateStatus: () => true
        })

        if (result.status == 200) {
            await fetchProfile();
            modal2[1].close();
        } else {
            setErrorMessage(result.data.message);
        }
    }

    async function enableWebauthn() {
        var response = await axios.post(`${API_URL}/webauthn`, { mode: 1 }, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        var credentialOptions = JSON.parse(response.data.message);
        credentialOptions.challenge = coerceToArrayBuffer(credentialOptions.challenge);
        credentialOptions.user.id = coerceToArrayBuffer(credentialOptions.user.id);

        if (credentialOptions.authenticatorSelection.authenticatorAttachment === null) {
            credentialOptions.authenticatorSelection.authenticatorAttachment = undefined;
        }

        let newCredential;
        try {
            newCredential = await navigator.credentials.create({ publicKey: credentialOptions });
        } catch (e) {
            console.error(e);
            return;
        }

        let attestationObject = new Uint8Array(newCredential.response.attestationObject);
        let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
        let rawId = new Uint8Array(newCredential.rawId);

        const data = {
            mode: 2,
            data: {
                id: newCredential.id,
                rawId: coerceToBase64Url(rawId),
                type: newCredential.type,
                clientExtensionResults: newCredential.getClientExtensionResults(),
                response: {
                    AttestationObject: coerceToBase64Url(attestationObject),
                    clientDataJSON: coerceToBase64Url(clientDataJSON)
                }
            }
        };

        var response = await axios.post(`${API_URL}/webauthn`, data, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status == 200) {
            await fetchProfile();
        }
    }

    return (
        <div style={{ height: '100vh' }}>
            <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify='space-between' mt="lg" mb="xs" grow>
                    <Text fw={500}>Két-faktoros authentikáció</Text>
                    <Text fw={500}>{profile.userTotpEnabled ? "Aktív" : "Inaktív"}</Text>
                    {!profile.userTotpEnabled ? <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} radius="lg" onClick={() => modal1[1].open()}>Aktiválás</Button> : <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} radius="lg" onClick={() => modal2[1].open()}>Kikapcsolás</Button>}
                </Group>
                <Group justify='space-between' mt="lg" mb="xs" grow>
                    <Text fw={500}>Biztonsági kulcsos authentikáció</Text>
                    <Text fw={500}>{profile.userWebauthnEnabled ? "Aktív" : "Inaktív"}</Text>
                    {!profile.userWebauthnEnabled ? <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} radius="lg" onClick={enableWebauthn}>Aktiválás</Button> : <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} radius="lg" onClick={() => modal3[1].open()}>Kikapcsolás</Button>}
                </Group>
                <Modal opened={modal1[0]} title="Két-faktoros authentikáció" centered classNames={{ header: 'logpage', content: 'logpage' }} size={"auto"} onClose={modal1[1].close} withCloseButton={false} styles={{
                    title: { textAlign: 'center' }
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
                                    classNames={{ input: 'logpage' }}
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
                        <Button onClick={modal1[1].close}>Mégse</Button>
                        {!confirm && <Button onClick={() => setConfirm(true)}>Tovább</Button>}
                        {confirm && <Button onClick={handleConfirmClick}>OK</Button>}
                    </Group>
                </Modal>
                <Modal opened={modal2[0]} title="Erősítse meg, hogy ön az" centered classNames={{ header: 'logpage', content: 'logpage' }} size={"auto"} onClose={modal2[1].close} withCloseButton={false} styles={{
                    title: { textAlign: 'center' },
                }}>
                    <Stack align='center'>
                        <Text size='xl'>A két faktoros bejelentkezés kikapcsolásához adja meg az alábbi adatokat:</Text>
                        <Text>Hitelesítési kód</Text>
                        <TextInput error={errorMessage}
                            value={confirmationCode}
                            onChange={(event) => setConfirmationCode(event.target.value)}
                            placeholder="Hitelesítési kód"
                            maxLength={6}
                            style={{ width: '50%' }}
                            classNames={{ input: 'logpage' }}
                        />

                        <Text>Jelszó</Text>
                        <PasswordInput error={errorMessage}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Jelszó"
                            style={{ width: '50%' }}
                            classNames={{ input: 'logpage' }}
                        />
                    </Stack>
                    <Group mt={20} gap={5} justify='flex-end'>
                        <Button onClick={modal2[1].close}>Mégse</Button>
                        <Button onClick={handleDisableClick}>OK</Button>
                    </Group>
                </Modal>
                <Modal opened={modal3[0]} title="Erősítse meg, hogy Ön az" centered classNames={{ header: 'logpage', content: 'logpage' }} size={"auto"} onClose={modal3[1].close} withCloseButton={false} styles={{
                    title: { textAlign: 'center' },
                }}>
                    <Stack align='center'>
                        <Text size='xl'>Biztonsági kulcsos authentikáció kikapcsolása</Text>
                        <p>Helyezd be a biztonsági kulcsot, és érintsd meg.<br />
                            Ha a biztonsági kulcs nem válaszol, kattints <a onClick={() => fetchWebAuthn()} style={{ cursor: "pointer", color: "lightblue" }}>ide.</a></p>

                        <Text>Jelszó</Text>
                        <PasswordInput error={errorMessage}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Jelszó"
                            style={{ width: '50%' }}
                            classNames={{ input: 'logpage' }}
                        />
                    </Stack>
                    <Group mt={20} gap={5} justify='flex-end'>
                        <Button onClick={modal3[1].close}>Mégse</Button>
                        <Button onClick={disableWebAuthn}>OK</Button>
                    </Group>
                </Modal>
            </Card>
        </div>
    );
}