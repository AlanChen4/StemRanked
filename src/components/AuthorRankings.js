import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './AuthorRankings.css';
import LoadingSpinner from './LoadingSpinner';

function AuthorRankings(props) {
  console.log(props.author);
  console.log('Type of props.author', typeof props.author);

  return (
    <div>
      {props.school === 'loading' ? <LoadingSpinner /> : props.school === null ? <div><span className="AdjustMargin">Select an institution to view its details.</span></div> : 
        <div>
          <Row className="InstitutionHeader">
            <Col><span className="AdjustMargin">{props.school}</span></Col>
          </Row>
          <div className="AuthorsTable">
            <Row className="TableHeaders">
              <Col><span className="AdjustMargin">Rank</span></Col>
              <Col>Author</Col>
              <Col>Adjusted Count</Col>
            </Row>
            <div className="DataColumnAuthors">
              {props.author[props.school].map((author, i) => <Row className="Author"><Col><span className="AdjustMargin">{i + 1}</span></Col><Col>{author}</Col><Col>{props.authorCount[props.school][i]}</Col></Row>)}
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default AuthorRankings;