import React from 'react';
import { Image, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { subjectList } from '../constants';

function About() {
    return (
        <div>
            <Nav className="mr-auto">
                {subjectList.map((subject) => <Nav.Link href={"/" + subject.replace(' ', '_')} className="SubjectLink" key={subject}>{subject}</Nav.Link>)}
            </Nav>

            <p>Picture of Oum Lahade</p>
            <p>Oum Lahade's Bio</p>
            <br />
            <p>Picture of Namh Lahade</p>
            <p>Namh Lahade's Bio</p>
            <br />
            <p>Picture of Alan Chen</p>
            <p>Alan Chen's Bio</p>
            <br />
            <p>Picture of Neel Runton</p>
            <p>Neel Runton's Bio</p>
        </div>

    );
}

export default About;