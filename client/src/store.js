import React from 'react';

const Store = React.createContext({
	addToast: () => {},
	removeToast: () => {},
});

export default Store;
