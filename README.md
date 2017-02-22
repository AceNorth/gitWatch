GitWatch monitors GitHub repos and allows users to sort and filter the results. Its purpose is to roughly monitor development activity, community support, and stability.

For a given repo, GitWatch will display:
- its total pulls and issues, as the GitHub API does not differentiate between the two and this is a decent proxy for development activity
- its total stars, showing an approximate level of interest in the app
- its current open issues, as a rough measure of stability

USAGE: 
GitWatch pings the API every 6 seconds, and will update the displayed info without a page refresh. You can sort the results by clicking on a column header, and filter them using the sliders.

NEXT STEPS:
Pinging the API 8 times every 6 seconds isn't very scalable! From here, I'd set up websockets so that we'd be making our requests on the backend and broadcasting them to every client connection.

I'm also using basic authentication to bypass the rate limit for the GitHub API, but it would be better to switch to OAuth in the future.

And of course it's not very pretty!
