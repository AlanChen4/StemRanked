# ![StemRanked](https://github.com/AlanChen4/StemRanked/blob/master/public/media/logo.png)

# StemRanked
GOTO metrics-based rankings generalized for a multitude of STEM field majors.

## Usage

## Methodology
The rankings system is based off of an adjusted count found from the number of publications each institution has after the user's selected start date in major conferences. An average count is then created based off of the user's selection of areas.

![equation](/public/ranking_equation.jpg)

(Areas in the equation is the conference)
Institutions with the highest average count are highest in the rankings.
(The methodology for the author rankings is the same as the institution rankings system)

## Dev Env Setup
Intended for Unix/Linux/Ubuntu OSs and Python 3

## Installation

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
