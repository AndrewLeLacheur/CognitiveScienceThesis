/*This code can run a simple cyoa. Includes:
    - Pages
    - Links
    - Variables (numerical or text)
    - Conditional links
    - Conditional effects
    - Go back button
    - Default condition
    - Location-specific effects
    - # of clicks condition
Does NOT include:
    - Items
    - Stat bar
    - Combat
Future dvelopment: (TODO)
*/


var subject_record = [" "];
var link_record = [" "];
var theory_record = [" "];
var link_nums = [0];
var record_index = 0;

class Area {
    constructor (title, text, key='NA', style=game.stylearea) {
        //Areas are static, and never change after they are created.
        this.index = game.areacount; //Unique index
        this.id = "area" + this.index; //html object id
        this.title = title; //text for scene title
        this.text = text; //body of text
        this.links = []; //list of link objects
        this.effects = []; //List of load effects

        this.style = style;

        game.areas.push(this); //Add to game areas list
        game.visit.push(0); //Add game visit variable
        game.areacount += 1; //Increment index counter

        if (key != 'NA') {
            game.a[key] = this.index;
        }
    }
    refresh() {
        this.load(); //Page script
        game.load(); //Global area script
        this.build();
        this.set_style();
    }
    set_style() {
        var page = document.getElementById("page");

        //Set background image:
        page.style["background-image"] = "url('" + this.style.background + "')";
        if (this.style.wrapback) { //Wrap image if so desired
            page.style["background-repeat"] = "no-repeat";
            page.style["background-size"] = "cover";
        }
    }
    build() {
        //Check for dynamic text
        var text = this.text;
        if (this.text instanceof DynamicText) {text = this.text.get_text();}
        var title = this.title;
        if (this.title instanceof DynamicText) {text = this.title.get_text();}

        //Updates text
        var areahtml = `<div id=` + this.id + `>`;
        //areahtml += `<h2>` + title + `</h2><p>` + text + `</p></div>`;
        areahtml += `<p>` + text + `</p></div>`;
        areahtml += `
        <p><i>Your notes:</i></p>
        <textarea style="font-size: large" id="subject_record">` + subject_record[record_index + 1] + `</textarea><br>
        <p><i>What are your theories about what happened? Include your percentage confidence that each theory is correct.</i></p>
        <textarea style="font-size: large" id="theory_record">` + theory_record[record_index + 1] + `</textarea>
        <p><i>Why have you chosen the next link you will click? (Leave blank if there is only one option.)</i></p>
        <textarea style="font-size: large" id="link_record">` + link_nums[record_index + 1] + `\n` + link_record[record_index + 1] + `</textarea>
        <br><br>`;

        //Builds link html objecs
        this.links.forEach(function (elt,i) {
            if (elt.viscond.evaluate()) {areahtml += elt.build();}
        })

        //Sets document html
        document.getElementById("mainText").innerHTML = areahtml;

        //Update text box
        document.getElementById('subject_record').style.height="30vh";
        document.getElementById('subject_record').style.width="50vw";
        document.getElementById('subject_record').style.text_align="top";
        document.getElementById('theory_record').style.width="50vw";
        document.getElementById('theory_record').style.height="15vh";
        document.getElementById('link_record').style.width="50vw";

        //Adds link text & event listeners
        this.links.forEach(function (elt,i) {
            if (elt.viscond.evaluate()) {elt.set_listeners();}
        })
    }
    load() {
        //Decide if you want this to run once, or every time the page is refreshed.
        //Currently this runs BEFORE the page has been loaded, so text-altering effects will work.

        //Run all page effects
        this.effects.forEach(function(elt,i) {
            if (elt.condition.evaluate()) {elt.enact();}
        })
    }
}

