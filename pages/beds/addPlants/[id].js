import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { getPlants } from '../../../api/plantData';
import { getBedPlants } from '../../../api/bedPlantData';
import { useAuth } from '../../../utils/context/authContext';
import BedPlantCard from '../../../components/cards/BedPlantCard';
import SearchBar from '../../../components/SearchBar';
import PlantTypeSelect from '../../../components/sidebarSelectors/PlantTypeSelect';

export default function AddBedPlants() {
  const [plants, setPlants] = useState([]);
  const [bedPlants, setBedPlants] = useState([]);
  const [isSortedAZ, setisSortedAZ] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectTypeInput, setSelectTypeInput] = useState('');
  const { user } = useAuth();
  const router = useRouter();
  const id = parseInt(router.query.id, 10);

  const sortPlantsAlphabetical = (array) => {
    const sortedArray = array;
    if (!isSortedAZ) {
      setisSortedAZ(true);
      sortedArray.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    } else {
      setisSortedAZ(false);
      sortedArray.sort((a, b) => {
        if (a.name < b.name) {
          return 1;
        }
        if (a.name > b.name) {
          return -1;
        }
        return 0;
      });
    }
    setPlants(sortedArray);
  };

  const getAllPlantsAndBedPlants = () => getPlants(user.uid).then((plantsArray) => {
    sortPlantsAlphabetical(plantsArray);
    setPlants(plantsArray);
    getBedPlants(id).then(setBedPlants);
  });

  useEffect(() => {
    getAllPlantsAndBedPlants();
  }, []);

  const searchedPlants = () => {
    const filteredPlants = plants?.filter((plant) => plant.name.toLowerCase().includes(searchInput));
    if (selectTypeInput !== '') {
      return filteredPlants?.filter((plant) => plant.type.toLowerCase().includes(selectTypeInput));
    }
    return filteredPlants;
  };

  return (
    <div className="plants-page">
      <div className="sidebar">
        <div className="mt-3">
          <Button onClick={() => { router.back(); }}>Back to Beds</Button>
        </div>
        <div className="mt-3">
          <Button onClick={getAllPlantsAndBedPlants}>Sort {isSortedAZ ? 'Z-A' : 'A-Z'}</Button>
        </div>
        <div className="mt-3">
          <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} isOnPlant />
        </div>
        <div className="mt-3">
          <PlantTypeSelect selectTypeInput={selectTypeInput} setSelectTypeInput={setSelectTypeInput} plants={plants} />
        </div>
      </div>
      {console.warn(plants)}
      <div className="content-container">
        <h1 className="center mb-5">Select plants for this bed</h1>
        {!plants.length
          ? (
            <>
              <h2 className="center">You dont have any plants!</h2>
              <div className="mt-3 center">
                <Link passHref href="/plants/createPlant">
                  <Button variant="success">Create Plant</Button>
                </Link>
              </div>
            </>
          )
          : (
            <>
              <div className="space-around wrap">
                {searchedPlants()?.map((plant) => {
                  const bedPlant = bedPlants.find((bp) => bp.plantId === plant.id);
                  return <BedPlantCard key={plant.id} plantObj={plant} bedPlantId={bedPlant ? bedPlant.id : 0} bedId={id} onUpdate={getAllPlantsAndBedPlants} />;
                })}
              </div>
              <div className="center mt-3">
                {!bedPlants.length
                  ? ''
                  : (
                    <Link passHref href={`/beds/${id}`}>
                      <Button>Continue to Bed</Button>
                    </Link>
                  )}
              </div>
            </>
          )}
      </div>
    </div>
  );
}
