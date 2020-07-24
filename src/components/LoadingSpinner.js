import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import './LoadingSpinner.css';

function LoadingSpinner() {
    return (
      <div className="Container">
        Loading Data...
        <br />
        <Spinner className='Spinner' animation="border" variant="primary" role="loading" />
      </div>
    );
}

export default LoadingSpinner;