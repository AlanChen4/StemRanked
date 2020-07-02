# StemRanked
GOTO metrics-based rankings generalized for a multitude of STEM field majors.

## Methodology
The rankings system is based off of an adjusted count found from the number of publications each institution has after 2009 in amajor conferences. An average count is then created based off of the user's selection of areas.

![equation](http://www.sciweavers.org/tex2img.php?eq=averageCount%3D%20%5Csqrt%5BN%5D%7B%20%5Cprod_%7Bi%3D1%7D%5EN%20%7B%28adjustedCounts_i%20%2B%201%29%7D%20%7D%20&bc=White&fc=Black&im=jpg&fs=12&ff=arev&edit=0)

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

## TODO
- 
