import React, { useState, useRef } from 'react';
import { Input, Container, Box, Text, Button } from '@mantine/core';

function App() {
  const [file, setFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const imageRef = useRef();

  const labelToImplant = {
    0: 'Depuy Mobility',
    1: 'Stryker Start',
    2: 'Wright Inbone II',
    3: 'Zimmer Biomet Trabecular Model',
  };

  const uploadImage = (e) => {
    setPrediction(null);
    const { files } = e.target;
    if (files.length > 0) {
      setFile(files[0]);
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
    } else {
      setFile(null);
      setImageURL(null);
    }
  };

  const handlePredict = async () => {
    setPrediction(null);
    const formData = new FormData();
    formData.append('file', file, file.name);
    const requestOptions = {
      method: 'POST',
      body: formData,
    };
    // 'https://ec2-3-110-208-165.ap-south-1.compute.amazonaws.com/predict';
    const url = 'http://localhost:8000/predict/';
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setPrediction(data.result);
        setConfidence(data.confidence);
      })
      .catch(() => {
        alert('Internal Server Error. Please try again later.');
      });
  };

  return (
    <Container mt={50}>
      <Box mt={50}>
        <Text size="xl" align="center">
          Ankle Fracture Detection
        </Text>
      </Box>
      <Box mt={50}>
        <Input
          label="Upload files"
          type={'file'}
          placeholder="Upload files"
          accept="image/*"
          onChange={uploadImage}
        />
      </Box>
      {file && (
        <Box mt={50}>
          <div style={{ width: '20%', marginLeft: '40%' }}>
            <img
              src={imageURL}
              alt="User Upload Preview"
              crossOrigin="anonymous"
              ref={imageRef}
              style={{ width: '100%' }}
            />
          </div>
        </Box>
      )}
      {prediction && confidence && (
        <Box mt={50}>
          <Text size="lg" align="center">
            Predicted implant is <b>{labelToImplant[prediction]}</b>.
          </Text>
          <Text size="lg" align="center">
            Confidence - {confidence} %
          </Text>
        </Box>
      )}
      {file && (
        <Box mt={50} mb={50}>
          <Button w="30%" ml="35%" onClick={handlePredict}>
            Predict
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;
