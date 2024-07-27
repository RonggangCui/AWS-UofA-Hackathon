import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const DisasterForm = () => {
  const [disasterName, setDisasterName] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setDisasterName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disasterName }),
      });
      const result = await response.text();
      setResponseMessage(result);
    } catch (error) {
      console.error('Error submitting the form', error);
      setResponseMessage('An error occurred while submitting the report.');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">Live Online Information Report</h1>
      <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <Form.Group controlId="formDisasterName">
          <Form.Label>Disaster Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the disaster name (e.g., Jasper Wildfire)"
            value={disasterName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Submit Report
        </Button>
      </Form>
      {responseMessage && (
        <Alert variant="info" className="mt-4">
          <FormattedResponseMessage message={responseMessage} />
        </Alert>
      )}
    </Container>
  );
};

const FormattedResponseMessage = ({ message }) => {
  const lines = message.split('\n');
  return (
    <Container>
      {lines.map((line, index) => (
        <div key={index}>
          {line.startsWith('Potential Misinformation:') && <h5 className="mt-4">{line}</h5>}
          {line.startsWith('Useful Information for Decision-making:') && <h5 className="mt-4">{line}</h5>}
          {line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') ? (
            <p className="mb-2">{line}</p>
          ) : (
            <p className="mb-3">{line}</p>
          )}
        </div>
      ))}
    </Container>
  );
};

export default DisasterForm;

