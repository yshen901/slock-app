import { useParams } from "react-router-dom";

function withParams(Component) {
    return function WrappedComponent(props) {
        const params = useParams();
        return <Component {...props} params={params} />
    };
}

export default withParams;