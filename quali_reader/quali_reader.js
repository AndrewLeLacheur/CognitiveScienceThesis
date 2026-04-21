//Import classes

import { Area, Link, EffectMove, EffectCustom, game, StyleArea, CondNot, CondVisit, CondCustom, CondList, true_cond, subject_record, theory_record, link_record, link_nums } 
from "./textgame.js";

function mystery_setup(game, s) {

    //Set style
    game.stylearea = new StyleArea("./library.png", true);

    //Create global variables
    var starttime = new Date();

    //Create game areas

    var pilot_intro = new Area("t", s.intro);

    //Investigation sequence
    var intro = new Area("Title", s.introduction);
    var body_intro = new Area("Title", s.body_intro);
    var body_body = new Area("Title", s.body_body);
    var body_vases = new Area("Title", s.body_vases);
    var body_mud = new Area("Title", s.body_mud);
    var body_windows = new Area("Title", s.body_windows);
    var body_lock = new Area("Title", s.body_lock);
    var body_fireplace = new Area("Title", s.body_fireplace);
    var body_light = new Area("Title", s.body_light);
    var body_return = new Area("Title", s.body_return);
    
    //Interviews

    var statements = new Area("t", s.statements);

    var inv_menu = new Area("t", s.inv_menu);

    var vince_intro = new Area("Title", s.vince_intro);
    var vince_call = new Area("Title", s.vince_call);
    var vince_shout = new Area("Title", s.vince_shout);
    var vince_lock = new Area("Title", s.vince_lock);
    var vince_window = new Area("Title", s.vince_window);
    var vince_lake = new Area("Title", s.vince_lake);
    var vince_health = new Area("Title", s.vince_health);
    var vince_marriage = new Area("Title", s.vince_marriage);
    var vince_key = new Area("Title", s.vince_key);
    var vince_cutscene = new Area("Title", s.vince_cutscene);
    
    var fran_intro = new Area("Title", s.fran_intro);
    var fran_marriage = new Area("Title", s.fran_marriage);
    var fran_health = new Area("Title", s.fran_health);
    var fran_lake = new Area("Title", s.fran_lake);
    var fran_cutscene = new Area("Title", s.fran_cutscene);
    
    var mel_intro = new Area("Title", s.mel_intro);
    var mel_move = new Area("Title", s.mel_move);
    var mel_lock = new Area("Title", s.mel_lock);
    var mel_window = new Area("Title", s.mel_window);
    var mel_lake = new Area("Title", s.mel_lake);
    var mel_cutscene = new Area("Title", s.mel_cutscene);
    var mel_health = new Area("Title", s.mel_health);
    var mel_key = new Area("Title", s.mel_key);

    var secretary = new Area("Title", s.secretary);
    var doctor = new Area("Title", s.doctor);
    var lake = new Area("Title", s.lake);
    var lawyer = new Area("Title", s.lawyer);
    var roommate = new Area("Title", s.roommate);
    var affair = new Area("Title", s.affair);
    var company = new Area("Title", s.company);
    var window = new Area("Title", s.window);
    var boots = new Area("Title", s.boots);
    var lock = new Area("Title", s.lock);
    var cell = new Area("Title", s.cell);

    var confrontation = new Area("Title", s.confrontation);
    var reveal = new Area("Title", s.reveal);

    
    //Create game links

    //Investigation sequence
    pilot_intro.links = [new Link("Begin", [new EffectMove(intro), new EffectCustom(function () {
        starttime = new Date();
    })])];
    intro.links = [
        new Link("Continue to the investigation", [new EffectMove(body_intro)]),
    ];
    body_intro.links = [
        new Link(s.body_bodyL, [new EffectMove(body_body)], new CondNot(new CondVisit(body_body))),
        new Link(s.body_vasesL, [new EffectMove(body_vases)], new CondNot(new CondVisit(body_vases))),
        new Link(s.body_mudL, [new EffectMove(body_mud)], new CondNot(new CondVisit(body_mud))),
        new Link(s.body_windowsL, [new EffectMove(body_windows)], new CondNot(new CondVisit(body_windows))),
        new Link(s.body_lockL, [new EffectMove(body_lock)], new CondNot(new CondVisit(body_lock))),
        new Link(s.body_fireplaceL, [new EffectMove(body_fireplace)], new CondNot(new CondVisit(body_fireplace))),
        new Link(s.body_lightL, [new EffectMove(body_light)], new CondNot(new CondVisit(body_light))),
    ];
    body_return.links = [
        new Link(s.body_bodyL, [new EffectMove(body_body)], new CondNot(new CondVisit(body_body))),
        new Link(s.body_vasesL, [new EffectMove(body_vases)], new CondNot(new CondVisit(body_vases))),
        new Link(s.body_mudL, [new EffectMove(body_mud)], new CondNot(new CondVisit(body_mud))),
        new Link(s.body_windowsL, [new EffectMove(body_windows)], new CondNot(new CondVisit(body_windows))),
        new Link(s.body_lockL, [new EffectMove(body_lock)], new CondNot(new CondVisit(body_lock))),
        new Link(s.body_fireplaceL, [new EffectMove(body_fireplace)], new CondNot(new CondVisit(body_fireplace))),
        new Link(s.body_lightL, [new EffectMove(body_light)], new CondNot(new CondVisit(body_light))),
        new Link(s.body_exitL, [new EffectMove(statements)]),
    ];
    var body_returnL = new Link(s.body_returnL, [new EffectMove(body_return)]);
    body_body.links = [body_returnL];
    body_vases.links = [body_returnL];
    body_mud.links = [body_returnL];
    body_windows.links = [body_returnL];
    body_lock.links = [body_returnL];
    body_fireplace.links = [body_returnL];
    body_light.links = [body_returnL];

    //Interviews

    statements.links = [new Link("Continue", [new EffectMove(inv_menu)])];

    var invclicks = 0;

    var check_end = new EffectMove(confrontation, new CondCustom(function () {return invclicks > 21}));
    var plus_inv = new EffectCustom(function () {invclicks += 1;});
     
    inv_menu.links = [
        new Link("Talk to Nathan", [new EffectMove(vince_intro)]),
        new Link("Talk to Frances", [new EffectMove(fran_intro)]),
        new Link("Talk to Melissa", [new EffectMove(mel_intro)]),
        new Link("Place a call to Ferris to check on Nathan's alibi", [new EffectMove(secretary)], new CondList(-1, [new CondNot(new CondVisit(secretary)), new CondVisit(vince_call)])),
        new Link("Check out Melissa's medical records", [new EffectMove(doctor)], new CondList(-1, [new CondNot(new CondVisit(doctor)), new CondVisit(mel_move)])),
        new Link("Check how long it would have taken Frances to get back from the far side of the lake", [new EffectMove(lake)], new CondList(-1, [new CondNot(new CondVisit(lake)), new CondVisit(fran_lake)])),
        new Link("Call Victor's lawyer to see if he followed through on removing Nathan from his will", [new EffectMove(lawyer)], new CondList(-1, [new CondNot(new CondVisit(lawyer)), new CondVisit(mel_cutscene)])),
        new Link("Call Frances's roommate and ask about her academic financial situation", [new EffectMove(roommate)], new CondList(-1, [new CondNot(new CondVisit(roommate)), new CondVisit(vince_cutscene)])),
        new Link("Call Ms. Giles to find out if Victor was really having an affair", [new EffectMove(affair)], new CondList(-1, [new CondNot(new CondVisit(affair)), new CondVisit(fran_cutscene)])),
        new Link("Investigate Nathan's business online", [new EffectMove(company)], new CondNot(new CondVisit(company))),
        new Link("Go outside and check out the exterior of Victor's bedroom window", [new EffectMove(window)], new CondNot(new CondVisit(window))),
        new Link("See if any of the boots in the boot tray match the marks in Victor's room", [new EffectMove(boots)], new CondNot(new CondVisit(boots))),
        new Link("Play around with one of the guest room door locks to get a better understanding of the mechanism", [new EffectMove(lock)], new CondNot(new CondVisit(lock))),
        new Link("", [new EffectMove(cell)], new CondNot(new CondVisit(cell))),
    ]

    var inv_return = new Link("Return to investigating", [
        new EffectCustom(function () {invclicks += 1;console.log(invclicks);}),
        new EffectMove(inv_menu),
        check_end,
    ]);

    secretary.links = [inv_return];
    doctor.links = [inv_return];
    lake.links = [inv_return];
    lawyer.links = [inv_return];
    roommate.links = [inv_return];
    affair.links = [inv_return];
    company.links = [inv_return];
    window.links = [inv_return];
    boots.links = [inv_return];
    lock.links = [inv_return];
    cell.links = [inv_return];

    var vinceQs = [
        new Link("Ask for more details about his phone call last night", [new EffectCustom(function () {invclicks += 1;}), new EffectMove(vince_call), check_end], new CondNot(new CondVisit(vince_call))),
        new Link("Ask about Victor's habits with locking his door", [new EffectCustom(function () {invclicks += 1;}), new EffectMove(vince_lock), check_end], new CondNot(new CondVisit(vince_lock))),
        new Link("Ask why Nathan was shouting last night", [new EffectCustom(function () {invclicks += 1;}), new EffectMove(vince_shout), check_end], new CondNot(new CondVisit(vince_shout))),
        new Link("Ask about Victor's habits with his window", [new EffectCustom(function () {invclicks += 1;}), new EffectMove(vince_window), check_end], new CondNot(new CondVisit(vince_window))),
        new Link("Ask how long it would take to get to the lake and back", [new EffectCustom(function () {invclicks += 1;}), new EffectMove(vince_lake), check_end], new CondNot(new CondVisit(vince_lake))),
        new Link("Ask about Melissa's health", [new EffectCustom(function () {invclicks += 1;}), new EffectMove(vince_health), check_end], new CondNot(new CondVisit(vince_health))),
        new Link("Ask about Victor and Melissa's marriage", [new EffectCustom(function () {invclicks += 1;}), new EffectMove(vince_marriage), check_end], new CondNot(new CondVisit(vince_marriage))),
        new Link("Ask about the missing key", [new EffectCustom(function () {invclicks += 1;}), new EffectMove(vince_key), check_end], new CondNot(new CondVisit(vince_key))),
        new Link("Stop talking to Nathan for now", [new EffectCustom(function () {invclicks += 1;}), new EffectMove(inv_menu), new EffectMove(vince_cutscene, new CondNot(new CondVisit(vince_cutscene)))]),
    ]
    vince_intro.links = vinceQs;
    vince_call.links = vinceQs;
    vince_shout.links = vinceQs;
    vince_lock.links = vinceQs;
    vince_window.links = vinceQs;
    vince_lake.links = vinceQs;
    vince_health.links = vinceQs;
    vince_marriage.links = vinceQs;
    vince_key.links = vinceQs;
    vince_cutscene.links = [inv_return];

    var franQs = [
        new Link("Ask about Victor and Melissa's marriage", [plus_inv, new EffectMove(fran_marriage), check_end], new CondNot(new CondVisit(fran_marriage))),
        new Link("Ask for more details about her walk to the lake last night", [plus_inv, new EffectMove(fran_lake), check_end], new CondNot(new CondVisit(fran_lake))),
        new Link("Ask about Melissa's health", [plus_inv, new EffectMove(fran_health), check_end], new CondNot(new CondVisit(fran_health))),
        new Link("Stop talking to Frances for now", [plus_inv, new EffectMove(inv_menu), new EffectMove(fran_cutscene, new CondNot(new CondVisit(fran_cutscene)))]),
    ]
    fran_intro.links = franQs;
    fran_marriage.links = franQs;
    fran_health.links = franQs;
    fran_lake.links = franQs;
    fran_cutscene.links = [inv_return];

    var melQs = [
        new Link("Ask Melissa about her movements while she was alone between 7:30 and 8:20", [plus_inv, new EffectMove(mel_move), check_end], new CondNot(new CondVisit(mel_move))),
        new Link("Ask about Victor's habits locking his door", [plus_inv, new EffectMove(mel_lock), check_end], new CondNot(new CondVisit(mel_lock))),
        new Link("Ask how long it would take to get to the lake and back", [plus_inv, new EffectMove(mel_lake), check_end], new CondNot(new CondVisit(mel_lake))),
        new Link("Ask about Victor's general physical health", [plus_inv, new EffectMove(mel_health), check_end], new CondNot(new CondVisit(mel_health))),
        new Link("Ask about Victor's habits with his window", [plus_inv, new EffectMove(mel_window), check_end], new CondNot(new CondVisit(mel_window))),
        new Link("Ask about the missing key", [plus_inv, new EffectMove(mel_key), check_end], new CondNot(new CondVisit(mel_key))),
        new Link("Stop talking to Melissa for now", [plus_inv, new EffectMove(inv_menu), new EffectMove(mel_cutscene, new CondNot(new CondVisit(mel_cutscene)))]),
    ]
    mel_intro.links = melQs;
    mel_move.links = melQs;
    mel_lock.links = melQs;
    mel_window.links = melQs;
    mel_lake.links = melQs;
    mel_health.links = melQs;
    mel_key.links = melQs;
    mel_cutscene.links = [inv_return];

    confrontation.links = [new Link("Submit final guess", [new EffectMove(reveal)])];

    reveal.links = [new Link("Download data--please email this file to the experimenter!", [new EffectCustom(function () {
        //Get time
        var curtime = new Date();
        var seconds = (curtime - starttime)/1000;

        //Build data
        var player_links = JSON.stringify(link_nums);
        var player_notes = JSON.stringify(subject_record);
        var player_theories = JSON.stringify(theory_record);
        var player_record = JSON.stringify(link_record);
        var total_string = seconds + player_links + player_notes + player_theories + player_record;
        console.log(total_string);

        //Save file
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(total_string));
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", "datafile.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
    })])]


    //Set starting area
    game.set_start(pilot_intro);

}

//Import text
import { m as mystery } from '../Experiment/text.js';


var jdata;
function set_jdata(x) {
    jdata = x;
    game.customize(mystery, mystery_setup, jdata); //Must be named 'game'
    game.run();
}
function fetchJSONData() {
    fetch('../analysis/data/datafile_4.json')
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