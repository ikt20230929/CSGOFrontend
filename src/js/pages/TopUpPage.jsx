import React, { useState, useEffect } from "react";
import { TextInput, Radio, Checkbox, Card, Text, Badge, Button, Group, NumberInput, Space, Loader } from '@mantine/core';
import { NavLink, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchEndpoint } from "../Globals";
import { useForm } from '@mantine/form';

export default function TopUpPage() {
  const [profileData, setProfileData] = useState({
    profile: []
  });
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      amount: '',
      termsOfService: false,
      paymentMethod: '',
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading to true when fetching data
      const profileResponse = (await fetchEndpoint("profile")).data;
      if (profileResponse == null) {
        navigate("/login");
        return;
      }
      setProfileData({
        profile: profileResponse
      });
      setIsLoading(false); // Set loading to false after data is fetched
    }
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      {isLoading ? ( // Conditional rendering of loader
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Loader color="rgba(0, 102, 255, 1)" size="xl" type="bars" />
        </div>
      ) : (
        <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mt="lg" mb="xs">
            <Text fw={900} size="25px" tt="uppercase" variant="gradient" gradient={{from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)'}}>Válassz az alábbi fizetési módok közül!</Text>
            <Badge color="pink">Adataid biztonságban vannak</Badge>
          </Group>
        <Space h="lg"></Space>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Radio
            label="Bankkártyás fizetés"
            value="Bankkártyás fizetés"
            name="paymentMethod"
            description="Ezzel a fizetési móddal +10% jóváírásra kerül az egyenlegedre."
            color="teal"
            size="lg"
            {...form.getInputProps('paymentMethod')}
          />
          <Space h="sm"></Space>
          <Radio
            label="PaySafeCard"
            value="PaySafeCard"
            name="paymentMethod"
            description="Pötyögd be a hátoldalán található kódot, és már pörgethetsz is!"
            color="teal"
            size="lg"
            {...form.getInputProps('paymentMethod')}
          />
          <Space h="sm"></Space>
          <Radio
            label="Paypal"
            value="Paypal"
            name="paymentMethod"
            description="Ezzel a fizetési móddal +15% jóváírásra kerül az egyenlegedre."
            color="teal"
            size="lg"
            {...form.getInputProps('paymentMethod')}
          />
          <Space h="sm"></Space>
          <Radio
            label="Fizess skinekkel"
            value="Fizess skinekkel"
            name="paymentMethod"
            description="Van néhány skined, amire nincs szükséged már, és szerencsét próbálnál? Akkor ez a te választásod!"
            color="teal"
            size="lg"
            {...form.getInputProps('paymentMethod')}
          />
          <Space h="md"></Space>
          <NumberInput withAsterisk
        label="Befizetni kívánt összeg"
        placeholder="$100"
        prefix="$"
        mb="md"
        allowNegative={false}
      />
                <Text size="md" fw={500}>Egyenleged: {formatCurrency(profileData.profile.balance)}</Text>
          <Space h="md"></Space>
          <Checkbox
            mt="md"
            color="teal"
            label="Elfogadom az Adatvédelmi és Általános Szerződési Feltételeket, beleértve, hogy adataim nem kerülnek publikálásra, és biztonságban lesznek."
            error="Mező kijelölése kötelező!"
            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
          />
          <Group justify="space-between" mt="md">
			<Link to="/profile">
				<Button variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 90}} radius="lg">
					Vissza
				</Button>
			</Link>
            <Button type="submit" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 90}} radius="lg">Befizetés</Button>
          </Group>
        </form>
      </Card>)}
    </div>
  );
}
