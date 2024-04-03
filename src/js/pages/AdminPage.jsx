import React, { useEffect, useState } from "react";
import { Card, Group, Text, Space, Modal, Button, TextInput, FileInput, Grid, Badge } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useSelector } from "react-redux";
import ItemContainer from "../components/ItemContainer";
import axios from "axios";
import { API_URL } from "../settings";
import store from "../store";

export default function ProfilePage() {
  
  // modals
  const newCaseModal = useDisclosure(false);
  const banPlayerModal = useDisclosure(false);
  const editCaseModal = useDisclosure(false);
  const showCaseModal = useDisclosure(false);
  const showDeleteCaseModal = useDisclosure(false);

  // Láda szerkesztésnél felhasznált adatok
  const [newCaseName, setNewCaseName] = useState(null);
  const [newCasePrice, setNewCasePrice] = useState(null);
  const [newCaseImage, setNewCaseImage] = useState(false);

  const [onError, setOnError] = useState(false);

  const { cases } = useSelector(state => state.data);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedCase, setSelectedCase] = useState({
    caseName: '',
    itemValue: 0,
    items: []
  });
  
  // Láda létrehozása
  const createCase = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${API_URL}/admin/cases`,
        headers: {
          'Authorization': `Bearer ${store.getState().auth.accessToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          Name: newCaseName,
          Value: newCasePrice,
          //Image: newCaseImage - Egyelőre nem létezik
        }
      })
      setNewCaseName(null)
      setNewCasePrice(null);
    } catch (error) {
      setOnError(true);
    }
  }

  // Láda szerkesztése
  const editCase = async (caseId) => {
    try {
      const response = await axios({
        method: 'put',
        url: `${API_URL}/admin/cases/${caseId}`,
        headers: {
          'Authorization': `Bearer ${store.getState().auth.accessToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          Name: newCaseName,
          Value: newCasePrice,
          //Image: newCaseImage - Egyelőre nem létezik
        }
      })
      setNewCaseName(null)
      setNewCasePrice(null);
    } catch (error) {
      setOnError(true);
    }
  }

  // Láda törlése 
  const deleteCase = async (caseId) => {
    try {
      const response = await axios({
        method: 'delete',
        url: `${API_URL}/admin/cases/${caseId}`,
        headers: {
          'Authorization': `Bearer ${store.getState().auth.accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      // Sikeres törlés megerősítés ide
    } catch (error) {
      setOnError(true);
      console.log(error);
    }
  }

  useEffect(() => {
    let item = cases.find((item) => item.caseId == selectedCaseId);

    if (item) {
      setSelectedCase(item);
    }
  }, [selectedCaseId]);

  const handleCloseModal = () => {
    setOnError(false);
  };

  return (
    <div>
      <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{ minHeight: "calc(100vh - 3.5rem)" }}>
        <Group justify="space-between" mt="lg" mb="xs">
          <Text size='90px' fw={700} tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(143, 143, 143, 1)', deg: 90 }}>
            ADMIN PANEL
          </Text>
        </Group>

        <Modal opened={newCaseModal[0]} onClose={newCaseModal[1].close} title="Új láda adatai" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <TextInput label="Név" placeholder="Your Case" value={newCaseName} onChange={(e) => setNewCaseName(e.target.value)}/>
          <TextInput label="Ár" placeholder="20$" value={newCasePrice} onChange={(e) => setNewCasePrice(e.target.value)}/>
          <FileInput variant="filled" label="Láda képe" description="Válassz az új ládának egy képet!" placeholder="Katt!" />
          <Space h="md" />
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={() => {newCaseModal[1].close; createCase()}}
          disabled={newCaseName == null && newCasePrice == null}>
            Mentés
          </Button>
        </Modal>

        <Button onClick={() => newCaseModal[1].open()} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
          Új láda hozzáadása
        </Button>
        <Space h="sm"></Space>

        <Modal opened={editCaseModal[0]} onClose={editCaseModal[1].close} title="Láda szerkesztése" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <TextInput label="Név" value={newCaseName} onChange={(e) => {setNewCaseName(e.target.value)}}/>
          <TextInput label="Ár" value={newCasePrice} onChange={(e) => {setNewCasePrice(e.target.value)}}/>
          <FileInput variant="filled" label="Láda képe" description="Válassz az új ládának egy képet!" placeholder="Katt!" />
          <Space h="md" />
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={() => {editCaseModal[1].close; editCase(selectedCase.caseId)}}>
            Mentés
          </Button>
        </Modal>

        <Modal size={"lg"} opened={showCaseModal[0]} onClose={showCaseModal[1].close} title="Láda megtekintése" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <Text size='16px' fw={700} tt="uppercase">
            {selectedCase.caseName}
          </Text>
          <Text size="sm" c="dimmed">Ár: {selectedCase.itemValue}</Text>
          <Text size="xl">Tárgyak ({selectedCase.items.length} db):</Text>
          <Space h="md" />
          <Grid>
            {selectedCase.items.map(item => <ItemContainer key={item.itemId} item={item} />)}
          </Grid>
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} onClick={showCaseModal[1].close}>Bezárás</Button>
          <Button>Kiválasztott tárgyak törlése</Button>
        </Modal>

        <Modal opened={onError} title="Hiba a művelet során!" onClose={handleCloseModal}>
          <Space h="xs" />
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} onClick={handleCloseModal}>Bezárás</Button>  
        </Modal>

        <Modal opened={showDeleteCaseModal[0]} onClose={showDeleteCaseModal[1].close} title="Biztosan törölni szeretnéd a ládát?">
          <Space h="xs" />
          <Button style={{margin:"5px"}} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} onClick={() =>deleteCase(selectedCase.caseId)}>Törlés</Button>
          <Button variant="gradient" gradient={{ from: 'cyan', to: 'indigo', deg: 90 }} onClick={showDeleteCaseModal[1].close}>Mégsem</Button>
        </Modal>

        <Card className="admincase" shadow="sm" padding="lg" radius="md" withBorder style={{ width: "100vw" }}>
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>LÁDÁK SZERKESZTÉSE</Text>
            <Badge color="pink">Összes láda: ({cases.length} db)</Badge>
          </Group>
          <Grid gutter="lg">
            {cases.map(_case => (
              <Grid.Col span={3} key={_case.caseId}>
                <Card className="admincase" shadow="sm" padding="lg" radius="md" withBorder>
                  <Text>{_case.caseName}</Text>
                  <Text size="sm" c="dimmed">({_case.items.length} db)</Text>
                  <Space h="xs"></Space>
                  <Button onClick={() => {
                    setSelectedCaseId(_case.caseId);
                    showCaseModal[1].open();
                  }} variant="outline" color="blue">Megtekintés</Button>
                  <Space h="xs"></Space>
                  <Button onClick={() => {
                    setSelectedCaseId(_case.caseId);
                    editCaseModal[1].open();
                    setNewCaseName(_case.caseName);
                    setNewCasePrice(_case.itemValue);
                  }} variant="outline" color="yellow">Szerkesztés</Button>
                  <Space h="xs"></Space>
                  <Button variant="outline" color="red" onClick={() => {showDeleteCaseModal[1].open();setSelectedCaseId(_case.caseId);}}>Törlés</Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Card>
      </Card>
    </div>
  );
}
