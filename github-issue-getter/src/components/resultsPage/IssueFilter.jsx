import React, { Component } from "react";
import "./styles/issueFilter.scss";
class IssueFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  changeFilter = () => {
    this.props.switchFilter(this.props.issueType);
  };
  render() {
    const { switchFilter, issueType } = this.props
    return (
      <div onClick={() => switchFilter(issueType)} className="issueType">
        {issueType}
      </div>
    );
  }
}

export default IssueFilter;
