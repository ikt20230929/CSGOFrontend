import React, { useEffect, useState } from "react";
import axios from "axios";
import { Radio, Checkbox, Card, Text, Badge, Button, Group, NumberInput, Space, NumberFormatter, Modal } from '@mantine/core';
import { Link } from "react-router-dom";
import { useForm } from '@mantine/form';
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../settings";
import { useDisclosure } from "@mantine/hooks";
import { fetchProfile } from "../Globals";
import store, { actions } from "../store";
const { setProfile } = actions;

export default function TopUpPage() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      amount: '',
      termsOfService: false,
      paymentMethod: ''
    }
  });

  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.data);
  const successfulPaymentModal = useDisclosure(false);
  const [successfulPayment, setSuccessfulPayment] = useState(false);

  const round = (num) => {
    var p = Math.pow(10, 2);
    var n = (num * p) * (1 + Number.EPSILON);
    return Math.round(n) / p;
  };

  const handleDeposit = async () => {
    const values = form.getValues();

    const modifier = values.paymentMethod == 'Bankkártyás fizetés' ? 1.1 :
      values.paymentMethod == 'PayPal' ? 1.15 : 1;
    const amount = round(values.amount * modifier);

    try {
      const response = await axios({
        method: 'post',
        url: `${API_URL}/deposit`,
        headers: {
          'Authorization': `Bearer ${store.getState().auth.accessToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          amount: amount
        }
      });
      successfulPaymentModal[1].open();
      setSuccessfulPayment(true);
    } catch (error) {
      console.log(error);
      console.log(amount);
    }
  }

  useEffect(() => {
    fetchProfile().then(() => {
      dispatch(setProfile(store.getState().data.profile));
    })
    setSuccessfulPayment(false);
  }, [dispatch, successfulPayment])

  return (
    <div className="topup">
      <Card className="logpage" shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mt="lg" mb="xs">
          <Text fw={900} size="1.3vw" tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)' }}>Válassz az alábbi fizetési módok közül!</Text>
          <Badge color="pink">Adataid biztonságban vannak</Badge>
        </Group>
        <Space h="lg"></Space>
        <form onSubmit={form.onSubmit(handleDeposit)}>
          <Radio.Group
            {...form.getInputProps('paymentMethod')}
          >
            <Radio
              classNames={{ radio: 'logpage' }}
              label="Bankkártyás fizetés"
              value="Bankkártyás fizetés"
              description="Ezzel a fizetési móddal +10% jóváírásra kerül az egyenlegedre."
              color="cyan"
              size="lg"
              required
            />
            <Space h="sm"></Space>
            <Radio
              classNames={{ radio: 'logpage' }}
              label="PaySafeCard"
              value="PaySafeCard"
              description="Pötyögd be a hátoldalán található kódot, és már pörgethetsz is!"
              color="cyan"
              size="lg"
            />
            <Radio
              classNames={{ radio: 'logpage' }}
              label="PayPal"
              value="PayPal"
              description="Ezzel a fizetési móddal +15% jóváírásra kerül az egyenlegedre."
              color="cyan"
              size="lg"
            />
            <Space h="sm"></Space>
            <Radio
              classNames={{ radio: 'logpage' }}
              label="Fizess skinekkel"
              value="Fizess skinekkel"
              description="Van néhány skined, amire nincs szükséged már, és szerencsét próbálnál? Akkor ez a te választásod!"
              color="cyan"
              size="lg"
            />
          </Radio.Group>
          <Space h="md"></Space>
          <NumberInput withAsterisk
            classNames={{ input: 'logpage' }}
            label="Befizetni kívánt összeg"
            placeholder="$100"
            prefix="$"
            mb="md"
            required
            allowNegative={false}
            {...form.getInputProps('amount')}
          />
          <Text size="md" fw={500}>Egyenleged: <NumberFormatter prefix="$" fixedDecimalScale={true} decimalScale={2} value={profile.userBalance} /></Text>
          <Space h="md"></Space>
          <Checkbox
            classNames={{ input: 'logpage' }}
            mt="md"
            color="cyan"
            label="Elfogadom az Adatvédelmi és Általános Szerződési Feltételeket, beleértve, hogy adataim nem kerülnek publikálásra, és biztonságban lesznek."
            required
            error="Mező kijelölése kötelező!"
            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
          />
          <Group justify="space-between" mt="md">
            <Link to="/profile">
              <Button variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 90 }} radius="lg">
                Vissza
              </Button>
            </Link>
            <Button variant="gradient" type="submit" gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 90 }} radius="lg">Befizetés</Button>
          </Group>
        </form>
      </Card>

      <Modal opened={successfulPaymentModal[0]} onClose={successfulPaymentModal[1].close} title={"Sikeres befizetés"}>
        <Text>Köszönjük, hogy minket választottál!</Text>
      </Modal>
    </div>
  )
}
