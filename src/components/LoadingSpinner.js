import React from 'react';
import { Spinner } from 'react-bootstrap';
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