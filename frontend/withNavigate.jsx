import { useNavigate } from "react-router-dom";

function withNavigate(Component) {
    return function WrappedComponent(props) {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />
    };
}

export default withNavigate;