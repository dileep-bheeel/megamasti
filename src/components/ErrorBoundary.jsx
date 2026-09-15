import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return <main className="error-state">
        <span>LET’S RESET THE BOARD</span>
        <h1>Something interrupted this round.</h1>
        <p>Your browser and saved progress are safe. Reload the experience or return to the game library.</p>
        <div><button type="button" onClick={() => window.location.reload()}>Reload</button><a href="/games">Browse games</a></div>
      </main>;
    }
    return this.props.children;
  }
}
