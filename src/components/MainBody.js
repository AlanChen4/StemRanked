import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './MainBody.css';

function MainBody(props) {
	return (
		<Row className="Outside">
			<Col>
				<Row>
					<Col className="SubjectName">
						{props.subject}
					</Col>
				</Row>
				<Row>
					<Col>
						<Row className="ConfigButtons">
							<Col>
								Publication Years
							</Col>
							<Col>
								<Row>
									<Col>
										Select Sub-Areas
									</Col>
								</Row>
								<Row>
									<Col>
										_ of _ selected
									</Col>
								</Row>
							</Col>
								{/* empty column for spacing */}
							<Col>
							</Col>
						</Row>
						<Row>
							<Col>
								Institution Rankings
							</Col>
						</Row>
					</Col>
					<Col className="AuthorRanks">
						College Info/Author Rankings
					</Col>
				</Row>
			</Col>
		</Row>
	);
}

export default MainBody;