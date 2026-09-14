import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    // Production error reporting can be connected here without exposing user data.
  }
  render() {
    if (this.state.failed) {
      return <main className="error-state">
        <span>LET’S RESET THE BOARD</span>
        <h1>Something interrupted this round.</h1>
        <p>Your browser and saved progress are safe. Reload the experience or return to the game library.</p>
        <div><button onClick={() => window.location.reload()}>Reload</button><Link to="/games">Browse games</Link></div>
      </main>;
    }
    return this.props.children;
  }
}
