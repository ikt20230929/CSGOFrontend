import React from "react";
import { Radio, Checkbox, Card, Text, Badge, Button, Group, NumberInput, Space, NumberFormatter } from '@mantine/core';
import { Link } from "react-router-dom";
import { useForm } from '@mantine/form';
import CenteredContainer from "../components/CenteredContainer";
import { useSelector } from "react-redux";

export default function TopUpPage() {
  const form = useForm({
    initialValues: {
      amount: '',
      termsOfService: false,
      paymentMethod: '',
    }
  });

  const { profile } = useSelector(state => state.data);

  return (
    <div className="topup">
      <Card className="logpage" shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mt="lg" mb="xs">
          <Text fw={900} size="25px" tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)' }}>Válassz az alábbi fizetési módok közül!</Text>
          <Badge color="pink">Adataid biztonságban vannak</Badge>
        </Group>
        <Space h="lg"></Space>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Radio
            classNames={{ radio: 'logpage' }}
            label="Bankkártyás fizetés"
            value="Bankkártyás fizetés"
            name="paymentMethod"
            description="Ezzel a fizetési móddal +10% jóváírásra kerül az egyenlegedre."
            color="cyan"
            size="lg"
            {...form.getInputProps('paymentMethod')}
          />
          <Space h="sm"></Space>
          <Radio
            classNames={{ radio: 'logpage' }}
            label="PaySafeCard"
            value="PaySafeCard"
            name="paymentMethod"
            description="Pötyögd be a hátoldalán található kódot, és már pörgethetsz is!"
            color="cyan"
            size="lg"
            {...form.getInputProps('paymentMethod')}
          />
          <Space h="sm"></Space>
          <Radio
            classNames={{ radio: 'logpage' }}
            label="Paypal"
            value="Paypal"
            name="paymentMethod"
            description="Ezzel a fizetési móddal +15% jóváírásra kerül az egyenlegedre."
            color="cyan"
            size="lg"
            {...form.getInputProps('paymentMethod')}
          />
          <Space h="sm"></Space>
          <Radio
            classNames={{ radio: 'logpage' }}
            label="Fizess skinekkel"
            value="Fizess skinekkel"
            name="paymentMethod"
            description="Van néhány skined, amire nincs szükséged már, és szerencsét próbálnál? Akkor ez a te választásod!"
            color="cyan"
            size="lg"
            {...form.getInputProps('paymentMethod')}
          />
          <Space h="md"></Space>
          <NumberInput withAsterisk
            classNames={{ input: 'logpage' }}
            label="Befizetni kívánt összeg"
            placeholder="$100"
            prefix="$"
            mb="md"
            allowNegative={false}
          />
          <Text size="md" fw={500}>Egyenleged: <NumberFormatter prefix="$" fixedDecimalScale={true} decimalScale={2} value={profile.balance} /></Text>
          <Space h="md"></Space>
          <Checkbox
            classNames={{ input: 'logpage' }}
            mt="md"
            color="cyan"
            label="Elfogadom az Adatvédelmi és Általános Szerződési Feltételeket, beleértve, hogy adataim nem kerülnek publikálásra, és biztonságban lesznek."
            error="Mező kijelölése kötelező!"
            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
          />
          <Group justify="space-between" mt="md">
            <Link to="/profile">
              <Button variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 90 }} radius="lg">
                Vissza
              </Button>
            </Link>
            <Button type="submit" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 90 }} radius="lg">Befizetés</Button>
          </Group>
        </form>
      </Card>
      </div>
  )
}
