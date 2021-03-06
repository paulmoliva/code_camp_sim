import React from 'react';
import Preload from 'react-preload';
import Secretary from './../../game_logic/animation_logic/secretary.js';
import Desk from './../../game_logic/animation_logic/desk.js';
import Clock from './../../game_logic/clock.js';

import StudyIconAnim from
 './../../game_logic/animation_logic/study_icon_anim.js';
import FireAnim from
 './../../game_logic/animation_logic/fire_anim.js';
import FoodAnim from
 './../../game_logic/animation_logic/food_anim.js';
import StudentAnim from
 './../../game_logic/animation_logic/student_anim.js';


class OpenSesh extends React.Component {
  constructor (props) {
    super(props);
    this.player = this.props.player;
    this.player.clock.pause();
    this.playerAnim = this.props.playerAnim;
    this.main = this.main.bind(this);
    this.renderSprites = this.renderSprites.bind(this);
    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.checkForDoneSprites = this.checkForDoneSprites.bind(this);
    this.checkFocus = this.checkFocus.bind(this);

    this.quadrants = this.quadrants.bind(this);
    this.mouseOverWorkStation = this.mouseOverWorkStation.bind(this);
    this.mouseOverLecture = this.mouseOverLecture.bind(this);
    this.mouseOverKitchen = this.mouseOverKitchen.bind(this);
    this.mouseOverCandanessa = this.mouseOverCandanessa.bind(this);
    this.mouseOverExit = this.mouseOverExit.bind(this);
    this.clickWorkStation = this.clickWorkStation.bind(this);
    this.clickLecture = this.clickLecture.bind(this);
    this.clickKitchen = this.clickKitchen.bind(this);
    this.clickCandanessa = this.clickCandanessa.bind(this);
    this.clickCandanessa = this.clickCandanessa.bind(this);
    this.clickExit = this.clickExit.bind(this);
    this.drinksCoffee = this.drinksCoffee.bind(this);
    this.eatsDonut = this.eatsDonut.bind(this);
    this.eatsLunch = this.eatsLunch.bind(this);
    this.leavingEarly = this.leavingEarly.bind(this);
    this.leaving = this.leaving.bind(this);
    this.leavingButtons = this.leavingButtons.bind(this);
    this.candanessaButtons = this.candanessaButtons.bind(this);
    this.spitGameAtCandanessa = this.spitGameAtCandanessa.bind(this);
    this.askOutCandanessa = this.askOutCandanessa.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleDontLeave = this.handleDontLeave.bind(this);
    this.handle1159 = this.handle1159.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.initializeSprites = this.initializeSprites.bind(this);
    this.buttons = this.buttons.bind(this);
    this.handleGetOffComputer = this.handleGetOffComputer.bind(this);
    this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this);

