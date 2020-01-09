import React, { Component } from "react";
import "./styles/issue.scss";
import IssueLabel from "./IssueLabel";

class Issue extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="issue">
        <div className="issue__title">
          <div>{this.props.issueInfo.issueTitle}</div>
        </div>
        <div className="issue__body">{this.props.issueInfo.issueBody}</div>
        <div className="issue__labels">
          {this.props.issueInfo.issueLabels.map((label, index) => {
            return <IssueLabel label={label} key={index} />;
          })}
        </div>
      </div>
    );
  }
}

export default Issue;
