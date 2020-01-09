import React, { Component } from "react";
import Issue from "./Issue";
import ResultsNavBar from "./ResultsNavbar";
import IssueFilter from "./IssueFilter";
import "./styles/resultsContainer.scss";

const ISSUETYPES = [  // enum constants should live outside of the component and be written in all caps
    "All Issues",
    "Open Issues",
    "Closed Issues",
    "Pull Requests"
  ]
class ResultsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIssueType: ISSUETYPES[0], // you should never repeat enum constants in an hard-coded way. 
      currentIssues: [],
    };
  }
  componentDidMount() {
    this.loadIssues()
  }

  loadIssues() { // case/switch style is easier to read here
    switch (this.state.selectedIssueType) {
      case "All Issues": return this.applyFilter(null)
      case "Closed Issues": return this.applyFilter(this.isClosedIssue)
      case "Pull Requests": return this.applyFilter(this.isPullRequest)
      case "Open Issues": return this.applyFilter(this.isOpenIssue)
    }
  }

  isClosedIssue(issue) {
    return issue.issueState === "closed"
  }

  isPullRequest(issue) {
    return !!issue.pullRequest
  }

  isOpenIssue(issue) {
    return issue.issueState === "open"
  }

  applyFilter(filterFunction = null) {
    const filteredIssues = filterFunction ? this.props.issues.filter(issue => filterFunction(issue)) : this.props.issues
    this.setState({ currentIssues: filteredIssues });
  }

  async switchFilter(newFilter) {
    await this.setState({ selectedIssueType: newFilter}) // state changes are async
    this.loadIssues()
  }

  renderIssues() {
    return this.state.currentIssues.map((issue, index) => <Issue issueInfo={issue} key={index} />)
  }

  render() {
    return (
      <div className="resultsContainer">
        <nav className="resultsNavbarContainer">
          <ResultsNavBar gitHubLink={this.props.gitHubLink} />
        </nav>
        {
          <div className="issueFilterContainer">
            {ISSUETYPES.map((issueType, index) => {
              return (
                <IssueFilter
                  key={index}
                  switchFilter={(newFilter) => this.switchFilter(newFilter)}
                  issueType={issueType}
                />
              );
            })}
          </div>
        }
        {this.state.currentIssues.length === 0 ? 
          <div>No issues for this repo...</div> 
          : 
          <div className="issuesContainer">{this.renderIssues()}</div>
        }
      </div>
    );
  }
}

export default ResultsContainer;
