import React, { useEffect, useState } from "react";
import { Card, Group, Text, Space, Modal, Button, TextInput, FileInput, Grid, Badge, Combobox, useCombobox, Box } from "@mantine/core";
import { DateTimePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useSelector, useDispatch } from "react-redux";
import ItemContainer from "../components/ItemContainer";
import axios, { formToJSON } from "axios";
import { API_URL } from "../settings";
import { fetchProfile } from "../Globals";
import store, { actions } from "../store";
//const { setCases } = actions; - If I enable this, the store will not update the cases.
// But when it commented, the browser console spammed by errors :skull:

const rarity = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ProfilePage() {

  const dispatch = useDispatch();

  // modals
  const newCaseModal = useDisclosure(false);
  const newItemModal = useDisclosure(false);
  const editItemModal = useDisclosure(false);
  const modifyItemModal = useDisclosure(false);
  const deleteItemModal = useDisclosure(false);
  const confirmDeleteItemModal = useDisclosure(false);
  const editCaseModal = useDisclosure(false);
  const showCaseModal = useDisclosure(false);
  const showDeleteCaseModal = useDisclosure(false);
  const newCaseItemModal = useDisclosure(false);
  const newGiveAwayModal = useDisclosure(false);
  const newGiveAwaySuccessModal = useDisclosure(false);
  const actionsModal = useDisclosure(false);
  const uploadImageModal = useDisclosure(false);
  const uploadSuccesModal = useDisclosure(false);

  const [span, setSpan] = useState(3);

  const allModals = [newCaseModal, newItemModal, editCaseModal, showCaseModal, showDeleteCaseModal, newCaseItemModal, actionsModal, uploadImageModal, uploadSuccesModal];
  const [newItem, setNewItem] = useState({
    itemName: '',
    description: '',
    rarity: '',
    skinName: '',
    value: null,
    image: ''
  });

  // combobox
  const [selectedItem, setSelectedItem] = useState(false);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  // Láda szerkesztésnél felhasznált adatok
  const [newCaseName, setNewCaseName] = useState('');
  const [newCasePrice, setNewCasePrice] = useState('');
  const [newCaseImg, setNewCaseImg] = useState('');

  const [successfulDelete, setSuccessfulDelete] = useState(false);
  const [successfulAdd, setSuccessfulAdd] = useState(false);
  const [casesUpdated, setCasesUpdated] = useState(false);

  const [itemToModify, setItemToModify] = useState(false);

  const [newGiveAway, setNewGiveAway] = useState({
    name: '',
    desc: '',
    date: '',
    item: ''
  })

  const [onSuccess, setOnSuccess] = useState({
    method: '',
    success: false
  })
  const [itemList, setItemList] = useState([]);
  const [itemCreated, setItemCreated] = useState(false);
  const [onError, setOnError] = useState(false);

  const { cases } = useSelector(state => state.data);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedCase, setSelectedCase] = useState({
    caseName: '',
    itemValue: 0,
    items: []
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [image, setImage] = useState('');
  const [imageResponse, setImageResponse] = useState('');

  useEffect(() => {
    setCasesUpdated(true);
  }, [successfulAdd, successfulDelete, onSuccess.success, itemCreated,])

  useEffect(() => {
    fetchProfile()
      .then(success => {
        if (success) {
          dispatch(setCases(cases));
        }
      })
    setCasesUpdated(false);
    getItems(selectedCase);
  }, [dispatch, casesUpdated])

  const handleToggleItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSelect = (item) => {
    setItemToModify(item);
    editItemModal[1].close();
    closeAllModals();

    modifyItemModal[1].open();
  }

  const handleDelete = (item) => {
    setItemToModify(item);
    deleteItemModal[1].open();
    closeAllModals();

    confirmDeleteItemModal[1].open();
  }

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 820) {
        setSpan(6);
      } else if (width < 1200) {
        setSpan(4);
      } else {
        setSpan(3);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [window.innerWidth]);

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
          AssetUrl: newCaseImg
        }
      })
      setOnSuccess({
        method: 'create',
        success: true
      });

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
          AssetUrl: newCaseImg
        }
      })
      setOnSuccess({
        method: 'edit',
        success: true
      });

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
      setOnSuccess({
        method: 'delete',
        success: true
      });

    } catch (error) {
      setOnError(true);
      console.log(error);
    }
  }

  // Új tárgy létrehozása
  const createItem = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${API_URL}/admin/items`,
        headers: {
          'Authorization': `Bearer ${store.getState().auth.accessToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          Name: newItem.itemName,
          Description: newItem.description,
          Rarity: newItem.rarity,
          SkinName: newItem.skinName,
          Value: newItem.value,
          AssetUrl: newItem.image
        }
      })
      setItemCreated(true);
    } catch (error) {
      setOnError(true);
    }
  }

  // Meglévő tárgy szerkesztése
  const modifyItem = async () => {
    try {
      const response = await axios({
        method: 'put',
        url: `${API_URL}/admin/items/${itemToModify.itemId}`,
        headers: {
          'Authorization': `Bearer ${store.getState().auth.accessToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          Name: itemToModify.itemName,
          Description: itemToModify.itemDescription,
          Rarity: itemToModify.itemRarity,
          SkinName: itemToModify.itemSkinName,
          Value: itemToModify.itemValue,
          AssetUrl: itemToModify.itemAssetUrl
        }
      })
    } catch (error) {
      console.log(error)
      setOnError(true);
      console.log(itemToModify);
    }
  }

  // Tárgy törlése
  const deleteItem = async () => {
    try {
      const response = await axios({
        method: 'delete',
        url: `${API_URL}/admin/items/${itemToModify.itemId}`,
        headers: {
          'Authorization': `Bearer ${store.getState().auth.accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      closeAllModals(); 
      confirmDeleteItemModal[1].close();
      console.log(response);
    } catch (error) {
      setOnError(true);
      console.log(error);
    }
  }

  // Összes tárgy betöltése, kivéve amit a láda eleve tartalmaz
  const getItems = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: `${API_URL}/items`,
        headers: {
          'Authorization': `Bearer ${store.getState().auth.accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      setItemList(response.data.message.filter(item => !selectedCase.items.some(selectedItem => selectedItem.itemId === item.itemId)));
      console.log(itemList);
    } catch (error) {
      setOnError(true);
    }
  }

  // Tárgyak törlése ládából
  const deleteSelectedItems = async (caseId) => {
    try {
      for (const itemId of selectedItems) {
        const response = await axios({
          method: 'delete',
          url: `${API_URL}/admin/cases/${caseId}/items/${itemId}`,
          headers: {
            'Authorization': `Bearer ${store.getState().auth.accessToken}`,
            'Content-Type': 'application/json'
          }
        })
      }
      getItems(selectedCase);
      setSelectedItems([]);
      setSuccessfulDelete(true);
    } catch (error) {
      setOnError(true);
    }
  }

  // Tárgyak hozzáadása ládához
  const addSelectedItems = async (caseId) => {
    if (caseId != null) {
      try {
        for (const itemId of selectedItems) {
          const response = await axios({
            method: 'post',
            url: `${API_URL}/admin/cases/${caseId}/items/${itemId}`,
            headers: {
              'Authorization': `Bearer ${store.getState().auth.accessToken}`,
              'Content-Type': 'application/json'
            }
          })
        }
        getItems(selectedCase);
        setSelectedItems([]);
        setSuccessfulAdd(true);
      } catch (error) {
        setOnError(true);
        console.log(error)
      }
    } else {
      setNewGiveAway({ ...newGiveAway, item: selectedItems[0] });
      setSuccessfulAdd(true);
      setSelectedItems([]);
    }
  }

  // Nyereményjáték létrehozása
  const createGiveAway = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${API_URL}/admin/giveaways`,
        headers: {
          'Authorization': `Bearer ${store.getState().auth.accessToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          Name: newGiveAway.name,
          Description: newGiveAway.desc,
          Date: newGiveAway.date,
          ItemId: newGiveAway.item
        }
      })
      newGiveAwaySuccessModal[1].open();
    } catch (error) {
      setOnError(true);
    }
  }

  // Képfeltöltés adatbázisba 
  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios({
        method: 'post',
        url: `${API_URL}/admin/images`,
        headers: {
          'Authorization': `Bearer ${store.getState().auth.accessToken}`
        },
        data: formData
      })

      let res = response.data.message;
      setImageResponse(res.replace("/api", ""));
      uploadSuccesModal[1].open();
    } catch (error) {
      setOnError(true);
    }
  }

  const handleFileChange = (event) => {
    setImage(event);
  };

  useEffect(() => {
    let item = cases.find((item) => item.caseId == selectedCaseId);

    if (item) {
      setSelectedCase(item);
    }
  }, [selectedCaseId, getItems]);

  const handleCloseModal = () => {
    if (onSuccess.success == true) {
      setOnSuccess({
        success: false,
        method: null
      });
    } else {
      setOnError(false);
    }
    setSuccessfulAdd(false);
    setSuccessfulDelete(false);
  };

  const closeAllModals = () => {
    allModals.forEach(modal => {
      modal[1].close();
    });
  };

  //combobox
  const options = rarity.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <div>
      <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{ minHeight: "calc(100vh - 3.5rem)" }}>
        <Group justify="space-between" mt="lg" mb="xs">
          <Text size='5vw' fw={700} tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(143, 143, 143, 1)', deg: 90 }}>
            ADMIN PANEL
          </Text>
        </Group>

        <Modal opened={actionsModal[0]} onClose={actionsModal[1].close} title="Admin műveletek" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <Button fullWidth onClick={() => newCaseModal[1].open()} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
            Új láda hozzáadása
          </Button>
          <Space h="sm"></Space>
          <Button fullWidth onClick={() => newItemModal[1].open()} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
            Új tárgy létrehozása
          </Button>
          <Space h="sm"></Space>
          <Button fullWidth onClick={() => editItemModal[1].open()} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
            Tárgy szerkesztése
          </Button>
          <Space h="sm"></Space>
          <Button fullWidth onClick={() => deleteItemModal[1].open()} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
            Tárgy törlése
          </Button>
          <Space h="sm"></Space>
          <Button fullWidth onClick={() => newGiveAwayModal[1].open()} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
            Nyereményjáték indítása
          </Button>
          <Space h="sm"></Space>
          <Button fullWidth onClick={() => uploadImageModal[1].open()} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
            Képfeltöltés
          </Button>
        </Modal>

        <Modal opened={newCaseModal[0]} onClose={newCaseModal[1].close} title="Új láda adatai" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <TextInput label="Név" placeholder="Your Case" value={newCaseName} onChange={(e) => setNewCaseName(e.target.value)} />
          <TextInput label="Ár" placeholder="20$" value={newCasePrice} onChange={(e) => setNewCasePrice(e.target.value)} />
          <TextInput label="Láda képe" placeholder="Illeszd ide a kép URL-ét..." description="Válassz az új ládának egy képet!" onChange={(e) => setNewCaseImg(e.target.value)}/>
          <Space h="md" />
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={() => { newCaseModal[1].close; createCase() }}
            disabled={!newCaseName || !newCasePrice}>
            Mentés
          </Button>
        </Modal>

        <Modal opened={uploadImageModal[0]} onClose={() => {uploadImageModal[1].close; closeAllModals()}} title="Képfeltöltés" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <FileInput
            label="Kép"
            placeholder="Kép kiválasztása"  
            accept="image/png,image/jpeg"
            onChange={handleFileChange}/>
          <Space h="md" />
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={() => { uploadImageModal[1].close; uploadImage(); }}>Feltöltés</Button>
        </Modal>

        <Modal opened={uploadSuccesModal[0]} onClose={() => {uploadSuccesModal[1].close; closeAllModals();}} title="Sikeres feltöltés" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <TextInput value={imageResponse}></TextInput>  
        </Modal>

        <Modal opened={newGiveAwayModal[0]} onClose={newGiveAwayModal[1].close} title="Nyereményjáték adatai" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <TextInput label="Név" placeholder="Tavaszi kés nyereményjáték" value={newGiveAway.name} onChange={(e) => setNewGiveAway({ ...newGiveAway, name: e.target.value })} />
          <TextInput label="Leírás" placeholder="Csatlakozz és nyerj egy Karambit Fade-et!" value={newGiveAway.desc} onChange={(e) => setNewGiveAway({ ...newGiveAway, desc: e.target.value })} />
          <DateTimePicker label="Sorsolás időpontja" placeholder="Válassz időpontot!" dropdownType="modal" onChange={(e) => setNewGiveAway({ ...newGiveAway, date: e })} clearable />
          <Space h="md" />
          <TextInput label="Nyeremény" value={newGiveAway.item != '' ? "Kiválasztva" : "Nincs kiválasztva"} disabled />
          <Button onClick={() => { newCaseItemModal[1].open(); getItems(0); setSelectedItems([]); }}>Skin kiválasztása</Button>
          <Space h="md" />
          <Button onClick={() => { newGiveAwayModal[1].close; createGiveAway() }}>Létrehozás</Button>
        </Modal>

        {/* Tárgy készítés */}
        <Modal opened={newItemModal[0]} onClose={newItemModal[1].close} title="Új tárgy adatai" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <TextInput label="Név" placeholder="Karambit" value={newItem.itemName} onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })} />
          <TextInput label="Skin" placeholder="Fade" value={newItem.skinName} onChange={(e) => setNewItem({ ...newItem, skinName: e.target.value })} />
          <Box mb="xs">
            <Text span size="sm" c="dimmed">
              Ritkaság:{' '}
            </Text>

            <Text span size="sm">
              {selectedItem || 'Nincs kiválasztva'}
            </Text>
          </Box>

          <Combobox
            store={combobox}
            width={250}
            position="bottom-start"
            withArrow
            onOptionSubmit={(val) => {
              setSelectedItem(val);
              setNewItem({ ...newItem, rarity: val });
              combobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <Button onClick={() => combobox.toggleDropdown()}>Ritkaság kiválasztása</Button>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>{options}</Combobox.Options>

            </Combobox.Dropdown>
          </Combobox>
          <TextInput label="Ár" placeholder="20$" value={newItem.value} onChange={(e) => setNewItem({ ...newItem, value: e.target.value })} />
          <TextInput label="Leírás" placeholder="Knife" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
          <TextInput label="Tárgy képe" description="Válassz az új tárgynak egy képet!" placeholder="Illeszd ide a kép URL-ét..." onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}/>
          <Space h="md" />
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={() => {
            newCaseModal[1].close;
            createItem();
            console.log(newItem)
          }}
            disabled={!newItem.itemName || !newItem.value || !newItem.description || !newItem.skinName}>
            Mentés
          </Button>
        </Modal>

        {/* Tárgy szerkesztése selection*/}
        <Modal opened={editItemModal[0]} onClose={editItemModal[1].close} title="Tárgy szerkesztése" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <Grid>
            {itemList.map(item => <ItemContainer key={item.itemId} item={item} showChance={true} onToggleItem={handleSelect} spanWidth={span}/>)}
          </Grid>
        </Modal>

        {/* Tárgy szerkesztése*/}
        <Modal opened={modifyItemModal[0]} onClose={modifyItemModal[1].close} title="Tárgy szerkesztése" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <TextInput label="Név" value={itemToModify.itemName} onChange={(e) => setItemToModify({ ...itemToModify, itemName: e.target.value })} />
          <TextInput label="Skin" value={itemToModify.itemSkinName} onChange={(e) => setItemToModify({ ...itemToModify, itemSkinName: e.target.value })} />
          <Box mb="xs">
            <Text span size="sm" c="dimmed">
              Ritkaság:{' '}
            </Text>

            <Text span size="sm">
              {selectedItem || itemToModify.itemRarity}
            </Text>
          </Box>

          <Combobox
            store={combobox}
            width={250}
            position="bottom-start"
            withArrow
            onOptionSubmit={(val) => {
              setSelectedItem(val);
              setNewItem({ ...newItem, rarity: val });
              combobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <Button onClick={() => combobox.toggleDropdown()}>Ritkaság kiválasztása</Button>
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options>{options}</Combobox.Options>

            </Combobox.Dropdown>
          </Combobox>
          <TextInput label="Ár" value={itemToModify.itemValue} onChange={(e) => setItemToModify({ ...itemToModify, itemValue: e.target.value })} />
          <TextInput label="Leírás" value={itemToModify.itemDescription} onChange={(e) => setItemToModify({ ...itemToModify, itemDescription: e.target.value })} />
          <TextInput label="Leírás" value={itemToModify.itemAssetUrl} onChange={(e) => setItemToModify({ ...itemToModify, itemAssetUrl: e.target.value })} />
          <Space h="md" />
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={() => {
            modifyItemModal[1].close();
            modifyItem();
          }}>
            Mentés
          </Button>
        </Modal>

        {/* Tárgy törlése */}
        <Modal opened={deleteItemModal[0]} onClose={deleteItemModal[1].close} title="Tárgy törlése" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <Grid>
            {itemList.map(item => <ItemContainer key={item.itemId} item={item} showChance={true} onToggleItem={handleDelete} spanWidth={span}/>)}
          </Grid>
        </Modal>

        {/* Törlés megerősítése */}
        <Modal opened={confirmDeleteItemModal[0]} onClose={confirmDeleteItemModal[1].close} title="Törlés megerősítése" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <Button onClick={() => {deleteItem();}}>Megerősítés</Button>
          <Button onClick={() => {closeAllModals(); confirmDeleteItemModal[1].close(); }}>Mégse</Button>
        </Modal>

        <Modal opened={itemCreated} onClose={() => {
          closeAllModals;
          setItemCreated(false);
        }} title="Sikeres létrehozás!">
          <Text>{newItem.itemName}</Text>
          {newItem.skinName} - {newItem.value} $
          <Button onClick={() => {
            closeAllModals;
            setItemCreated(false);
          }}>OK</Button>
        </Modal>

        <Space h="sm"></Space>
        <Button onClick={() => actionsModal[1].open()} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
          Műveletek
        </Button>

        <Modal opened={editCaseModal[0]} onClose={editCaseModal[1].close} title="Láda szerkesztése" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <TextInput label="Név" value={newCaseName} onChange={(e) => { setNewCaseName(e.target.value) }} />
          <TextInput label="Ár" value={newCasePrice} onChange={(e) => { setNewCasePrice(e.target.value) }} />
          <TextInput label="Láda képe" placeholder="Illeszd ide a kép URL-ét..." description="Válassz az új ládának egy képet!" onChange={(e) => setNewCaseImage(e.target.value)}/>
          <Space h="md" />
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={() => { editCaseModal[1].close; editCase(selectedCase.caseId) }}>
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
            {selectedCase.items.map(item => <ItemContainer key={item.itemId} item={item} onToggleItem={handleToggleItem} spanWidth={span}/>)}
          </Grid>
          <Button style={{ margin: "5px" }} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} onClick={showCaseModal[1].close}>Bezárás</Button>
          <Button onClick={() => { deleteSelectedItems(selectedCaseId) }} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>Kiválasztott tárgyak törlése</Button>
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} style={{ margin: "5px" }} onClose={showCaseModal[1].close} onClick={() => { newCaseItemModal[1].open(); getItems(selectedCase); setSelectedItems([]) }}>Tárgy hozzáadása ládához</Button>
        </Modal>

        <Modal opened={onError} title="Hiba a művelet során!" onClose={handleCloseModal} transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <Space h="xs" />
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} onClick={() => { closeAllModals(); handleCloseModal(); }}>Bezárás</Button>
        </Modal>

        <Modal opened={showDeleteCaseModal[0]} onClose={showDeleteCaseModal[1].close} title="Biztosan törölni szeretnéd a ládát?" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <Space h="xs" />
          <Button style={{ margin: "5px" }} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} onClick={() => deleteCase(selectedCase.caseId)}>Törlés</Button>
          <Button variant="gradient" gradient={{ from: 'cyan', to: 'indigo', deg: 90 }} onClick={showDeleteCaseModal[1].close}>Mégsem</Button>
        </Modal>

        <Modal size="lg" opened={newCaseItemModal[0]} onClose={newCaseItemModal[1].close} title="Skin hozzáadása ládához" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
          <Space h="xs" />
          <Grid>
            {itemList.map(item => <ItemContainer key={item.itemId} item={item} onToggleItem={handleToggleItem} spanWidth={span}/>)}
          </Grid>
          <Space h="xs"></Space>
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} onClick={newCaseItemModal[1].close}>Mégsem</Button>
          <Button onClick={() => { addSelectedItems(selectedCaseId); newCaseItemModal[1].close; }} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} >Hozzáadás</Button>
        </Modal>

        <Modal opened={onSuccess.success} title={onSuccess.method == 'create' ? 'Sikeres létrehozás!' : onSuccess.method == 'edit' ? 'Sikeres módosítás!' : 'Sikeres törlés!'}
          transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}
          onClose={() => {
            handleCloseModal();
            closeAllModals();
          }}>
          <Button onClick={() => {
            handleCloseModal();
            closeAllModals();
          }}>OK</Button>
        </Modal>

        <Modal opened={newGiveAwaySuccessModal[0]} title="Sikeres hozzáadás!" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }} onClose={() => { handleCloseModal(); closeAllModals(); }}>
          <Button onClick={() => { handleCloseModal(); closeAllModals(); }}></Button>
        </Modal>

        {/* Láda tartalmi szerkesztésének visszacsatolása */}
        <Modal opened={successfulDelete || successfulAdd} title={successfulAdd == true ? 'Sikeres hozzáadás!' : successfulDelete == true ? 'Sikeres törlés!' : 'Sikeres módosítás!'}
          onClose={() => { handleCloseModal(); closeAllModals(); }}>
          <Button onClick={() => { handleCloseModal(); closeAllModals(); }}>OK</Button>
        </Modal>

        <Card className="admincase" shadow="sm" padding="lg" radius="md" withBorder style={{ width: "100%", maxWidth: "100%" }}>
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>LÁDÁK SZERKESZTÉSE</Text>
            <Badge color="pink">Összes láda: ({cases.length} db)</Badge>
          </Group>
          <Grid gutter="lg">
            {cases.map(_case => (
              <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={_case.caseId}>
                <Card className="admincase" shadow="sm" padding="lg" radius="md" withBorder style={{ width: "100%", maxWidth: "100%" }}>
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
                  <Button variant="outline" color="red" onClick={() => { showDeleteCaseModal[1].open(); setSelectedCaseId(_case.caseId); }}>Törlés</Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Card>
      </Card>
    </div>
  );
}