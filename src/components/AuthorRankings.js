import React from 'react';
import { Row, Col, Accordion, Card, Image } from 'react-bootstrap';
import { PieChart } from 'react-minimal-pie-chart';
import './AuthorRankings.css';
import LoadingSpinner from './LoadingSpinner';
import { env } from '../constants';

function PublicationPieChart(props) {
  let data = [];
  for (let area of Object.keys(props.everything[props.school][props.author])) {
    data.push({ title: area, value: props.everything[props.school][props.author][area], color: '#' + Math.floor(Math.random() * 16700000).toString(16) });
  }
  //if (env) console.log('FULL DATA FOR ' + props.author, data);

  return (
    <div style={{ textAlign: 'center' }}>
      Sub-Area Breakdown for Publications by {props.author}
      <PieChart
        style={{ height: '30vh' }}
        background="#ff5454"
        label={({ dataEntry }) =>
          Math.round(dataEntry.percentage) >= 5 ?
            dataEntry.title.split(' ').join('\n') + '\n' + Math.round(dataEntry.percentage) + '%' : // TODO: ESCAPE CHARACTERS DON'T WORK HERE
            ''
        }
        labelStyle={(index) => ({ fill: data[index].color, fontSize: '0.35vw' })}
        labelPosition={112}
        radius={42}
        data={data}
      />
    </div>
  );
}

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
                <div key={author}>
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
                              <Col className="GraphContainer">
                                {props.strongestSubject[props.school][author]}
                                <Image className="Graph" src="./images/graph.png" />
                              </Col>
                            </Row>
                          </Col>
                          <Col>{props.authorCount[props.school][i]}</Col>
                        </Row>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={author}>
                        <Card.Body>
                          <PublicationPieChart school={props.school} everything={props.everything} author={author} />
                        </Card.Body>
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