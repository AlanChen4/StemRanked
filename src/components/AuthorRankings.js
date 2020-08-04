import React from 'react';
import { Row, Col, Accordion, Card } from 'react-bootstrap';
import './AuthorRankings.css';
import LoadingSpinner from './LoadingSpinner';
import { env } from '../constants';

function AuthorRankings(props) {
  if (env) console.log(props.author);
  if (env) console.log('Type of props.author', typeof props.author);

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
              {props.author[props.school].map((author, i) => 



                <div>
                  <Accordion>
                    <Card className="AuthorAccordion">
                      <Accordion.Toggle as={Card.Header} eventKey={author} className="AccordionContainer" title={"View statistics for " + author}>
                        <Row className="Author" key={author}>
                          <Col><span className="AdjustMargin">{i + 1}</span></Col>
                          <Col>
                            <Row>
                              <Col>{author}</Col>
                            </Row>
                            <Row className="StrongestArea">
                              <Col>{props.strongestSubject[props.school][author]}</Col>
                            </Row>
                          </Col>
                          <Col>{props.authorCount[props.school][i]}</Col>
                        </Row>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={author}>
                        <Card.Body>Hello! I'm another body</Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </div>




              )}
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default AuthorRankings;