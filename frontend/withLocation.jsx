import { useLocation } from "react-router-dom";

function withLocation(Component) {
    return function WrappedComponent(props) {
        const location = useLocation();
        return <Component {...props} location={location} />
    };
}

export default withLocation;