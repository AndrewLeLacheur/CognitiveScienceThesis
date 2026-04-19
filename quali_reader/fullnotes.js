//Import classes

import { Area, Link, EffectMove, EffectCustom, game, StyleArea, CondNot, CondVisit, CondCustom, CondList, true_cond, } 
from "./textgame.js";

var text_1 = ``;

function mystery_setup(game, s) {

    //Set style
    game.stylearea = new StyleArea("./library.png", true);

    //Create global variables
    var starttime = new Date();

    //Create game areas

    var pilot_intro = new Area("t", text_1);

    //Set starting area
    game.set_start(pilot_intro);

}

//Import text
import { m as mystery } from '../Experiment/text.js';




var subject_record = [" "];
var link_record = [" "];
var theory_record = [" "];
var link_nums = [0];

function parse_jdata (data) {
    let time = "";
    let links = "";
    let notes = "";
    let theories = "";
    let record = "";
    //let marker = "";
    let i = 0;
    while (data[i] != "[") {
        time = time + data[i];
        i++;
    }
    links = links + data[i];
    i++;
    while (data[i] != "[") {
        links = links + data[i];
        i++;
    }
    notes = notes + data[i];
    i++;
    while (data[i] != "[") {
        notes = notes + data[i];
        i++;
    }
    theories = theories + data[i];
    i++;
    while (data[i] != "[") {
        theories = theories + data[i];
        i++;
    }
    record = record + data[i];
    i++;
    while (data[i] != "]") {
        record = record + data[i];
        i++;
    }
    record = record + data[i];

    //time = JSON.parse(time);
    link_nums = JSON.parse(links);
    subject_record = JSON.parse(notes);
    theory_record = JSON.parse(theories);
    link_record = JSON.parse(record);

    subject_record[subject_record.length] = subject_record[subject_record.length-1].replace(/\n/g, "<br>")
    for (i=0;i<theory_record.length;i++) {
        theory_record[i] = theory_record[i].replace(/- Include your percentage confidence for each theory\n- Update your percentage confidence when it changes \n- You don’t need to completely re-describe theories that have only changed a little, just refer to the earlier theory\n- You may ignore this box if your theories have not changed at all/g, "");
        theory_record[i] = theory_record[i].replace(/\n/g, "<br>");
        console.log(i);
    }
    

    //var output = ``;
    //output += subject_record.pop();

    var output = ``;
    output += subject_record.pop() + '@';
    for (i=0;i<link_nums.length;i++) {
        output += `<p>` + theory_record[i] + `</p><p style='color: blue'>` + link_nums[i] + `</p><p>` + link_record[i] + `</p><br><br>=================`;
    }

    return output;
}

var jdata;
function set_jdata(x) {
    text_1 = parse_jdata(x);
    game.customize(mystery, mystery_setup, x); //Must be named 'game'
    game.run();
}
function fetchJSONData() {
    fetch('../analysis/data/datafile_22.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();  
        })
        .then(data => set_jdata(data))  
        .catch(error => console.error('Failed to fetch data:', error)); 
}
fetchJSONData(); 

//Begin game
//game.run();