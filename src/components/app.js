import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';

export default class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			repos: [],
			filter: "all",
			minPulls: 0,
			minStars: 0,
			maxIssues: 1000
		}
		this.fetchRepos = this.fetchRepos.bind(this);
	}

	componentWillMount() {
		this.fetchRepos();
		this.timerID = setInterval(this.fetchRepos, 6000);
	}

	fetchRepos() {
		let facebookPromise = this.getRepoInfo("facebook", "react");
		let angularPromise = this.getRepoInfo("angular", "angular.js");
		let emberPromise = this.getRepoInfo("emberjs", "ember.js");
		let vuePromise = this.getRepoInfo("vuejs", "vue");
		Promise.all([facebookPromise, angularPromise, emberPromise, vuePromise])
			.then(resultArr => this.setState({ repos: resultArr }))
	}

	getRepoInfo(owner, repo) {
		let instance = axios.create({
			auth: {
		    username: 'AceNorth',
		    password: 'WHOA podner this is A SECRET'
		  },
		})
		let repoPromise = instance.get(`https://api.github.com/repos/${owner}/${repo}`);
		let pullsPromise = instance.get(`https://api.github.com/repos/${owner}/${repo}/pulls`);

		return Promise.all([repoPromise, pullsPromise])
		  .then(resArr => {
		  	let repo = resArr[0].data;
		  	let pulls = resArr[1].data[0].number;
		    return {
		    	name: repo.name,
		    	pullRequests: pulls,
		    	issues: repo.open_issues_count,
		    	stars: repo.stargazers_count
		    }
		  })
		  .catch(function (error) {
		    console.err(error);
		  });
	}

	setFilter(type) {
		// don't display any repos who don't meet the minimum reqs
		let num = Number($(`input[id=${type}]`).val())
		switch (type) {
			case "pulls":
				this.setState({minPulls: num});
				return;
			case "stars":
				this.setState({minStars: num});
				return;
			case "issues":
				this.setState({maxIssues: num});
				return;
			default:
				return;
		}
	}

	filterRepos() {
		let displayed = [];
		this.state.repos.map(repo => {
			if (
				repo.pullRequests >= this.state.minPulls &&
				repo.stars >= this.state.minStars &&
				repo.issues <= this.state.maxIssues
				) {
				displayed.push(repo);
			}
		})
		return displayed;
	}

	sortBy(criteria) {
		let sorted;
		switch (criteria) {
			case "pulls":
				sorted = this.state.repos.sort((a, b) => b.pullRequests - a.pullRequests);
				break;
			case "issues":
				sorted = this.state.repos.sort((a, b) => b.issues - a.issues);
				break;
			case "stars":
				sorted = this.state.repos.sort((a, b) => b.stars - a.stars);
				break;
			default:
				sorted = this.state.repos;
				break;
			}
		this.setState({ repos: sorted, filter: criteria })
	}

  render() {
  	let displayedRepos = this.filterRepos();

    return (
    	<div>
    	<h1> GitWatch </h1>
    	<p style={{fontSize: 11}}> Click a column header to sort </p>
	    	<table style={styles.table}>
	    		<thead style={styles.thead}>
	    			<tr style={styles.tr}>
		    			<td style={styles.td}>Library</td>
		    			<td onClick={() => this.sortBy("pulls")} style={styles.td}>Total pulls/issues</td>
		    			<td onClick={() => this.sortBy("issues")} style={styles.td}>Open issues</td>
		    			<td onClick={() => this.sortBy("stars")} style={styles.td}>Stars</td>
	    			</tr>
	    		</thead>
	    		<tbody>
	    	{displayedRepos.map(repo => {
	    			return <tr style={styles.tr} key={repo.name}>
				      <td style={styles.td}>{repo.name}</td>
				      <td style={styles.td}>{repo.pullRequests}</td>
				      <td style={styles.td}>{repo.issues}</td>
				      <td style={styles.td}>{repo.stars}</td>
	      		</tr>
	    			}
	    		)}
	    	</tbody>
	    	</table>
	    	<div>
					<input type="range" min="0" max="20000" defaultValue="0" name ="pulls" id="pulls" onChange={() => this.setFilter("pulls")}/>
		    	<label>Minimum pulls: {this.state.minPulls} </label>
				</div>
				<div>
					<input type="range" min="0" max="75000" defaultValue="0" id="stars" onChange={() => this.setFilter("stars")}/>
					<label>Minimum stars: {this.state.minStars}</label>
				</div>
				<div>
					<input type="range" min="0" max="1000" defaultValue="1000" id="issues" onChange={() => this.setFilter("issues")}/>
					<label>Maximum open issues: {this.state.maxIssues}</label>
				</div>
	    	</div>
    );
  }
}

const styles = {
	table: {
		"border": "1px solid black",
	},
	thead: {
	  "background": "#395870",
	  "color": "#fff",
	  "fontSize": "11px"
	},
	td: {
		"padding" : "5px"
	}
}
