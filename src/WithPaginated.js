import React from 'react';

const withPaginated = Component => props => (
	<div>
		<Component {...props} />

		<div className="interactions">
			{!props.isLoading && props.page > 0 && (
				<div>
					<button type="button" onClick={props.onBack}>
						Back
					</button>
				</div>
			)}
			{props.page !== null && !props.isLoading && (
				<div>
					<button type="button" onClick={props.onMore}>
						More
					</button>
				</div>
			)}
		</div>
	</div>
);

export default withPaginated;