class Link {
    constructor (text, effects, viscondition=true_cond, condition=true_cond, key='NA', style=game.stylelink) {
        this.index = game.lcount; //Unique index
        this.id = "link" + this.index; //html object id
        this.text = text; //Text for the scene (may be dynamic)
        this.viscond = viscondition; //Cond object; visibility
        this.condition = condition; //Cond object; selectability
        this.effects = effects; //List of Effect objects

        this.style = style;

        game.links.push(this); //Add to game areas list
        game.lclick.push(0); //Add game visit variable
        game.lcount += 1; //Increment index counter

        if (key != 'NA') {
            game.l[key] = this.index;
        }
    }
    refresh() {
        document.getElementById(this.id).innerHTML = this.build();
        this.set_listeners();
    }
    build() {
        //Set style elements
        var color = this.style.textcolor;
        if ((!this.condition.evaluate())) {
            color = this.style.lockcolor;
        }

        //Check for dynamic text
        var text = this.text;
        if (this.text instanceof DynamicText) {text = this.text.get_text();}

        //Adds link text
        var linkhtml = ``;
        linkhtml += this.style.space + `<div class=link id=` + this.id + ` style="color: ` + color + `">` + text + `</div>`;
        return linkhtml;
    }
    set_listeners() {
        //Adds event listeners
        if (this.condition.evaluate()) {
            document.getElementById(this.id).addEventListener('click', () => {this.click();}, false);
        }
    }
    click() {
        //Increment click counter:
        game.lclick[this.index] += 1;

        //Save textarea:
        subject_record.push(document.getElementById("subject_record").value);
        link_record.push(document.getElementById("link_record").value);
        theory_record.push(document.getElementById("theory_record").value);
        link_nums.push(this.text);
        record_index += 1;

        //Loops through the effects and enacts them
        this.effects.forEach(function(elt,i) {
            if (elt.condition.evaluate()) {elt.enact();}
        })

        //Global link script
        game.click();

        //Save game state
        game.history.push();

        //Reload page (or load new page)
        game.refresh(); //This will work even for EffectMoves, since the game area has been updated.
    }
}

//STYLE

class StyleArea {
    constructor(background, wrapback=false) {
        this.background = background; //Background image
        this.wrapback = wrapback; //True if you want the image NOT to repeat
    }
}

class StyleLink {
    constructor (space=``, textcolor="blue", lockcolor="black") {
        this.space = space; //If you want a line break between options, put it here
        this.textcolor = textcolor; //Color of link text
        this.lockcolor = lockcolor; //Color of link text when the option is locked
    }
}

//CONDITIONS

class CondList {
    constructor (num, lst) {
        this.num = num; //Amount of conds in lst that must be true; -1 for all
        this.conditions = lst; //List of other Cond types
        this.condition = new CondCustom(function() {return true;});
        if (this.num == -1) {
            this.num = this.conditions.length; //Changes -1 "all" flag to # of conds in list
        }
    }
    evaluate() {
        //Returns true if Conds evaluating to true >= num
        var retval = false;
        var count = 0;
        this.conditions.forEach(function (elt,i) {
            if (elt.evaluate()) {count += 1;}
        })
        if (count >= this.num) {
            retval = true;
        }
        return retval;
    }
}

class CondNot {
    constructor (target) {
        this.target = target; //Cond object
    }
    evaluate() {
        //Returns true if Not target
        return !(this.target.evaluate());
    }
}

class CondVisit {
    constructor (area, num=1) {
        this.area = area; //Area object
        this.num = num; //Minimum threshold for visits
    }
    evaluate() {
        //Returns true if the player has been there before
        return (game.visit[this.area.index] >= this.num);
    }
}

//Cond only applies if condcond is also met; a conditional condition
class CondCond {
    constructor(cond, condcond) {
        this.cond = cond; //Cond object, Condition
        this.condcond = condcond; //Cond object, The condition of the contition
    }
    evaluate() {
        //Evaluates the first cond only if the second is already true
        var retval = true;
        if (this.condcond.evaluate()) {
            retval = this.cond.evaluate();
        }
        return retval;
    }
}

