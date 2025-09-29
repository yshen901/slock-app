import { useLocation, useNavigate, useParams } from "react-router-dom";

export function withLocation(Component) {
    return function WrappedComponent(props) {
        const location = useLocation();
        return <Component {...props} location={location} />
    };
}

export function withNavigate(Component) {
    return function WrappedComponent(props) {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />
    };
}

export function withParams(Component) {
    return function WrappedComponent(props) {
        const params = useParams();
        return <Component {...props} params={params} />
    };
}

export function withRouter(Component) {
    return function WrappedComponent(props) {
        const location = useLocation();
        const params = useParams();
        const navigate = useNavigate();
        return <Component {...props} params={params} location={location} navigate={navigate}/>
    };
}