    this.sprites = [];
    this.player.ateDonut = false;
    this.leavingTime = false;
    this.background = new Image();
    this.background.src = './app/assets/images/newfloor.png';
  }//end constructor

  componentDidMount() {
    this.canvas = document.getElementById('canvas');
    this.canvas.height = 500;
    this.canvas.width = 800;
    this.ctx = this.canvas.getContext("2d");
    this.player.ctx = this.ctx;
    this.player.canvas = this.canvas;
    this.playerAnim.ctx = this.ctx;
    this.playerAnim.canvas = this.canvas;
    this.initializeSprites();
    this.hover1 = document.getElementById('hover1');
    this.player.clock.animTickerCount = this.player.clock.tickCounter + 5 - 5;
    this.background.onload = () => {
      this.player.clock.unpause();
      this.main();
    };
  }


  main() { //refactor!
    if (this.player.clock.is([24,0])) {this.handle1159();}
    if (this.player.clock.is(["2","00","am"])) {
      this.player.clock.pause();

      this.handleLeave();}
    if (this.player.day.eatingLunch) {
      if (this.player.clock.diff(this.lunchTime) > this.lunchMinutes) {
        this.endLunch();
      }
    }

    if (this.player.clock.paused) {return;}
    var dt = (this.player.clock.tickCounter - this.player.clock.animTickerCount);
    this.ctx.drawImage(this.background,-28,0);
    this.update(dt);
    this.renderSprites();
    this.player.clock.animTickerCount = this.player.clock.tickCounter;

    if (this.player.newStrike) {this.cancelAnimationFrame(this.openSeshAnimationFrame);
    } else {
      if ([0,2,4].includes(this.player.session)) {
        this.openSeshAnimationFrame = window.requestAnimationFrame(this.main);
      } else {
        this.cancelAnimationFrame(this.openSeshAnimationFrame);
      }
    }
  }

  cancelAnimationFrame() {
    if (this.openSeshAnimationFrame) {
      this.playerAnim.soundTyping.pause();
      if (this.microwaveSound) {this.microwaveSound.pause();}
      if (this.player.onFire) {this.player.fireOff();}
      window.cancelAnimationFrame(this.openSeshAnimationFrame);
      this.openSeshAnimationFrame = undefined;
    }
  }

  buttons() {
    if (this.leavingTime) {return this.leavingButtons();}
    if (this.player.working())  {return this.workStationButtons();}
    if (this.player.currentPos===9) {return this.kitchenButtons();}
    if (this.player.currentPos===10) {return this.candanessaButtons();}
  }

  leavingButtons() {
    if (this.leavingTime === "early") {
      return (
        <div className="middle-buttons-area">
          <button className="leave-button-big"
            onClick={this.handleDontLeave}>
            NO! DO NOT LEAVE YET!
          </button>
          <button className="leave-button-small"
            onClick={this.handleLeave}>
            YES I WANT TO LEAVE EARLY
          </button>
        </div>
    );} else if (this.leavingTime === "normal") {
      return (
        <div className="middle-buttons-area">
          <button className="leave-button-big"
            onClick={this.handleLeave}>
            YES, I WANT TO LEAVE
          </button>
          <button className="leave-button-small"
            onClick={this.handleDontLeave}>
            NO! DO NOT LEAVE YET!
          </button>
        </div>
    );}
  }

  handleDontLeave() {
    this.player.tempMessage = "";
    this.leavingTime = false;
    this.player.clock.unpause();
    this.openSeshAnimationFrame = window.requestAnimationFrame(this.main);
  }

  handleLeave() {
    this.player.tempMessage = "";
    this.player.clock.unpause();
    this.cancelAnimationFrame();
    this.leavingTime = false;
    this.player.leaving = true;
  }



  workStationButtons() {
    return (
      <div className="middle-buttons-area">
        <button className="middle-button1"
          onClick={this.handleSave}>
          SAVE GAME
        </button>
        <button className="middle-button2"
          onClick={this.handleGetOffComputer}>
          LEAVE WORKSTATION
        </button>

        <button className="middle-button3"
              onClick={this.handleSave}>
              MESSAGE BOARDS
        </button>
      </div>
    );
  }

  handleSave() {
    this.player.tempMessage = "🚧 This feature is currently in development 🚧";
  }


  handleBoards() {
    this.player.tempMessage = "🚧 This feature is currently in development 🚧";

  }

  handleGetOffComputer() {
    this.playerAnim.soundTyping.pause();
    this.player.day.chanceForFireOffset = 0;
    if (this.player.onFire) {this.player.fireOff();}
    this.playerAnim.moveTo(0, ()=> {
      this.player.currentPos=0;
    });
  }




  kitchenButtons() {
    var eatButton = null;
    if (this.player.day.eatingLunch) {return null;}
    if ((!(this.player.day.ateLunch)) && this.player.clock.isBetween([12,1],[13,26])) {
      eatButton =
        <button className = "middle-button5"
          onClick = {this.eatsLunch}>
          🍲 <br/>LUNCH BREAK
        </button>;
      }
    if (this.player.clock.isBetween([8,45],[8,59]) && (!(this.player.ateDonut))) {
      eatButton =
        <button className = "middle-button5"
          onClick = {this.eatsDonut}>
          🍩 <br/>EAT DONUT
        </button>;
      }

    return (
      <div className="middle-buttons-area">
        <button className="middle-button4"
          onClick={this.drinksCoffee}>
          ☕<br/>DRINK COFFEE
        </button>
        {eatButton}
      </div>
    );
  }


  candanessaButtons() {
    var candanessaButton = null;

    if (!(this.player.day.talkedToCandanessa)) {
      candanessaButton =
        <button className = "middle-button6" //change to 6
          onClick = {this.spitGameAtCandanessa}>
          TALK TO CANDANESSA
        </button>;
      }
    if ((this.player.day.talkedToCandanessa)) {
      candanessaButton =
        <button className = "middle-button6"
          onClick = {this.askOutCandanessa}>
          ASK CANDANESSA ON A DATE
        </button>;
      }

    return (
      <div className="middle-buttons-area">
        {candanessaButton}
      </div>
    );
  }

   spitGameAtCandanessa() {
      this.player.talkingToCandanessa = true;
      this.player.day.talkedToCandanessa = true;
       this.player.tempMessage = this.getCandanessaMessage();
       this.player.happiness +=3;
       var now = this.player.clock.time();
       this.player.day.eatingLunch = true;
       this.lunchTime = now;
       this.lunchMinutes = 15;
       this.player.clock = new Clock(now, this.player.defaultClockSpeed*4);
   }


   askOutCandanessa() {
     if (this.player.askedOutCandanessa) {

       this.player.newStrike = {message: "You receive a strike for violating the code of conduct.  If you ask someone out and they say they're not interested, you cannot ask again.    No means no.", newTime: this.player.clock.time(), newClockSpeed: this.player.defaultClockSpeed, newPos: 0};
     } else {
       this.player.message = `No, thank you.  I'm not interested.`;
       window.setTimeout(()=>{
         this.player.message = "";},2000);
       this.player.askedOutCandanessa = true;
       this.playerAnim.moveTo(0, ()=> {
         this.player.currentPos=0;
       });
     }
   }

   getCandanessaMessage() {
     var x = Math.floor(Math.random()*5)+1;
     switch (x) {
       case 1:
         return "The biggest mistake I see students make is not managing their sleep well.";
       case 2:
         return "Hi!  How are you doing today?";
       case 3:
         return "Don't forget to eat lunch every day!";
       case 4:
         return "The main point of Pair Programming is to learn to work well with other.  Make sure you switch every 30 minutes!";
       case 5:
         return "If you drink coffee too late, you won't be able to fall asleep at night.";
       default:
         console.log("some weird numbe showed up when getting the candanessa message  " + x);

     }
   }

  drinksCoffee() {
    if ((Math.random()*5)< 1) {
      this.player.day.lastCoffee = this.player.clock.time();
      if (this.player.clock.isBetween([0,0],[2,0])) {
        this.player.day.lastCoffee[0] += 24;
      }
    }
    if (this.player.day.lastCoffee !== undefined && this.player.clock.diff(this.player.day.lastCoffee) < 30) {
      this.player.tempMessage = "COFFEE BREWING...";
    } else {
      this.player.day.lastCoffee = this.player.clock.time();
      if (this.player.clock.isBetween([0,0],[2,0])) {
        this.player.day.lastCoffee[0] += 24;
      }
      this.player.focus+=35;
      var coffee = new FoodAnim({canvas: this.canvas, ctx: this.ctx},
        "coffee");
      this.sprites.push(coffee);
    }
  }

  eatsDonut() {
    this.player.ateDonut = true;
    this.player.focus+=15;
    this.player.sleepBank +=3;
    this.player.happiness +=3;
    this.player.score +=1000;
    var donut = new FoodAnim({canvas: this.canvas, ctx: this.ctx},
      "donut");
    this.sprites.push(donut);


  }

  eatsLunch() {
    if (!(this.player.day.ateLunch)) {
      this.microwaveSound = new Audio("./app/assets/sounds/microwave_start.wav");
      window.setTimeout(()=>this.microwaveSound.play(),100);
      this.player.day.eatingLunch = true;
      this.player.tempMessage = "TAKING LUNCH BREAK";
      this.player.focus = 100;
      this.player.happiness +=2;
      var now = this.player.clock.time();
      this.lunchTime = now;
      this.lunchMinutes = 15 + Math.floor(Math.random()*15);
      if (this.lunchMinutes > 15) {
        this.player.tempMessage = "Stuck in the microwave line!!!";
      }
      this.player.clock = new Clock(now, this.player.defaultClockSpeed*3);


    }

  }

  endLunch() {
    if (this.player.talkingToCandanessa) {
      this.player.talkingToCandanessa = false;
      this.player.day.talkedToCandanessa = true;
      this.player.day.eatingLunch = false; //should rename this
    } else {
    this.microwaveSound.pause();
    this.microwaveSound = undefined;
    this.player.day.eatingLunch = false;
    this.player.day.ateLunch = true;
    this.player.tempMessage = "";
    this.player.message = "Be sure you're seated at your workstation at 1:30pm for pair programming!";
    var lunch = new FoodAnim({canvas: this.canvas, ctx: this.ctx},
      "lunch");
      this.sprites.push(lunch);
  }
    var now = this.player.clock.time();
    this.lunchTime = null;
    this.player.clock = new Clock(now, this.player.defaultClockSpeed);

  }



  quadrants() {
    if (this.player.day.eatingLunch || this.leavingTime){return null;}
    var candanessa = null;
    var kitchen = null;
    if (this.player.clock.isBetween([7,0],[17,0]) && this.player.currentPos !==10 ) {
      candanessa = <div id="hover4"
        onMouseOver={this.mouseOverCandanessa}
        onClick={this.clickCandanessa}
        onMouseOut={()=> {
          this.player.tempMessage="";
        }}/>;
    }
    if (this.player.currentPos !==9 ) {
      kitchen = <div id="hover3"
        onMouseOver={this.mouseOverKitchen}
        onClick={this.clickKitchen}
        onMouseOut={()=> {
          this.player.tempMessage="";
        }}/>;
    }
    if (!(this.player.working())) {
    return (
      <div className="hovers">
        <div id="hover1"
          onMouseOver={this.mouseOverWorkStation}
          onClick={this.clickWorkStation}
          onMouseOut={()=> {
            this.player.tempMessage="";
          }}/>
        <div id="hover2"
          onMouseOver={this.mouseOverLecture}
          onClick={this.clickLecture}
          onMouseOut={()=> {
            this.player.tempMessage="";
          }}/>
        <div id="hover5"
          onMouseOver={this.mouseOverExit}
          onClick={this.clickExit}
          onMouseOut={()=> {
            this.player.tempMessage="";
          }}/>

        {kitchen}
        {candanessa}
      </div>
    );}
  }

  clickLecture() {
    if (this.player.clock.isBetween([8,30],[9,30])) {
      this.player.message = "";
      this.player.defaultMessage = "";
      this.playerAnim.moveTo(12, ()=> {
        this.player.currentPos=12;
        this.player.session = 1;
      });
    }
    else {
      this.player.message = "The lecture hall doors are locked.";
    }
  }

  mouseOverLecture() {
    if (this.player.clock.isBetween([8,30],[9,30])) {
      this.player.tempMessage = "Go to lecture";
    } else {this.player.tempMessage = "The lecture hall doors are locked.";}
  }

  clickWorkStation() {
    this.playerAnim.moveTo(11, ()=> {
      this.player.currentPos=11;
    });
  }

  mouseOverWorkStation() {
    this.player.tempMessage = "Go to workstation";

  }

  clickKitchen() {
    if (this.player.clock.isBetween([8,45],[8,59])) {
      this.player.tempMessage="Oh look!  Someone left donuts in the kitchen!";}
    this.playerAnim.moveTo(9, ()=> {
      this.player.currentPos=9;
    });
  }

  mouseOverKitchen() {
    this.player.tempMessage = "Go to kitchen";
  }

  clickCandanessa() {
    this.playerAnim.moveTo(10, ()=> {
      this.player.currentPos=10;
    });
  }

  mouseOverCandanessa() {
    this.player.tempMessage = "Talk to Candanessa";
  }

  mouseOverExit() {
    this.player.tempMessage = "Exit";
  }

  clickExit() {
    var now = this.player.clock.time();
    switch (true) {
      case (this.player.clock.isBetween(["6","00","am"],["4","59","pm"])):
          this.leavingEarly();
        break;
      default:
          this.leaving();
    }

  }

  leavingEarly() {
    this.player.tempMessage = "🚧 Leave school early feature is in development 🚧";



    // var now = this.player.clock.time();
    // this.player.clock.pause();
    // var strikes;
    // switch (true) {
    //   case this.player.clock.isBetween([6,0],[8,59]):
    //     strikes = 4;
    //     break;
    //   case this.player.clock.isBetween([9,0],[9,29]):
    //     strikes = 3;
    //     break;
    //   case this.player.clock.isBetween([9,30],[13,29]):
    //     strikes = 2;
    //     break;
    //   default:
    // }
    // this.player.tempMessage = `ARE YOU SURE YOU WANT TO LEAVE EARLY?  You will receive ${strikes} strikes for missing the rest of the day's sessions.`;
    // this.leavingTime = "early";
  }

  leaving() {
    this.player.clock.pause();
    this.player.tempMessage = "Please confirm you want to leave.";
    this.leavingTime = "normal";
  }

  handle1159() {
    this.player.clock = new Clock ([24,1], this.player.defaultClockSpeed);
    this.player.clock.pause();
    this.player.tempMessage = "It is 11:59pm.  This is your last chance to leave and be guaranteed you can get in on time in the morning.  Stay at your own risk!  Would you like to leave now?";
    this.leavingTime = "normal";
  }
  checkFocus() {
    if (this.player.focus>0) {return;}
    this.player.tempMessage === "You can't focus any longer.  Take a break.";
    this.handleGetOffComputer();
  }


  update (dt) {
    this.checkFocus();
    if (this.player.working()) {

        var workstationUpdate = this.player.workstationGo();
        if (workstationUpdate){
          this.addStudyIcon(workstationUpdate);
        }
    }
    this.sprites.forEach(sprite => sprite.update(dt));
    if (this.player.onFire) {
      this.player.fire.update(dt);}
    this.playerAnim.update(dt);
    this.checkForDoneSprites();
    this.secretary.update(this.player.clock.isBetween([8,0],[17,0]));
    //check for new icon
  }

  addStudyIcon(newIcon) { //this should take an object account
    this.sprites.push(newIcon);
    this.player.lastIconTime = Date.now();
  }

  renderSprites () {
    ////draw furniture first then fire, then study icons then hero
    this.sprites.forEach(sprite => {
      if (sprite.type!=="study icon" && sprite.type!=="student") {
        this.ctx.drawImage(sprite.image,sprite.pos[0],sprite.pos[1]);
      } else if (
        sprite.type==="student" &&
        sprite.number !== 1 &&
        (!(this.player.clock.isBetween([9,1],[11,59]))) &&
        (!(this.player.clock.isBetween([0,0],[2,0])))) {
        sprite.render();
        if (sprite.number !== 1 && this.player.clock.isBetween([20,0],[24,0])) {
          if (Math.random()*3000 < 1) {
            sprite.done= true;
          }
        }
      } else if (sprite.number === 1 && (!(this.player.clock.isBetween([9,1],[11,59])))) {sprite.render();}
      this.ctx.drawImage(this.secretary.image,this.secretary.pos[0],this.secretary.pos[1]);

      if (this.player.onFire) {
        this.player.fire.render();
      }
      if (sprite.type==="study icon") {
        sprite.render();
      }
    });
    this.playerAnim.render(); // render player
  }

  checkForDoneSprites () { //change to check for done icons

    for (var i = 0; i < this.sprites.length; i++) {
      var sprite = this.sprites[i];
      if (sprite.done) {
        this.sprites.splice(i,1);
        i -=1;
      }
    }
  }


  initializeSprites () {
    //need to change this up between animated and not-animated
    this.secretary = new Secretary();
    var d = new Desk(1);
    d.pos = [290,90];
    this.sprites.push(d);
    d = new Desk(2);
    d.pos = [250,200];
    this.sprites.push(d);
    d = new Desk(3);
    d.pos = [300,320];
    this.sprites.push(d);

    d = new StudentAnim(this.player, [412,320], 3);
    this.player.rightStudent = d;
    this.sprites.push(d);
    d = new StudentAnim(this.player, [482,319], 3);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [553,322], 3, 1);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [593,320], 3);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [628,323], 3);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [668,323], 3);
    this.sprites.push(d);

    d = new StudentAnim(this.player, [260,201], 2);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [298,204], 2);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [337,200], 2);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [373,202], 2);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [446,202], 2);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [520,200], 2);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [629,202], 2);
    this.sprites.push(d);

    d = new StudentAnim(this.player, [283,91], 1);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [398,90], 1);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [472,91], 1);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [548,90], 1);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [583,91], 1);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [617,90], 1);
    this.sprites.push(d);
    d = new StudentAnim(this.player, [656,96], 1);
    this.sprites.push(d);

  }//end initialize()

  render () {

    return (

          <div className="canvas-container">
            {this.quadrants()}
            <canvas id="canvas"
              width="800"
              height="520"/>
            {this.buttons()}
          </div>

    );
  }

}//end component


export default OpenSesh;
