import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './AuthorRankings.css';
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

function AuthorRankings(props) {
  console.log(props.author);
  console.log('Type of props.author', typeof props.author);

  return (
    <div>
      <Row className="TableHeaders">
        <Col>Rank</Col>
        <Col>Author</Col>
      </Row>
      {props.school === 'loading' ? <LoadingSpinner /> : props.school === null ? <div>Select an institution to view its details.</div> : <div>
        {props.author[props.school].map((author, i) => <Row><Col>{i + 1}</Col><Col>{author}</Col></Row>)}</div>
      }
    </div>
  );
}

export default AuthorRankings;