class CondLoc {
    constructor (area) {
        this.index = area.index;
    }
    evaluate() {
        //Returns true if the player is in the input location
        return game.area.index == this.index;
    }
}

class CondClicks {
    constructor (index, max) {
        this.index = index; //index of the link
        this.max = max; //maximum number of clicks
    }
    evaluate() {
        //returns true if the link has been clicked less than the maximum
        return game.lclick[this.index] < this.max;
    }
}

class CondDefault {
    constructor(index) {
        this.index = index; //index of a Link object; should also work on Area
        this.id = 1; //Flags it so it knows not to evaluate itself
    }
    evaluate() {
        //Returns true if no other link effects are true
        var retval = true;
        var link = game.links[this.index];
        link.effects.forEach(function (elt,i) {
            if (elt.condition.id != 1) {
                if (elt.condition.evaluate()) {
                    retval = false;
                }
            }
        })
        return retval;
    }
}

class CondCustom {
    constructor(funct) {
        this.funct = funct; //Function returning boolean
    }
    evaluate() {
        return this.funct();
    }
}

//EFFECTS

class EffectMulti {
    constructor (lst, condition=true_cond) {
        this.effects = lst;
        this.condition = condition;
    }
    enact() {
        this.effects.forEach(function (elt, i) {
            if (elt.condition.evaluate()) {elt.enact();}
        })
    }
}

class EffectMove {
    constructor (dest, condition=true_cond) {
        this.condition = condition; //Cond object
        this.dest = dest; //Area object
    }
    enact() {
        //Changes game area to destination & refreshes the game
        var store = game.area;
        game.area = this.dest;
        if (this.dest == "back") {
            game.area = game.lastarea;
        }
        game.lastarea = store;
        game.visit[game.area.index] += 1; //Note that the first visit will have a val of 1! Doesn't update on refresh either.
        document.body.scrollTop = document.documentElement.scrollTop = 0; //Scrolls back to the top of the page on click
    }
}

class EffectCustom {
    constructor(funct, condition=true_cond) {
        this.condition = condition; //Cond object
        this.funct = funct; //Custom function
    }
    enact() {
        this.funct();
    }
}

//TEXT

class DynamicText {
    constructor(funct) {
        this.funct = funct; //Function returning the html text you want
    }
    get_text(){
        return this.funct();
    }
}

//GAME

function copy_array(array) {
    var copy = [];
    array.forEach(function (elt,i) {
        copy[i] = elt;
    })
    return copy;
}

//When you update this, also update items.js!
class GameState {
    constructor(game) {
        this.area = game.area.index;
        this.lastarea = game.lastarea.index;
        this.visit = copy_array(game.visit);
        this.vars = {};
        Object.assign(this.vars, game.v);
        this.vars = JSON.stringify(this.vars);

        this.lcount = game.lcount;
        this.lclick = copy_array(game.lclick);
    }
    load(game) {
        game.area = game.areas[this.area];
        game.lastarea = game.areas[this.lastarea];
        game.visit = this.visit;
        game.v = JSON.parse(this.vars);

        game.lcount = this.lcount;
        game.lclick = this.lclick;
    }
    to_text() {
        return JSON.stringify(this);
    }
}

class History {
    constructor() {
        this.log = [];
    }
    push() {
        //NOTE: When you update this, also update items.js

        var gamestate = new GameState(game);
        this.log.unshift(gamestate);
    }
    pop() {
        this.log.shift();
        this.log.shift().load(game);
    }
}

