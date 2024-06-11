import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Card, Accordion, Container, Row, Col, Spinner } from 'react-bootstrap';
import './App.css'; // Archivo de estilos personalizados

function CustomCard({ titulo, resumen, peliculaId }) {
  const [personajes, setPersonajes] = useState([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  useEffect(() => {
    if (isAccordionOpen && personajes.length === 0) {
      fetchPersonajes();
    }
  }, [isAccordionOpen]);

  const fetchPersonajes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/pelis/${peliculaId}/personajes`);
      const jsonData = await response.json();
      setPersonajes(jsonData);
    } catch (error) {
      console.error('Error al obtener los personajes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccordionToggle = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const imagenUrl = `/img/${peliculaId}.jpg`; // Ruta de la imagen basada en el ID de la película

  const handleImageLoaded = () => {
    setBackgroundLoaded(true);
  };

  return (
    <Card className={`custom-card ${backgroundLoaded ? 'loaded' : ''}`}>
      <Card.Img variant="top" src={imagenUrl} alt={titulo} onLoad={handleImageLoaded} />
      <Card.Body>
        <Card.Title className="custom-card-title">{titulo}</Card.Title>
        <Accordion activeKey={isAccordionOpen ? '0' : ''}>
          <Accordion.Item eventKey="0">
            <Accordion.Header className="custom-accordion-header" onClick={handleAccordionToggle}>Ver más</Accordion.Header>
            <Accordion.Body>
              <p>{resumen}</p>
              <h5>Personajes:</h5>
              {isLoading ? (
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                </div>
              ) : (
                <Row>
                  {personajes.map((personaje, index) => (
                    <Col key={index} xs={6} sm={3}>
                      <p>{personaje.name}</p>
                    </Col>
                  ))}
                </Row>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );
}

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/pelis');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  return (
    <Container>
      <h1 className="text-center custom-title">Datos desde API Spring</h1>
      {data.map((item, index) => (
        <Row key={index} className="justify-content-center">
          <Col xs={12} lg={6}>
            <CustomCard
              titulo={item.titulo}
              resumen={item.resumen}
              peliculaId={index + 1} // Asumiendo que la posición en la lista corresponde al ID de la película
            />
          </Col>
        </Row>
      ))}
    </Container>
  );
}

export default App;