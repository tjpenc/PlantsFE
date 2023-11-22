import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { getBeds } from '../../api/bedData';
import SmallBedCard from '../../components/cards/BedCardSmall';
import Loading from '../../components/Loading';

export default function ViewBeds() {
  const [beds, setBeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const getAllBeds = () => getBeds(user.uid).then((bedsArray) => {
    setBeds(bedsArray);
    setIsLoading(false);
  });

  useEffect(() => {
    setTimeout(() => {
      getAllBeds();
    }, 300);
  }, []);

  return (
    <>
      {isLoading
        ? <Loading />
        : (
          <>
            <div className="mt-3">
              <Link passHref href="/beds/createBed">
                <Button>Create Bed</Button>
              </Link>
            </div>
            <h1 className="center mb-5">My Beds</h1>
            <div className="space-around wrap">
              {beds?.length === 0
                ? (
                  <>
                    <div>
                      <h2>You have no beds! Use the top left button to create a new bed</h2>
                    </div>
                  </>
                )
                : beds?.map((bed) => <SmallBedCard key={bed.id} bedObj={bed} onUpdate={getAllBeds} />)}
            </div>
          </>
        )}

    </>
  );
}
