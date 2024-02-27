import React from 'react';
import {QRCodeSVG} from 'qrcode.react';
import { useSelector } from 'react-redux';
import { Button, Card, Center, Group, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function UserOptionsPage() {
    const { profile } = useSelector(state => state.data);
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{minHeight: "calc(100vh - 3.5rem)"}}>
            <Group mt="lg" mb="xs">
                <Text fw={500}>Két-faktoros authentikáció</Text>
                <Text fw={500}>{profile.totpEnabled ? "Aktív" : "Inaktív"}</Text>
                {!profile.totpEnabled && <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} radius="lg" onClick={open}>Aktiválás</Button>}
            </Group>
            <Modal opened={opened} title="Két-faktoros authentikáció" centered classNames={{ header: 'regpage', content: 'regpage' }} size={"auto"} onClose={close} withCloseButton={false} styles={{
                title: { textAlign: 'center' },
            }}>
                    <Stack align='center'>
                        <QRCodeSVG value="nem működik ne próbáld" includeMargin={true} />
                        <Text size='lg'>Olvassa be a QR-kódot</Text>
                        <Text>Használjon hitelesítő alkalmazást vagy böngészőbővítményt a beolvasáshoz.</Text>
                        <Button variant="default">Nem tudja beolvasni?</Button>
                    </Stack>
                    <Group mt={20} gap={5} justify='flex-end'>
                            <Button onClick={close}>Mégse</Button>
                            <Button>Tovább</Button>
                    </Group>
            </Modal>
        </Card>
    );
}