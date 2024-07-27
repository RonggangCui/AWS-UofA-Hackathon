import React from 'react';
import { Container, Navbar, Nav, Tab, Tabs } from 'react-bootstrap';
import DisasterForm from './DisasterForm';

const App = () => {
  return (
    <Container fluid className="p-0">
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Navbar.Brand href="#" className="px-3">Disaster Watch</Navbar.Brand>
      </Navbar>
      <Container>
        <Tabs defaultActiveKey="live-report" id="uncontrolled-tab-example">
          <Tab eventKey="live-report" title="Live Online Information Report">
            <DisasterForm />
          </Tab>
          <Tab eventKey="info-confirmation" title="Information Confirmation">
            <InformationConfirmation />
          </Tab>
          <Tab eventKey="sos-chatbot" title="SOS Chat Bot">
            <SOSChatBot />
          </Tab>
          <Tab eventKey="disaster-map" title="Disaster Map">
            <DisasterMap />
          </Tab>
        </Tabs>
      </Container>
    </Container>
  );
};

const InformationConfirmation = () => {
  return (
    <div className="p-4">
      <h2>Information Confirmation</h2>
      <p>Content for Information Confirmation will go here.</p>
    </div>
  );
};

const SOSChatBot = () => {
  return (
    <div className="p-4">
      <h2>SOS Chat Bot</h2>
      <p>Content for SOS Chat Bot will go here.</p>
    </div>
  );
};

const DisasterMap = () => {
  return (
    <div className="p-4">
      <h2>Disaster Map</h2>
      <p>Content for Disaster Map will go here.</p>
    </div>
  );
};

export default App;
