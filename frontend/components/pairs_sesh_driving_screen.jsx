import React from 'react';
import Clock from './../../game_logic/clock.js';
import PairsLine from './pairs_line.jsx';

class PairsSeshDrivingScreen extends React.Component {
  constructor (props) {
    super(props);
    // this.main = this.main.bind(this);
    this.sentenceTexts = ["test","def my_each(&prc)","self.length.times do |i|", "prc.call(self[i])", "end", "self", "end", "def my_select(&prc)", "selects = []", "self.my_each do |item|", "if prc.call(item)", "selects << item", "end", "end", "selects", "end"];
    this.sentences = [];
    this.explosions = [];
    this.shotSound = new Audio ("./app/assets/sounds/shot.wav");
    this.state= {
      currentInput: "",
    };
    // this.onClick = this.onClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.initializeSentences = this.initializeSentences.bind(this);
    this.updateSentences = this.updateSentences.bind(this);
    // this.getRandomSentence = this.getRandomSentence.bind(this);
    this.addNewSentence = this.addNewSentence.bind(this);
    this.addExplosion = this.addExplosion.bind(this);
    this.renderExplosion = this.renderExplosion.bind(this);
    this.updateExplosions = this.updateExplosions.bind(this);
    this.pairsLines = this.pairsLines.bind(this);
    this.findActive = this.findActive.bind(this);
    this.initializeSentences();
    this.over = false;
    this.yPosIncrement = 2;
    this.lineSpacing = 100;
    this.props.player.message = "TYPE THE TEXT AS FAST AS YOU CAN!";
    this.explosionImage = new Image ();
    this.explosionImage.src = "./app/assets/images/line_explosion.jpg";
    this.yyinterval = setInterval(()=>this.tick(),50);
  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas2');
    this.canvas.height = 500;
    this.canvas.width = 800;
    this.ctx = this.canvas.getContext("2d");

  }

  initializeSentences() {
    this.sentenceTexts.forEach((el,idx) => {
      this.sentences.push(
        {id: idx, text: el, active: (idx===0 ? true : false), exploded: false, yPos: 500 + idx*100}
      );
    });

  }

  tick() {
    this.checkOver();
    this.updateSentences();
    this.updateExplosions();
    document.getElementById("pairs-input").focus();
  }

  clearInt() {
    clearInterval(this.yyinterval);
  }

  addExplosion(a) {
    this.explosions.push({yPos: a.yPos, timer: 0});
  }

  updateExplosions() {

    for (var i = 0; i < this.explosions.length; i++) {
      var a = this.explosions[i];
      this.renderExplosion(a);
      a.yPos -= this.yPosIncrement*2;
      a.timer++;
      if (a.timer===8) {
        this.explosions.splice(i,1);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        i--;
      }
    }
  }

  renderExplosion(a) {
    // this.ctx.fillStyle = "rgb(51, 118, 36)";
    // this.ctx.fillRect(550, a.yPos + 310, 200, 50);
    var xOffset=(a.timer %3) * 75;
    var yOffset=Math.floor(a.timer / 3) * 75;
    for (var i = 0; i < 4; i++) {
      this.ctx.drawImage(this.explosionImage, xOffset, yOffset, 75, 75, 530 + i*60, a.yPos -130, 75, 75 );

    }

  }

  addNewSentence() {
    var a = this.sentences.length - 1;
    var newYpos = this.sentences[a].yPos + this.lineSpacing;

    this.sentences.push(
      {text: this.sentences[0].text, exploded: false, done: false, active: false, yPos: newYpos}
    );
  }


  update(field){
    return e => {
      this.setState({[field]: e.currentTarget.value });
    };
  }

  checkOver() {
    if (this.sentences.length===0) {
    clearInterval(this.yyinterval);
    console.log("OVER");}
  }
  updateSentences() {

    if (this.state.currentInput==="bbr") {
      this.setState({currentInput: this.sentences[0].text});
      return;
    }
    this.sentences.forEach(sentence => {
      sentence.yPos -= this.yPosIncrement;
    });
    if (this.sentences[0].yPos <= 200) {
        new Audio ("./app/assets/sounds/missed.wav").play();
        this.addNewSentence();
        if (this.sentences[0].active) {
          this.sentences[1].active = true;
          this.sentences[0].active=false;
          this.sentences[0].exploded=false;
          this.sentences[0].done = true;
          this.setState({currentInput: ""});
        }
        this.sentences.shift();
    } else {this.checkOver();}
  }

  findActive() {
    for (var i = 0; i < this.sentences.length; i++) {
      if (this.sentences[i].active) {return i;}
    }
    return null;
  }

  handleSubmit(e){

    if (e.keyCode===13) {e.preventDefault();}
    if (e.keyCode===13 && this.state.currentInput.length>1) {
      // debugger;
      var a = this.findActive();
      if (this.state.currentInput == this.sentences[this.findActive()].text) {
          new Audio ("./app/assets/sounds/explosion.wav").play();
          this.addExplosion(this.sentences[a]);
          this.sentences[a+1].active = true;
          this.sentences[a].exploded = true;
          this.sentences[a].active = false;
        }
      else {
        new Audio ("./app/assets/sounds/missed.wav").play();
        this.sentences[a].active=false;
        this.sentences[a].done = true;
        this.sentences[a+1].active=true;
      }
        this.setState({currentInput: ""});
    }
    }

  pairsLines() {
    var results = [];
    this.sentences.forEach((sentence, idx) => {
    if (sentence.yPos<500) {
    results.push(
      <div className="pairs-line" style={{top: sentence.yPos + "px"}} >
        <PairsLine currentLine = {sentence} currentInput = {this.state.currentInput}/>
      </div>
      );}
    });
    return results;
  }



  render () {
    return (
      <div className="pairs-sesh">
      <canvas id="canvas2"
        width="800"
        height="520"/>

        <img src="/Users/Eihcir0/Desktop/code_camp_sim/app/assets/images/computer_screen2.png" className="pairs-computer-screen"/>
        <div className="pairs-input-text">
          <textarea id="pairs-input"
            value={this.state.currentInput}
            onKeyDown={this.handleSubmit}
            onChange={this.update("currentInput")}
            className="pairs-input" autoFocus />
       </div>
        <div className="pairs-partner-area">
          {this.pairsLines()}
        </div>
      </div>
    );
  }

}//end component


export default PairsSeshDrivingScreen;
