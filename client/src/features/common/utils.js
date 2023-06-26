// export function capitalize(string) {
// 	return string ? `${string.charAt(0).toUpperCase()}${string.slice(1)}` : string;
// }

// export default { capitalize };
export function capitalize(string) {
	return typeof string === 'string' ? `${string.charAt(0).toUpperCase()}${string.slice(1)}` : string;
}

export default { capitalize };