class Game {
    constructor (clickeffects=[], loadeffects=[]) {
        this.stylelink = new StyleLink();
        this.stylearea = new StyleArea();

        this.clickeffects = clickeffects; //List of global link effects
        this.loadeffects = loadeffects; //list of global area effects

        this.areacount = 0; //# of areas
        this.areas = []; //All game areas
        this.visit = []; //# of times each area has been visited
        this.area = 0; //Current area
        this.lastarea = 0; //Previous area
        this.a = {}; //area(string key)-to-index map; optional
        
        this.links = []; //All game links
        this.lcount = 0; //# of links
        this.lclick = []; //# of times each link has been clicked
        this.l = {}; //link(string key)-to-index map; optional

        this.history = new History(this); //History object
        this.setup = function () {}; //Setup function
        this.story = 0; //Story object

        this.v = {}; //Empty dictionary for variables
    }
    save_load_page() {
        //Build the save & load page for html_setup
        var loadpage = new Area("Save & Load", new DynamicText(function () {
            return `<p id="gamestring">` + game.history.log[0].to_text() + `</p>
            <input id="gameid" type="text"></input>`
        }))
        var submit = new Link("Submit", [new EffectCustom(function () {
            var loadgame = JSON.parse(document.getElementById('gameid').value);
            loadgame = Object.assign(new GameState(game), loadgame)
            loadgame.load(game);
        })])
        var retgame = new Link("Return to game", [new EffectMove("back")]);
        loadpage.links = [submit, retgame];
        return loadpage;
    }
    html_setup() {
        //NOTE: When you update this, also update items.js

        //Create game links and pages:

        //The save & load page:
        var loadpage = this.save_load_page();

        //Go back & save/load links that appear at the top of every page:
        var go_back = new Link("Go back", [new EffectCustom(function () {game.history.pop();})], true_cond, true_cond, 'NA', new StyleLink())
        var load = new Link("Save & Load", [new EffectMove(loadpage)], true_cond, true_cond, 'NA', new StyleLink())

        //Build base html
        var layout = 
            `<main ID="main">
                <section ID="mainText" class="textarea">
                    <p>If you can see this, the script.js is working, but your starting area isn't.</p>
                </section>
            </main>`
        ;

        //Set html to layout
        document.getElementById("maincontent").innerHTML = layout;
    }
    customize(story, setup, data) {
        this.story = story; //Custom story object imported from text document
        this.setup = setup; //Custom setup function designed to build the story
        this.setup(this, this.story); //Runs setup function on story object

        console.log("this far");

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
    }
    click() {
        //Global link script: runs when a link is clicked, after link-specific effects but before the refresh
        this.clickeffects.forEach(function(elt,i) {
            if (elt.condition.evaluate()) {elt.enact();}
        })
    }
    load() {
        //Global link script: runs when a link is clicked, after link-specific effects but before the refresh
        this.loadeffects.forEach(function(elt,i) {
            if (elt.condition.evaluate()) {elt.enact();}
        })
    }
    refresh() {
        //NOTE: When you update this, also update items.js
        //reloads the whole game
        this.area.refresh();
    }
    set_start(area) {
        game.lastarea = area;
        game.area = area;
    }
    run() {
        this.html_setup(); //Build html
        this.history.push(); //Save the start state
        this.refresh(); //Build starting page
    }
}

//Recurringly useful functions
function visits(key) {
    return game.visit[game.a[key]];
}

function clicks(key) {
    return game.lclick[game.l[key]];
}

//Stable values
var false_cond = new CondCustom(function () {return false;})
var true_cond = new CondCustom(function () {return true});
true_cond.id = 1; //This way default conditions won't respond to effects that are always true!
false_cond.id = 1;

//Global game variable; must be accessible by all functions at all times
var game = new Game();

//Export all classes & constants
export { Area, Link, 
    StyleLink, StyleArea,
    CondList, CondNot, CondVisit, CondCond, CondLoc, CondClicks, CondDefault, CondCustom, 
    EffectMulti, EffectMove, EffectCustom, 
    DynamicText, 
    GameState, History, Game, 
    copy_array, visits, clicks,
    false_cond, true_cond, game, subject_record, link_record, theory_record, link_nums };
