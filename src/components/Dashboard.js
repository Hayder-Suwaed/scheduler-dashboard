import React, { Component } from "react";
import { setInterview } from "helpers/reducers";
import axios from "axios";
import Loading from "./Loading";
import Panel from "./Panel";

import classnames from "classnames";
import data from "./data";

class Dashboard extends Component {
  state = {
    loading: false,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {}
  };

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:4000');

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (typeof data === "object" && data.type === "SET_INTERVIEW") {
        this.setState((previousState) =>
          setInterview(previousState, data.id, data.interview)
        );
      }
    };

    const focused = JSON.parse(localStorage.getItem("focused"));

    Promise.all([
      axios.get("http://localhost:4000/api/days"),
      axios.get("http://localhost:4000/api/appointments"),
      axios.get("http://localhost:4000/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });

    if (focused) {
      this.setState({ focused });
    }
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  componentWillUnmount() {
    this.socket.close();
  }

  selectPanel = (id) => {
    this.setState((previousState) => ({
      focused: previousState.focused !== null ? null : id
    }));
  };

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });
    if (this.state.loading) {
      return <Loading />;
    }

    const panels = data
      .filter(
        (panel) =>
          this.state.focused === null || this.state.focused === panel.id
      )
      .map((panel) => (
        <Panel
          key={panel.id}
          id={panel.id}
          label={panel.label}
          value={panel.getValue(this.state)}
          onSelect={() => this.selectPanel(panel.id)}
        />
      ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
