import { Button as PrimeButton } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

const TestPrimeReact = () => {
    return (
        <div style={{ padding: '20px' }}>
            <PrimeButton label="Accept" severity="success"/>
            <PrimeButton label="Reject" rounded />
        </div>
    );
};

export default TestPrimeReact;
