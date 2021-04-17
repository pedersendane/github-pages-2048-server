import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import uuid from 'uuid';

var fs = require('fs');
var data = fs.readFileSync('./config.json'),
    highScore;

try {
    highScore = JSON.parse(data);
    console.dir(highScore);
} catch (err) {
    console.log('There has been an error parsing your JSON.')
    console.log(err);
}


const app = express();

app.use(bodyParser.json());
app.use(cors());

// The route for getting a list of all todos
app.get('/high-score', (req, res) => {
    res.status(200).json(highScore);
});


// The route for creating new todo-list items
app.post('/new-high-score', (req, res) => {
    console.log(req);
    console.log(req.query);
    const {
        score
    } = req.query;
    console.log(score);
    if (score) {
        const newScore = [{
            id: uuid(),
            score: parseInt(score),
        }]
        highScore = newScore;
        var newHighScore = JSON.stringify(highScore);
        fs.writeFile('./config.json', newHighScore, function (err) {
            if (err) {
                console.log('There has been an error saving your configuration data.');
                console.log(err.message);
                return;
            }
            console.log('Configuration saved successfully.')
        });
        res.status(200).json(newScore);
    } else {
        res.status(400).json({
            message: 'Request params should be formatted {score: number}'
        });
    }
});



app.listen(8000, () => console.log("Server listening on port 8000"));