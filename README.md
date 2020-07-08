# StemRanked
GOTO metrics-based rankings generalized for a multitude of STEM field majors.

## Methodology
The rankings system is based off of an adjusted count found from the number of publications each institution has after 2009 in amajor conferences. An average count is then created based off of the user's selection of areas.

![equation](/public/ranking_equation.jpg)

Institutions with the highest average count are highest in the rankings.

## Dev Env Setup
Intended for Unix/Linux/Ubuntu OSs and Python 3

### Frontend
- Make sure [npm](https://www.npmjs.com/get-npm) is installed
- Install node modules with `npm install`

### Backend
- Run `python3 -m venv .venv`
- Enter the virtual env with `source .venv/bin/activate`
- Install Python dependencies with `pip3 install -r requirements.txt`

## Run Dev Env

### Frontend
- Run `npm start`
- Dev server will start on `http://localhost:3000`

### Backend
- Enter the virtual env with `source .venv/bin/activate`
- Do Python stuff
