import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { createPlant, updatePlant } from '../../api/plantData';

const initialState = {
  uid: '',
  name: '',
  description: '',
  type: '',
  numberPerSquare: 0,
  isOwned: true,
  image: '',
  symbol: '',
};

export default function PlantForm({ plantObj }) {
  const [formInput, setFormInput] = useState(initialState);
  const router = useRouter();
  const { user } = useAuth();

  const updateEmptyInputFields = () => {
    if (plantObj.description === 'N/A') {
      setFormInput((prevState) => ({
        ...prevState,
        description: '',
      }));
    }
    if (plantObj.type === 'N/A') {
      setFormInput((prevState) => ({
        ...prevState,
        type: '',
      }));
    }
    if (plantObj.numberPerSquare < 0) {
      setFormInput((prevState) => ({
        ...prevState,
        numberPerSquare: 0,
      }));
    }
  };

  useEffect(() => {
    if (plantObj.id) {
      setFormInput(plantObj);
      updateEmptyInputFields();
    }
  }, [plantObj.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckChange = (e) => {
    const { name, checked } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formInput.uid = user.uid;
    if (!formInput.description) {
      formInput.description = 'N/A';
    }
    if (!formInput.type) {
      formInput.type = 'N/A';
    }
    if (!formInput.numberPerSquare) {
      formInput.numberPerSquare = -1;
    }
    if (plantObj.id) {
      updatePlant(formInput).then(router.push(`/plants/${plantObj.id}`));
    } else {
      createPlant(formInput).then(router.push('/plants/plants'));
    }
  };

  return (
    <>
      <Form className="form-container" onSubmit={handleSubmit}>
        <div className="form-column-container">
          <div className="form-column" style={{ flex: '2', marginRight: '10px' }}>
            <h1 className="center mb-3">Required</h1>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Plant Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Plant Name"
                name="name"
                value={formInput.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Raised Bed Symbol</Form.Label>
              <Form.Control
                type="text"
                placeholder="i.e Bc for Broccoli"
                name="symbol"
                value={formInput.symbol}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Check
              className="mb-3"
              inline
              label="Owned?"
              name="isOwned"
              type="checkbox"
              checked={formInput.isOwned}
              onChange={handleCheckChange}
              id="inline-checkbox-1"
            />
          </div>
          <div className="form-column" style={{ flex: '1' }}>
            <h1 className="center mb-3">Optional</h1>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Image"
                name="image"
                value={formInput.image}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Description"
                name="description"
                value={formInput.description}
                onChange={handleChange}
              />
            </Form.Group>

            {/* need to fix this one */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="i.e. Brassica"
                name="type"
                value={formInput.type}
                onChange={handleChange}
              />
            </Form.Group>

            {/* need to fix this one */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Number Per Square Foot</Form.Label>
              <Form.Control
                type="number"
                placeholder="# / sq.ft"
                min="0"
                name="numberPerSquare"
                value={formInput.numberPerSquare}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </div>
        <div className="center mt-3 form-submit-button">
          <Button type="Submit">Submit</Button>
        </div>
      </Form>
    </>
  );
}

PlantForm.propTypes = {
  plantObj: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    numberPerSquare: PropTypes.number,
    isOwned: PropTypes.bool,
    image: PropTypes.string,
    symbol: PropTypes.string,
  }),
};

PlantForm.defaultProps = {
  plantObj: {
    uid: '',
    name: '',
    description: '',
    type: '',
    numberPerSquare: 1,
    isOwned: false,
    image: '',
    symbol: '',
  },
};
