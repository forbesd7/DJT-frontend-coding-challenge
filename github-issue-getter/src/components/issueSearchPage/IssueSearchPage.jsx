import React, { Component, Fragment } from "react";
import axios from "axios";
import ResultsContainer from "../resultsPage/ResultsContainer";

import "./issueSearchPage.scss";
class IssueSearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didSearch: false,
      isLoading: false, // using strings here was more like a hack. Instead, use a second state variable
      currentGitHubLink: "",
      gitHubIssues: []
    };
  }

  callGitHubIssuesGetter = e => {
    if (e.key === "Enter") {
      let curLink = this.state.currentGitHubLink;
      if (curLink.includes("github.com")) {
        this.GitHubIssuesGetter(curLink);
      } else {
        alert("Please enter a valid GitHub URL.");
      }
    }
  };

  GitHubIssuesGetter = link => {
    //split link and get the user/reponame
    // note 1: You should handle edge cases better. For example: 'https://github.com/facebook' is searchable but breaks the app.
    // note 2: The fetching should be done outside of the component. Ideally in a helper file, inside a utils folder
    const splitLink = link.split("/");
    const gitHubUser = splitLink[3];
    const repoName = splitLink[4];

    this.changeViewToLoading();
    axios
      .get(`https://api.github.com/repos/${gitHubUser}/${repoName}/issues`, {
        params: {
          state: "all",
          per_page: 20 
        }
      })
      .then(res => {
        //filter information for what is needed to show
        res.data.map(issue => {
          const issueInformation = {
            issueTitle: issue.title,
            issueBody: issue.body,
            issueState: issue.state,
            issueLabels: issue.labels,
            issueLink: issue.url
          };
          //set a parameter if it is a pull request
          if (issue.pull_request) {
            issueInformation.pullRequest = true;
          } else {
            issueInformation.pullRequest = false;
          }
          //update state with filtered issue
          const curGitHubLinks = this.state.gitHubIssues;
          curGitHubLinks.push(issueInformation);
          this.setState({ gitHubIssues: curGitHubLinks });
          return "Found Issues";
        });
        this.changeViewToResults();
      })
      .catch(err => {
        console.log(err); //TODO: Show error page
      });
  };

  updateGitHubLink = e => {
    this.setState({ currentGitHubLink: e.target.value });
  };

  changeViewToResults = () => {
    this.setState({ isLoading: false });
  };

  changeViewToLoading = () => {
    this.setState({ isLoading: true, didSearch: true });
  };

  // refactored this into functions to make it easier to read and maintain. You could've also refactored this into its own component.
  renderSearchBar() {
     return (
      <div className="searchBarContainer">
        <div id="searchBarLabel">Github Issue Viewer</div>
        <input
          onKeyPress={this.callGitHubIssuesGetter}
          onChange={this.updateGitHubLink}
          type="text"
          placeholder="Paste a link to a GitHub repo!"
          value={this.state.value}
          className="searchBar"
        ></input>
      </div>
      )
  }

  renderLoading() {
    return (
      <div id="loadingImageContainer">
        <img
          alt="Loading..."
          id="loadingImage"
          placeholder="loading..."
          src="https://wpamelia.com/wp-content/uploads/2018/11/ezgif-2-6d0b072c3d3f.gif"
        ></img>
      </div>
    )
  }

  renderResults(currentGitHubLink, gitHubIssues) {
    return (
      <ResultsContainer
        gitHubLink={currentGitHubLink}
        issues={gitHubIssues}
      />
    )
  }

  renderView() {
    const {isLoading, didSearch, currentGitHubLink, gitHubIssues} = this.state // this makes the code below less lengthy
    if (!didSearch && !isLoading)  return this.renderSearchBar() // if-else not needed because we return here
    if (isLoading) return this.renderLoading() // if-else not needed because we return here
    return this.renderResults(currentGitHubLink, gitHubIssues)
  }
  
  render() {
    return <Fragment>{this.renderView()}</Fragment>;
  }
}

export default IssueSearchPage;
