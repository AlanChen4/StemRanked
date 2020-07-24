import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './AuthorRankings.css';
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

function AuthorRankings(props) {

  return (
    <div>
      {props.school === 'loading' ? <LoadingSpinner /> : props.school === null ? <div>Select an institution to view its details.</div> : props.school}
    </div>
  );
}

export default AuthorRankings;