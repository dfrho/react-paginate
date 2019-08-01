import React from 'react';
import List from './List';
import withPaginated from './WithPaginated';
import { compose } from 'recompose';

import './App.css';

const applyUpdateResult = result => prevState => ({
	hits: [...prevState.hits, [...result.hits]],
	page: prevState.page + 1,
	isLoading: false,
	currentResult: result,
	onScreenHits: result.hits,
});

const applySetResult = result => prevState => ({
	hits: [result.hits],
	page: result.page,
	isLoading: false,
	currentResult: result,
	onScreenHits: result.hits,
});

const applyBackResult = () => prevState => ({
	isLoading: false,
	page: prevState.page - 1,
	onScreenHits: prevState.hits[prevState.page - 1],
});

const getHackerNewsUrl = (value, page) =>
	`https://hn.algolia.com/api/v1/search?query=${value}&page=${page}&hitsPerPage=88`;

const withLoading = Component => props => (
	<div>
		<Component {...props} />

		<div className="interactions">{props.isLoading && <span>Loading...</span>}</div>
	</div>
);

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hits: [],
			onScreenHits: [],
			page: null,
			isLoading: false,
		};
	}

	onSearch = e => {
		e.preventDefault();
		const { value } = this.input;

		if (value === '') {
			return;
		}
		const page = this.state.page === null ? 0 : this.state.page + 1;
		this.fetchStories(value, page);
	};

	onBack = e => {
		e.preventDefault();
		this.setState(applyBackResult());
	};

	fetchStories = (value, page) => {
		this.setState({ isLoading: true });

		fetch(getHackerNewsUrl(value, page))
			.then(response => response.json())
			.then(result => this.onSetResult(result, page));
	};

	onSetResult = (result, page) =>
		page === 0 ? this.setState(applySetResult(result)) : this.setState(applyUpdateResult(result));

	render() {
		return (
			<div className="page">
				<div className="interactions">
					<form type="submit" onSubmit={this.onSearch}>
						<input type="text" ref={node => (this.input = node)} />
						<button type="submit">Search</button>
					</form>
				</div>
				<ListWithLoadingWithPaginated
					list={this.state.onScreenHits}
					page={this.state.page}
					onMore={this.onSearch}
					isLoading={this.state.isLoading}
					onBack={this.onBack}
					itemsPerPage={8}
					s
				/>
			</div>
		);
	}
}

const ListWithLoadingWithPaginated = compose(
	withPaginated,
	withLoading
)(List);

export default App;
