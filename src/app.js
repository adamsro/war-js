import React from 'react';
import './app.css';
import WarCardGame from './war';

function CardView(props) {
  if (props.faceUp) {
    return <img className="card" src={"/cards/" + props.rank + props.suit + ".svg"}/>
  }
  return <img className="card" src="/cards/back.svg"/>
}

function StackActive(props) {
  return (<div className="clickable" tabIndex="1" autoFocus="true" onClick={() => props.clickHandle()}>
      <Stack {...props} />
    </div>
  );
}
function Stack(props) {
  return (<div className="stack">
      {props.stack.length > 0
        ? <CardView {...props.stack[props.stack.length - 1]}/>
        : <div className="card-spot"></div>
      }
      {props.isWinner === true
        ? <p className="text-center">Player {props.player}<br />WINS!</p>
        : <p className="text-center">Player {props.player}<br /> {props.stack.length} cards</p>
      }
    </div>
  );
}

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      game: new WarCardGame()
    };
    this.state.game.startGame();
  }

  /**
   * Click handler for Player A card
   */
  handleNextMove() {
    // Manual advance
    // this.state.game.nextMove();
  }

  render() {
    return (
      <div className="card-layout">
        <div className="card-col">
          <StackActive
            clickHandle={() => this.handleNextMove()}
            player="A"
            stack={this.state.game.stackA}
            isWinner={this.state.game.winner} />
        </div>
        <div className="card-col">
          {this.state.game.playedA.map((card, index) =>
            <CardView key={index} {...card} />
          )}
        </div>
        <div className="card-col">
          {this.state.game.playedB.map((card, index) =>
            <CardView key={index} {...card} />
          )}
        </div>
        <div className="card-col">
          <Stack
            player="B"
            stack={this.state.game.stackB}
            isWinner={this.state.winner} />
        </div>
      </div>
    );
  }
}