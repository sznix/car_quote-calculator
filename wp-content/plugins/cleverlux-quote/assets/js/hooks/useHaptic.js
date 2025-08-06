export function useHaptic() {
	return () => {
		if ( window.navigator.vibrate ) window.navigator.vibrate( 20 );
	};
}
